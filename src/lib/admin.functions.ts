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
      return z.array(mvpSchema).parse(
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
