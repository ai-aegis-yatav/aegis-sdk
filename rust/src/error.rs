use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum AegisError {
    #[error("Authentication failed: {message}")]
    Authentication {
        message: String,
        request_id: Option<String>,
    },

    #[error("Tier access denied: {message}")]
    TierAccess {
        message: String,
        required_tier: Option<String>,
        upgrade_url: Option<String>,
    },

    #[error("Quota exceeded: {message}")]
    QuotaExceeded {
        message: String,
        limit: Option<i64>,
        used: Option<i64>,
        reset_at: Option<String>,
    },

    #[error("Rate limited: {message}")]
    RateLimit {
        message: String,
        retry_after: Option<f64>,
    },

    #[error("Validation error: {message}")]
    Validation { message: String, status_code: u16 },

    #[error("Not found: {message}")]
    NotFound { message: String },

    #[error("Server error: {message}")]
    Server { message: String, status_code: u16 },

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

pub type Result<T> = std::result::Result<T, AegisError>;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ApiErrorBody {
    #[serde(default)]
    pub message: Option<String>,
    #[serde(default)]
    pub error: Option<String>,
    #[serde(default)]
    pub request_id: Option<String>,
    #[serde(default)]
    pub required_tier: Option<String>,
    #[serde(default)]
    pub upgrade_url: Option<String>,
    #[serde(default)]
    pub limit: Option<i64>,
    #[serde(default)]
    pub used: Option<i64>,
    #[serde(default)]
    pub reset_at: Option<String>,
    #[serde(default)]
    pub retry_after: Option<f64>,
}

impl ApiErrorBody {
    pub fn message(&self) -> String {
        self.message
            .clone()
            .or_else(|| self.error.clone())
            .unwrap_or_else(|| "Unknown error".to_string())
    }
}
