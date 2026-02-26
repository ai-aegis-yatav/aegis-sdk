package ai.aegis.sdk.streaming;

import ai.aegis.sdk.internal.JsonUtil;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.function.Consumer;

/**
 * Parses Server-Sent Events from a stream of lines.
 * Used internally by Transport for SSE streaming endpoints.
 */
public final class SseStream {

    private SseStream() {
    }

    /**
     * Parses raw SSE lines and invokes the consumer for each complete data event.
     */
    public static void parse(java.util.stream.Stream<String> lines,
                             Consumer<String> dataConsumer) {
        StringBuilder dataBuffer = new StringBuilder();
        lines.forEach(line -> {
            if (line.startsWith("data: ")) {
                dataBuffer.append(line.substring(6));
            } else if (line.startsWith("data:")) {
                dataBuffer.append(line.substring(5));
            } else if (line.isEmpty() && dataBuffer.length() > 0) {
                String data = dataBuffer.toString().trim();
                dataBuffer.setLength(0);
                if (!data.isEmpty() && !"[DONE]".equals(data)) {
                    dataConsumer.accept(data);
                }
            }
        });
        if (dataBuffer.length() > 0) {
            String remaining = dataBuffer.toString().trim();
            if (!remaining.isEmpty() && !"[DONE]".equals(remaining)) {
                dataConsumer.accept(remaining);
            }
        }
    }

    /**
     * Parses SSE data into typed events.
     */
    public static <T> void parseTyped(java.util.stream.Stream<String> lines,
                                      Class<T> eventType,
                                      Consumer<T> eventConsumer) {
        parse(lines, data -> {
            T event = JsonUtil.deserialize(data, eventType);
            eventConsumer.accept(event);
        });
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JudgeStreamEvent {

        @JsonProperty("type")
        private String type;

        @JsonProperty("data")
        private Object data;

        @JsonProperty("judgment_id")
        private String judgmentId;

        public JudgeStreamEvent() {
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Object getData() { return data; }
        public void setData(Object data) { this.data = data; }

        public String getJudgmentId() { return judgmentId; }
        public void setJudgmentId(String judgmentId) { this.judgmentId = judgmentId; }
    }
}
