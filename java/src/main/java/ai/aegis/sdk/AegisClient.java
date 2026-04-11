package ai.aegis.sdk;

import ai.aegis.sdk.config.ClientConfig;
import ai.aegis.sdk.internal.QuotaInfo;
import ai.aegis.sdk.internal.Transport;
import ai.aegis.sdk.resources.*;

import java.time.Duration;
import java.util.Map;
import java.util.Objects;

public final class AegisClient implements AutoCloseable {

    private final Transport transport;

    private volatile JudgeResource judgeResource;
    private volatile RulesResource rulesResource;
    private volatile EscalationsResource escalationsResource;
    private volatile AnalyticsResource analyticsResource;
    private volatile EvidenceResource evidenceResource;
    private volatile MlResource mlResource;
    private volatile NlpResource nlpResource;
    private volatile AiActResource aiActResource;
    private volatile ClassifyResource classifyResource;
    private volatile JailbreakResource jailbreakResource;
    private volatile SafetyResource safetyResource;
    private volatile DefenseResource defenseResource;
    private volatile AdvancedResource advancedResource;
    private volatile AdversaFlowResource adversaFlowResource;
    private volatile GuardNetResource guardNetResource;
    private volatile AgentResource agentResource;
    private volatile AnomalyResource anomalyResource;
    private volatile MultimodalResource multimodalResource;
    private volatile EvolutionResource evolutionResource;
    private volatile SaberResource saberResource;
    private volatile OpsResource opsResource;
    private volatile ApiKeysResource apiKeysResource;
    private volatile OrchestrationResource orchestrationResource;
    private volatile DreamdojoResource dreamdojoResource;
    private volatile MilitaryResource militaryResource;
    private volatile GuardModelResource guardModelResource;
    private volatile KoreanResource koreanResource;
    private volatile PipelineResource pipelineResource;
    private volatile ReportsResource reportsResource;
    private volatile TokenMonitorResource tokenMonitorResource;
    private volatile V3AnalyticsResource v3AnalyticsResource;

    private AegisClient(ClientConfig config) {
        this.transport = new Transport(config);
    }

    public static Builder builder(String apiKey) {
        return new Builder(apiKey);
    }

    public JudgeResource judge() {
        JudgeResource r = judgeResource;
        if (r == null) {
            synchronized (this) {
                r = judgeResource;
                if (r == null) {
                    r = new JudgeResource(transport);
                    judgeResource = r;
                }
            }
        }
        return r;
    }

    public RulesResource rules() {
        RulesResource r = rulesResource;
        if (r == null) {
            synchronized (this) {
                r = rulesResource;
                if (r == null) {
                    r = new RulesResource(transport);
                    rulesResource = r;
                }
            }
        }
        return r;
    }

    public EscalationsResource escalations() {
        EscalationsResource r = escalationsResource;
        if (r == null) {
            synchronized (this) {
                r = escalationsResource;
                if (r == null) {
                    r = new EscalationsResource(transport);
                    escalationsResource = r;
                }
            }
        }
        return r;
    }

    public AnalyticsResource analytics() {
        AnalyticsResource r = analyticsResource;
        if (r == null) {
            synchronized (this) {
                r = analyticsResource;
                if (r == null) {
                    r = new AnalyticsResource(transport);
                    analyticsResource = r;
                }
            }
        }
        return r;
    }

    public EvidenceResource evidence() {
        EvidenceResource r = evidenceResource;
        if (r == null) {
            synchronized (this) {
                r = evidenceResource;
                if (r == null) {
                    r = new EvidenceResource(transport);
                    evidenceResource = r;
                }
            }
        }
        return r;
    }

    public MlResource ml() {
        MlResource r = mlResource;
        if (r == null) {
            synchronized (this) {
                r = mlResource;
                if (r == null) {
                    r = new MlResource(transport);
                    mlResource = r;
                }
            }
        }
        return r;
    }

    public NlpResource nlp() {
        NlpResource r = nlpResource;
        if (r == null) {
            synchronized (this) {
                r = nlpResource;
                if (r == null) {
                    r = new NlpResource(transport);
                    nlpResource = r;
                }
            }
        }
        return r;
    }

    public AiActResource aiAct() {
        AiActResource r = aiActResource;
        if (r == null) {
            synchronized (this) {
                r = aiActResource;
                if (r == null) {
                    r = new AiActResource(transport);
                    aiActResource = r;
                }
            }
        }
        return r;
    }

    public ClassifyResource classify() {
        ClassifyResource r = classifyResource;
        if (r == null) {
            synchronized (this) {
                r = classifyResource;
                if (r == null) {
                    r = new ClassifyResource(transport);
                    classifyResource = r;
                }
            }
        }
        return r;
    }

    public JailbreakResource jailbreak() {
        JailbreakResource r = jailbreakResource;
        if (r == null) {
            synchronized (this) {
                r = jailbreakResource;
                if (r == null) {
                    r = new JailbreakResource(transport);
                    jailbreakResource = r;
                }
            }
        }
        return r;
    }

    public SafetyResource safety() {
        SafetyResource r = safetyResource;
        if (r == null) {
            synchronized (this) {
                r = safetyResource;
                if (r == null) {
                    r = new SafetyResource(transport);
                    safetyResource = r;
                }
            }
        }
        return r;
    }

    public DefenseResource defense() {
        DefenseResource r = defenseResource;
        if (r == null) {
            synchronized (this) {
                r = defenseResource;
                if (r == null) {
                    r = new DefenseResource(transport);
                    defenseResource = r;
                }
            }
        }
        return r;
    }

    public AdvancedResource advanced() {
        AdvancedResource r = advancedResource;
        if (r == null) {
            synchronized (this) {
                r = advancedResource;
                if (r == null) {
                    r = new AdvancedResource(transport);
                    advancedResource = r;
                }
            }
        }
        return r;
    }

    public AdversaFlowResource adversaflow() {
        AdversaFlowResource r = adversaFlowResource;
        if (r == null) {
            synchronized (this) {
                r = adversaFlowResource;
                if (r == null) {
                    r = new AdversaFlowResource(transport);
                    adversaFlowResource = r;
                }
            }
        }
        return r;
    }

    public GuardNetResource guardnet() {
        GuardNetResource r = guardNetResource;
        if (r == null) {
            synchronized (this) {
                r = guardNetResource;
                if (r == null) {
                    r = new GuardNetResource(transport);
                    guardNetResource = r;
                }
            }
        }
        return r;
    }

    public AgentResource agent() {
        AgentResource r = agentResource;
        if (r == null) {
            synchronized (this) {
                r = agentResource;
                if (r == null) {
                    r = new AgentResource(transport);
                    agentResource = r;
                }
            }
        }
        return r;
    }

    public AnomalyResource anomaly() {
        AnomalyResource r = anomalyResource;
        if (r == null) {
            synchronized (this) {
                r = anomalyResource;
                if (r == null) {
                    r = new AnomalyResource(transport);
                    anomalyResource = r;
                }
            }
        }
        return r;
    }

    public MultimodalResource multimodal() {
        MultimodalResource r = multimodalResource;
        if (r == null) {
            synchronized (this) {
                r = multimodalResource;
                if (r == null) {
                    r = new MultimodalResource(transport);
                    multimodalResource = r;
                }
            }
        }
        return r;
    }

    public EvolutionResource evolution() {
        EvolutionResource r = evolutionResource;
        if (r == null) {
            synchronized (this) {
                r = evolutionResource;
                if (r == null) {
                    r = new EvolutionResource(transport);
                    evolutionResource = r;
                }
            }
        }
        return r;
    }

    public SaberResource saber() {
        SaberResource r = saberResource;
        if (r == null) {
            synchronized (this) {
                r = saberResource;
                if (r == null) {
                    r = new SaberResource(transport);
                    saberResource = r;
                }
            }
        }
        return r;
    }

    public OpsResource ops() {
        OpsResource r = opsResource;
        if (r == null) {
            synchronized (this) {
                r = opsResource;
                if (r == null) {
                    r = new OpsResource(transport);
                    opsResource = r;
                }
            }
        }
        return r;
    }

    public ApiKeysResource apiKeys() {
        ApiKeysResource r = apiKeysResource;
        if (r == null) {
            synchronized (this) {
                r = apiKeysResource;
                if (r == null) {
                    r = new ApiKeysResource(transport);
                    apiKeysResource = r;
                }
            }
        }
        return r;
    }

    public OrchestrationResource orchestration() {
        OrchestrationResource r = orchestrationResource;
        if (r == null) {
            synchronized (this) {
                r = orchestrationResource;
                if (r == null) {
                    r = new OrchestrationResource(transport);
                    orchestrationResource = r;
                }
            }
        }
        return r;
    }

    public DreamdojoResource dreamdojo() {
        DreamdojoResource r = dreamdojoResource;
        if (r == null) {
            synchronized (this) {
                r = dreamdojoResource;
                if (r == null) {
                    r = new DreamdojoResource(transport);
                    dreamdojoResource = r;
                }
            }
        }
        return r;
    }

    public MilitaryResource military() {
        MilitaryResource r = militaryResource;
        if (r == null) {
            synchronized (this) {
                r = militaryResource;
                if (r == null) {
                    r = new MilitaryResource(transport);
                    militaryResource = r;
                }
            }
        }
        return r;
    }

    public GuardModelResource guardModel() {
        GuardModelResource r = guardModelResource;
        if (r == null) {
            synchronized (this) {
                r = guardModelResource;
                if (r == null) {
                    r = new GuardModelResource(transport);
                    guardModelResource = r;
                }
            }
        }
        return r;
    }

    public KoreanResource korean() {
        KoreanResource r = koreanResource;
        if (r == null) {
            synchronized (this) {
                r = koreanResource;
                if (r == null) {
                    r = new KoreanResource(transport);
                    koreanResource = r;
                }
            }
        }
        return r;
    }

    public PipelineResource pipeline() {
        PipelineResource r = pipelineResource;
        if (r == null) {
            synchronized (this) {
                r = pipelineResource;
                if (r == null) {
                    r = new PipelineResource(transport);
                    pipelineResource = r;
                }
            }
        }
        return r;
    }

    public ReportsResource reports() {
        ReportsResource r = reportsResource;
        if (r == null) {
            synchronized (this) {
                r = reportsResource;
                if (r == null) {
                    r = new ReportsResource(transport);
                    reportsResource = r;
                }
            }
        }
        return r;
    }

    public TokenMonitorResource tokenMonitor() {
        TokenMonitorResource r = tokenMonitorResource;
        if (r == null) {
            synchronized (this) {
                r = tokenMonitorResource;
                if (r == null) {
                    r = new TokenMonitorResource(transport);
                    tokenMonitorResource = r;
                }
            }
        }
        return r;
    }

    public V3AnalyticsResource v3Analytics() {
        V3AnalyticsResource r = v3AnalyticsResource;
        if (r == null) {
            synchronized (this) {
                r = v3AnalyticsResource;
                if (r == null) {
                    r = new V3AnalyticsResource(transport);
                    v3AnalyticsResource = r;
                }
            }
        }
        return r;
    }

    public QuotaInfo quota() {
        return transport.getQuotaInfo();
    }

    @Override
    public void close() {
        transport.close();
    }

    public static final class Builder {
        private final String apiKey;
        private String baseUrl = "https://api.aiaegis.io";
        private Duration timeout = Duration.ofSeconds(30);
        private int maxRetries = 3;
        private final java.util.HashMap<String, String> customHeaders = new java.util.HashMap<>();

        private Builder(String apiKey) {
            this.apiKey = Objects.requireNonNull(apiKey, "apiKey is required");
        }

        public Builder baseUrl(String baseUrl) {
            this.baseUrl = Objects.requireNonNull(baseUrl);
            return this;
        }

        public Builder timeout(Duration timeout) {
            this.timeout = Objects.requireNonNull(timeout);
            return this;
        }

        public Builder maxRetries(int maxRetries) {
            if (maxRetries < 0) {
                throw new IllegalArgumentException("maxRetries must be >= 0");
            }
            this.maxRetries = maxRetries;
            return this;
        }

        public Builder customHeader(String name, String value) {
            this.customHeaders.put(
                    Objects.requireNonNull(name),
                    Objects.requireNonNull(value));
            return this;
        }

        public Builder customHeaders(Map<String, String> headers) {
            this.customHeaders.putAll(Objects.requireNonNull(headers));
            return this;
        }

        public AegisClient build() {
            ClientConfig config = ClientConfig.builder(apiKey)
                    .baseUrl(baseUrl)
                    .timeout(timeout)
                    .maxRetries(maxRetries)
                    .customHeaders(customHeaders)
                    .build();
            return new AegisClient(config);
        }
    }
}
