package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.JsonUtil;
import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.models.JudgeRequest;
import ai.aegis.sdk.models.JudgeResponse;
import ai.aegis.sdk.streaming.SseStream;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class JudgeResource extends BaseResource {

    public JudgeResource(Transport transport) {
        super(transport);
    }

    public JudgeResponse create(JudgeRequest request) {
        return post("/v3/judge", request, JudgeResponse.class);
    }

    public List<JudgeResponse> batch(List<JudgeRequest> requests) {
        Map<String, Object> body = Collections.singletonMap("requests", requests);
        return post("/v3/judge/batch", body,
                new TypeReference<List<JudgeResponse>>() {});
    }

    public void stream(JudgeRequest request, Consumer<SseStream.JudgeStreamEvent> eventConsumer) {
        streamSse("/v3/judge/stream", request, data -> {
            SseStream.JudgeStreamEvent event = JsonUtil.deserialize(
                    data, SseStream.JudgeStreamEvent.class);
            eventConsumer.accept(event);
        });
    }

    public List<JudgeResponse> list(Map<String, Object> params) {
        StringBuilder path = new StringBuilder("/v3/judge");
        appendQueryParams(path, params);
        return get(path.toString(), new TypeReference<List<JudgeResponse>>() {});
    }

    public List<JudgeResponse> list() {
        return list(null);
    }

    public JudgeResponse get(String judgmentId) {
        return get("/v3/judge/" + judgmentId, JudgeResponse.class);
    }

    private void appendQueryParams(StringBuilder path, Map<String, Object> params) {
        if (params == null || params.isEmpty()) return;
        path.append("?");
        boolean first = true;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (!first) path.append("&");
            path.append(entry.getKey()).append("=").append(entry.getValue());
            first = false;
        }
    }
}
