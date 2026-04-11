package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.Map;

public class MilitaryResource extends BaseResource {

    public MilitaryResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> antiSpoofing(Map<String, Object> request) {
        return postMap("/v3/military/anti-spoofing/analyze", request);
    }

    public Map<String, Object> classification(Map<String, Object> request) {
        return postMap("/v3/military/classification/analyze", request);
    }

    public Map<String, Object> commandChain(Map<String, Object> request) {
        return postMap("/v3/military/command-chain/analyze", request);
    }

    public Map<String, Object> crossDomain(Map<String, Object> request) {
        return postMap("/v3/military/cross-domain/analyze", request);
    }

    public Map<String, Object> opsec(Map<String, Object> request) {
        return postMap("/v3/military/opsec/analyze", request);
    }

    public Map<String, Object> roe(Map<String, Object> request) {
        return postMap("/v3/military/roe/analyze", request);
    }

    public Map<String, Object> tacticalAutonomy(Map<String, Object> request) {
        return postMap("/v3/military/tactical-autonomy/analyze", request);
    }

    public Map<String, Object> orchestrate(Map<String, Object> request) {
        return postMap("/v3/military/orchestrate", request);
    }

    public Map<String, Object> status() {
        return getMap("/v3/military/status");
    }
}
