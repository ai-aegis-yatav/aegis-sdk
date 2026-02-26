package ai.aegis.sdk.errors;

import java.time.Duration;

public class RateLimitException extends ApiException {

    private final Duration retryAfter;

    public RateLimitException(String message, String requestId, String body,
                              Duration retryAfter) {
        super(message, 429, "RATE_LIMITED", requestId, body);
        this.retryAfter = retryAfter;
    }

    public Duration getRetryAfter() {
        return retryAfter;
    }
}
