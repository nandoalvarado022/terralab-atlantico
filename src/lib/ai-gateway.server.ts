import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5";

type TextBlock = { type: "text"; text: string };
/** `data` es una data URL completa (`data:image/png;base64,...`). */
type ImageBlock = { type: "image"; data: string };
export type Block = TextBlock | ImageBlock;

export type ChatMessage = {
  role: "system" | "user";
  content: string | Block[];
};

export class GatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

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

export async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) throw new GatewayError(401, "Falta la configuración de la IA (ANTHROPIC_API_KEY).");

  const system = messages.find((m) => m.role === "system");
  const resto = messages.filter((m) => m.role !== "system");

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      ...(typeof system?.content === "string" ? { system: system.content } : {}),
      messages: resto.map((m) => ({
        role: "user" as const,
        content:
          typeof m.content === "string" ? m.content : m.content.map(toAnthropicBlock),
      })),
    });

    const text = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    )?.text;
    return (text ?? "").trim();
  } catch (e) {
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

/** Extrae el primer objeto/arreglo JSON de una respuesta del modelo. */
export function parseJsonLoose<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced?.[1] ?? raw).trim();
  const start = body.search(/[[{]/);
  if (start === -1) throw new GatewayError(502, "La IA no devolvió datos utilizables.");
  const opener = body[start];
  const closer = opener === "[" ? "]" : "}";
  const end = body.lastIndexOf(closer);
  const slice = body.slice(start, end === -1 ? undefined : end + 1);
  try {
    return JSON.parse(slice) as T;
  } catch {
    throw new GatewayError(502, "La IA no devolvió datos utilizables.");
  }
}
