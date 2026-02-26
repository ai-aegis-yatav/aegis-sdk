package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.ApiKey;
import ai.aegis.sdk.models.ApiKeyCreateRequest;
import ai.aegis.sdk.models.ApiKeyCreateResponse;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;

public class ApiKeysResource extends BaseResource {

    public ApiKeysResource(Transport transport) {
        super(transport);
    }

    public ApiKeyCreateResponse create(ApiKeyCreateRequest request) {
        return post("/v3/api-keys", request, ApiKeyCreateResponse.class);
    }

    public List<ApiKey> list() {
        return get("/v3/api-keys", new TypeReference<List<ApiKey>>() {});
    }

    public ApiKey get(String keyId) {
        return get("/v3/api-keys/" + keyId, ApiKey.class);
    }

    public ApiKey revoke(String keyId) {
        return post("/v3/api-keys/" + keyId + "/revoke", null, ApiKey.class);
    }

    public void delete(String keyId) {
        deleteVoid("/v3/api-keys/" + keyId);
    }
}
