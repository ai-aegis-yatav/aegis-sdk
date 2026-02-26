use std::sync::RwLock;
use std::time::Duration;

use reqwest::{header, Client, Method, StatusCode};
use serde::de::DeserializeOwned;
use serde::Serialize;

use crate::config::ClientConfig;
use crate::error::{AegisError, ApiErrorBody, Result};
use crate::models::common::QuotaInfo;

const SDK_VERSION: &str = "0.1.0";
const USER_AGENT: &str = "aegis-rust-sdk/0.1.0";

pub(crate) struct Transport {
    client: Client,
    config: ClientConfig,
    last_quota: RwLock<Option<QuotaInfo>>,
}

impl Transport {
    pub fn new(config: ClientConfig) -> Result<Self> {
        let mut default_headers = header::HeaderMap::new();
        default_headers.insert(
            "X-API-Key",
            header::HeaderValue::from_str(&config.api_key)
                .map_err(|_| AegisError::Authentication {
                    message: "Invalid API key format".into(),
                    request_id: None,
                })?,
        );
        default_headers.insert(
            header::USER_AGENT,
            header::HeaderValue::from_static(USER_AGENT),
        );
        default_headers.insert(
            "X-SDK-Version",
            header::HeaderValue::from_static(SDK_VERSION),
        );

        for (key, value) in &config.custom_headers {
            if let (Ok(name), Ok(val)) = (
                header::HeaderName::from_bytes(key.as_bytes()),
                header::HeaderValue::from_str(value),
            ) {
                default_headers.insert(name, val);
            }
        }

        let client = Client::builder()
            .timeout(config.timeout)
            .default_headers(default_headers)
            .build()?;

        Ok(Self {
            client,
            config,
            last_quota: RwLock::new(None),
        })
    }

    pub async fn request<T: DeserializeOwned>(
        &self,
        method: Method,
        path: &str,
        body: Option<&impl Serialize>,
    ) -> Result<T> {
        let response = self.request_with_retry(method, path, body).await?;
        self.extract_quota(&response);
        let bytes = response.bytes().await?;
        serde_json::from_slice(&bytes).map_err(AegisError::from)
    }

    pub async fn request_raw(
        &self,
        method: Method,
        path: &str,
        body: Option<&impl Serialize>,
    ) -> Result<reqwest::Response> {
        let response = self.request_with_retry(method, path, body).await?;
        self.extract_quota(&response);
        Ok(response)
    }

    pub fn last_quota(&self) -> Option<QuotaInfo> {
        self.last_quota.read().ok().and_then(|q| q.clone())
    }

    async fn request_with_retry(
        &self,
        method: Method,
        path: &str,
        body: Option<&impl Serialize>,
    ) -> Result<reqwest::Response> {
        let url = format!("{}{}", self.config.base_url, path);
        let mut last_err: Option<AegisError> = None;
        let max_attempts = self.config.max_retries + 1;

        for attempt in 0..max_attempts {
            if attempt > 0 {
                let backoff = Duration::from_millis(100 * 2u64.pow(attempt - 1));
                tokio::time::sleep(backoff).await;
            }

            let mut builder = self.client.request(method.clone(), &url);
            if let Some(b) = body {
                builder = builder.json(b);
            }

            let response = match builder.send().await {
                Ok(r) => r,
                Err(e) => {
                    last_err = Some(AegisError::Network(e));
                    continue;
                }
            };

            let status = response.status();

            if status.is_success() {
                return Ok(response);
            }

            if Self::is_retryable(status) && attempt < max_attempts - 1 {
                if status == StatusCode::TOO_MANY_REQUESTS {
                    if let Some(retry_after) = response
                        .headers()
                        .get("retry-after")
                        .and_then(|v| v.to_str().ok())
                        .and_then(|v| v.parse::<f64>().ok())
                    {
                        tokio::time::sleep(Duration::from_secs_f64(retry_after)).await;
                    }
                }
                let body_bytes = response.bytes().await.unwrap_or_default();
                let err_body: ApiErrorBody =
                    serde_json::from_slice(&body_bytes).unwrap_or(ApiErrorBody {
                        message: Some(format!("HTTP {}", status.as_u16())),
                        error: None,
                        request_id: None,
                        required_tier: None,
                        upgrade_url: None,
                        limit: None,
                        used: None,
                        reset_at: None,
                        retry_after: None,
                    });
                last_err = Some(Self::map_status_error(status, err_body));
                continue;
            }

            let body_bytes = response.bytes().await.unwrap_or_default();
            let err_body: ApiErrorBody =
                serde_json::from_slice(&body_bytes).unwrap_or(ApiErrorBody {
                    message: Some(format!("HTTP {}", status.as_u16())),
                    error: None,
                    request_id: None,
                    required_tier: None,
                    upgrade_url: None,
                    limit: None,
                    used: None,
                    reset_at: None,
                    retry_after: None,
                });
            return Err(Self::map_status_error(status, err_body));
        }

        Err(last_err.unwrap_or(AegisError::Server {
            message: "Max retries exceeded".into(),
            status_code: 0,
        }))
    }

    fn is_retryable(status: StatusCode) -> bool {
        status == StatusCode::TOO_MANY_REQUESTS
            || status.is_server_error()
    }

    fn map_status_error(status: StatusCode, body: ApiErrorBody) -> AegisError {
        match status {
            StatusCode::UNAUTHORIZED => AegisError::Authentication {
                message: body.message(),
                request_id: body.request_id,
            },
            StatusCode::FORBIDDEN => AegisError::TierAccess {
                message: body.message(),
                required_tier: body.required_tier,
                upgrade_url: body.upgrade_url,
            },
            StatusCode::NOT_FOUND => AegisError::NotFound {
                message: body.message(),
            },
            StatusCode::TOO_MANY_REQUESTS => {
                if body.limit.is_some() || body.used.is_some() {
                    AegisError::QuotaExceeded {
                        message: body.message(),
                        limit: body.limit,
                        used: body.used,
                        reset_at: body.reset_at,
                    }
                } else {
                    AegisError::RateLimit {
                        message: body.message(),
                        retry_after: body.retry_after,
                    }
                }
            }
            s if s == StatusCode::BAD_REQUEST || s == StatusCode::UNPROCESSABLE_ENTITY => {
                AegisError::Validation {
                    message: body.message(),
                    status_code: s.as_u16(),
                }
            }
            s => AegisError::Server {
                message: body.message(),
                status_code: s.as_u16(),
            },
        }
    }

    fn extract_quota(&self, response: &reqwest::Response) {
        let headers = response.headers();
        let get_header = |name: &str| -> Option<String> {
            headers.get(name).and_then(|v| v.to_str().ok()).map(String::from)
        };
        let get_i64 = |name: &str| -> Option<i64> {
            headers.get(name).and_then(|v| v.to_str().ok()).and_then(|v| v.parse().ok())
        };

        let limit = get_i64("X-Quota-Limit");
        let used = get_i64("X-Quota-Used");
        let remaining = get_i64("X-Quota-Remaining");
        let reset_at = get_header("X-Quota-Reset");

        if limit.is_some() || used.is_some() || remaining.is_some() {
            let info = QuotaInfo {
                limit,
                used,
                remaining,
                reset_at,
            };
            if let Ok(mut guard) = self.last_quota.write() {
                *guard = Some(info);
            }
        }
    }
}
