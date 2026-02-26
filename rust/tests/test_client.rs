use aegis_sdk::AegisClient;
use std::time::Duration;

#[test]
fn client_builder_creates_client() {
    let client = AegisClient::builder("sk_test_123").build();
    assert!(client.is_ok(), "builder should create client with valid api_key");
}

#[test]
fn client_builder_with_empty_api_key() {
    // Empty API key - build may succeed or fail depending on header validation
    let result = AegisClient::builder("").build();
    let _ = result; // Just verify it doesn't panic
}

#[test]
fn quota_initially_default() {
    let client = AegisClient::builder("sk_test_123").build().unwrap();
    let quota = client.quota();
    // Before any API call, quota should be None (no data yet)
    assert!(quota.is_none(), "quota should be None before any API calls");
}

#[test]
fn client_builder_with_options() {
    let client = AegisClient::builder("sk_test_123")
        .base_url("https://custom.api.example.com")
        .timeout(Duration::from_secs(10))
        .build();
    assert!(client.is_ok());
}
