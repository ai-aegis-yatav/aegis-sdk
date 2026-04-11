use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Rule {
    pub id: String,
    pub name: String,
    pub pattern: String,
    pub action: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default)]
    pub priority: i32,
    #[serde(default)]
    pub enabled: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleCreateRequest {
    pub name: String,
    pub pattern: String,
    pub category: String,
    pub action: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub severity: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleUpdateRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleTestRequest {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rule_ids: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleTestResponse {
    pub matched: bool,
    #[serde(default)]
    pub matched_rules: Vec<MatchedRule>,
    #[serde(default)]
    pub action: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MatchedRule {
    pub id: String,
    pub name: String,
    pub action: String,
    #[serde(default)]
    pub priority: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleListResponse {
    pub rules: Vec<Rule>,
    #[serde(default)]
    pub total: i64,
    #[serde(default)]
    pub page: i32,
    #[serde(default)]
    pub limit: i32,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleListParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RuleTemplate {
    pub name: String,
    pub pattern: String,
    pub category: String,
    pub action: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// 한국어 정규식 해설 (wizard 용)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub regex_explanation_ko: Option<String>,
    /// English regex breakdown (wizard)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub regex_explanation_en: Option<String>,
}
