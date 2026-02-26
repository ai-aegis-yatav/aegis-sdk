package ai.aegis.sdk.errors;

public class TierAccessException extends ApiException {

    private final String requiredTier;
    private final String upgradeUrl;

    public TierAccessException(String message, String requestId, String body,
                               String requiredTier, String upgradeUrl) {
        super(message, 403, "TIER_ACCESS_DENIED", requestId, body);
        this.requiredTier = requiredTier;
        this.upgradeUrl = upgradeUrl;
    }

    public String getRequiredTier() {
        return requiredTier;
    }

    public String getUpgradeUrl() {
        return upgradeUrl;
    }
}
