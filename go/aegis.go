package aegis

import "time"

const (
	DefaultBaseURL    = "https://api.aiaegis.io/v3"
	DefaultTimeout    = 30 * time.Second
	DefaultMaxRetries = 3
)

// Option configures the Client.
type Option func(*clientConfig)

type clientConfig struct {
	BaseURL       string
	Timeout       time.Duration
	MaxRetries    int
	CustomHeaders map[string]string
}

func defaultConfig() *clientConfig {
	return &clientConfig{
		BaseURL:       DefaultBaseURL,
		Timeout:       DefaultTimeout,
		MaxRetries:    DefaultMaxRetries,
		CustomHeaders: map[string]string{},
	}
}

// WithBaseURL sets a custom API base URL.
func WithBaseURL(url string) Option {
	return func(c *clientConfig) {
		c.BaseURL = url
	}
}

// WithTimeout sets the HTTP client timeout.
func WithTimeout(d time.Duration) Option {
	return func(c *clientConfig) {
		c.Timeout = d
	}
}

// WithMaxRetries sets the maximum number of retries on transient failures.
func WithMaxRetries(n int) Option {
	return func(c *clientConfig) {
		c.MaxRetries = n
	}
}

// WithCustomHeaders adds custom HTTP headers sent with every request.
func WithCustomHeaders(headers map[string]string) Option {
	return func(c *clientConfig) {
		for k, v := range headers {
			c.CustomHeaders[k] = v
		}
	}
}

// NewClient creates a new AEGIS API client.
func NewClient(apiKey string, opts ...Option) *Client {
	cfg := defaultConfig()
	for _, opt := range opts {
		opt(cfg)
	}
	return newClient(apiKey, cfg)
}
