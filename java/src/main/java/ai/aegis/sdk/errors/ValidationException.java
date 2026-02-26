package ai.aegis.sdk.errors;

import java.util.Collections;
import java.util.List;

public class ValidationException extends ApiException {

    private final List<String> fieldErrors;

    public ValidationException(String message, int statusCode, String requestId,
                               String body, List<String> fieldErrors) {
        super(message, statusCode, "VALIDATION_ERROR", requestId, body);
        this.fieldErrors = fieldErrors != null
                ? Collections.unmodifiableList(fieldErrors)
                : Collections.emptyList();
    }

    public List<String> getFieldErrors() {
        return fieldErrors;
    }
}
