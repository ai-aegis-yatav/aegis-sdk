package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class GuardNetResource extends BaseResource {

    public GuardNetResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> analyze(Map<String, Object> request) {
        return postMap("/v3/guardnet/analyze", request);
    }

    public Map<String, Object> jbshield(Map<String, Object> request) {
        return postMap("/v3/guardnet/jbshield", request);
    }

    public Map<String, Object> ccfc(Map<String, Object> request) {
        return postMap("/v3/guardnet/ccfc", request);
    }

    public Map<String, Object> muli(Map<String, Object> request) {
        return postMap("/v3/guardnet/muli", request);
    }

    public Map<String, Object> unified(Map<String, Object> request) {
        return postMap("/v3/guardnet/unified", request);
    }
}
