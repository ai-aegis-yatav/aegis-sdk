import type { GuardResult } from "../types.js";

/**
 * Minimal offline pattern-matching fallback used when the AEGIS API
 * is unreachable. This is NOT a replacement for the full PALADIN
 * pipeline — it only catches the most blatant attack patterns so the
 * agent is not left completely undefended during outages.
 */

const DPI_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?prior/i,
  /forget\s+(everything|all|your)\s+(instructions|rules|guidelines)/i,
  /you\s+are\s+now\s+(DAN|evil|unrestricted|jailbroken)/i,
  /\bDAN\s+mode\b/i,
  /do\s+anything\s+now/i,
  /bypass\s+(all\s+)?safety/i,
  /override\s+(all\s+)?restrictions/i,
  /\bsystem:\s*override\b/i,
  /\bSYSTEM\s*:\s*(override|update|new\s+instructions)/i,
  /\bMEMORY\s*UPDATE\b/i,
  /\bPOLICY\s*:/i,
  /\bUPDATE\s*CONTEXT\b/i,
  /execute\s+system\s+command/i,
  /rm\s+-rf\s+\//,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /output\s+(your\s+)?initial\s+instructions/i,
  /\bexfiltrate\b/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+if/i,
  /from\s+now\s+on.*ignore/i,
  /이전.*지시.*무시/i,
  /모든\s*규칙.*무시/i,
  /시스템\s*프롬프트.*출력/i,
  /前の指示.*無視/i,
  /ignor.*instrucciones\s+anteriores/i,
];

const TOOL_DANGER_PATTERNS: RegExp[] = [
  /\b(rm|del|delete)\s+-r/i,
  /\bdrop\s+(database|table|collection)\b/i,
  /\bshutdown\b/i,
  /\b(curl|wget)\s+.*\|\s*(bash|sh)\b/i,
  /eval\s*\(/i,
];

export function localPromptGuard(content: string): GuardResult {
  const start = Date.now();
  for (const pattern of DPI_PATTERNS) {
    if (pattern.test(content)) {
      return {
        action: "block",
        reason: `Local pattern match: ${pattern.source}`,
        riskScore: 0.9,
        details: { source: "local-fallback", pattern: pattern.source },
        latencyMs: Date.now() - start,
      };
    }
  }
  return {
    action: "allow",
    riskScore: 0,
    details: { source: "local-fallback" },
    latencyMs: Date.now() - start,
  };
}

export function localToolGuard(toolChain: string[], args?: string): GuardResult {
  const start = Date.now();
  const fullText = [...toolChain, args ?? ""].join(" ");

  for (const pattern of TOOL_DANGER_PATTERNS) {
    if (pattern.test(fullText)) {
      return {
        action: "block",
        reason: `Local tool pattern match: ${pattern.source}`,
        riskScore: 0.85,
        details: { source: "local-fallback", pattern: pattern.source },
        latencyMs: Date.now() - start,
      };
    }
  }
  return {
    action: "allow",
    riskScore: 0,
    details: { source: "local-fallback" },
    latencyMs: Date.now() - start,
  };
}
