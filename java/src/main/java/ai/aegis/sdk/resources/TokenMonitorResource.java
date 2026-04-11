package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class TokenMonitorResource extends BaseResource {

    public TokenMonitorResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> usage() {
        return getMap("/v3/token-monitor/usage");
    }

    public Map<String, Object> usage(Map<String, Object> params) {
        return getMap(buildQueryPath("/v3/token-monitor/usage", params));
    }

    public Map<String, Object> listQuotas() {
        return getMap("/v3/token-monitor/quotas");
    }

    public Map<String, Object> createQuota(Map<String, Object> request) {
        return postMap("/v3/token-monitor/quotas", request);
    }

    public Map<String, Object> updateQuota(String id, Map<String, Object> request) {
        return patchMap("/v3/token-monitor/quotas/" + id, request);
    }

    public Map<String, Object> listAlerts() {
        return getMap("/v3/token-monitor/alerts");
    }

    public Map<String, Object> listAlerts(Map<String, Object> params) {
        return getMap(buildQueryPath("/v3/token-monitor/alerts", params));
    }

    public Map<String, Object> updateAlert(String id, Map<String, Object> request) {
        return patchMap("/v3/token-monitor/alerts/" + id, request);
    }

    public Map<String, Object> overview() {
        return getMap("/v3/token-monitor/overview");
    }
}
