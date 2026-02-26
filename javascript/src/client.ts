import type { ClientOptions, QuotaInfo } from "./models/common";
import { Transport } from "./transport";
import { Judge } from "./resources/judge";
import { Rules } from "./resources/rules";
import {
  Escalations, Analytics, EvidenceResource, ML, NLP, AiAct,
  Classify, Jailbreak, Safety, Defense, Advanced, AdversaFlow,
  GuardNet, Agent, Anomaly, Multimodal, Evolution, Saber,
  Ops, ApiKeys,
} from "./resources/index";

export class AegisClient {
  private transport: Transport;

  // V1 resources
  readonly judge: Judge;
  readonly rules: Rules;
  readonly escalations: Escalations;
  readonly analytics: Analytics;
  readonly evidence: EvidenceResource;
  readonly ml: ML;
  readonly nlp: NLP;
  readonly aiAct: AiAct;

  // V2 resources
  readonly classify: Classify;
  readonly jailbreak: Jailbreak;
  readonly safety: Safety;
  readonly defense: Defense;
  readonly advanced: Advanced;
  readonly adversaflow: AdversaFlow;

  // V3 resources
  readonly guardnet: GuardNet;
  readonly agent: Agent;
  readonly anomaly: Anomaly;
  readonly multimodal: Multimodal;
  readonly evolution: Evolution;
  readonly saber: Saber;

  // Ops
  readonly ops: Ops;

  // Management
  readonly apiKeys: ApiKeys;

  constructor(options: ClientOptions) {
    if (!options.apiKey) throw new Error("apiKey is required");

    this.transport = new Transport({
      apiKey: options.apiKey,
      baseUrl: (options.baseUrl ?? "https://api.aiaegis.io").replace(/\/$/, ""),
      timeout: options.timeout ?? 30_000,
      maxRetries: options.maxRetries ?? 3,
      customHeaders: options.customHeaders ?? {},
    });

    this.judge = new Judge(this.transport);
    this.rules = new Rules(this.transport);
    this.escalations = new Escalations(this.transport);
    this.analytics = new Analytics(this.transport);
    this.evidence = new EvidenceResource(this.transport);
    this.ml = new ML(this.transport);
    this.nlp = new NLP(this.transport);
    this.aiAct = new AiAct(this.transport);

    this.classify = new Classify(this.transport);
    this.jailbreak = new Jailbreak(this.transport);
    this.safety = new Safety(this.transport);
    this.defense = new Defense(this.transport);
    this.advanced = new Advanced(this.transport);
    this.adversaflow = new AdversaFlow(this.transport);

    this.guardnet = new GuardNet(this.transport);
    this.agent = new Agent(this.transport);
    this.anomaly = new Anomaly(this.transport);
    this.multimodal = new Multimodal(this.transport);
    this.evolution = new Evolution(this.transport);
    this.saber = new Saber(this.transport);

    this.ops = new Ops(this.transport);
    this.apiKeys = new ApiKeys(this.transport);
  }

  get quota(): QuotaInfo {
    return this.transport.quota;
  }
}
