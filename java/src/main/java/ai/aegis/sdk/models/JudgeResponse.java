package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JudgeResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("decision")
    private String decision;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("risks")
    private List<Risk> risks;

    @JsonProperty("layers")
    private List<DefenseLayer> layers;

    @JsonProperty("latency_ms")
    private long latencyMs;

    public JudgeResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public List<Risk> getRisks() {
        return risks;
    }

    public void setRisks(List<Risk> risks) {
        this.risks = risks;
    }

    public List<DefenseLayer> getLayers() {
        return layers;
    }

    public void setLayers(List<DefenseLayer> layers) {
        this.layers = layers;
    }

    public long getLatencyMs() {
        return latencyMs;
    }

    public void setLatencyMs(long latencyMs) {
        this.latencyMs = latencyMs;
    }
}
