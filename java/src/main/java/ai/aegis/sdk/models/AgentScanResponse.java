package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentScanResponse {

    @JsonProperty("safe")
    private boolean safe;

    @JsonProperty("threats")
    private List<Risk> threats;

    @JsonProperty("score")
    private double score;

    @JsonProperty("recommendations")
    private List<String> recommendations;

    @JsonProperty("details")
    private Map<String, Object> details;

    public AgentScanResponse() {
    }

    public boolean isSafe() { return safe; }
    public void setSafe(boolean safe) { this.safe = safe; }

    public List<Risk> getThreats() { return threats; }
    public void setThreats(List<Risk> threats) { this.threats = threats; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
