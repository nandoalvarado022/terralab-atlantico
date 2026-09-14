import { callAnthropic } from "./ai-anthropic.server";
import { callDeepseek } from "./ai-deepseek.server";
import { type AiProvider, type ChatMessage, GatewayError } from "./ai-gateway.types";

export type { AiProvider, Block, ChatMessage } from "./ai-gateway.types";
export { GatewayError, parseJsonLoose } from "./ai-gateway.types";
export { MODEL as ANTHROPIC_MODEL } from "./ai-anthropic.server";
export { MODEL as DEEPSEEK_MODEL } from "./ai-deepseek.server";

/** Resuelve el proveedor activo. Por defecto: anthropic. */
export function resolveAiProvider(): AiProvider {
  const raw = (process.env["AI_PROVIDER"] ?? "anthropic").trim().toLowerCase();
  if (raw === "deepseek") return "deepseek";
  if (raw === "anthropic" || raw === "") return "anthropic";
  throw new GatewayError(
    500,
    `Proveedor de IA desconocido: "${raw}". Usa AI_PROVIDER=anthropic|deepseek.`,
  );
}

/**
 * Middleware de gateway: enruta al SDK configurado con `AI_PROVIDER`
 * (`anthropic` | `deepseek`).
 */
export async function callGateway(messages: ChatMessage[]): Promise<string> {
  switch (resolveAiProvider()) {
    case "deepseek":
      return callDeepseek(messages);
    case "anthropic":
      return callAnthropic(messages);
  }
}
