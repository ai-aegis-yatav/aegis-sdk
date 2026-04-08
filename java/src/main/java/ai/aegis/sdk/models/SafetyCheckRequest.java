package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SafetyCheckRequest {

    @JsonProperty("text")
    private String content;

    @JsonProperty("categories")
    private List<String> categories;

    @JsonProperty("options")
    private Map<String, Object> options;

    private SafetyCheckRequest() {
    }

    private SafetyCheckRequest(Builder builder) {
        this.content = builder.content;
        this.categories = builder.categories.isEmpty() ? null : new ArrayList<>(builder.categories);
        this.options = builder.options.isEmpty() ? null : new HashMap<>(builder.options);
    }

    public String getContent() { return content; }
    public List<String> getCategories() { return categories; }
    public Map<String, Object> getOptions() { return options; }

    public static Builder builder(String content) {
        return new Builder(content);
    }

    public static final class Builder {
        private final String content;
        private final List<String> categories = new ArrayList<>();
        private final Map<String, Object> options = new HashMap<>();

        private Builder(String content) { this.content = content; }

        public Builder category(String category) { this.categories.add(category); return this; }
        public Builder categories(List<String> categories) { this.categories.addAll(categories); return this; }
        public Builder option(String key, Object value) { this.options.put(key, value); return this; }

        public SafetyCheckRequest build() { return new SafetyCheckRequest(this); }
    }
}
