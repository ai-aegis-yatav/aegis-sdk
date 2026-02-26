package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class MlResource extends BaseResource {

    public MlResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> health() {
        return getMap("/v3/ml/health");
    }

    public Map<String, Object> embed(String text) {
        return postMap("/v3/ml/embed", Collections.singletonMap("text", text));
    }

    public Map<String, Object> embedBatch(List<String> texts) {
        return postMap("/v3/ml/embed/batch", Collections.singletonMap("texts", texts));
    }

    public Map<String, Object> classify(Map<String, Object> request) {
        return postMap("/v3/ml/classify", request);
    }

    public Map<String, Object> similarity(Map<String, Object> request) {
        return postMap("/v3/ml/similarity", request);
    }
}
