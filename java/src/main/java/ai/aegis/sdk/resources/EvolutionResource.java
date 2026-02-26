package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class EvolutionResource extends BaseResource {

    public EvolutionResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> generate(Map<String, Object> request) {
        return postMap("/v3/evolution/generate", request);
    }

    public Map<String, Object> evolve(Map<String, Object> request) {
        return postMap("/v3/evolution/evolve", request);
    }

    public Map<String, Object> stats() {
        return getMap("/v3/evolution/stats");
    }
}
