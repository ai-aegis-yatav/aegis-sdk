use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct V3Analytics {
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

impl V3Analytics {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn explain(&self, judgment_id: &str) -> Result<Value> {
        self.transport
            .request(
                Method::GET,
                &format!("/v3/analytics/explain/{}", judgment_id),
                None::<&()>,
            )
            .await
    }

    pub async fn layer_stats(&self, params: &Value) -> Result<Value> {
        let path = format!("/v3/analytics/layer-stats{}", build_query(params));
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn attack_clusters(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/analytics/attack-clusters", Some(body))
            .await
    }

    pub async fn baseline(&self, params: &Value) -> Result<Value> {
        let path = format!("/v3/analytics/baseline{}", build_query(params));
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }
}
