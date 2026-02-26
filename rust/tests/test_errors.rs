use aegis_sdk::AegisError;

#[test]
fn error_display_implementations() {
    let auth = AegisError::Authentication {
        message: "Invalid key".into(),
        request_id: Some("req-1".into()),
    };
    let s = auth.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Authentication") || s.contains("Invalid key"));

    let tier = AegisError::TierAccess {
        message: "Upgrade required".into(),
        required_tier: Some("pro".into()),
        upgrade_url: Some("https://aiaegis.io/upgrade".into()),
    };
    let s = tier.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Tier") || s.contains("Upgrade"));

    let quota = AegisError::QuotaExceeded {
        message: "Quota exceeded".into(),
        limit: Some(1000),
        used: Some(1001),
        reset_at: Some("2025-02-25T00:00:00Z".into()),
    };
    let s = quota.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Quota") || s.contains("exceeded"));

    let rate_limit = AegisError::RateLimit {
        message: "Rate limited".into(),
        retry_after: Some(60.0),
    };
    let s = rate_limit.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Rate") || s.contains("limited"));

    let validation = AegisError::Validation {
        message: "Validation failed".into(),
        status_code: 422,
    };
    let s = validation.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Validation") || s.contains("failed"));

    let not_found = AegisError::NotFound {
        message: "Not found".into(),
    };
    let s = not_found.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Not found"));

    let server = AegisError::Server {
        message: "Server error".into(),
        status_code: 500,
    };
    let s = server.to_string();
    assert!(!s.is_empty());
    assert!(s.contains("Server") || s.contains("error"));
}

#[test]
fn error_variants_match_expected_messages() {
    let auth = AegisError::Authentication {
        message: "Invalid API key".into(),
        request_id: None,
    };
    assert!(auth.to_string().contains("Invalid API key"));

    let tier = AegisError::TierAccess {
        message: "Access denied".into(),
        required_tier: Some("enterprise".into()),
        upgrade_url: Some("https://aiaegis.io/plans".into()),
    };
    let s = tier.to_string();
    assert!(s.contains("Access denied") || s.contains("enterprise") || s.contains("plans"));

    let quota = AegisError::QuotaExceeded {
        message: "Limit reached".into(),
        limit: Some(100),
        used: Some(100),
        reset_at: Some("2025-02-25T00:00:00Z".into()),
    };
    assert!(quota.to_string().contains("Limit reached") || quota.to_string().contains("Quota"));
}
