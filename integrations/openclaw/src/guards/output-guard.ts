import { aegisApi } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localPromptGuard } from "./local-fallback.js";
import { formatOutputReport, maskContent } from "./report-formatter.js";
import type {
  AegisGuardConfig,
  GuardResult,
  OpenClawPluginAPI,
} from "../types.js";

const TAG_TOOL = "[aegis-guard:output-tool]";
const TAG_SEND = "[aegis-guard:output-send]";

export function registerOutputGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  const log = api.logger;

  // --- after_tool_call: IPI scan on tool output ---
  api.on("after_tool_call", async (event: any, _ctx: any) => {
    const toolName = event?.toolName ?? "unknown";
    const result = event?.result;
    const output = typeof result === "string" ? result : JSON.stringify(result ?? "").slice(0, 500);
    if (!output) return;

    log.info(`${TAG_TOOL} ━━━ SCANNING tool output ━━━`);
    log.info(`${TAG_TOOL} tool="${toolName}" output_len=${output.length}`);
    log.info(`${TAG_TOOL} preview: "${output.slice(0, 120)}${output.length > 120 ? "..." : ""}"`);

    const key = cacheKey("output-tool", toolName, output.slice(0, 256));
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG_TOOL} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      return;
    }

    const apiResult = await scanToolOutput(toolName, output, config, log);
    const localResult = localPromptGuard(output);

    log.info(`${TAG_TOOL} API: action=${apiResult.action} risk=${apiResult.riskScore.toFixed(2)}`);
    log.info(`${TAG_TOOL} Local: action=${localResult.action} risk=${localResult.riskScore.toFixed(2)}`);

    const scanResult = (apiResult.action !== "allow")
      ? apiResult
      : (localResult.action === "block") ? localResult : apiResult;

    cache.set(key, scanResult);

    const icon = scanResult.action === "block" ? "🛑" : "✅";
    log.info(`${TAG_TOOL} ━━━ RESULT: ${icon} ${scanResult.action.toUpperCase()} ━━━`);
    log.info(`${TAG_TOOL} risk=${scanResult.riskScore.toFixed(2)} latency=${scanResult.latencyMs}ms`);
    if (scanResult.reason) log.warn(`${TAG_TOOL} IPI detected: ${scanResult.reason}`);
  });

  // --- message_sending: final outbound safety gate ---
  api.on("message_sending", async (event: any, _ctx: any) => {
    const content = event?.content;
    if (!content) return;

    // Skip if content is an AEGIS report itself (prevent infinite loop)
    if (content.includes("AEGIS Guard")) return;

    log.info(`${TAG_SEND} ━━━ SCANNING outbound reply ━━━`);
    log.info(`${TAG_SEND} len=${content.length} to=${event?.to ?? "unknown"}`);
    log.info(`${TAG_SEND} preview: "${content.slice(0, 120)}${content.length > 120 ? "..." : ""}"`);

    const key = cacheKey("output-send", content.slice(0, 256));
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG_SEND} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      if (cached.action === "block") {
        const report = formatOutputReport(cached);
        log.warn(`${TAG_SEND} 🛑 BLOCKED outbound (cached)`);
        return { content: report };
      }
      if (cached.action === "modify") {
        const report = formatOutputReport(cached);
        return { content: report };
      }
      return;
    }

    const result = await checkSafety(content, config, log);
    cache.set(key, result);

    const icon = result.action === "block" ? "🛑" : result.action === "modify" ? "✏️" : "✅";
    log.info(`${TAG_SEND} ━━━ RESULT: ${icon} ${result.action.toUpperCase()} ━━━`);
    log.info(`${TAG_SEND} risk=${result.riskScore.toFixed(2)} latency=${result.latencyMs}ms`);
    if (result.reason) log.warn(`${TAG_SEND} reason: ${result.reason}`);

    if (result.action === "block") {
      const report = formatOutputReport(result);
      return { content: report };
    }
    if (result.action === "modify") {
      const report = formatOutputReport(result);
      return { content: report };
    }
  });

  log.info("[aegis-guard:output] registered (after_tool_call + message_sending)");
}

async function scanToolOutput(
  toolName: string,
  output: string,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();
  try {
    log.info(`${TAG_TOOL} calling AEGIS /v3/agent/scan (IPI mode) ...`);
    const res: any = await aegisApi.agentScan({
      prompt: `Tool "${toolName}" returned output`,
      tools: [output],
      context: { scan_type: "ipi_tool_output" },
    });

    const threats = res.threats ?? [];
    const topThreat = threats[0];
    const riskScore = topThreat?.confidence ?? 0;
    const injectionDetected = !res.is_safe && threats.length > 0;
    const injectionType = topThreat?.threat_type ?? "none";
    log.info(`${TAG_TOOL} IPI scan → is_safe=${res.is_safe} threats=${threats.length} confidence=${riskScore.toFixed(2)}`);
    return {
      action: injectionDetected && riskScore >= config.riskThresholds.block
        ? "block" : "allow",
      reason: injectionDetected
        ? `IPI in tool output: ${injectionType} (confidence=${riskScore.toFixed(2)})` : undefined,
      riskScore,
      details: { source: "v3/agent/scan:ipi", toolName },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG_TOOL} IPI scan failed: ${String(err)}`);
    return { action: "allow", riskScore: 0, details: { source: "fallback" }, latencyMs: Date.now() - start };
  }
}

async function checkSafety(
  content: string,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();
  try {
    log.info(`${TAG_SEND} calling AEGIS /v2/safety/check ...`);
    const res: any = await aegisApi.safetyCheck({ text: content });
    const riskScore = res.confidence ?? 0;
    const categories = res.categories ?? [];
    log.info(`${TAG_SEND} safety → safe=${res.is_safe} score=${riskScore.toFixed(2)} categories=[${categories.join(", ")}]`);

    return {
      action: !res.is_safe && riskScore >= config.riskThresholds.block
        ? "block"
        : !res.is_safe && riskScore >= config.riskThresholds.escalate
          ? "modify" : "allow",
      reason: !res.is_safe
        ? `Safety: ${categories.join(", ")} (score=${riskScore.toFixed(2)})` : undefined,
      riskScore,
      details: { source: "v2/safety/check" },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG_SEND} safety check failed: ${String(err)}`);
    return { action: "allow", riskScore: 0, details: { source: "fallback" }, latencyMs: Date.now() - start };
  }
}
