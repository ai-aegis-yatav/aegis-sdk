package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class SaberResource extends BaseResource {

    public SaberResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> estimate(Map<String, Object> request) {
        return postMap("/v3/saber/estimate", request);
    }

    public Map<String, Object> evaluate(Map<String, Object> request) {
        return postMap("/v3/saber/evaluate", request);
    }

    public Map<String, Object> budget(Map<String, Object> request) {
        return postMap("/v3/saber/budget", request);
    }

    public Map<String, Object> compare(Map<String, Object> request) {
        return postMap("/v3/saber/compare", request);
    }

    public Map<String, Object> report() {
        return getMap("/v3/saber/report");
    }

    public Map<String, Object> report(Map<String, Object> params) {
        return postMap("/v3/saber/report", params);
    }
}
