package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.Escalation;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;

public class EscalationsResource extends BaseResource {

    public EscalationsResource(Transport transport) {
        super(transport);
    }

    public Escalation create(Map<String, Object> request) {
        return post("/v3/escalations", request, Escalation.class);
    }

    public Escalation get(String escalationId) {
        return get("/v3/escalations/" + escalationId, Escalation.class);
    }

    public List<Escalation> list() {
        return get("/v3/escalations", new TypeReference<List<Escalation>>() {});
    }

    public Escalation resolve(String escalationId, Map<String, Object> resolution) {
        return post("/v3/escalations/" + escalationId + "/resolve", resolution, Escalation.class);
    }

    public Escalation assign(String escalationId, Map<String, Object> assignment) {
        return post("/v3/escalations/" + escalationId + "/assign", assignment, Escalation.class);
    }

    public Escalation claim(String escalationId) {
        return post("/v3/escalations/" + escalationId + "/claim", null, Escalation.class);
    }

    public Map<String, Object> stats() {
        return getMap("/v3/escalations/stats");
    }
}
