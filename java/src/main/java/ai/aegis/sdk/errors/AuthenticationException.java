package ai.aegis.sdk.errors;

public class AuthenticationException extends ApiException {

    public AuthenticationException(String message, String requestId, String body) {
        super(message, 401, "AUTHENTICATION_FAILED", requestId, body);
    }
}
