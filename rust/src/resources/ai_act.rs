use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::*;
use crate::transport::Transport;

pub struct AiActResource {
    transport: Arc<Transport>,
}

impl AiActResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn watermark(&self, request: &WatermarkRequest) -> Result<WatermarkResponse> {
        self.transport
            .request(Method::POST, "/v1/ai-act/watermark", Some(request))
            .await
    }

    pub async fn verify(
        &self,
        request: &ComplianceVerifyRequest,
    ) -> Result<ComplianceVerifyResponse> {
        self.transport
            .request(Method::POST, "/v1/ai-act/verify", Some(request))
            .await
    }

    pub async fn guidelines(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v1/ai-act/guidelines", None::<&()>)
            .await
    }

    pub async fn high_impact_watermark(
        &self,
        request: &WatermarkRequest,
    ) -> Result<WatermarkResponse> {
        self.transport
            .request(
                Method::POST,
                "/v1/ai-act/high-impact/watermark",
                Some(request),
            )
            .await
    }

    pub async fn label_deepfake(&self, request: &WatermarkRequest) -> Result<WatermarkResponse> {
        self.transport
            .request(Method::POST, "/v1/ai-act/deepfake/label", Some(request))
            .await
    }

    pub async fn check_guardrails(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v1/ai-act/guardrail/check", Some(&body))
            .await
    }

    pub async fn detect_pii(&self, request: &PiiDetectRequest) -> Result<PiiDetectResponse> {
        self.transport
            .request(Method::POST, "/v1/ai-act/pii/detect", Some(request))
            .await
    }

    pub async fn assess_risk(&self, request: &RiskAssessRequest) -> Result<RiskAssessResponse> {
        self.transport
            .request(Method::POST, "/v1/ai-act/risk/assess", Some(request))
            .await
    }

    pub async fn audit_logs(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v1/ai-act/audit/logs", None::<&()>)
            .await
    }

    pub async fn report_violation(
        &self,
        report: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v1/ai-act/report-violation", Some(report))
            .await
    }
}
