package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class KoreanResource extends BaseResource {

    public KoreanResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> analyze(Map<String, Object> request) {
        return postMap("/v3/korean/analyze", request);
    }
}
