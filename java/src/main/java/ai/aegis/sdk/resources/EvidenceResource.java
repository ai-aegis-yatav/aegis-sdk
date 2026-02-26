package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;

public class EvidenceResource extends BaseResource {

    public EvidenceResource(Transport transport) {
        super(transport);
    }

    public Map<String, Object> get(String evidenceId) {
        return getMap("/v3/evidence/" + evidenceId);
    }

    public List<Map<String, Object>> list() {
        return getList("/v3/evidence");
    }

    public Map<String, Object> verify(String evidenceId) {
        return postMap("/v3/evidence/" + evidenceId + "/verify", null);
    }

    public List<Map<String, Object>> forJudgment(String judgmentId) {
        return get("/v3/evidence/judgment/" + judgmentId,
                new TypeReference<List<Map<String, Object>>>() {});
    }
}
