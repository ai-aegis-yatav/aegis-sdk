package ai.aegis.sdk.errors;

public class NotFoundException extends ApiException {

    public NotFoundException(String message, String requestId, String body) {
        super(message, 404, "NOT_FOUND", requestId, body);
    }
}
