use std::collections::HashMap;
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct ClientConfig {
    pub api_key: String,
    pub base_url: String,
    pub timeout: Duration,
    pub max_retries: u32,
    pub custom_headers: HashMap<String, String>,
}

impl ClientConfig {
    pub fn builder(api_key: impl Into<String>) -> ClientConfigBuilder {
        ClientConfigBuilder {
            api_key: api_key.into(),
            base_url: "https://api.aiaegis.io".to_string(),
            timeout: Duration::from_secs(30),
            max_retries: 3,
            custom_headers: HashMap::new(),
        }
    }
}

pub struct ClientConfigBuilder {
    api_key: String,
    base_url: String,
    timeout: Duration,
    max_retries: u32,
    custom_headers: HashMap<String, String>,
}

impl ClientConfigBuilder {
    pub fn base_url(mut self, url: impl Into<String>) -> Self {
        self.base_url = url.into();
        self
    }

    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn max_retries(mut self, max_retries: u32) -> Self {
        self.max_retries = max_retries;
        self
    }

    pub fn header(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.custom_headers.insert(key.into(), value.into());
        self
    }

    pub fn build(self) -> ClientConfig {
        ClientConfig {
            api_key: self.api_key,
            base_url: self.base_url.trim_end_matches('/').to_string(),
            timeout: self.timeout,
            max_retries: self.max_retries,
            custom_headers: self.custom_headers,
        }
    }
}
