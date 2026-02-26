package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JudgeRequest {

    @JsonProperty("prompt")
    private String prompt;

    @JsonProperty("context")
    private String context;

    @JsonProperty("metadata")
    private Map<String, Object> metadata;

    @JsonProperty("options")
    private Map<String, Object> options;

    private JudgeRequest() {
    }

    private JudgeRequest(Builder builder) {
        this.prompt = builder.prompt;
        this.context = builder.context;
        this.metadata = builder.metadata.isEmpty() ? null : new HashMap<>(builder.metadata);
        this.options = builder.options.isEmpty() ? null : new HashMap<>(builder.options);
    }

    public String getPrompt() {
        return prompt;
    }

    public String getContext() {
        return context;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public Map<String, Object> getOptions() {
        return options;
    }

    public static Builder builder(String prompt) {
        return new Builder(prompt);
    }

    public static final class Builder {
        private final String prompt;
        private String context;
        private final Map<String, Object> metadata = new HashMap<>();
        private final Map<String, Object> options = new HashMap<>();

        private Builder(String prompt) {
            this.prompt = prompt;
        }

        public Builder context(String context) {
            this.context = context;
            return this;
        }

        public Builder metadata(String key, Object value) {
            this.metadata.put(key, value);
            return this;
        }

        public Builder metadata(Map<String, Object> metadata) {
            this.metadata.putAll(metadata);
            return this;
        }

        public Builder option(String key, Object value) {
            this.options.put(key, value);
            return this;
        }

        public Builder options(Map<String, Object> options) {
            this.options.putAll(options);
            return this;
        }

        public JudgeRequest build() {
            return new JudgeRequest(this);
        }
    }
}
