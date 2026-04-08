package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// AgentService — V3 agent security.
type AgentService struct {
	t *internal.Transport
}

type AgentScanRequest struct {
	Prompt       string         `json:"prompt"`
	ExternalData []string       `json:"external_data"`
	SessionID    string         `json:"session_id"`
	UserID       string         `json:"user_id"`
	AgentType    string         `json:"agent_type,omitempty"`
	Context      map[string]any `json:"context,omitempty"`
}

func (s *AgentService) Scan(ctx context.Context, req AgentScanRequest) (map[string]any, error) {
	if req.ExternalData == nil {
		req.ExternalData = []string{}
	}
	if req.SessionID == "" {
		req.SessionID = "smoke-session"
	}
	if req.UserID == "" {
		req.UserID = "sdk-smoke"
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/agent/scan", req, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AgentService) Toolchain(ctx context.Context, tools []map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/agent/toolchain", map[string]any{"tools": tools}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AgentService) MemoryPoisoning(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/agent/memory-poisoning", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AgentService) ReasoningHijack(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/agent/reasoning-hijack", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AgentService) ToolDisguise(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/agent/tool-disguise", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
