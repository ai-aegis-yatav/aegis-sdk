package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class V3AnalyticsResource extends BaseResource {

    public V3AnalyticsResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> explain(String judgmentId) {
        return getMap("/v3/analytics/explain/" + judgmentId);
    }

    public Map<String, Object> layerStats() {
        return getMap("/v3/analytics/layer-stats");
    }

    public Map<String, Object> layerStats(Map<String, Object> params) {
        return getMap(buildQueryPath("/v3/analytics/layer-stats", params));
    }

    public Map<String, Object> attackClusters(Map<String, Object> request) {
        return postMap("/v3/analytics/attack-clusters", request);
    }

    public Map<String, Object> baseline() {
        return getMap("/v3/analytics/baseline");
    }

    public Map<String, Object> baseline(Map<String, Object> params) {
        return getMap(buildQueryPath("/v3/analytics/baseline", params));
    }
}
