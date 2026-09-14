import OpenAI from "openai";

import { type Block, type ChatMessage, GatewayError } from "./ai-gateway.types";

export const MODEL = process.env["DEEPSEEK_MODEL"] ?? "deepseek-chat";
const BASE_URL = process.env["DEEPSEEK_BASE_URL"] ?? "https://api.deepseek.com";

function toDeepseekPart(block: Block): OpenAI.Chat.ChatCompletionContentPart {
  if (block.type === "text") return { type: "text", text: block.text };

  const match = /^data:([^;]+);base64,(.+)$/.exec(block.data);
  if (!match) throw new GatewayError(400, "La imagen no tiene un formato válido.");
  // DeepSeek chat es texto; si llega imagen, la enviamos como data URL por si el modelo lo soporta.
  return {
    type: "image_url",
    image_url: { url: block.data },
  };
}

function toDeepseekContent(
  content: string | Block[],
): string | OpenAI.Chat.ChatCompletionContentPart[] {
  if (typeof content === "string") return content;
  return content.map(toDeepseekPart);
}

export async function callDeepseek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["DEEPSEEK_API_KEY"];
  if (!apiKey) throw new GatewayError(401, "Falta la configuración de la IA (DEEPSEEK_API_KEY).");

  const client = new OpenAI({ apiKey, baseURL: BASE_URL });

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 8192,
      messages: messages.map((m) => ({
        role: m.role,
        content: toDeepseekContent(m.content),
      })),
    });

    const choice = response.choices[0];
    if (choice?.finish_reason === "length") {
      throw new GatewayError(
        502,
        "El documento quedó demasiado largo para la IA. Intenta de nuevo o resume alguna respuesta.",
      );
    }

    const text = choice?.message?.content;
    return (typeof text === "string" ? text : "").trim();
  } catch (e) {
    if (e instanceof GatewayError) throw e;
    if (e instanceof OpenAI.RateLimitError) {
      throw new GatewayError(
        429,
        "La IA está recibiendo muchas solicitudes. Espera unos segundos e intenta de nuevo.",
      );
    }
    if (e instanceof OpenAI.AuthenticationError) {
      throw new GatewayError(401, "La clave de la IA no es válida.");
    }
    if (e instanceof OpenAI.APIError) {
      throw new GatewayError(e.status ?? 502, e.message || `Error ${e.status} de la IA.`);
    }
    throw new GatewayError(502, "No pudimos conectar con la IA.");
  }
}
