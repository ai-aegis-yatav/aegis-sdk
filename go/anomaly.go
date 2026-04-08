package aegis

import (
	"context"
	"time"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// AnomalyService — V3 anomaly detection.
type AnomalyService struct {
	t *internal.Transport
}

func (s *AnomalyService) Algorithms(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v3/anomaly/algorithms", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

// Detect runs anomaly detection. Provide either DataPoints, or History +
// optional Value (smoke-test convenience — converted to data_points).
type AnomalyDetectArgs struct {
	Metric     string           `json:"metric,omitempty"`
	Algorithm  string           `json:"algorithm"`
	DataPoints []map[string]any `json:"data_points,omitempty"`
	History    []float64        `json:"-"`
	Value      *float64         `json:"-"`
	Threshold  *float64         `json:"threshold,omitempty"`
}

func (s *AnomalyService) Detect(ctx context.Context, args AnomalyDetectArgs) (map[string]any, error) {
	if args.Algorithm == "" {
		args.Algorithm = "zscore"
	}
	body := map[string]any{"algorithm": args.Algorithm}
	if args.Metric != "" {
		body["metric"] = args.Metric
	}
	if args.DataPoints != nil {
		body["data_points"] = args.DataPoints
	} else if args.History != nil {
		now := time.Now().Unix()
		points := make([]map[string]any, 0, len(args.History)+1)
		for i, v := range args.History {
			points = append(points, map[string]any{
				"timestamp": now - int64(len(args.History)-i)*60,
				"value":     v,
			})
		}
		if args.Value != nil {
			points = append(points, map[string]any{"timestamp": now, "value": *args.Value})
		}
		body["data_points"] = points
	}
	if args.Threshold != nil {
		body["threshold"] = *args.Threshold
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/anomaly/detect", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AnomalyService) Events(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/anomaly/events", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AnomalyService) Stats(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/anomaly/stats", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
