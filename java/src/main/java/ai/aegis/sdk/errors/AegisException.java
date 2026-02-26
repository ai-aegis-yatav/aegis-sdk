package ai.aegis.sdk.errors;

public class AegisException extends RuntimeException {

    public AegisException(String message) {
        super(message);
    }

    public AegisException(String message, Throwable cause) {
        super(message, cause);
    }
}
