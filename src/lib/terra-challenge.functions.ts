import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buscarCanvasPorCorreoLider, validarCorreoLider } from "./mvp-save.server";
import { getSupabase } from "./supabase.server";

const respuestaCampo = z.string().trim().min(1, "Responde todas las preguntas");

const guardarSchema = z.object({
  correoLider: z.string().trim().email("Indica un correo electrónico válido"),
  reto: respuestaCampo,
  solucion: respuestaCampo,
  aprendizaje_prototipo: respuestaCampo,
  cambio_concreto: respuestaCampo,
  viabilidad: respuestaCampo,
  propuesta_valor: respuestaCampo,
  compromiso_colegio: respuestaCampo,
  logo: z.string().trim().url("La URL del logo no es válida").nullable(),
  imagenPrototipo: z
    .string()
    .trim()
    .url("La URL de la imagen del prototipo no es válida")
    .nullable(),
  pdf: z.string().trim().url("La URL del PDF no es válida").nullable(),
});

/** Inserta un envío nuevo. No actualiza filas anteriores del mismo correo. */
export const guardarTerraChallenge = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => guardarSchema.parse(input))
  .handler(async ({ data }) => {
    const correo = validarCorreoLider(data.correoLider);
    const canvas = await buscarCanvasPorCorreoLider(correo);
    if (!canvas) {
      throw new Error("No encontramos un equipo con ese correo de líder.");
    }

    const fila = {
      correo_lider: correo,
      reto: data.reto,
      solucion: data.solucion,
      aprendizaje_prototipo: data.aprendizaje_prototipo,
      cambio_concreto: data.cambio_concreto,
      viabilidad: data.viabilidad,
      propuesta_valor: data.propuesta_valor,
      compromiso_colegio: data.compromiso_colegio,
      logo: data.logo,
      imagen_prototipo: data.imagenPrototipo,
      pdf: data.pdf,
    };

    const { error } = await getSupabase().from("terra_challenge").insert(fila);
    if (error) {
      console.error("[terra_challenge] error al guardar", error);
      if (error.code === "42P01" || error.code === "PGRST205") {
        console.error(
          "[terra_challenge] falta la tabla. Ejecuta supabase/migrations/20260930_terra_challenge.sql",
        );
      }
      if (error.code === "42703") {
        console.error(
          "[terra_challenge] faltan columnas de archivos. Ejecuta supabase/migrations/20261001_terra_challenge_archivos.sql",
        );
      }
      throw new Error("No pudimos guardar las respuestas. Intenta de nuevo.");
    }

    return { ok: true as const };
  });

const mvpLaboratorioSchema = z.object({
  colegio: z.string().nullable().optional(),
  brigada: z.string().nullable().optional(),
  lema: z.string().nullable().optional(),
  correo_lider: z.string().nullable().optional(),
  integrantes: z.string().nullable().optional(),
  pistas: z.string().nullable().optional(),
  desafio: z.string().nullable().optional(),
  idea_semilla: z.string().nullable().optional(),
  lab: z.string(),
  nombre: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
  respuestas: z.unknown(),
  respuestas_ecotech: z.record(z.string(), z.string()).nullable().optional(),
});

export type MvpLaboratorio = z.infer<typeof mvpLaboratorioSchema>;

/** Ficha completa del laboratorio guardada en `mvps` para ese correo de líder. */
export const obtenerMvpLaboratorio = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ correoLider: z.string().trim().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const correo = validarCorreoLider(data.correoLider);
    const { data: fila, error } = await getSupabase()
      .from("mvps")
      .select(
        "colegio, brigada, lema, correo_lider, integrantes, pistas, desafio, idea_semilla, lab, nombre, documento, prompt, respuestas, respuestas_ecotech",
      )
      .eq("correo_lider", correo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[mvps] error al cargar el laboratorio", error);
      throw new Error("No pudimos cargar la información del laboratorio.");
    }
    if (!fila) return null;
    return mvpLaboratorioSchema.parse(fila);
  });
