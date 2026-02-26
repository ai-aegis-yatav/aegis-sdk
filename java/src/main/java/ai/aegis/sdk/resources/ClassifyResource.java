package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

public class ClassifyResource extends BaseResource {

    public ClassifyResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> classify(Map<String, Object> request) {
        return postMap("/v3/classify", request);
    }

    public Map<String, Object> batch(Map<String, Object> request) {
        return postMap("/v3/classify/batch", request);
    }

    public List<Map<String, Object>> categories() {
        return getList("/v3/classify/categories");
    }
}
