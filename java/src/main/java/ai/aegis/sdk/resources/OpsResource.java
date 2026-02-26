package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

public class OpsResource extends BaseResource {

    public OpsResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> ciGate(Map<String, Object> request) {
        return postMap("/v3/ops/ci-gate", request);
    }

    public Map<String, Object> benchmark(Map<String, Object> request) {
        return postMap("/v3/ops/benchmark", request);
    }

    public Map<String, Object> thresholds() {
        return getMap("/v3/ops/thresholds");
    }

    public Map<String, Object> thresholds(Map<String, Object> request) {
        return postMap("/v3/ops/thresholds", request);
    }

    public Map<String, Object> redteamStats() {
        return getMap("/v3/ops/redteam/stats");
    }

    public List<Map<String, Object>> attackLibrary() {
        return getList("/v3/ops/attack-library");
    }
}
