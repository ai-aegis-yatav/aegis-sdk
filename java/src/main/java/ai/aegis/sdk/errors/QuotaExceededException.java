package ai.aegis.sdk.errors;

public class QuotaExceededException extends ApiException {

    private final long limit;
    private final long used;
    private final String resetAt;

    public QuotaExceededException(String message, String requestId, String body,
                                  long limit, long used, String resetAt) {
        super(message, 429, "QUOTA_EXCEEDED", requestId, body);
        this.limit = limit;
        this.used = used;
        this.resetAt = resetAt;
    }

    public long getLimit() {
        return limit;
    }

    public long getUsed() {
        return used;
    }

    public String getResetAt() {
        return resetAt;
    }
}
