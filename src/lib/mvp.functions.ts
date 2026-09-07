import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { callGateway, parseJsonLoose } from "./ai-gateway.server";

export const canvasSchema = z.object({
  colegio: z.string(),
  brigada: z.string(),
  lema: z.string(),
  integrantes: z.string(),
  pistas: z.string(),
  desafio: z.string(),
  ideaSemilla: z.string(),
  lab: z.string(),
});

export type CanvasData = z.infer<typeof canvasSchema>;

export const labEnfoque: Record<string, string> = {
  ecotech:
    "LAB Tecnología (EcoTech): el MVP es una solución digital — app web, dashboard de datos, sensor con tablero, mapa o chatbot — que hace visible un problema ambiental y permite actuar sobre él.",
  circular:
    "LAB Circular (Emprende Circular): el MVP es un sistema o emprendimiento que convierte residuos en valor — plataforma de préstamo/retorno, catálogo de productos, registro de acopio — con soporte digital simple.",
  influencia:
    "LAB Influencia (ECOFluencer): el MVP es una plataforma de campaña — micrositio, reto viral con marcador, generador de contenido, medidor de compromisos — que cambia hábitos de forma medible.",
  biodiversidad:
    "LAB Biodiversidad (Biodiversidad Viva): el MVP es un sistema de registro y monitoreo de especies o ecosistemas escolares — fichas, mapa, bitácora ciudadana, ruta interpretativa digital.",
};

const preguntaSchema = z.object({
  id: z.string(),
  pregunta: z.string(),
  ayuda: z.string(),
  sugerencia: z.string(),
});

export type Pregunta = z.infer<typeof preguntaSchema>;

const SISTEMA =
  "Eres facilitador de Terra Lab Atlántico (CRA y ALITIC), una estrategia de educación ambiental e innovación escolar. Acompañas brigadas de estudiantes de 3.º de primaria a 9.º grado para convertir un canvas de expedición en un MVP construido con Lovable. Escribes siempre en español claro, concreto y motivador, con lenguaje adecuado para estudiantes de colegio. Nunca inventes datos del colegio que no estén en la información dada.";

function enfoque(lab: string) {
  return labEnfoque[lab] ?? labEnfoque["ecotech"]!;
}

function contexto(canvas: CanvasData) {
  return [
    `Colegio: ${canvas.colegio || "no indicado"}`,
    `Brigada: ${canvas.brigada || "no indicada"}`,
    `Lema: ${canvas.lema || "no indicado"}`,
    `Integrantes y roles: ${canvas.integrantes || "no indicados"}`,
    `Pistas del safari / hallazgos: ${canvas.pistas || "no indicadas"}`,
    `Desafío elegido: ${canvas.desafio || "no indicado"}`,
    `Idea semilla: ${canvas.ideaSemilla || "no indicada"}`,
    `Lab activado: ${canvas.lab}`,
    `Enfoque del lab: ${enfoque(canvas.lab)}`,
  ].join("\n");
}

/** Paso 1 — transcribe la foto del canvas impreso. */
export const transcribirCanvas = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ imagenes: z.array(z.string().min(20)).min(1).max(3) }).parse(input),
  )
  .handler(async ({ data }) => {
    const contenido = [
      {
        type: "text" as const,
        text: `Estas son fotos de canvas impresos de Terra Lab Atlántico ("Expedición TerraLAB" y/o "Pase al Día 2 · Reto desbloqueado"), diligenciados a mano por una brigada de estudiantes.

Transcribe la letra manuscrita e impresa y devuelve SOLO un objeto JSON con estas claves exactas (strings, en español, sin markdown):
{
  "colegio": "",
  "brigada": "",
  "lema": "",
  "integrantes": "nombre — rol, separados por comas",
  "pistas": "las pistas o hallazgos del safari, separadas por punto y coma",
  "desafio": "el desafío o reto elegido tal como lo escribieron",
  "ideaSemilla": "la idea semilla o solución propuesta",
  "lab": "uno de: circular | influencia | biodiversidad | ecotech (según el lab marcado; si no hay marca, deduce el más cercano)"
}
Si un campo no aparece o es ilegible, déjalo como string vacío. No inventes nombres ni datos.`,
      },
      ...data.imagenes.map((url) => ({
        type: "image" as const,
        data: url,
      })),
    ];

    const raw = await callGateway([
      { role: "system", content: SISTEMA },
      { role: "user", content: contenido },
    ]);

    const parsed = parseJsonLoose<Record<string, unknown>>(raw);
    const str = (k: string) => (typeof parsed[k] === "string" ? (parsed[k] as string) : "");
    const lab = str("lab").toLowerCase();

    return {
      colegio: str("colegio"),
      brigada: str("brigada"),
      lema: str("lema"),
      integrantes: str("integrantes"),
      pistas: str("pistas"),
      desafio: str("desafio"),
      ideaSemilla: str("ideaSemilla"),
      lab: lab in labEnfoque ? lab : "ecotech",
    } satisfies CanvasData;
  });

/** Paso 3 — preguntas de PRD que faltan (context engineering). */
export const generarPreguntas = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ canvas: canvasSchema }).parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway([
      { role: "system", content: SISTEMA },
      {
        role: "user",
        content: `Información del canvas de la brigada:
${contexto(data.canvas)}

Genera 7 preguntas de PRD que faltan para poder construir el MVP de esta brigada. Deben ser específicas de ESTE reto (menciona su contexto real), no genéricas, y cubrir: usuario principal, acción clave que hace ese usuario, qué dato se registra o se mide, quién administra o revisa, cómo se muestra la evidencia o el avance, alcance mínimo del prototipo (qué SÍ y qué NO), e indicador de impacto.

Devuelve SOLO un arreglo JSON, sin markdown, con objetos:
[{"id":"usuario","pregunta":"...","ayuda":"una frase corta que explique por qué importa","sugerencia":"una respuesta sugerida y concreta que la brigada pueda aceptar tal cual"}]
Usa ids cortos en minúscula sin espacios. Lenguaje para estudiantes de colegio.`,
      },
    ]);

    const parsed = parseJsonLoose<unknown[]>(raw);
    return z.array(preguntaSchema).parse(parsed).slice(0, 8);
  });

/** Paso 4 — documento de MVP + prompt para Lovable. */
export const construirMvp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        canvas: canvasSchema,
        respuestas: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const qa = data.respuestas
      .filter((r) => r.respuesta.trim())
      .map((r) => `- ${r.pregunta}\n  → ${r.respuesta}`)
      .join("\n");

    const raw = await callGateway([
      { role: "system", content: SISTEMA },
      {
        role: "user",
        content: `Información del canvas:
${contexto(data.canvas)}

Respuestas de PRD de la brigada:
${qa || "sin respuestas adicionales"}

Devuelve SOLO un objeto JSON, sin markdown fuera de los valores, con estas claves:
{
  "nombre": "nombre corto y memorable del producto",
  "documento": "el documento de MVP completo en Markdown",
  "prompt": "el prompt listo para pegar en Lovable"
}

El "documento" en Markdown debe tener, con títulos ##: Nombre del MVP, Brigada y colegio, Problema, Usuario principal, Propuesta de valor, Alcance del MVP (3 a 5 pantallas o piezas, cada una con su descripción y las acciones que permite), Fuera de alcance, Datos que se registran (lista de campos), Indicador de impacto, Criterios de listo (checklist), y Cómo lo probamos con la comunidad escolar.

El "prompt" debe estar escrito en segunda persona dirigido a Lovable, en español, entre 200 y 350 palabras: qué construir, para quién, pantallas y flujos concretos, datos y campos, indicador que se muestra, tono visual apropiado para estudiantes, y la instrucción de empezar por una primera versión navegable sin cuentas de usuario si no son indispensables. No incluyas explicaciones fuera del JSON.`,
      },
    ]);

    const parsed = parseJsonLoose<Record<string, unknown>>(raw);
    return z
      .object({ nombre: z.string(), documento: z.string(), prompt: z.string() })
      .parse(parsed);
  });
