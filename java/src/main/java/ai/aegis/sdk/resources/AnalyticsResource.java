package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class AnalyticsResource extends BaseResource {

    public AnalyticsResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> overview() {
        return getMap("/v3/analytics/overview");
    }

    public Map<String, Object> overview(Map<String, Object> params) {
        return getMap(buildPath("/v3/analytics/overview", params));
    }

    public Map<String, Object> judgments() {
        return getMap("/v3/analytics/judgments");
    }

    public Map<String, Object> judgments(Map<String, Object> params) {
        return getMap(buildPath("/v3/analytics/judgments", params));
    }

    public Map<String, Object> defenseLayers() {
        return getMap("/v3/analytics/defense-layers");
    }

    public Map<String, Object> defenseLayers(Map<String, Object> params) {
        return getMap(buildPath("/v3/analytics/defense-layers", params));
    }

    public Map<String, Object> threats() {
        return getMap("/v3/analytics/threats");
    }

    public Map<String, Object> threats(Map<String, Object> params) {
        return getMap(buildPath("/v3/analytics/threats", params));
    }

    public Map<String, Object> performance() {
        return getMap("/v3/analytics/performance");
    }

    public Map<String, Object> performance(Map<String, Object> params) {
        return getMap(buildPath("/v3/analytics/performance", params));
    }

    private String buildPath(String base, Map<String, Object> params) {
        if (params == null || params.isEmpty()) return base;
        StringBuilder sb = new StringBuilder(base).append("?");
        boolean first = true;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (!first) sb.append("&");
            sb.append(entry.getKey()).append("=").append(entry.getValue());
            first = false;
        }
        return sb.toString();
    }
}
