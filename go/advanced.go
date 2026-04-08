package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// AdvancedService — V2 advanced attack detection.
type AdvancedService struct {
	t *internal.Transport
}

func (s *AdvancedService) post(ctx context.Context, path, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", path, map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdvancedService) Detect(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/detect", text)
}
func (s *AdvancedService) HybridWeb(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/hybrid-web", text)
}
func (s *AdvancedService) VSH(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/vsh", text)
}
func (s *AdvancedService) FewShot(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/few-shot", text)
}
func (s *AdvancedService) CoT(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/cot", text)
}
func (s *AdvancedService) Acoustic(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/acoustic", text)
}
func (s *AdvancedService) ContextConfusion(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/context-confusion", text)
}
func (s *AdvancedService) InfoExtraction(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v2/advanced/info-extraction", text)
}
