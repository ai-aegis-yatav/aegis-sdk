package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.SafetyCheckRequest;
import ai.aegis.sdk.models.SafetyCheckResponse;

import java.util.List;
import java.util.Map;

public class SafetyResource extends BaseResource {

    public SafetyResource(Transport transport) {
        super(transport);
    }

    public SafetyCheckResponse check(SafetyCheckRequest request) {
        return post("/v3/safety/check", request, SafetyCheckResponse.class);
    }

    public Map<String, Object> checkBatch(Map<String, Object> request) {
        return postMap("/v3/safety/check/batch", request);
    }

    public List<Map<String, Object>> categories() {
        return getList("/v3/safety/categories");
    }

    public List<Map<String, Object>> backends() {
        return getList("/v3/safety/backends");
    }
}
