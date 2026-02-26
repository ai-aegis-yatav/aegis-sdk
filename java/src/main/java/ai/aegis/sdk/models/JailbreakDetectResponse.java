package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JailbreakDetectResponse {

    @JsonProperty("detected")
    private boolean detected;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("type")
    private String type;

    @JsonProperty("techniques")
    private List<String> techniques;

    @JsonProperty("details")
    private Map<String, Object> details;

    public JailbreakDetectResponse() {
    }

    public boolean isDetected() { return detected; }
    public void setDetected(boolean detected) { this.detected = detected; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getTechniques() { return techniques; }
    public void setTechniques(List<String> techniques) { this.techniques = techniques; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
