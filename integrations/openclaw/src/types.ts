/**
 * OpenClaw lifecycle context types.
 *
 * These mirror the shapes exposed by the OpenClaw plugin API
 * (openclaw >=2026.2). Only the subset consumed by AEGIS Guard
 * is declared here so the plugin compiles without a hard
 * dependency on OpenClaw internals.
 */

// ---------------------------------------------------------------------------
// Message & session primitives
// ---------------------------------------------------------------------------

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface Sender {
  id: string;
  name?: string;
  platform?: string;
}

export interface Session {
  id: string;
  channelId?: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Tool execution primitives
// ---------------------------------------------------------------------------

export interface ToolDef {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface ToolInvocation {
  tool: ToolDef;
  arguments: Record<string, unknown>;
  expectedOutput?: string;
}

// ---------------------------------------------------------------------------
// Lifecycle hook contexts
// ---------------------------------------------------------------------------

export interface MessageProcessContext {
  message: Message;
  sender: Sender;
  session: Session;
  history: Message[];
  block(reason: string): void;
  escalate(reason: string): void;
}

export interface ToolExecutionContext {
  invocation: ToolInvocation;
  toolChain: ToolDef[];
  previousInvocations: ToolInvocation[];
  agent: { privilegeLevel: number };
  session: Session;
  block(reason: string): void;
}

export interface ToolOutputContext {
  invocation: ToolInvocation;
  output: string;
  session: Session;
  block(reason: string): void;
  replaceOutput(newOutput: string): void;
}

export interface MemoryStoreContext {
  newEntries: string[];
  recentMessages: Message[];
  session: Session;
  reject(reason: string): void;
}

export interface MessageSendContext {
  message: Message;
  session: Session;
  block(reason: string): void;
  replaceContent(newContent: string): void;
}

export interface ReasoningContext {
  prompt: string;
  reasoningOutput?: string;
  session: Session;
  block(reason: string): void;
}

export interface HeartbeatContext {
  sessionMetrics: number[];
  session: Session;
  pauseAgent(): void;
}

// ---------------------------------------------------------------------------
// Lifecycle API (subset)
// ---------------------------------------------------------------------------

export interface LifecycleHookOptions {
  priority?: number;
  timeout?: number;
}

export type PhaseHandler<T> = (ctx: T) => void | Promise<void>;

export interface LifecycleAPI {
  on<T>(phase: string, handler: PhaseHandler<T>, options?: LifecycleHookOptions): void;
}

export interface OpenClawPluginAPI {
  lifecycle: LifecycleAPI;
  log: {
    info(msg: string, ...args: unknown[]): void;
    warn(msg: string, ...args: unknown[]): void;
    error(msg: string, ...args: unknown[]): void;
    debug(msg: string, ...args: unknown[]): void;
  };
}

// ---------------------------------------------------------------------------
// Plugin configuration
// ---------------------------------------------------------------------------

export type GuardMode = "strict" | "balanced" | "permissive";

export interface AegisGuardConfig {
  apiKey: string;
  baseUrl: string;
  guardMode: GuardMode;
  timeout: number;
  maxRetries: number;

  allowedTools: string[];
  deniedTools: string[];
  defaultPrivilegeLevel: number;

  riskThresholds: {
    block: number;
    escalate: number;
  };

  cache: {
    enabled: boolean;
    ttlMs: number;
    maxEntries: number;
  };

  enabledGuards: {
    inbound: boolean;
    tool: boolean;
    output: boolean;
    memory: boolean;
    reasoning: boolean;
    heartbeat: boolean;
  };
}

// ---------------------------------------------------------------------------
// Internal guard result
// ---------------------------------------------------------------------------

export type GuardAction = "allow" | "block" | "escalate" | "modify";

export interface GuardResult {
  action: GuardAction;
  reason?: string;
  riskScore: number;
  details?: Record<string, unknown>;
  latencyMs: number;
}
