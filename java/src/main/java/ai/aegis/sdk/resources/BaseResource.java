package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.JsonUtil;
import ai.aegis.sdk.internal.Transport;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public abstract class BaseResource {

    protected final Transport transport;

    protected BaseResource(Transport transport) {
        this.transport = transport;
    }

    protected <T> T get(String path, Class<T> responseType) {
        String json = transport.get(path);
        return JsonUtil.deserialize(json, responseType);
    }

    protected <T> T get(String path, TypeReference<T> typeRef) {
        String json = transport.get(path);
        return JsonUtil.deserialize(json, typeRef);
    }

    protected String getRaw(String path) {
        return transport.get(path);
    }

    protected <T> T post(String path, Object body, Class<T> responseType) {
        String json = transport.post(path, body);
        return JsonUtil.deserialize(json, responseType);
    }

    protected <T> T post(String path, Object body, TypeReference<T> typeRef) {
        String json = transport.post(path, body);
        return JsonUtil.deserialize(json, typeRef);
    }

    protected String postRaw(String path, Object body) {
        return transport.post(path, body);
    }

    protected <T> T put(String path, Object body, Class<T> responseType) {
        String json = transport.put(path, body);
        return JsonUtil.deserialize(json, responseType);
    }

    protected <T> T put(String path, Object body, TypeReference<T> typeRef) {
        String json = transport.put(path, body);
        return JsonUtil.deserialize(json, typeRef);
    }

    protected String putRaw(String path, Object body) {
        return transport.put(path, body);
    }

    protected <T> T delete(String path, Class<T> responseType) {
        String json = transport.delete(path);
        return JsonUtil.deserialize(json, responseType);
    }

    protected <T> T patch(String path, Object body, Class<T> responseType) {
        String json = transport.patch(path, body);
        return JsonUtil.deserialize(json, responseType);
    }

    protected <T> T patch(String path, Object body, TypeReference<T> typeRef) {
        String json = transport.patch(path, body);
        return JsonUtil.deserialize(json, typeRef);
    }

    @SuppressWarnings("unchecked")
    protected Map<String, Object> patchMap(String path, Object body) {
        return patch(path, body, new TypeReference<Map<String, Object>>() {});
    }

    protected String buildQueryPath(String base, Map<String, Object> params) {
        if (params == null || params.isEmpty()) return base;
        StringBuilder sb = new StringBuilder(base).append("?");
        boolean first = true;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (!first) sb.append("&");
            sb.append(entry.getKey()).append("=").append(entry.getValue());
            first = false;
        }
        return sb.toString();
    }

    protected void deleteVoid(String path) {
        transport.delete(path);
    }

    protected void streamSse(String path, Object body, Consumer<String> eventConsumer) {
        transport.streamSse(path, body, eventConsumer);
    }

    @SuppressWarnings("unchecked")
    protected Map<String, Object> getMap(String path) {
        return get(path, new TypeReference<Map<String, Object>>() {});
    }

    @SuppressWarnings("unchecked")
    protected Map<String, Object> postMap(String path, Object body) {
        return post(path, body, new TypeReference<Map<String, Object>>() {});
    }

    @SuppressWarnings("unchecked")
    protected List<Map<String, Object>> getList(String path) {
        return get(path, new TypeReference<List<Map<String, Object>>>() {});
    }
}
