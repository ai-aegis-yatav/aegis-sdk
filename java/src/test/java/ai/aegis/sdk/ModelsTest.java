package ai.aegis.sdk;

import ai.aegis.sdk.internal.JsonUtil;
import ai.aegis.sdk.models.*;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ModelsTest {

    @Test
    void judgeRequestSerialization() throws Exception {
        JudgeRequest req = JudgeRequest.builder("Hello world")
                .context("user context")
                .metadata("key", "value")
                .option("threshold", 0.8)
                .build();

        String json = JsonUtil.serialize(req);
        assertNotNull(json);
        assertTrue(json.contains("Hello world"));
        assertTrue(json.contains("user context"));
        assertTrue(json.contains("key"));
        assertTrue(json.contains("value"));
        assertTrue(json.contains("threshold"));
    }

    @Test
    void judgeResponseDeserializationWithRisksAndLayers() throws Exception {
        String json = """
                {
                    "id": "judge-123",
                    "decision": "block",
                    "confidence": 0.95,
                    "risks": [
                        {"label": "jailbreak", "severity": "high", "score": 0.9}
                    ],
                    "layers": [
                        {"name": "layer1", "passed": false, "latency_ms": 50}
                    ],
                    "latency_ms": 100
                }
                """;

        JudgeResponse resp = JsonUtil.deserialize(json, JudgeResponse.class);
        assertNotNull(resp);
        assertEquals("judge-123", resp.getId());
        assertEquals("block", resp.getDecision());
        assertEquals(0.95, resp.getConfidence(), 0.001);
        assertNotNull(resp.getRisks());
        assertEquals(1, resp.getRisks().size());
        assertEquals("jailbreak", resp.getRisks().get(0).getLabel());
        assertEquals("high", resp.getRisks().get(0).getSeverity());
        assertNotNull(resp.getLayers());
        assertEquals(1, resp.getLayers().size());
        assertEquals("layer1", resp.getLayers().get(0).getName());
        assertFalse(resp.getLayers().get(0).isPassed());
        assertEquals(100, resp.getLatencyMs());
    }

    @Test
    void ruleModelRoundTrip() throws Exception {
        Rule rule = new Rule();
        rule.setId("rule-1");
        rule.setName("Test Rule");
        rule.setDescription("A test rule");
        rule.setPattern(".*malicious.*");
        rule.setAction("block");
        rule.setSeverity("high");
        rule.setEnabled(true);
        rule.setTags(List.of("security", "test"));
        rule.setCreatedAt(Instant.parse("2025-02-24T10:00:00Z"));
        rule.setUpdatedAt(Instant.parse("2025-02-24T11:00:00Z"));

        String json = JsonUtil.serialize(rule);
        Rule roundTrip = JsonUtil.deserialize(json, Rule.class);

        assertEquals(rule.getId(), roundTrip.getId());
        assertEquals(rule.getName(), roundTrip.getName());
        assertEquals(rule.getDescription(), roundTrip.getDescription());
        assertEquals(rule.getPattern(), roundTrip.getPattern());
        assertEquals(rule.getAction(), roundTrip.getAction());
        assertEquals(rule.getSeverity(), roundTrip.getSeverity());
        assertEquals(rule.isEnabled(), roundTrip.isEnabled());
        assertEquals(rule.getTags(), roundTrip.getTags());
        assertEquals(rule.getCreatedAt(), roundTrip.getCreatedAt());
        assertEquals(rule.getUpdatedAt(), roundTrip.getUpdatedAt());
    }

    @Test
    void apiKeyDeserialization() throws Exception {
        String json = """
                {
                    "id": "key-123",
                    "name": "Test Key",
                    "prefix": "sk_test_",
                    "scopes": ["judge", "rules"],
                    "status": "active",
                    "created_at": "2025-02-24T10:00:00Z"
                }
                """;

        ApiKey key = JsonUtil.deserialize(json, ApiKey.class);
        assertNotNull(key);
        assertEquals("key-123", key.getId());
        assertEquals("Test Key", key.getName());
        assertEquals("sk_test_", key.getPrefix());
        assertEquals(List.of("judge", "rules"), key.getScopes());
        assertEquals("active", key.getStatus());
        assertEquals(Instant.parse("2025-02-24T10:00:00Z"), key.getCreatedAt());
    }

    @Test
    void safetyCheckResponseDeserialization() throws Exception {
        String json = """
                {
                    "safe": false,
                    "score": 0.85,
                    "categories": ["harmful", "jailbreak"],
                    "risks": [
                        {"label": "harmful", "severity": "medium", "score": 0.85}
                    ]
                }
                """;

        SafetyCheckResponse resp = JsonUtil.deserialize(json, SafetyCheckResponse.class);
        assertNotNull(resp);
        assertFalse(resp.isSafe());
        assertEquals(0.85, resp.getScore(), 0.001);
        assertNotNull(resp.getFlaggedCategories());
        assertEquals(2, resp.getFlaggedCategories().size());
        assertTrue(resp.getFlaggedCategories().contains("harmful"));
        assertTrue(resp.getFlaggedCategories().contains("jailbreak"));
        assertNotNull(resp.getRisks());
        assertEquals(1, resp.getRisks().size());
        assertEquals("harmful", resp.getRisks().get(0).getLabel());
    }
}
