package aegis_test

import (
	"errors"
	"testing"
	"time"

	"github.com/ai-aegis-yatav/aegis-sdk/go"
)

func TestErrorTypesImplementErrorInterface(t *testing.T) {
	var _ error = (*aegis.AegisError)(nil)
	var _ error = (*aegis.ApiError)(nil)
	var _ error = (*aegis.AuthenticationError)(nil)
	var _ error = (*aegis.TierAccessError)(nil)
	var _ error = (*aegis.QuotaExceededError)(nil)
	var _ error = (*aegis.RateLimitError)(nil)
	var _ error = (*aegis.ValidationError)(nil)
	var _ error = (*aegis.NotFoundError)(nil)
	var _ error = (*aegis.ServerError)(nil)
	var _ error = (*aegis.NetworkError)(nil)
}

func TestIsAuthError(t *testing.T) {
	err := &aegis.AuthenticationError{}
	if !aegis.IsAuthError(err) {
		t.Error("IsAuthError should return true for AuthenticationError")
	}
	if aegis.IsAuthError(errors.New("other")) {
		t.Error("IsAuthError should return false for other errors")
	}
}

func TestIsTierError(t *testing.T) {
	err := &aegis.TierAccessError{}
	if !aegis.IsTierError(err) {
		t.Error("IsTierError should return true for TierAccessError")
	}
	if aegis.IsTierError(errors.New("other")) {
		t.Error("IsTierError should return false for other errors")
	}
}

func TestIsQuotaError(t *testing.T) {
	err := &aegis.QuotaExceededError{}
	if !aegis.IsQuotaError(err) {
		t.Error("IsQuotaError should return true for QuotaExceededError")
	}
	if aegis.IsQuotaError(errors.New("other")) {
		t.Error("IsQuotaError should return false for other errors")
	}
}

func TestIsRateLimitError(t *testing.T) {
	err := &aegis.RateLimitError{}
	if !aegis.IsRateLimitError(err) {
		t.Error("IsRateLimitError should return true for RateLimitError")
	}
	if aegis.IsRateLimitError(errors.New("other")) {
		t.Error("IsRateLimitError should return false for other errors")
	}
}

func TestTierAccessErrorFields(t *testing.T) {
	err := &aegis.TierAccessError{
		ApiError: aegis.ApiError{
			StatusCode: 403,
			Message:    "upgrade required",
		},
		RequiredTier: "pro",
		UpgradeURL:   "https://aiaegis.io/upgrade",
	}
	if err.RequiredTier != "pro" {
		t.Errorf("RequiredTier = %q, want pro", err.RequiredTier)
	}
	if err.UpgradeURL != "https://aiaegis.io/upgrade" {
		t.Errorf("UpgradeURL = %q, want https://aiaegis.io/upgrade", err.UpgradeURL)
	}
	if err.Error() == "" {
		t.Error("Error() should return non-empty string")
	}
}

func TestQuotaExceededErrorFields(t *testing.T) {
	resetAt := time.Date(2025, 2, 25, 0, 0, 0, 0, time.UTC)
	err := &aegis.QuotaExceededError{
		ApiError: aegis.ApiError{
			StatusCode: 429,
			Message:    "quota exceeded",
		},
		Limit:   1000,
		Used:    1001,
		ResetAt: resetAt,
	}
	if err.Limit != 1000 {
		t.Errorf("Limit = %d, want 1000", err.Limit)
	}
	if err.Used != 1001 {
		t.Errorf("Used = %d, want 1001", err.Used)
	}
	if !err.ResetAt.Equal(resetAt) {
		t.Errorf("ResetAt = %v, want %v", err.ResetAt, resetAt)
	}
	if err.Error() == "" {
		t.Error("Error() should return non-empty string")
	}
}
