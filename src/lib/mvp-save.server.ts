import {
  type RespuestasGuardadas,
  aplanarCamposMisiones,
  esArrayMisiones,
} from "./respuestas-misiones";
import { getSupabase } from "./supabase.server";

export type MvpResultadoIa = {
  nombre: string;
  documento: string;
  prompt: string;
};

/** Subconjunto del canvas necesario para persistir (evita dependencia circular). */
export type CanvasParaGuardar = {
  colegio: string;
  brigada: string;
  lema: string;
  correoLider: string;
  integrantes: string;
  pistas: string;
  desafio: string;
  ideaSemilla: string;
  lab: string;
};

export type GuardarMvpInput = {
  canvas: CanvasParaGuardar;
  /** Array de misiones (o Q&A plano en labs sin misiones estructuradas) que se guarda en `respuestas`. */
  respuestas: RespuestasGuardadas;
  resultado: MvpResultadoIa;
  /** Si true, actualiza el MVP existente del mismo correo en lugar de insertar. */
  regenerar?: boolean;
};

export class CorreoLiderDuplicadoError extends Error {
  constructor(correo: string) {
    super(
      `El correo "${correo}" ya está registrado como líder de otro equipo. Usa un correo distinto.`,
    );
    this.name = "CorreoLiderDuplicadoError";
  }
}

export class CorreoLiderInvalidoError extends Error {
  constructor() {
    super("Indica un correo electrónico válido del líder del equipo.");
    this.name = "CorreoLiderInvalidoError";
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizarCorreoLider(correo: string): string {
  return correo.trim().toLowerCase();
}

export function validarCorreoLider(correo: string): string {
  const normalizado = normalizarCorreoLider(correo);
  if (!normalizado || !EMAIL_RE.test(normalizado)) {
    throw new CorreoLiderInvalidoError();
  }
  return normalizado;
}

/** true si ya hay un MVP con ese correo de líder. */
export async function correoLiderYaRegistrado(correoNormalizado: string): Promise<boolean> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("mvps")
    .select("id")
    .eq("correo_lider", correoNormalizado)
    .limit(1);

  if (error) {
    if (error.code === "42703") {
      throw new Error(
        "Falta la columna correo_lider en Supabase. Ejecuta la migración supabase/migrations/20260314_correo_lider.sql.",
      );
    }
    console.error("[mvps] error al verificar correo_lider", error);
    throw new Error("No pudimos verificar el correo del líder. Intenta de nuevo.");
  }

  return Boolean(data && data.length > 0);
}

/**
 * Persiste un MVP en Supabase.
 * - `respuestas`: array (una posición = JSON de cada misión, o Q&A plano).
 * - `correo_lider`: único (índice en DB + chequeo previo).
 * - `respuestas_ecotech`: mapa plano solo para EcoTech (compatibilidad con el visor legado).
 */
export async function guardarMvpEnSupabase(input: GuardarMvpInput): Promise<void> {
  const correoLider = validarCorreoLider(input.canvas.correoLider);
  const sb = getSupabase();

  const respuestasEcoTech =
    input.canvas.lab === "ecotech" && esArrayMisiones(input.respuestas)
      ? aplanarCamposMisiones(input.respuestas)
      : null;

  const fila = {
    colegio: input.canvas.colegio,
    brigada: input.canvas.brigada,
    lema: input.canvas.lema,
    correo_lider: correoLider,
    integrantes: input.canvas.integrantes,
    pistas: input.canvas.pistas,
    desafio: input.canvas.desafio,
    idea_semilla: input.canvas.ideaSemilla,
    lab: input.canvas.lab,
    respuestas: input.respuestas,
    respuestas_ecotech: respuestasEcoTech,
    nombre: input.resultado.nombre,
    documento: input.resultado.documento,
    prompt: input.resultado.prompt,
  };

  if (input.regenerar) {
    const { data, error } = await sb
      .from("mvps")
      .update(fila)
      .eq("correo_lider", correoLider)
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "42703" && /correo_lider/i.test(error.message)) {
        throw new Error(
          "Falta la columna correo_lider en Supabase. Ejecuta la migración supabase/migrations/20260314_correo_lider.sql.",
        );
      }
      console.error("[mvps] error al actualizar", error);
      throw new Error("No pudimos actualizar el MVP en la base de datos.");
    }

    if (data && data.length > 0) return;

    // Si no había fila previa, insertar como primera generación.
  } else if (await correoLiderYaRegistrado(correoLider)) {
    throw new CorreoLiderDuplicadoError(correoLider);
  }

  const { error } = await sb.from("mvps").insert(fila);

  if (error) {
    if (error.code === "23505") {
      throw new CorreoLiderDuplicadoError(correoLider);
    }
    if (error.code === "42703" && /correo_lider/i.test(error.message)) {
      throw new Error(
        "Falta la columna correo_lider en Supabase. Ejecuta la migración supabase/migrations/20260314_correo_lider.sql.",
      );
    }
    console.error("[mvps] error al guardar", error);
    throw new Error("No pudimos guardar el MVP en la base de datos.");
  }
}
