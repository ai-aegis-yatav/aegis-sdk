use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::*;
use crate::transport::Transport;

pub struct ClassifyResource {
    transport: Arc<Transport>,
}

impl ClassifyResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn classify(&self, request: &ClassifyRequest) -> Result<ClassifyResponse> {
        self.transport
            .request(Method::POST, "/v2/classify", Some(request))
            .await
    }

    pub async fn batch(&self, request: &ClassifyBatchRequest) -> Result<ClassifyBatchResponse> {
        self.transport
            .request(Method::POST, "/v2/classify/batch", Some(request))
            .await
    }

    pub async fn categories(&self) -> Result<Vec<CategoryInfo>> {
        self.transport
            .request(Method::GET, "/v2/classify/categories", None::<&()>)
            .await
    }
}
