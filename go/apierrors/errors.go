package apierrors

import (
	"fmt"
	"time"
)

// AegisError is the base error type for all SDK errors.
type AegisError struct {
	Message string
	Cause   error
}

func (e *AegisError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("aegis: %s: %v", e.Message, e.Cause)
	}
	return fmt.Sprintf("aegis: %s", e.Message)
}

func (e *AegisError) Unwrap() error {
	return e.Cause
}

// ApiError represents an error response from the AEGIS API.
type ApiError struct {
	StatusCode int    `json:"status_code"`
	ErrorCode  string `json:"error_code"`
	RequestID  string `json:"request_id"`
	Body       string `json:"body"`
	Message    string `json:"message"`
}

func (e *ApiError) Error() string {
	return fmt.Sprintf("aegis api error (status=%d, code=%s, request_id=%s): %s",
		e.StatusCode, e.ErrorCode, e.RequestID, e.Message)
}

// AuthenticationError indicates invalid or missing API key.
type AuthenticationError struct {
	ApiError
}

func (e *AuthenticationError) Error() string {
	return fmt.Sprintf("aegis authentication error: %s", e.Message)
}

// TierAccessError indicates the current tier cannot access this resource.
type TierAccessError struct {
	ApiError
	RequiredTier string `json:"required_tier"`
	UpgradeURL   string `json:"upgrade_url"`
}

func (e *TierAccessError) Error() string {
	return fmt.Sprintf("aegis tier access error: %s (required_tier=%s, upgrade_url=%s)",
		e.Message, e.RequiredTier, e.UpgradeURL)
}

// QuotaExceededError indicates the quota has been exhausted.
type QuotaExceededError struct {
	ApiError
	Limit   int       `json:"limit"`
	Used    int       `json:"used"`
	ResetAt time.Time `json:"reset_at"`
}

func (e *QuotaExceededError) Error() string {
	return fmt.Sprintf("aegis quota exceeded: %s (limit=%d, used=%d, resets=%s)",
		e.Message, e.Limit, e.Used, e.ResetAt.Format(time.RFC3339))
}

// RateLimitError indicates too many requests.
type RateLimitError struct {
	ApiError
	RetryAfter time.Duration `json:"retry_after"`
}

func (e *RateLimitError) Error() string {
	return fmt.Sprintf("aegis rate limited: retry after %s", e.RetryAfter)
}

// ValidationError indicates invalid request parameters.
type ValidationError struct {
	ApiError
	Fields map[string]string `json:"fields,omitempty"`
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("aegis validation error: %s", e.Message)
}

// NotFoundError indicates the requested resource was not found.
type NotFoundError struct {
	ApiError
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("aegis not found: %s", e.Message)
}

// ServerError indicates an internal server error.
type ServerError struct {
	ApiError
}

func (e *ServerError) Error() string {
	return fmt.Sprintf("aegis server error (status=%d): %s", e.StatusCode, e.Message)
}

// NetworkError indicates a connectivity issue.
type NetworkError struct {
	AegisError
}

func (e *NetworkError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("aegis network error: %s: %v", e.Message, e.Cause)
	}
	return fmt.Sprintf("aegis network error: %s", e.Message)
}

// Type-checking helpers

func IsAuthError(err error) bool {
	_, ok := err.(*AuthenticationError)
	return ok
}

func IsTierError(err error) bool {
	_, ok := err.(*TierAccessError)
	return ok
}

func IsQuotaError(err error) bool {
	_, ok := err.(*QuotaExceededError)
	return ok
}

func IsRateLimitError(err error) bool {
	_, ok := err.(*RateLimitError)
	return ok
}

func IsValidationError(err error) bool {
	_, ok := err.(*ValidationError)
	return ok
}

func IsNotFoundError(err error) bool {
	_, ok := err.(*NotFoundError)
	return ok
}

func IsServerError(err error) bool {
	_, ok := err.(*ServerError)
	return ok
}

func IsNetworkError(err error) bool {
	_, ok := err.(*NetworkError)
	return ok
}
