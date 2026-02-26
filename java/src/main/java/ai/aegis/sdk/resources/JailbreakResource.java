package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.JailbreakDetectRequest;
import ai.aegis.sdk.models.JailbreakDetectResponse;

import java.util.List;
import java.util.Map;

public class JailbreakResource extends BaseResource {

    public JailbreakResource(Transport transport) {
        super(transport);
    }

    public JailbreakDetectResponse detect(JailbreakDetectRequest request) {
        return post("/v3/jailbreak/detect", request, JailbreakDetectResponse.class);
    }

    public Map<String, Object> detectBatch(Map<String, Object> request) {
        return postMap("/v3/jailbreak/detect/batch", request);
    }

    public List<Map<String, Object>> types() {
        return getList("/v3/jailbreak/types");
    }
}
