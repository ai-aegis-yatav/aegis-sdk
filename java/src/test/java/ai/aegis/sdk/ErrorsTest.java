package ai.aegis.sdk;

import ai.aegis.sdk.errors.*;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

class ErrorsTest {

    @Test
    void authenticationExceptionHasCorrectStatusCode() {
        var ex = new AuthenticationException("Invalid key", "req-1", "{}");
        assertEquals(401, ex.getStatusCode());
    }

    @Test
    void tierAccessExceptionHasCorrectStatusCodeAndFields() {
        var ex = new TierAccessException("Upgrade required", "req-1", "{}", "pro", "https://aiaegis.io/upgrade");
        assertEquals(403, ex.getStatusCode());
        assertEquals("pro", ex.getRequiredTier());
        assertEquals("https://aiaegis.io/upgrade", ex.getUpgradeUrl());
    }

    @Test
    void quotaExceededExceptionHasCorrectStatusCodeAndFields() {
        var ex = new QuotaExceededException("Quota exceeded", "req-1", "{}", 1000L, 1001L, "2025-02-25T00:00:00Z");
        assertEquals(429, ex.getStatusCode());
        assertEquals(1000L, ex.getLimit());
        assertEquals(1001L, ex.getUsed());
        assertEquals("2025-02-25T00:00:00Z", ex.getResetAt());
    }

    @Test
    void rateLimitExceptionHasCorrectStatusCodeAndRetryAfter() {
        var ex = new RateLimitException("Rate limited", "req-1", "{}", Duration.ofSeconds(60));
        assertEquals(429, ex.getStatusCode());
        assertEquals(Duration.ofSeconds(60), ex.getRetryAfter());
    }

    @Test
    void validationExceptionHasCorrectStatusCode() {
        var ex = new ValidationException("Validation failed", 422, "req-1", "{}", null);
        assertEquals(422, ex.getStatusCode());
    }

    @Test
    void notFoundExceptionHasCorrectStatusCode() {
        var ex = new NotFoundException("Not found", "req-1", "{}");
        assertEquals(404, ex.getStatusCode());
    }

    @Test
    void serverExceptionHasCorrectStatusCode() {
        var ex = new ServerException("Server error", 500, "req-1", "{}");
        assertEquals(500, ex.getStatusCode());
    }

    @Test
    void apiExceptionHasCorrectStatusCode() {
        var ex = new ApiException("API error", 418, "TEAPOT", "req-1", "{}");
        assertEquals(418, ex.getStatusCode());
    }

    @Test
    void allExceptionsExtendAegisExceptionOrApiException() {
        assertTrue(new AuthenticationException("a", "b", "c") instanceof AegisException);
        assertTrue(new TierAccessException("a", "b", "c", "d", "e") instanceof ApiException);
        assertTrue(new QuotaExceededException("a", "b", "c", 1, 2, "d") instanceof ApiException);
        assertTrue(new RateLimitException("a", "b", "c", Duration.ZERO) instanceof ApiException);
        assertTrue(new ValidationException("a", 400, "b", "c", null) instanceof ApiException);
        assertTrue(new NotFoundException("a", "b", "c") instanceof ApiException);
        assertTrue(new ServerException("a", 500, "b", "c") instanceof ApiException);
        assertTrue(new ApiException("a", 400, "b", "c", "d") instanceof AegisException);
        assertTrue(new NetworkException("a", new RuntimeException()) instanceof AegisException);
    }
}
