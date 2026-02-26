package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class AdvancedResource extends BaseResource {

    public AdvancedResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> detect(Map<String, Object> request) {
        return postMap("/v3/advanced/detect", request);
    }

    public Map<String, Object> hybridWeb(Map<String, Object> request) {
        return postMap("/v3/advanced/hybrid-web", request);
    }

    public Map<String, Object> vsh(Map<String, Object> request) {
        return postMap("/v3/advanced/vsh", request);
    }

    public Map<String, Object> fewShot(Map<String, Object> request) {
        return postMap("/v3/advanced/few-shot", request);
    }

    public Map<String, Object> cot(Map<String, Object> request) {
        return postMap("/v3/advanced/cot", request);
    }

    public Map<String, Object> acoustic(Map<String, Object> request) {
        return postMap("/v3/advanced/acoustic", request);
    }

    public Map<String, Object> contextConfusion(Map<String, Object> request) {
        return postMap("/v3/advanced/context-confusion", request);
    }

    public Map<String, Object> infoExtraction(Map<String, Object> request) {
        return postMap("/v3/advanced/info-extraction", request);
    }
}
