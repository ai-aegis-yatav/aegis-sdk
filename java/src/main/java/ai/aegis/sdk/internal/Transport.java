package ai.aegis.sdk.internal;

import ai.aegis.sdk.config.ClientConfig;
import ai.aegis.sdk.errors.*;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Consumer;
import java.util.stream.Stream;

public final class Transport implements AutoCloseable {

    private static final String SDK_VERSION = "0.1.0";
    private static final String USER_AGENT = "aegis-java-sdk/" + SDK_VERSION;

    private final ClientConfig config;
    private final HttpClient httpClient;
    private final QuotaInfo quotaInfo;

    public Transport(ClientConfig config) {
        this.config = config;
        this.quotaInfo = new QuotaInfo();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(config.getTimeout())
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public QuotaInfo getQuotaInfo() {
        return quotaInfo;
    }

    public String get(String path) {
        return execute("GET", path, null);
    }

    public String post(String path, Object body) {
        return execute("POST", path, body);
    }

    public String put(String path, Object body) {
        return execute("PUT", path, body);
    }

    public String delete(String path) {
        return execute("DELETE", path, null);
    }

    public void streamSse(String path, Object body, Consumer<String> eventConsumer) {
        URI uri = buildUri(path);
        String jsonBody = body != null ? JsonUtil.serialize(body) : null;

        HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                .uri(uri)
                .timeout(Duration.ofMinutes(5))
                .header("Accept", "text/event-stream");

        applyCommonHeaders(reqBuilder);

        if (jsonBody != null) {
            reqBuilder.POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .header("Content-Type", "application/json");
        } else {
            reqBuilder.GET();
        }

        try {
            HttpResponse<Stream<String>> response = httpClient.send(
                    reqBuilder.build(),
                    HttpResponse.BodyHandlers.ofLines());

            if (response.statusCode() >= 400) {
                StringBuilder sb = new StringBuilder();
                response.body().forEach(line -> sb.append(line).append("\n"));
                handleErrorResponse(response.statusCode(), sb.toString(), response);
            }

            StringBuilder dataBuffer = new StringBuilder();
            response.body().forEach(line -> {
                if (line.startsWith("data: ")) {
                    dataBuffer.append(line.substring(6));
                } else if (line.isEmpty() && dataBuffer.length() > 0) {
                    String data = dataBuffer.toString().trim();
                    dataBuffer.setLength(0);
                    if (!"[DONE]".equals(data)) {
                        eventConsumer.accept(data);
                    }
                }
            });
        } catch (AegisException e) {
            throw e;
        } catch (IOException e) {
            throw new NetworkException("SSE connection failed: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new NetworkException("SSE connection interrupted", e);
        }
    }

    private String execute(String method, String path, Object body) {
        URI uri = buildUri(path);
        String jsonBody = body != null ? JsonUtil.serialize(body) : null;

        int attempt = 0;
        while (true) {
            try {
                HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                        .uri(uri)
                        .timeout(config.getTimeout());

                applyCommonHeaders(reqBuilder);

                switch (method) {
                    case "GET":
                        reqBuilder.GET();
                        break;
                    case "DELETE":
                        reqBuilder.DELETE();
                        break;
                    case "POST":
                        reqBuilder.POST(bodyPublisher(jsonBody));
                        reqBuilder.header("Content-Type", "application/json");
                        break;
                    case "PUT":
                        reqBuilder.PUT(bodyPublisher(jsonBody));
                        reqBuilder.header("Content-Type", "application/json");
                        break;
                    default:
                        reqBuilder.method(method, bodyPublisher(jsonBody));
                        reqBuilder.header("Content-Type", "application/json");
                }

                HttpResponse<String> response = httpClient.send(
                        reqBuilder.build(),
                        HttpResponse.BodyHandlers.ofString());

                updateQuota(response);

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    return response.body();
                }

                if (isRetryable(response.statusCode()) && attempt < config.getMaxRetries()) {
                    attempt++;
                    backoff(attempt, response);
                    continue;
                }

                handleErrorResponse(response.statusCode(), response.body(), response);

            } catch (AegisException e) {
                throw e;
            } catch (IOException e) {
                if (attempt < config.getMaxRetries()) {
                    attempt++;
                    backoff(attempt, null);
                    continue;
                }
                throw new NetworkException("Request failed after " + (attempt + 1) + " attempts: " + e.getMessage(), e);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new NetworkException("Request interrupted", e);
            }
        }
    }

    private URI buildUri(String path) {
        String base = config.getBaseUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return URI.create(base + path);
    }

    private void applyCommonHeaders(HttpRequest.Builder builder) {
        builder.header("X-API-Key", config.getApiKey())
                .header("User-Agent", USER_AGENT)
                .header("Accept", "application/json");

        for (Map.Entry<String, String> entry : config.getCustomHeaders().entrySet()) {
            builder.header(entry.getKey(), entry.getValue());
        }
    }

    private HttpRequest.BodyPublisher bodyPublisher(String json) {
        return json != null
                ? HttpRequest.BodyPublishers.ofString(json)
                : HttpRequest.BodyPublishers.noBody();
    }

    private void updateQuota(HttpResponse<?> response) {
        try {
            String limit = response.headers().firstValue("X-Quota-Limit").orElse(null);
            String used = response.headers().firstValue("X-Quota-Used").orElse(null);
            String remaining = response.headers().firstValue("X-Quota-Remaining").orElse(null);

            if (limit != null && used != null && remaining != null) {
                quotaInfo.update(
                        Long.parseLong(limit),
                        Long.parseLong(used),
                        Long.parseLong(remaining));
            }
        } catch (NumberFormatException ignored) {
        }
    }

    private boolean isRetryable(int statusCode) {
        return statusCode == 429 || statusCode == 502 || statusCode == 503 || statusCode == 504;
    }

    private void backoff(int attempt, HttpResponse<?> response) {
        long baseMs = 500L * (1L << (attempt - 1));
        long jitter = ThreadLocalRandom.current().nextLong(0, baseMs / 2 + 1);
        long waitMs = baseMs + jitter;

        if (response != null) {
            response.headers().firstValue("Retry-After").ifPresent(val -> {
                // Retry-After header handling is best-effort
            });
        }

        try {
            Thread.sleep(waitMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new NetworkException("Retry interrupted", e);
        }
    }

    private void handleErrorResponse(int statusCode, String body,
                                     HttpResponse<?> response) {
        String requestId = response.headers().firstValue("X-Request-Id").orElse(null);
        String message = extractMessage(body);
        String errorCode = extractField(body, "error_code");

        switch (statusCode) {
            case 400:
            case 422:
                throw new ValidationException(message, statusCode, requestId, body, null);
            case 401:
                throw new AuthenticationException(message, requestId, body);
            case 403:
                throw new TierAccessException(
                        message, requestId, body,
                        extractField(body, "required_tier"),
                        extractField(body, "upgrade_url"));
            case 404:
                throw new NotFoundException(message, requestId, body);
            case 429:
                if ("QUOTA_EXCEEDED".equals(errorCode) || body.contains("quota")) {
                    throw new QuotaExceededException(
                            message, requestId, body,
                            extractLong(body, "limit"),
                            extractLong(body, "used"),
                            extractField(body, "reset_at"));
                }
                Duration retryAfter = response.headers().firstValue("Retry-After")
                        .map(v -> {
                            try {
                                return Duration.ofSeconds(Long.parseLong(v));
                            } catch (NumberFormatException e) {
                                return Duration.ofSeconds(60);
                            }
                        })
                        .orElse(Duration.ofSeconds(60));
                throw new RateLimitException(message, requestId, body, retryAfter);
            default:
                if (statusCode >= 500) {
                    throw new ServerException(message, statusCode, requestId, body);
                }
                throw new ApiException(message, statusCode, errorCode, requestId, body);
        }
    }

    private String extractMessage(String body) {
        if (body == null || body.isEmpty()) {
            return "Unknown error";
        }
        try {
            JsonNode node = JsonUtil.mapper().readTree(body);
            if (node.has("message")) {
                return node.get("message").asText();
            }
            if (node.has("error")) {
                JsonNode err = node.get("error");
                if (err.isTextual()) {
                    return err.asText();
                }
                if (err.has("message")) {
                    return err.get("message").asText();
                }
            }
        } catch (Exception ignored) {
        }
        return body.length() > 200 ? body.substring(0, 200) : body;
    }

    private String extractField(String body, String field) {
        if (body == null) return null;
        try {
            JsonNode node = JsonUtil.mapper().readTree(body);
            if (node.has(field)) {
                return node.get(field).asText();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private long extractLong(String body, String field) {
        String val = extractField(body, field);
        if (val != null) {
            try {
                return Long.parseLong(val);
            } catch (NumberFormatException ignored) {
            }
        }
        return -1;
    }

    @Override
    public void close() {
        // HttpClient does not require explicit close in Java 11
    }
}
