package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Collections;
import java.util.Map;

public class GuardModelResource extends BaseResource {

    public GuardModelResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> stats() {
        return getMap("/v3/guard-model/stats");
    }

    public Map<String, Object> performance() {
        return getMap("/v3/guard-model/performance");
    }

    public Map<String, Object> train(Map<String, Object> request) {
        return postMap("/v3/guard-model/train", request);
    }

    public Map<String, Object> trainStatus() {
        return getMap("/v3/guard-model/train/status");
    }

    public Map<String, Object> trainCancel() {
        return postMap("/v3/guard-model/train/cancel", Collections.emptyMap());
    }
}
