package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class ReportsResource extends BaseResource {

    public ReportsResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> generate(Map<String, Object> request) {
        return postMap("/v3/reports/generate", request);
    }
}
