package ai.aegis.sdk.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentScanRequest {

    @JsonProperty("agent_input")
    private String agentInput;

    @JsonProperty("agent_output")
    private String agentOutput;

    @JsonProperty("tools")
    private List<String> tools;

    @JsonProperty("context")
    private Map<String, Object> context;

    @JsonProperty("options")
    private Map<String, Object> options;

    private AgentScanRequest() {
    }

    private AgentScanRequest(Builder builder) {
        this.agentInput = builder.agentInput;
        this.agentOutput = builder.agentOutput;
        this.tools = builder.tools.isEmpty() ? null : new ArrayList<>(builder.tools);
        this.context = builder.context.isEmpty() ? null : new HashMap<>(builder.context);
        this.options = builder.options.isEmpty() ? null : new HashMap<>(builder.options);
    }

    public String getAgentInput() { return agentInput; }
    public String getAgentOutput() { return agentOutput; }
    public List<String> getTools() { return tools; }
    public Map<String, Object> getContext() { return context; }
    public Map<String, Object> getOptions() { return options; }

    public static Builder builder(String agentInput) {
        return new Builder(agentInput);
    }

    public static final class Builder {
        private final String agentInput;
        private String agentOutput;
        private final List<String> tools = new ArrayList<>();
        private final Map<String, Object> context = new HashMap<>();
        private final Map<String, Object> options = new HashMap<>();

        private Builder(String agentInput) { this.agentInput = agentInput; }

        public Builder agentOutput(String agentOutput) { this.agentOutput = agentOutput; return this; }
        public Builder tool(String tool) { this.tools.add(tool); return this; }
        public Builder tools(List<String> tools) { this.tools.addAll(tools); return this; }
        public Builder context(String key, Object value) { this.context.put(key, value); return this; }
        public Builder option(String key, Object value) { this.options.put(key, value); return this; }

        public AgentScanRequest build() { return new AgentScanRequest(this); }
    }
}
