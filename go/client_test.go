package aegis_test

import (
	"testing"
	"time"

	"github.com/ai-aegis-yatav/aegis-sdk/go"
)

func TestNewClientCreatesClientWithApiKey(t *testing.T) {
	client := aegis.NewClient("sk_test_123")
	if client == nil {
		t.Fatal("expected non-nil client")
	}
}

func TestNewClientWithOptions(t *testing.T) {
	client := aegis.NewClient("sk_test_123",
		aegis.WithBaseURL("https://custom.api.example.com"),
		aegis.WithTimeout(10*time.Second),
	)
	if client == nil {
		t.Fatal("expected non-nil client")
	}
}

func TestAllServiceAccessorsNonNil(t *testing.T) {
	client := aegis.NewClient("sk_test_123")

	if client.Judge == nil {
		t.Error("Judge should not be nil")
	}
	if client.Rules == nil {
		t.Error("Rules should not be nil")
	}
	if client.Escalations == nil {
		t.Error("Escalations should not be nil")
	}
	if client.Analytics == nil {
		t.Error("Analytics should not be nil")
	}
	if client.Evidence == nil {
		t.Error("Evidence should not be nil")
	}
	if client.ML == nil {
		t.Error("ML should not be nil")
	}
	if client.NLP == nil {
		t.Error("NLP should not be nil")
	}
	if client.AiAct == nil {
		t.Error("AiAct should not be nil")
	}
	if client.Classify == nil {
		t.Error("Classify should not be nil")
	}
	if client.Jailbreak == nil {
		t.Error("Jailbreak should not be nil")
	}
	if client.Safety == nil {
		t.Error("Safety should not be nil")
	}
	if client.Defense == nil {
		t.Error("Defense should not be nil")
	}
	if client.Advanced == nil {
		t.Error("Advanced should not be nil")
	}
	if client.AdversaFlow == nil {
		t.Error("AdversaFlow should not be nil")
	}
	if client.GuardNet == nil {
		t.Error("GuardNet should not be nil")
	}
	if client.Agent == nil {
		t.Error("Agent should not be nil")
	}
	if client.Anomaly == nil {
		t.Error("Anomaly should not be nil")
	}
	if client.Multimodal == nil {
		t.Error("Multimodal should not be nil")
	}
	if client.Evolution == nil {
		t.Error("Evolution should not be nil")
	}
	if client.Saber == nil {
		t.Error("Saber should not be nil")
	}
	if client.Ops == nil {
		t.Error("Ops should not be nil")
	}
	if client.ApiKeys == nil {
		t.Error("ApiKeys should not be nil")
	}
}

func TestQuotaInitiallyEmpty(t *testing.T) {
	client := aegis.NewClient("sk_test_123")
	quota := client.Quota()
	if quota != nil {
		t.Errorf("expected nil quota initially, got %v", quota)
	}
}
