package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class DreamdojoResource extends BaseResource {

    public DreamdojoResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> validateAction(Map<String, Object> request) {
        return postMap("/v3/dreamdojo/validate-action", request);
    }

    public Map<String, Object> validateInput(Map<String, Object> request) {
        return postMap("/v3/dreamdojo/validate-input", request);
    }

    public Map<String, Object> validatePipeline(Map<String, Object> request) {
        return postMap("/v3/dreamdojo/validate-pipeline", request);
    }

    public Map<String, Object> validateLatent(Map<String, Object> request) {
        return postMap("/v3/dreamdojo/validate-latent", request);
    }

    public Map<String, Object> embodiments() {
        return getMap("/v3/dreamdojo/embodiments");
    }
}
