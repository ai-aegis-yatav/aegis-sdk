package ai.aegis.sdk.errors;

public class ApiException extends AegisException {

    private final int statusCode;
    private final String errorCode;
    private final String requestId;
    private final String body;

    public ApiException(String message, int statusCode, String errorCode,
                        String requestId, String body) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.requestId = requestId;
        this.body = body;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getBody() {
        return body;
    }
}
