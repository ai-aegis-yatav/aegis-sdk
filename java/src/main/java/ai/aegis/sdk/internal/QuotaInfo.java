package ai.aegis.sdk.internal;

public final class QuotaInfo {

    private volatile long limit;
    private volatile long used;
    private volatile long remaining;

    public QuotaInfo() {
        this.limit = -1;
        this.used = -1;
        this.remaining = -1;
    }

    public void update(long limit, long used, long remaining) {
        this.limit = limit;
        this.used = used;
        this.remaining = remaining;
    }

    public long getLimit() {
        return limit;
    }

    public long getUsed() {
        return used;
    }

    public long getRemaining() {
        return remaining;
    }

    public boolean isAvailable() {
        return limit >= 0;
    }

    @Override
    public String toString() {
        if (!isAvailable()) {
            return "QuotaInfo{unavailable}";
        }
        return "QuotaInfo{limit=" + limit + ", used=" + used + ", remaining=" + remaining + "}";
    }
}
