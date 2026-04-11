package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class PipelineResource extends BaseResource {

    public PipelineResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> run(Map<String, Object> request) {
        return postMap("/v3/pipeline/run", request);
    }
}
