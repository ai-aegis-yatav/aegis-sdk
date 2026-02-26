package ai.aegis.sdk;

import ai.aegis.sdk.internal.QuotaInfo;
import ai.aegis.sdk.resources.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AegisClientTest {

    @Test
    void builderCreatesClientWithRequiredApiKey() {
        AegisClient client = AegisClient.builder("sk_test_123").build();
        assertNotNull(client);
    }

    @Test
    void builderThrowsOnNullApiKey() {
        assertThrows(NullPointerException.class, () -> AegisClient.builder(null).build());
    }

    @Test
    void allResourceAccessorsReturnNonNull() {
        AegisClient client = AegisClient.builder("sk_test_123").build();

        assertNotNull(client.judge());
        assertNotNull(client.rules());
        assertNotNull(client.escalations());
        assertNotNull(client.analytics());
        assertNotNull(client.evidence());
        assertNotNull(client.ml());
        assertNotNull(client.nlp());
        assertNotNull(client.aiAct());
        assertNotNull(client.classify());
        assertNotNull(client.jailbreak());
        assertNotNull(client.safety());
        assertNotNull(client.defense());
        assertNotNull(client.advanced());
        assertNotNull(client.adversaflow());
        assertNotNull(client.guardnet());
        assertNotNull(client.agent());
        assertNotNull(client.anomaly());
        assertNotNull(client.multimodal());
        assertNotNull(client.evolution());
        assertNotNull(client.saber());
        assertNotNull(client.ops());
        assertNotNull(client.apiKeys());
    }

    @Test
    void quotaInfoInitiallyEmpty() {
        AegisClient client = AegisClient.builder("sk_test_123").build();
        QuotaInfo quota = client.quota();
        assertNotNull(quota);
        assertFalse(quota.isAvailable());
    }

    @Test
    void autoCloseableWorks() {
        AegisClient client = AegisClient.builder("sk_test_123").build();
        assertDoesNotThrow(client::close);
    }
}
