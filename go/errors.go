package aegis

import (
	"github.com/ai-aegis-yatav/aegis-sdk/go/apierrors"
)

// Re-export error types for convenience so callers can use aegis.ApiError etc.
type (
	AegisError          = apierrors.AegisError
	ApiError            = apierrors.ApiError
	AuthenticationError = apierrors.AuthenticationError
	TierAccessError     = apierrors.TierAccessError
	QuotaExceededError  = apierrors.QuotaExceededError
	RateLimitError      = apierrors.RateLimitError
	ValidationError     = apierrors.ValidationError
	NotFoundError       = apierrors.NotFoundError
	ServerError         = apierrors.ServerError
	NetworkError        = apierrors.NetworkError
)

// Re-export helper functions.
var (
	IsAuthError       = apierrors.IsAuthError
	IsTierError       = apierrors.IsTierError
	IsQuotaError      = apierrors.IsQuotaError
	IsRateLimitError  = apierrors.IsRateLimitError
	IsValidationError = apierrors.IsValidationError
	IsNotFoundError   = apierrors.IsNotFoundError
	IsServerError     = apierrors.IsServerError
	IsNetworkError    = apierrors.IsNetworkError
)
