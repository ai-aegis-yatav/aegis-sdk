package ai.aegis.sdk.config;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public final class ClientConfig {

    private final String apiKey;
    private final String baseUrl;
    private final Duration timeout;
    private final int maxRetries;
    private final Map<String, String> customHeaders;

    private ClientConfig(Builder builder) {
        this.apiKey = Objects.requireNonNull(builder.apiKey, "apiKey is required");
        this.baseUrl = builder.baseUrl;
        this.timeout = builder.timeout;
        this.maxRetries = builder.maxRetries;
        this.customHeaders = Collections.unmodifiableMap(new HashMap<>(builder.customHeaders));
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public Duration getTimeout() {
        return timeout;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public Map<String, String> getCustomHeaders() {
        return customHeaders;
    }

    public static Builder builder(String apiKey) {
        return new Builder(apiKey);
    }

    public static final class Builder {
        private final String apiKey;
        private String baseUrl = "https://api.aiaegis.io";
        private Duration timeout = Duration.ofSeconds(30);
        private int maxRetries = 3;
        private final Map<String, String> customHeaders = new HashMap<>();

        private Builder(String apiKey) {
            this.apiKey = apiKey;
        }

        public Builder baseUrl(String baseUrl) {
            this.baseUrl = Objects.requireNonNull(baseUrl);
            return this;
        }

        public Builder timeout(Duration timeout) {
            this.timeout = Objects.requireNonNull(timeout);
            return this;
        }

        public Builder maxRetries(int maxRetries) {
            if (maxRetries < 0) {
                throw new IllegalArgumentException("maxRetries must be >= 0");
            }
            this.maxRetries = maxRetries;
            return this;
        }

        public Builder customHeader(String name, String value) {
            this.customHeaders.put(
                    Objects.requireNonNull(name),
                    Objects.requireNonNull(value));
            return this;
        }

        public Builder customHeaders(Map<String, String> headers) {
            this.customHeaders.putAll(Objects.requireNonNull(headers));
            return this;
        }

        public ClientConfig build() {
            return new ClientConfig(this);
        }
    }
}
