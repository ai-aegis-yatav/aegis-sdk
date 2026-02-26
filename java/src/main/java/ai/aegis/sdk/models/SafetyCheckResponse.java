package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SafetyCheckResponse {

    @JsonProperty("safe")
    private boolean safe;

    @JsonProperty("score")
    private double score;

    @JsonProperty("categories")
    private List<String> flaggedCategories;

    @JsonProperty("risks")
    private List<Risk> risks;

    @JsonProperty("details")
    private Map<String, Object> details;

    public SafetyCheckResponse() {
    }

    public boolean isSafe() { return safe; }
    public void setSafe(boolean safe) { this.safe = safe; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public List<String> getFlaggedCategories() { return flaggedCategories; }
    public void setFlaggedCategories(List<String> flaggedCategories) { this.flaggedCategories = flaggedCategories; }

    public List<Risk> getRisks() { return risks; }
    public void setRisks(List<Risk> risks) { this.risks = risks; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
