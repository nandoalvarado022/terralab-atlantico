import Anthropic from "@anthropic-ai/sdk";

import { type Block, type ChatMessage, GatewayError } from "./ai-gateway.types";

export const MODEL = "claude-opus-5";

function toAnthropicBlock(block: Block): Anthropic.ContentBlockParam {
  if (block.type === "text") return { type: "text", text: block.text };

  const match = /^data:([^;]+);base64,(.+)$/.exec(block.data);
  const mediaType = match?.[1];
  const data = match?.[2];
  if (!mediaType || !data) throw new GatewayError(400, "La imagen no tiene un formato válido.");
  return {
    type: "image",
    source: { type: "base64", media_type: mediaType as "image/png", data },
  };
}

export async function callAnthropic(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) throw new GatewayError(401, "Falta la configuración de la IA (ANTHROPIC_API_KEY).");

  const system = messages.find((m) => m.role === "system");
  const resto = messages.filter((m) => m.role !== "system");

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      ...(typeof system?.content === "string" ? { system: system.content } : {}),
      messages: resto.map((m) => ({
        role: "user" as const,
        content: typeof m.content === "string" ? m.content : m.content.map(toAnthropicBlock),
      })),
    });

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (response.stop_reason === "max_tokens") {
      throw new GatewayError(
        502,
        "El documento quedó demasiado largo para la IA. Intenta de nuevo o resume alguna respuesta.",
      );
    }
    return (text ?? "").trim();
  } catch (e) {
    if (e instanceof GatewayError) throw e;
    if (e instanceof Anthropic.RateLimitError) {
      throw new GatewayError(
        429,
        "La IA está recibiendo muchas solicitudes. Espera unos segundos e intenta de nuevo.",
      );
    }
    if (e instanceof Anthropic.AuthenticationError) {
      throw new GatewayError(401, "La clave de la IA no es válida.");
    }
    if (e instanceof Anthropic.APIError) {
      throw new GatewayError(e.status ?? 502, e.message || `Error ${e.status} de la IA.`);
    }
    throw new GatewayError(502, "No pudimos conectar con la IA.");
  }
}
