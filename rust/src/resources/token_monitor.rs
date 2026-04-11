use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct TokenMonitor {
    transport: Arc<Transport>,
}

fn build_query(params: &Value) -> String {
    let mut parts: Vec<String> = Vec::new();
    if let Some(obj) = params.as_object() {
        for (k, v) in obj {
            let value_str = match v {
                Value::String(s) => s.clone(),
                Value::Null => continue,
                other => other.to_string(),
            };
            parts.push(format!("{}={}", k, value_str));
        }
    }
    if parts.is_empty() {
        String::new()
    } else {
        format!("?{}", parts.join("&"))
    }
}

impl TokenMonitor {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn usage(&self, params: &Value) -> Result<Value> {
        let path = format!("/v3/token-monitor/usage{}", build_query(params));
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn list_quotas(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/token-monitor/quotas", None::<&()>)
            .await
    }

    pub async fn create_quota(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/token-monitor/quotas", Some(body))
            .await
    }

    pub async fn update_quota(&self, id: &str, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::PATCH,
                &format!("/v3/token-monitor/quotas/{}", id),
                Some(body),
            )
            .await
    }

    pub async fn list_alerts(&self, params: &Value) -> Result<Value> {
        let path = format!("/v3/token-monitor/alerts{}", build_query(params));
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn update_alert(&self, id: &str, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::PATCH,
                &format!("/v3/token-monitor/alerts/{}", id),
                Some(body),
            )
            .await
    }

    pub async fn overview(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/token-monitor/overview", None::<&()>)
            .await
    }
}
