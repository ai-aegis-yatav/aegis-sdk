/**
 * AEGIS Guard scan result formatter.
 *
 * Produces human-readable Markdown reports for both
 * webchat (rich) and WhatsApp (plain text) display.
 */

import type { GuardResult } from "../types.js";

// ---------------------------------------------------------------------------
// Risk bar visualization
// ---------------------------------------------------------------------------

function riskBar(score: number): string {
  const filled = Math.round(score * 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function riskLabel(score: number): string {
  if (score >= 0.8) return "CRITICAL";
  if (score >= 0.6) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  if (score >= 0.2) return "LOW";
  return "SAFE";
}

function riskEmoji(score: number): string {
  if (score >= 0.8) return "🔴";
  if (score >= 0.6) return "🟠";
  if (score >= 0.4) return "🟡";
  if (score >= 0.2) return "🟢";
  return "✅";
}

function actionIcon(action: string): string {
  switch (action) {
    case "block": return "🛑";
    case "escalate": return "⚠️";
    case "modify": return "✏️";
    default: return "✅";
  }
}

// ---------------------------------------------------------------------------
// Masking
// ---------------------------------------------------------------------------

export function maskContent(content: string): string {
  if (content.length <= 6) return "█".repeat(content.length);
  const visible = 3;
  return content.slice(0, visible) + "█".repeat(Math.min(content.length - visible, 30)) + "...";
}

// ---------------------------------------------------------------------------
// Inbound scan report
// ---------------------------------------------------------------------------

export function formatInboundReport(
  result: GuardResult,
  contentPreview: string,
  direction: "inbound" | "outbound" = "inbound",
): string {
  const dirLabel = direction === "inbound" ? "📥 INPUT" : "📤 OUTPUT";
  const icon = actionIcon(result.action);
  const risk = riskEmoji(result.riskScore);
  const label = riskLabel(result.riskScore);
  const bar = riskBar(result.riskScore);
  const source = (result.details?.source as string) ?? "unknown";

  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛡️ *AEGIS Guard — ${dirLabel} Analysis*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `${icon} *Verdict:* ${result.action.toUpperCase()}`,
    `${risk} *Risk:* ${label} (${(result.riskScore * 100).toFixed(0)}%)`,
    `   ${bar}`,
  ];

  if (result.reason) {
    lines.push(``, `⚡ *Threat:* ${result.reason}`);
  }

  if (result.action === "block") {
    lines.push(
      ``,
      `📝 *Content:* \`${maskContent(contentPreview)}\``,
      ``,
      `🚫 This message has been blocked by AEGIS Guard.`,
    );
  } else if (result.action === "escalate") {
    lines.push(
      ``,
      `⚠️ This message was flagged for review.`,
    );
  }

  lines.push(
    ``,
    `🔬 _Source: ${source} • Latency: ${result.latencyMs}ms_`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Output safety report
// ---------------------------------------------------------------------------

export function formatOutputReport(result: GuardResult): string {
  const icon = actionIcon(result.action);
  const risk = riskEmoji(result.riskScore);
  const label = riskLabel(result.riskScore);
  const bar = riskBar(result.riskScore);
  const source = (result.details?.source as string) ?? "unknown";

  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🛡️ *AEGIS Guard — 📤 OUTPUT Safety*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `${icon} *Verdict:* ${result.action.toUpperCase()}`,
    `${risk} *Risk:* ${label} (${(result.riskScore * 100).toFixed(0)}%)`,
    `   ${bar}`,
  ];

  if (result.reason) {
    lines.push(``, `⚡ *Threat:* ${result.reason}`);
  }

  if (result.action === "block" || result.action === "modify") {
    lines.push(
      ``,
      `🚫 Output has been ${result.action === "block" ? "blocked" : "redacted"} by AEGIS Guard.`,
    );
  }

  lines.push(
    ``,
    `🔬 _Source: ${source} • Latency: ${result.latencyMs}ms_`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Compact inline status (for ALLOW — non-intrusive)
// ---------------------------------------------------------------------------

export function formatCompactStatus(result: GuardResult, direction: "in" | "out"): string {
  const dirIcon = direction === "in" ? "📥" : "📤";
  const risk = riskEmoji(result.riskScore);
  return `🛡️${dirIcon} ${risk} ${result.action.toUpperCase()} (${(result.riskScore * 100).toFixed(0)}%) — ${result.latencyMs}ms`;
}
