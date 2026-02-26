package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class MultimodalResource extends BaseResource {

    public MultimodalResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> scan(Map<String, Object> request) {
        return postMap("/v3/multimodal/scan", request);
    }

    public Map<String, Object> imageAttack(Map<String, Object> request) {
        return postMap("/v3/multimodal/image-attack", request);
    }

    public Map<String, Object> viscra(Map<String, Object> request) {
        return postMap("/v3/multimodal/viscra", request);
    }

    public Map<String, Object> mml(Map<String, Object> request) {
        return postMap("/v3/multimodal/mml", request);
    }
}
