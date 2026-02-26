package internal

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ai-aegis-yatav/aegis-sdk/go/apierrors"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
	"github.com/ai-aegis-yatav/aegis-sdk/go/streaming"
)

const (
	SDKVersion = "0.1.0"
	UserAgent  = "aegis-go-sdk/" + SDKVersion
)

type Transport struct {
	HTTPClient    *http.Client
	BaseURL       string
	APIKey        string
	MaxRetries    int
	CustomHeaders map[string]string
	LastQuota     *models.QuotaInfo
}

func NewTransport(apiKey, baseURL string, timeout time.Duration, maxRetries int, headers map[string]string) *Transport {
	return &Transport{
		HTTPClient:    &http.Client{Timeout: timeout},
		BaseURL:       strings.TrimRight(baseURL, "/"),
		APIKey:        apiKey,
		MaxRetries:    maxRetries,
		CustomHeaders: headers,
	}
}

// Do executes an HTTP request with retry logic, parsing the JSON response into result.
func (t *Transport) Do(ctx context.Context, method, path string, body interface{}, result interface{}) error {
	var reqBody []byte
	if body != nil {
		var err error
		reqBody, err = json.Marshal(body)
		if err != nil {
			return &apierrors.AegisError{Message: "failed to marshal request body", Cause: err}
		}
	}

	var lastErr error
	for attempt := 0; attempt <= t.MaxRetries; attempt++ {
		if attempt > 0 {
			wait := t.backoff(attempt)
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(wait):
			}
		}

		var bodyReader io.Reader
		if reqBody != nil {
			bodyReader = bytes.NewReader(reqBody)
		}

		req, err := http.NewRequestWithContext(ctx, method, t.BaseURL+path, bodyReader)
		if err != nil {
			return &apierrors.NetworkError{AegisError: apierrors.AegisError{Message: "failed to create request", Cause: err}}
		}
		t.setHeaders(req)

		resp, err := t.HTTPClient.Do(req)
		if err != nil {
			lastErr = &apierrors.NetworkError{AegisError: apierrors.AegisError{Message: "request failed", Cause: err}}
			continue
		}

		t.parseQuotaHeaders(resp)

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			if result != nil {
				defer resp.Body.Close()
				if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
					return &apierrors.AegisError{Message: "failed to decode response", Cause: err}
				}
			} else {
				resp.Body.Close()
			}
			return nil
		}

		apiErr := t.parseError(resp)
		resp.Body.Close()

		if t.shouldRetry(resp.StatusCode) && attempt < t.MaxRetries {
			lastErr = apiErr
			continue
		}
		return apiErr
	}
	return lastErr
}

// DoStream executes an HTTP request and returns a StreamReader for SSE events.
func (t *Transport) DoStream(ctx context.Context, method, path string, body interface{}) (*streaming.StreamReader, error) {
	var bodyReader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, &apierrors.AegisError{Message: "failed to marshal request body", Cause: err}
		}
		bodyReader = bytes.NewReader(data)
	}

	req, err := http.NewRequestWithContext(ctx, method, t.BaseURL+path, bodyReader)
	if err != nil {
		return nil, &apierrors.NetworkError{AegisError: apierrors.AegisError{Message: "failed to create request", Cause: err}}
	}
	t.setHeaders(req)
	req.Header.Set("Accept", "text/event-stream")

	resp, err := t.HTTPClient.Do(req)
	if err != nil {
		return nil, &apierrors.NetworkError{AegisError: apierrors.AegisError{Message: "stream request failed", Cause: err}}
	}

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		t.parseQuotaHeaders(resp)
		return streaming.NewStreamReader(resp.Body), nil
	}

	apiErr := t.parseError(resp)
	resp.Body.Close()
	return nil, apiErr
}

func (t *Transport) setHeaders(req *http.Request) {
	req.Header.Set("X-API-Key", t.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", UserAgent)
	for k, v := range t.CustomHeaders {
		req.Header.Set(k, v)
	}
}

func (t *Transport) parseQuotaHeaders(resp *http.Response) {
	limit := resp.Header.Get("X-Quota-Limit")
	used := resp.Header.Get("X-Quota-Used")
	remaining := resp.Header.Get("X-Quota-Remaining")
	resetAt := resp.Header.Get("X-Quota-Reset")
	tier := resp.Header.Get("X-Quota-Tier")

	if limit == "" && used == "" {
		return
	}

	q := &models.QuotaInfo{Tier: tier}
	if v, err := strconv.Atoi(limit); err == nil {
		q.Limit = v
	}
	if v, err := strconv.Atoi(used); err == nil {
		q.Used = v
	}
	if v, err := strconv.Atoi(remaining); err == nil {
		q.Remaining = v
	}
	if ts, err := time.Parse(time.RFC3339, resetAt); err == nil {
		q.ResetAt = ts
	}
	t.LastQuota = q
}

func (t *Transport) parseError(resp *http.Response) error {
	bodyBytes, _ := io.ReadAll(resp.Body)
	bodyStr := string(bodyBytes)

	var errResp struct {
		Message      string            `json:"message"`
		ErrorCode    string            `json:"error_code"`
		RequestID    string            `json:"request_id"`
		RequiredTier string            `json:"required_tier"`
		UpgradeURL   string            `json:"upgrade_url"`
		Limit        int               `json:"limit"`
		Used         int               `json:"used"`
		ResetAt      string            `json:"reset_at"`
		RetryAfter   float64           `json:"retry_after"`
		Fields       map[string]string `json:"fields"`
	}
	json.Unmarshal(bodyBytes, &errResp)

	base := apierrors.ApiError{
		StatusCode: resp.StatusCode,
		ErrorCode:  errResp.ErrorCode,
		RequestID:  errResp.RequestID,
		Body:       bodyStr,
		Message:    errResp.Message,
	}
	if base.Message == "" {
		base.Message = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	switch resp.StatusCode {
	case 401:
		return &apierrors.AuthenticationError{ApiError: base}
	case 403:
		return &apierrors.TierAccessError{
			ApiError:     base,
			RequiredTier: errResp.RequiredTier,
			UpgradeURL:   errResp.UpgradeURL,
		}
	case 404:
		return &apierrors.NotFoundError{ApiError: base}
	case 422:
		return &apierrors.ValidationError{ApiError: base, Fields: errResp.Fields}
	case 429:
		retryAfter := time.Duration(errResp.RetryAfter) * time.Second
		if retryAfter == 0 {
			if ra := resp.Header.Get("Retry-After"); ra != "" {
				if secs, err := strconv.Atoi(ra); err == nil {
					retryAfter = time.Duration(secs) * time.Second
				}
			}
		}
		if errResp.Limit > 0 {
			resetTime, _ := time.Parse(time.RFC3339, errResp.ResetAt)
			return &apierrors.QuotaExceededError{
				ApiError: base,
				Limit:    errResp.Limit,
				Used:     errResp.Used,
				ResetAt:  resetTime,
			}
		}
		return &apierrors.RateLimitError{ApiError: base, RetryAfter: retryAfter}
	default:
		if resp.StatusCode >= 500 {
			return &apierrors.ServerError{ApiError: base}
		}
		return &apierrors.ApiError{
			StatusCode: base.StatusCode,
			ErrorCode:  base.ErrorCode,
			RequestID:  base.RequestID,
			Body:       base.Body,
			Message:    base.Message,
		}
	}
}

func (t *Transport) shouldRetry(statusCode int) bool {
	return statusCode == 429 || statusCode >= 500
}

func (t *Transport) backoff(attempt int) time.Duration {
	base := 500 * time.Millisecond
	max := 30 * time.Second
	wait := time.Duration(float64(base) * math.Pow(2, float64(attempt-1)))
	if wait > max {
		wait = max
	}
	return wait
}
