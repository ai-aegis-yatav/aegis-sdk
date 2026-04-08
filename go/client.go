package aegis

import (
	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

// Client is the top-level AEGIS API client. Access API resources via the
// embedded service structs.
type Client struct {
	transport *internal.Transport

	Judge       *JudgeService
	Rules       *RulesService
	Escalations *EscalationsService
	Analytics   *AnalyticsService
	Evidence    *EvidenceService
	ML          *MLService
	NLP         *NLPService
	AiAct       *AiActService
	Classify    *ClassifyService
	Jailbreak   *JailbreakService
	Safety      *SafetyService
	Defense     *DefenseService
	Advanced    *AdvancedService
	AdversaFlow *AdversaFlowService
	GuardNet    *GuardNetService
	Agent       *AgentService
	Anomaly     *AnomalyService
	Multimodal  *MultimodalService
	Evolution   *EvolutionService
	Saber       *SaberService
	Ops           *OpsService
	ApiKeys       *ApiKeysService
	Orchestration *OrchestrationService
}

func newClient(apiKey string, cfg *clientConfig) *Client {
	t := internal.NewTransport(apiKey, cfg.BaseURL, cfg.Timeout, cfg.MaxRetries, cfg.CustomHeaders)
	c := &Client{transport: t}

	c.Judge = &JudgeService{t: t}
	c.Rules = &RulesService{t: t}
	c.Escalations = &EscalationsService{t: t}
	c.Analytics = &AnalyticsService{t: t}
	c.Evidence = &EvidenceService{t: t}
	c.ML = &MLService{t: t}
	c.NLP = &NLPService{t: t}
	c.AiAct = &AiActService{t: t}
	c.Classify = &ClassifyService{t: t}
	c.Jailbreak = &JailbreakService{t: t}
	c.Safety = &SafetyService{t: t}
	c.Defense = &DefenseService{t: t}
	c.Advanced = &AdvancedService{t: t}
	c.AdversaFlow = &AdversaFlowService{t: t}
	c.GuardNet = &GuardNetService{t: t}
	c.Agent = &AgentService{t: t}
	c.Anomaly = &AnomalyService{t: t}
	c.Multimodal = &MultimodalService{t: t}
	c.Evolution = &EvolutionService{t: t}
	c.Saber = &SaberService{t: t}
	c.Ops = &OpsService{t: t}
	c.ApiKeys = &ApiKeysService{t: t}
	c.Orchestration = &OrchestrationService{t: t}

	return c
}

// Quota returns the most recently observed quota information from API
// response headers. Returns nil if no quota data has been received yet.
func (c *Client) Quota() *models.QuotaInfo {
	return c.transport.LastQuota
}
