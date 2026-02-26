package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class DefenseResource extends BaseResource {

    public DefenseResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> paladinStats() {
        return getMap("/v3/defense/paladin/stats");
    }

    public Map<String, Object> enableLayer(Map<String, Object> request) {
        return postMap("/v3/defense/paladin/enable", request);
    }

    public Map<String, Object> trustValidate(Map<String, Object> request) {
        return postMap("/v3/defense/trust/validate", request);
    }

    public Map<String, Object> trustProfile(String profileId) {
        return getMap("/v3/defense/trust/profile/" + profileId);
    }

    public Map<String, Object> ragDetect(Map<String, Object> request) {
        return postMap("/v3/defense/rag/detect", request);
    }

    public Map<String, Object> circuitBreakerEvaluate(Map<String, Object> request) {
        return postMap("/v3/defense/circuit-breaker/evaluate", request);
    }

    public Map<String, Object> circuitBreakerStatus() {
        return getMap("/v3/defense/circuit-breaker/status");
    }

    public Map<String, Object> adaptiveEvaluate(Map<String, Object> request) {
        return postMap("/v3/defense/adaptive/evaluate", request);
    }

    public Map<String, Object> adaptiveLearn(Map<String, Object> request) {
        return postMap("/v3/defense/adaptive/learn", request);
    }
}
