import { pantallasEcoTech } from "@/data/ecotech-misiones";
import { pantallasEcoFluencer } from "@/data/ecofluencer-misiones";
import { pantallasEmprendeCircular } from "@/data/emprende-circular-misiones";

/** Una entrada del array `respuestas` en Supabase (una misión = un JSON). */
export type RespuestaMision = {
  id: string;
  numero: number;
  nombre: string;
  tagline?: string | undefined;
  campos: Record<string, string>;
};

/** Formato legado usado por el flujo PRD de biodiversidad. */
export type RespuestaPlana = { pregunta: string; respuesta: string };

export type RespuestasGuardadas = RespuestaMision[] | RespuestaPlana[];

function esDataUrl(valor: string) {
  return /^data:(image|video)\//i.test(valor);
}

/** Evita guardar data URLs enormes; deja una marca legible. */
export function sanitizarValorRespuesta(valor: string): string {
  const v = valor.trim();
  if (!v) return "";
  if (esDataUrl(v)) {
    return /^data:video\//i.test(v) ? "(video adjuntado)" : "(imagen adjuntada)";
  }
  return v;
}

function sanitizarCampos(campos: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(campos)) {
    const limpio = sanitizarValorRespuesta(v ?? "");
    if (limpio) out[k] = limpio;
  }
  return out;
}

function clavesConPrefijo(respuestas: Record<string, string>, ...prefijos: string[]) {
  const campos: Record<string, string> = {};
  for (const [k, v] of Object.entries(respuestas)) {
    if (prefijos.some((p) => k === p || k.startsWith(p))) {
      const limpio = sanitizarValorRespuesta(v ?? "");
      if (limpio) campos[k] = limpio;
    }
  }
  return campos;
}

function claveCelda(campoId: string, filaId: string, columnaId: string) {
  return `${campoId}.${filaId}.${columnaId}`;
}

/** Empaqueta el Record plano de EcoTech en un array (una posición = una misión). */
export function empaquetarRespuestasEcoTech(respuestas: Record<string, string>): RespuestaMision[] {
  return pantallasEcoTech.map((pantalla) => {
    const campos: Record<string, string> = {};
    for (const seccion of pantalla.secciones) {
      for (const campo of seccion.campos) {
        if (campo.tipo === "tabla") {
          for (const fila of campo.filas) {
            for (const col of campo.columnas) {
              const clave = claveCelda(campo.id, fila.id, col.id);
              const limpio = sanitizarValorRespuesta(respuestas[clave] ?? "");
              if (limpio) campos[clave] = limpio;
            }
          }
        } else {
          const limpio = sanitizarValorRespuesta(respuestas[campo.id] ?? "");
          if (limpio) campos[campo.id] = limpio;
        }
      }
    }
    return {
      id: pantalla.id,
      numero: pantalla.numero,
      nombre: pantalla.nombre,
      tagline: pantalla.tagline,
      campos,
    };
  });
}

/**
 * Prefijos por pantalla EcoFluencer.
 * La fábrica usa `ef6-*` aunque es la misión 5; construir/probar comparten `ef7-*` con claves distintas.
 */
const prefijosEcoFluencer: Record<string, string[]> = {
  "mensaje-pulso-eco": ["ef1-"],
  "comprender-audiencia": ["ef2-"],
  evaluacion: ["ef3-"],
  "brief-cambio": ["ef4-"],
  "fabrica-campanas": ["ef6-"],
  construir: ["ef7-construir-imagen"],
  probar: ["ef7-probar-mejora"],
  inspirar: ["ef8-"],
};

export function empaquetarRespuestasEcoFluencer(
  respuestas: Record<string, string>,
): RespuestaMision[] {
  return pantallasEcoFluencer.map((pantalla) => {
    const prefijos = prefijosEcoFluencer[pantalla.id] ?? [];
    return {
      id: pantalla.id,
      numero: pantalla.numero,
      nombre: pantalla.nombre,
      tagline: pantalla.tagline,
      campos: clavesConPrefijo(respuestas, ...prefijos),
    };
  });
}

/** Prefijos `ecN-*` alineados con el número de misión. */
export function empaquetarRespuestasEmprendeCircular(
  respuestas: Record<string, string>,
): RespuestaMision[] {
  return pantallasEmprendeCircular.map((pantalla) => ({
    id: pantalla.id,
    numero: pantalla.numero,
    nombre: pantalla.nombre,
    tagline: pantalla.tagline,
    campos: clavesConPrefijo(respuestas, `ec${pantalla.numero}-`),
  }));
}

export function empaquetarRespuestasPrd(respuestas: RespuestaPlana[]): RespuestaPlana[] {
  return respuestas
    .map((r) => ({
      pregunta: r.pregunta,
      respuesta: sanitizarValorRespuesta(r.respuesta),
    }))
    .filter((r) => r.respuesta);
}

/** Reconstruye un Record plano a partir del array de misiones (útil para VisorEcoTech). */
export function aplanarCamposMisiones(misiones: RespuestaMision[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of misiones) {
    Object.assign(out, m.campos);
  }
  return out;
}

export function esArrayMisiones(value: unknown): value is RespuestaMision[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const first = value[0];
  return (
    typeof first === "object" &&
    first !== null &&
    "id" in first &&
    "campos" in first &&
    typeof (first as RespuestaMision).campos === "object"
  );
}

export function esArrayPlano(value: unknown): value is RespuestaPlana[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const first = value[0];
  return typeof first === "object" && first !== null && "pregunta" in first && "respuesta" in first;
}
