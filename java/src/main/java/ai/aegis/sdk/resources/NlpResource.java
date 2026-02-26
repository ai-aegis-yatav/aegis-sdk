package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Collections;
import java.util.Map;

public class NlpResource extends BaseResource {

    public NlpResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> detectLanguage(String text) {
        return postMap("/v3/nlp/detect-language",
                Collections.singletonMap("text", text));
    }

    public Map<String, Object> detectJailbreak(Map<String, Object> request) {
        return postMap("/v3/nlp/detect-jailbreak", request);
    }

    public Map<String, Object> detectHarmful(Map<String, Object> request) {
        return postMap("/v3/nlp/detect-harmful", request);
    }
}
