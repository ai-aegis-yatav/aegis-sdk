package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RuleCreateRequest {

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("pattern")
    private String pattern;

    @JsonProperty("action")
    private String action;

    @JsonProperty("severity")
    private String severity;

    @JsonProperty("enabled")
    private Boolean enabled;

    @JsonProperty("tags")
    private List<String> tags;

    @JsonProperty("metadata")
    private Map<String, Object> metadata;

    private RuleCreateRequest() {
    }

    private RuleCreateRequest(Builder builder) {
        this.name = builder.name;
        this.description = builder.description;
        this.pattern = builder.pattern;
        this.action = builder.action;
        this.severity = builder.severity;
        this.enabled = builder.enabled;
        this.tags = builder.tags.isEmpty() ? null : new ArrayList<>(builder.tags);
        this.metadata = builder.metadata.isEmpty() ? null : new HashMap<>(builder.metadata);
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getPattern() { return pattern; }
    public String getAction() { return action; }
    public String getSeverity() { return severity; }
    public Boolean getEnabled() { return enabled; }
    public List<String> getTags() { return tags; }
    public Map<String, Object> getMetadata() { return metadata; }

    public static Builder builder(String name, String pattern) {
        return new Builder(name, pattern);
    }

    public static final class Builder {
        private final String name;
        private final String pattern;
        private String description;
        private String action = "flag";
        private String severity = "medium";
        private Boolean enabled = true;
        private final List<String> tags = new ArrayList<>();
        private final Map<String, Object> metadata = new HashMap<>();

        private Builder(String name, String pattern) {
            this.name = name;
            this.pattern = pattern;
        }

        public Builder description(String description) { this.description = description; return this; }
        public Builder action(String action) { this.action = action; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder enabled(boolean enabled) { this.enabled = enabled; return this; }
        public Builder tag(String tag) { this.tags.add(tag); return this; }
        public Builder tags(List<String> tags) { this.tags.addAll(tags); return this; }
        public Builder metadata(String key, Object value) { this.metadata.put(key, value); return this; }

        public RuleCreateRequest build() {
            return new RuleCreateRequest(this);
        }
    }
}
