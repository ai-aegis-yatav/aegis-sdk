use std::sync::Arc;

use futures_core::Stream;
use reqwest::Method;

use crate::error::Result;
use crate::models::common::PaginatedResponse;
use crate::models::judge::*;
use crate::streaming::{SseEvent, SseStream};
use crate::transport::Transport;

pub struct JudgeResource {
    transport: Arc<Transport>,
}

impl JudgeResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn create(&self, request: &JudgeRequest) -> Result<JudgeResponse> {
        self.transport
            .request(Method::POST, "/v1/judge", Some(request))
            .await
    }

    pub async fn batch(&self, request: &JudgeBatchRequest) -> Result<JudgeBatchResponse> {
        self.transport
            .request(Method::POST, "/v1/judge/batch", Some(request))
            .await
    }

    pub async fn stream(
        &self,
        request: &JudgeRequest,
    ) -> Result<impl Stream<Item = Result<SseEvent>>> {
        let response = self
            .transport
            .request_raw(Method::POST, "/v1/judge/stream", Some(request))
            .await?;
        Ok(SseStream::new(response).into_stream())
    }

    pub async fn list(
        &self,
        params: &JudgmentListParams,
    ) -> Result<PaginatedResponse<JudgmentListItem>> {
        let mut query_parts = Vec::new();
        if let Some(page) = params.page {
            query_parts.push(format!("page={}", page));
        }
        if let Some(limit) = params.limit {
            query_parts.push(format!("limit={}", limit));
        }
        if let Some(ref decision) = params.decision {
            query_parts.push(format!("decision={}", decision));
        }
        let path = if query_parts.is_empty() {
            "/v1/judgments".to_string()
        } else {
            format!("/v1/judgments?{}", query_parts.join("&"))
        };
        self.transport
            .request::<PaginatedResponse<JudgmentListItem>>(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn get(&self, id: &str) -> Result<JudgeResponse> {
        self.transport
            .request(Method::GET, &format!("/v1/judgments/{}", id), None::<&()>)
            .await
    }
}
