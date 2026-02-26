export interface JudgeOptions {
  enable_streaming?: boolean;
  fast_mode?: boolean;
  skip_layers?: string[];
}

export interface JudgeRequest {
  prompt: string;
  context?: unknown;
  metadata?: Record<string, unknown>;
  options?: JudgeOptions;
}

export interface Risk {
  label: string;
  severity: string;
  description?: string;
  score?: number;
  categories?: string[];
}

export interface DefenseLayer {
  name: string;
  passed: boolean;
  latency_ms?: number;
  details?: Record<string, unknown>;
}

export interface JudgeResponse {
  id: string;
  decision: string;
  confidence: number;
  risks: Risk[];
  layers: DefenseLayer[];
  latency_ms?: number;
}

export interface JudgeStreamEvent {
  event_type?: string;
  partial_decision?: string;
  layer?: DefenseLayer;
  risk?: Risk;
  final_response?: JudgeResponse;
  done?: boolean;
}
