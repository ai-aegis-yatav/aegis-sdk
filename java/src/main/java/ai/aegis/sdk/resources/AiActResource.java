package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

public class AiActResource extends BaseResource {

    public AiActResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> watermark(Map<String, Object> request) {
        return postMap("/v3/ai-act/watermark", request);
    }

    public Map<String, Object> verify(Map<String, Object> request) {
        return postMap("/v3/ai-act/verify", request);
    }

    public Map<String, Object> piiDetect(Map<String, Object> request) {
        return postMap("/v3/ai-act/pii-detect", request);
    }

    public Map<String, Object> riskAssess(Map<String, Object> request) {
        return postMap("/v3/ai-act/risk-assess", request);
    }

    public List<Map<String, Object>> auditLogs() {
        return getList("/v3/ai-act/audit-logs");
    }

    public Map<String, Object> guidelines() {
        return getMap("/v3/ai-act/guidelines");
    }

    public Map<String, Object> guardrailCheck(Map<String, Object> request) {
        return postMap("/v3/ai-act/guardrail-check", request);
    }
}
