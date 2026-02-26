package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.Rule;
import ai.aegis.sdk.models.RuleCreateRequest;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class RulesResource extends BaseResource {

    public RulesResource(Transport transport) {
        super(transport);
    }

    public Rule create(RuleCreateRequest request) {
        return post("/v3/rules", request, Rule.class);
    }

    public List<Rule> list() {
        return get("/v3/rules", new TypeReference<List<Rule>>() {});
    }

    public Rule get(String ruleId) {
        return get("/v3/rules/" + ruleId, Rule.class);
    }

    public Rule update(String ruleId, Map<String, Object> updates) {
        return put("/v3/rules/" + ruleId, updates, Rule.class);
    }

    public void delete(String ruleId) {
        deleteVoid("/v3/rules/" + ruleId);
    }

    public Map<String, Object> test(String ruleId, Map<String, Object> testInput) {
        return postMap("/v3/rules/" + ruleId + "/test", testInput);
    }

    public Map<String, Object> reload() {
        return postMap("/v3/rules/reload", null);
    }

    public List<Map<String, Object>> templates() {
        return getList("/v3/rules/templates");
    }
}
