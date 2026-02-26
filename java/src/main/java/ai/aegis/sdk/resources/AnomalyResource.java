package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

public class AnomalyResource extends BaseResource {

    public AnomalyResource(Transport transport) {
        super(transport);
    }

    public List<Map<String, Object>> algorithms() {
        return getList("/v3/anomaly/algorithms");
    }

    public Map<String, Object> detect(Map<String, Object> request) {
        return postMap("/v3/anomaly/detect", request);
    }

    public Map<String, Object> detectBatch(Map<String, Object> request) {
        return postMap("/v3/anomaly/detect/batch", request);
    }

    public List<Map<String, Object>> events() {
        return getList("/v3/anomaly/events");
    }

    public Map<String, Object> stats() {
        return getMap("/v3/anomaly/stats");
    }
}
