export interface RuleCreateRequest {
  name: string;
  pattern: string;
  pattern_type?: string;
  action: string;
  severity?: string;
  category?: string;
  description?: string;
  priority?: number;
  enabled?: boolean;
}

export interface RuleUpdateRequest {
  name?: string;
  pattern?: string;
  pattern_type?: string;
  action?: string;
  severity?: string;
  category?: string;
  description?: string;
  priority?: number;
  enabled?: boolean;
}

export interface Rule {
  id: string;
  name: string;
  pattern: string;
  pattern_type: string;
  action: string;
  severity: string;
  category: string;
  description?: string;
  priority: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RuleTestRequest {
  content: string;
  rule_ids?: string[];
}

export interface RuleTestResponse {
  matched: boolean;
  matched_rules: Record<string, unknown>[];
  details?: Record<string, unknown>;
}
