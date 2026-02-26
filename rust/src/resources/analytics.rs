use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{AnalyticsOverview, AnalyticsTimeline};
use crate::transport::Transport;

pub struct AnalyticsResource {
    transport: Arc<Transport>,
}

impl AnalyticsResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn overview(
        &self,
        start_date: Option<&str>,
        end_date: Option<&str>,
    ) -> Result<AnalyticsOverview> {
        let mut query_parts = Vec::new();
        if let Some(s) = start_date {
            query_parts.push(format!("start_date={}", s));
        }
        if let Some(e) = end_date {
            query_parts.push(format!("end_date={}", e));
        }
        let path = if query_parts.is_empty() {
            "/v1/analytics/overview".to_string()
        } else {
            format!("/v1/analytics/overview?{}", query_parts.join("&"))
        };
        self.transport.request(Method::GET, &path, None::<&()>).await
    }

    pub async fn judgments(
        &self,
        start_date: Option<&str>,
        end_date: Option<&str>,
    ) -> Result<serde_json::Value> {
        let mut query_parts = Vec::new();
        if let Some(s) = start_date {
            query_parts.push(format!("start_date={}", s));
        }
        if let Some(e) = end_date {
            query_parts.push(format!("end_date={}", e));
        }
        let path = if query_parts.is_empty() {
            "/v1/analytics/judgments".to_string()
        } else {
            format!("/v1/analytics/judgments?{}", query_parts.join("&"))
        };
        self.transport.request(Method::GET, &path, None::<&()>).await
    }

    pub async fn defense_layers(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v1/analytics/defense-layers", None::<&()>)
            .await
    }

    pub async fn threats(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v1/analytics/threats", None::<&()>)
            .await
    }

    pub async fn performance(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v1/analytics/performance", None::<&()>)
            .await
    }

    pub async fn timeline(
        &self,
        start_date: Option<&str>,
        end_date: Option<&str>,
        interval: Option<&str>,
    ) -> Result<AnalyticsTimeline> {
        let mut query_parts = Vec::new();
        if let Some(s) = start_date {
            query_parts.push(format!("start_date={}", s));
        }
        if let Some(e) = end_date {
            query_parts.push(format!("end_date={}", e));
        }
        if let Some(i) = interval {
            query_parts.push(format!("interval={}", i));
        }
        let path = if query_parts.is_empty() {
            "/v1/analytics/timeline".to_string()
        } else {
            format!("/v1/analytics/timeline?{}", query_parts.join("&"))
        };
        self.transport.request(Method::GET, &path, None::<&()>).await
    }
}
