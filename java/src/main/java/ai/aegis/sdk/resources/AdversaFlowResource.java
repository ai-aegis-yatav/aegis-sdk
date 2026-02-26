package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

public class AdversaFlowResource extends BaseResource {

    public AdversaFlowResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> campaigns(Map<String, Object> request) {
        return postMap("/v3/adversaflow/campaigns", request);
    }

    public List<Map<String, Object>> campaigns() {
        return getList("/v3/adversaflow/campaigns");
    }

    public Map<String, Object> tree(Map<String, Object> request) {
        return postMap("/v3/adversaflow/tree", request);
    }

    public Map<String, Object> trace(String traceId) {
        return getMap("/v3/adversaflow/trace/" + traceId);
    }

    public Map<String, Object> stats() {
        return getMap("/v3/adversaflow/stats");
    }

    public Map<String, Object> record(Map<String, Object> request) {
        return postMap("/v3/adversaflow/record", request);
    }
}
