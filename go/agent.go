package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AgentService struct {
	t *internal.Transport
}

func (s *AgentService) Scan(ctx context.Context, req models.AgentScanRequest) (*models.AgentScanResponse, error) {
	var resp models.AgentScanResponse
	if err := s.t.Do(ctx, "POST", "/agent/scan", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AgentService) Toolchain(ctx context.Context, req models.ToolchainRequest) (*models.ToolchainResponse, error) {
	var resp models.ToolchainResponse
	if err := s.t.Do(ctx, "POST", "/agent/toolchain", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AgentService) MemoryPoisoning(ctx context.Context, req models.MemoryPoisoningRequest) (*models.MemoryPoisoningResponse, error) {
	var resp models.MemoryPoisoningResponse
	if err := s.t.Do(ctx, "POST", "/agent/memory-poisoning", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AgentService) ReasoningHijack(ctx context.Context, req models.ReasoningHijackRequest) (*models.ReasoningHijackResponse, error) {
	var resp models.ReasoningHijackResponse
	if err := s.t.Do(ctx, "POST", "/agent/reasoning-hijack", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AgentService) ToolDisguise(ctx context.Context, req models.ToolDisguiseRequest) (*models.ToolDisguiseResponse, error) {
	var resp models.ToolDisguiseResponse
	if err := s.t.Do(ctx, "POST", "/agent/tool-disguise", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
