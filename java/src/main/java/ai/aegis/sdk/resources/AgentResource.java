package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.AgentScanRequest;
import ai.aegis.sdk.models.AgentScanResponse;

import java.util.Map;

public class AgentResource extends BaseResource {

    public AgentResource(Transport transport) {
        super(transport);
    }

    public AgentScanResponse scan(AgentScanRequest request) {
        return post("/v3/agent/scan", request, AgentScanResponse.class);
    }

    public Map<String, Object> toolchain(Map<String, Object> request) {
        return postMap("/v3/agent/toolchain", request);
    }

    public Map<String, Object> memoryPoisoning(Map<String, Object> request) {
        return postMap("/v3/agent/memory-poisoning", request);
    }

    public Map<String, Object> reasoningHijack(Map<String, Object> request) {
        return postMap("/v3/agent/reasoning-hijack", request);
    }

    public Map<String, Object> toolDisguise(Map<String, Object> request) {
        return postMap("/v3/agent/tool-disguise", request);
    }
}
