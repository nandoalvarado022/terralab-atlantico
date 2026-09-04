const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const MODEL = "google/gemini-3.7-flash";

type TextBlock = { type: "text"; text: string };
type ImageBlock = { type: "image_url"; image_url: { url: string } };
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

export async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new GatewayError(401, "Falta la configuración de Lovable AI.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let message = detail.slice(0, 400);
    try {
      const parsed = JSON.parse(detail) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? message;
    } catch {
      // keep raw text
    }
    if (res.status === 429) {
      message = "La IA está recibiendo muchas solicitudes. Espera unos segundos e intenta de nuevo.";
    } else if (res.status === 402) {
      message = message || "Se agotaron los créditos de IA del proyecto.";
    }
    throw new GatewayError(res.status, message || `Error ${res.status} de la IA.`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
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
