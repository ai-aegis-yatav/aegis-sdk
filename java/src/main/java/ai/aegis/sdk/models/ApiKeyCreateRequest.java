package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiKeyCreateRequest {

    @JsonProperty("name")
    private String name;

    @JsonProperty("scopes")
    private List<String> scopes;

    @JsonProperty("expires_in_days")
    private Integer expiresInDays;

    @JsonProperty("metadata")
    private Map<String, Object> metadata;

    private ApiKeyCreateRequest() {
    }

    private ApiKeyCreateRequest(Builder builder) {
        this.name = builder.name;
        this.scopes = builder.scopes.isEmpty() ? null : new ArrayList<>(builder.scopes);
        this.expiresInDays = builder.expiresInDays;
        this.metadata = builder.metadata.isEmpty() ? null : new HashMap<>(builder.metadata);
    }

    public String getName() { return name; }
    public List<String> getScopes() { return scopes; }
    public Integer getExpiresInDays() { return expiresInDays; }
    public Map<String, Object> getMetadata() { return metadata; }

    public static Builder builder(String name) {
        return new Builder(name);
    }

    public static final class Builder {
        private final String name;
        private final List<String> scopes = new ArrayList<>();
        private Integer expiresInDays;
        private final Map<String, Object> metadata = new HashMap<>();

        private Builder(String name) { this.name = name; }

        public Builder scope(String scope) { this.scopes.add(scope); return this; }
        public Builder scopes(List<String> scopes) { this.scopes.addAll(scopes); return this; }
        public Builder expiresInDays(int days) { this.expiresInDays = days; return this; }
        public Builder metadata(String key, Object value) { this.metadata.put(key, value); return this; }

        public ApiKeyCreateRequest build() { return new ApiKeyCreateRequest(this); }
    }
}
