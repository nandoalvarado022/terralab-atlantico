type TextBlock = { type: "text"; text: string };
/** `data` es una data URL completa (`data:image/png;base64,...`). */
type ImageBlock = { type: "image"; data: string };
export type Block = TextBlock | ImageBlock;

export type ChatMessage = {
  role: "system" | "user";
  content: string | Block[];
};

export type AiProvider = "anthropic" | "deepseek";

export class GatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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
