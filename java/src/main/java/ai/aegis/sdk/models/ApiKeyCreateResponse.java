package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiKeyCreateResponse {

    @JsonProperty("api_key")
    private ApiKey apiKey;

    @JsonProperty("secret")
    private String secret;

    public ApiKeyCreateResponse() {
    }

    public ApiKey getApiKey() { return apiKey; }
    public void setApiKey(ApiKey apiKey) { this.apiKey = apiKey; }

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
}
