import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { getSupabase } from "./supabase.server";

const mvpSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  colegio: z.string(),
  brigada: z.string(),
  lema: z.string(),
  lab: z.string(),
  nombre: z.string(),
  documento: z.string(),
  prompt: z.string(),
  respuestas: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
  respuestas_ecotech: z.record(z.string(), z.string()).nullable(),
});

export type MvpGuardado = z.infer<typeof mvpSchema>;

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

  const { data, error } = await getSupabase()
    .from("mvps")
    .select(
      "id, created_at, colegio, brigada, lema, lab, nombre, documento, prompt, respuestas, respuestas_ecotech",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("No pudimos cargar los MVPs guardados.");

  return z.array(mvpSchema).parse(data);
});
