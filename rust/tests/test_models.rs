use aegis_sdk::models::*;

#[test]
fn judge_request_serialization() {
    let req = JudgeRequest {
        prompt: "Hello world".into(),
        context: None,
        metadata: None,
        options: None,
    };
    let json = serde_json::to_string(&req).unwrap();
    assert!(json.contains("Hello world"));
    assert!(json.contains("prompt"));

    // With optional fields
    let req_with_opts = JudgeRequest {
        prompt: "Test".into(),
        context: None,
        metadata: Some(serde_json::json!({"key": "value"})),
        options: Some(JudgeOptions {
            layers: Some(vec!["safety".into()]),
            threshold: Some(0.8),
        }),
    };
    let json = serde_json::to_string(&req_with_opts).unwrap();
    assert!(json.contains("Test"));
    assert!(json.contains("metadata") || json.contains("key"));
}

#[test]
fn judge_response_deserialization() {
    let json = r#"{
        "id": "judge-123",
        "decision": "block",
        "confidence": 0.95,
        "risks": [
            {"label": "jailbreak", "severity": "high", "score": 0.9}
        ],
        "layers": [
            {"name": "layer1", "passed": false, "latency_ms": 50}
        ]
    }"#;
    let resp: JudgeResponse = serde_json::from_str(json).unwrap();
    assert_eq!(resp.id, "judge-123");
    assert_eq!(resp.decision, "block");
    assert!((resp.confidence - 0.95).abs() < 0.001);
    assert_eq!(resp.risks.len(), 1);
    assert_eq!(resp.risks[0].label, "jailbreak");
    assert_eq!(resp.layers.len(), 1);
    assert_eq!(resp.layers[0].name, "layer1");
    assert!(!resp.layers[0].passed);
}

#[test]
fn optional_fields_skip_when_none() {
    let req = JudgeRequest {
        prompt: "test".into(),
        context: None,
        metadata: None,
        options: None,
    };
    let json = serde_json::to_string(&req).unwrap();
    // Optional fields with skip_serializing_if = Option::is_none should be omitted
    assert!(!json.contains("context"));
    assert!(!json.contains("metadata"));
    assert!(!json.contains("options"));
}

#[test]
fn default_values_work() {
    let json = r#"{"id": "judge-1", "decision": "allow"}"#;
    let resp: JudgeResponse = serde_json::from_str(json).unwrap();
    assert_eq!(resp.id, "judge-1");
    assert_eq!(resp.decision, "allow");
    assert_eq!(resp.confidence, 0.0);
    assert!(resp.risks.is_empty());
    assert!(resp.layers.is_empty());
}

#[test]
fn rule_round_trip() {
    let rule = Rule {
        id: "rule-1".into(),
        name: "Test Rule".into(),
        pattern: ".*malicious.*".into(),
        action: "block".into(),
        description: Some("A test rule".into()),
        priority: 0,
        enabled: true,
        created_at: Some("2025-02-24T10:00:00Z".into()),
        updated_at: Some("2025-02-24T11:00:00Z".into()),
    };
    let json = serde_json::to_string(&rule).unwrap();
    let round_trip: Rule = serde_json::from_str(&json).unwrap();
    assert_eq!(round_trip.id, rule.id);
    assert_eq!(round_trip.name, rule.name);
    assert_eq!(round_trip.pattern, rule.pattern);
}

#[test]
fn safety_check_response_deserialization() {
    let json = r#"{
        "is_safe": false,
        "category": "harmful",
        "categories": ["harmful", "jailbreak"],
        "flags": ["flag1"],
        "confidence": 0.85,
        "scores": {"harmful": 0.85},
        "backend": "default",
        "latency_ms": 50.0
    }"#;
    let resp: SafetyCheckResponse = serde_json::from_str(json).unwrap();
    assert!(!resp.is_safe);
    assert_eq!(resp.category, "harmful");
    assert_eq!(resp.categories.len(), 2);
    assert!((resp.confidence - 0.85).abs() < 0.001);
}
