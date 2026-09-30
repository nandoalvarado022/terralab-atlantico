import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  esArrayMisiones,
  esArrayPlano,
  type RespuestaMision,
  type RespuestaPlana,
} from "./respuestas-misiones";
import { getSupabase } from "./supabase.server";
import type { TerraChallengeReporte } from "./terra-challenge";

const respuestaPlanaSchema = z.object({ pregunta: z.string(), respuesta: z.string() });
const respuestaMisionSchema = z.object({
  id: z.string(),
  numero: z.number(),
  nombre: z.string(),
  tagline: z.string().optional(),
  campos: z.record(z.string(), z.string()),
});

const mvpSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  colegio: z.string(),
  brigada: z.string(),
  lema: z.string().nullable().optional(),
  correo_lider: z.string().nullable().optional(),
  integrantes: z.string().nullable().optional(),
  pistas: z.string().nullable().optional(),
  desafio: z.string().nullable().optional(),
  idea_semilla: z.string().nullable().optional(),
  lab: z.string(),
  nombre: z.string(),
  documento: z.string(),
  prompt: z.string(),
  respuestas: z.array(z.union([respuestaMisionSchema, respuestaPlanaSchema])),
  respuestas_ecotech: z.record(z.string(), z.string()).nullable(),
});

export type MvpGuardado = Omit<z.infer<typeof mvpSchema>, "respuestas"> & {
  respuestas: RespuestaMision[] | RespuestaPlana[];
};

function adminSession() {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) throw new Error("Falta la configuración de sesión (SESSION_SECRET).");
  // No es un hook de React: es la utilidad de sesión server-side de TanStack Start.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<{ authenticated: boolean }>({
    password: secret,
    name: "terralab-admin",
  });
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const esperado = process.env["ADMIN_PASSWORD"];
    if (!esperado || data.password !== esperado) {
      return { ok: false as const };
    }
    const session = await adminSession();
    await session.update({ authenticated: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
  return { ok: true as const };
});

export const listMvps = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  if (!session.data.authenticated) {
    throw new Error("UNAUTHORIZED");
  }

  const columnas =
    "id, created_at, colegio, brigada, lema, correo_lider, integrantes, pistas, desafio, idea_semilla, lab, nombre, documento, prompt, respuestas, respuestas_ecotech";
  const columnasSinCorreo =
    "id, created_at, colegio, brigada, lema, integrantes, pistas, desafio, idea_semilla, lab, nombre, documento, prompt, respuestas, respuestas_ecotech";

  const { data, error } = await getSupabase()
    .from("mvps")
    .select(columnas)
    .order("created_at", { ascending: false });

  if (error) {
    // Compatibilidad si aún no corrieron la migración de correo_lider.
    if (error.code === "42703" && /correo_lider/i.test(error.message)) {
      const fallback = await getSupabase()
        .from("mvps")
        .select(columnasSinCorreo)
        .order("created_at", { ascending: false });
      if (fallback.error) throw new Error("No pudimos cargar los MVPs guardados.");
      return z
        .array(mvpSchema)
        .parse(
          (fallback.data ?? []).map((row) => ({ ...row, correo_lider: null })),
        ) as MvpGuardado[];
    }
    // Compatibilidad si faltan columnas de canvas (instalaciones viejas).
    if (error.code === "42703") {
      const minimo = await getSupabase()
        .from("mvps")
        .select(
          "id, created_at, colegio, brigada, lema, correo_lider, lab, nombre, documento, prompt, respuestas, respuestas_ecotech",
        )
        .order("created_at", { ascending: false });
      if (minimo.error) throw new Error("No pudimos cargar los MVPs guardados.");
      return z.array(mvpSchema).parse(
        (minimo.data ?? []).map((row) => ({
          ...row,
          integrantes: null,
          pistas: null,
          desafio: null,
          idea_semilla: null,
        })),
      ) as MvpGuardado[];
    }
    throw new Error("No pudimos cargar los MVPs guardados.");
  }

  const parsed = z.array(mvpSchema).parse(data) as MvpGuardado[];
  return parsed.map((m) => {
    if (esArrayMisiones(m.respuestas) || esArrayPlano(m.respuestas)) {
      return m;
    }
    return { ...m, respuestas: [] as RespuestaPlana[] };
  });
});

const terraFilaSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  correo_lider: z.string(),
  reto: z.string(),
  solucion: z.string(),
  aprendizaje_prototipo: z.string(),
  cambio_concreto: z.string(),
  viabilidad: z.string(),
  propuesta_valor: z.string(),
  compromiso_colegio: z.string(),
});

const terraEquipoSchema = z.object({
  correo_lider: z.string().nullable(),
  colegio: z.string().nullable(),
  integrantes: z.string().nullable(),
  nombre: z.string().nullable(),
});

/** Cada envío de Terralab Challenge, con colegio y proyecto tomados de mvps. */
export const listTerraChallenge = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  if (!session.data.authenticated) {
    throw new Error("UNAUTHORIZED");
  }

  const columnas =
    "id, created_at, correo_lider, reto, solucion, aprendizaje_prototipo, cambio_concreto, viabilidad, propuesta_valor, compromiso_colegio";
  const { data, error } = await getSupabase()
    .from("terra_challenge")
    .select(columnas)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      throw new Error(
        "Falta la tabla terra_challenge en Supabase. Ejecuta la migración supabase/migrations/20260930_terra_challenge.sql.",
      );
    }
    console.error("[terra_challenge] error al listar", error);
    throw new Error("No pudimos cargar los envíos de Terralab Challenge.");
  }

  const filas = z.array(terraFilaSchema).parse(data ?? []);
  const correos = [...new Set(filas.map((f) => f.correo_lider))];
  const equipos = new Map<string, { colegio: string; terranautas: string; nombre: string }>();

  if (correos.length > 0) {
    const mvps = await getSupabase()
      .from("mvps")
      .select("correo_lider, colegio, integrantes, nombre")
      .in("correo_lider", correos);

    if (mvps.error) {
      console.error("[terra_challenge] error al unir mvps", mvps.error);
      throw new Error("No pudimos completar el reporte con los datos del equipo.");
    }

    for (const row of z.array(terraEquipoSchema).parse(mvps.data ?? [])) {
      const correo = (row.correo_lider ?? "").trim().toLowerCase();
      if (!correo || equipos.has(correo)) continue;
      equipos.set(correo, {
        colegio: row.colegio ?? "",
        terranautas: row.integrantes ?? "",
        nombre: row.nombre ?? "",
      });
    }
  }

  return filas.map((fila) => {
    const equipo = equipos.get(fila.correo_lider.trim().toLowerCase());
    return {
      ...fila,
      colegio: equipo?.colegio ?? "",
      terranautas: equipo?.terranautas ?? "",
      nombre_proyecto: equipo?.nombre ?? "",
    } satisfies TerraChallengeReporte;
  });
});
