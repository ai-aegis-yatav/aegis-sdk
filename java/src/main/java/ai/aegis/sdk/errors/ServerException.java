package ai.aegis.sdk.errors;

public class ServerException extends ApiException {

    public ServerException(String message, int statusCode, String requestId, String body) {
        super(message, statusCode, "SERVER_ERROR", requestId, body);
    }
}
