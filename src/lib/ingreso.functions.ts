import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";

import { labs } from "@/data/labs";
import { buscarCanvasPorCorreoLider, validarCorreoLider } from "./mvp-save.server";
import { crearClienteAuth } from "./supabase-auth.server";

const LABS = new Set(labs.map((lab) => lab.id));

export type CanvasIngreso = {
  colegio: string;
  brigada: string;
  lema: string;
  integrantes: string;
  pistas: string;
  desafio: string;
  ideaSemilla: string;
  lab: string;
};

export type ResultadoIngreso = {
  correo: string;
  canvas: CanvasIngreso | null;
  /** La cuenta quedó creada, pero Supabase pide confirmar el correo antes de entrar. */
  confirmacionPendiente?: boolean;
};

const credencialesSchema = z.object({
  correo: z.string(),
  clave: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

function canvasDesdeRegistro(
  registro: NonNullable<Awaited<ReturnType<typeof buscarCanvasPorCorreoLider>>>,
): CanvasIngreso {
  const lab = LABS.has(registro.lab) ? registro.lab : "ecotech";
  return {
    colegio: registro.colegio,
    brigada: registro.brigada,
    lema: registro.lema,
    integrantes: registro.integrantes,
    pistas: registro.pistas,
    desafio: registro.desafio,
    ideaSemilla: registro.ideaSemilla,
    lab,
  };
}

function mensajeAuth(error: { message: string; code?: string | undefined }) {
  const code = error.code ?? "";
  const message = error.message ?? "";
  if (code === "invalid_credentials" || /invalid login credentials/i.test(message)) {
    return "Correo o contraseña incorrectos.";
  }
  if (code === "email_not_confirmed" || /email not confirmed/i.test(message)) {
    return "Confirma el correo antes de ingresar. Revisa la bandeja de entrada.";
  }
  if (
    code === "user_already_exists" ||
    /already registered|already been registered/i.test(message)
  ) {
    return "Ese correo ya tiene cuenta. Ingresa con tu contraseña.";
  }
  if (/password/i.test(message) && /at least|weak|short/i.test(message)) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (/rate limit/i.test(message)) {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }
  return "No pudimos completar el ingreso. Intenta de nuevo.";
}

async function resultadoDesdeSesion(
  supabase: ReturnType<typeof crearClienteAuth>,
  correoEsperado?: string,
): Promise<ResultadoIngreso> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) {
    throw new Error("No pudimos abrir la sesión. Intenta de nuevo.");
  }
  const correo = validarCorreoLider(data.user.email);
  if (correoEsperado && correo !== correoEsperado) {
    throw new Error("El correo de la sesión no coincide.");
  }
  const registro = await buscarCanvasPorCorreoLider(correo);
  return {
    correo,
    canvas: registro ? canvasDesdeRegistro(registro) : null,
  };
}

function urlRetorno(recuperacion = false) {
  const actual = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
  const destino = new URL("/mvp", actual.origin);
  if (recuperacion) destino.searchParams.set("recuperacion", "1");
  return destino.toString();
}

export const iniciarSesion = createServerFn({ method: "POST" })
  .validator((input: unknown) => credencialesSchema.parse(input))
  .handler(async ({ data }) => {
    const correo = validarCorreoLider(data.correo);
    const supabase = crearClienteAuth();
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: data.clave,
    });
    if (error) throw new Error(mensajeAuth(error));
    return resultadoDesdeSesion(supabase, correo);
  });

export const crearCuenta = createServerFn({ method: "POST" })
  .validator((input: unknown) => credencialesSchema.parse(input))
  .handler(async ({ data }) => {
    const correo = validarCorreoLider(data.correo);
    const supabase = crearClienteAuth();
    const { data: creado, error } = await supabase.auth.signUp({
      email: correo,
      password: data.clave,
      options: { emailRedirectTo: urlRetorno() },
    });
    if (error) throw new Error(mensajeAuth(error));
    if (creado.user && (creado.user.identities?.length ?? 0) === 0) {
      throw new Error("Ese correo ya tiene cuenta. Ingresa con tu contraseña.");
    }
    if (!creado.session) {
      return { correo, canvas: null, confirmacionPendiente: true } satisfies ResultadoIngreso;
    }
    return resultadoDesdeSesion(supabase, correo);
  });

export const enviarRecuperacion = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ correo: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const correo = validarCorreoLider(data.correo);
    const supabase = crearClienteAuth();
    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: urlRetorno(true),
    });
    if (error) throw new Error(mensajeAuth(error));
    return { ok: true as const };
  });

/** Canjea el código del enlace de confirmación o de recuperación. */
export const confirmarEnlaceAuth = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ code: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = crearClienteAuth();
    const { error } = await supabase.auth.exchangeCodeForSession(data.code);
    if (error) {
      throw new Error("El enlace no es válido o ya venció. Pide uno nuevo.");
    }
    return resultadoDesdeSesion(supabase);
  });

export const actualizarClave = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({ clave: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.") })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = crearClienteAuth();
    const { data: usuario, error: sesionError } = await supabase.auth.getUser();
    if (sesionError || !usuario.user?.email) {
      throw new Error("El enlace venció. Pide uno nuevo.");
    }
    const { error } = await supabase.auth.updateUser({ password: data.clave });
    if (error) throw new Error(mensajeAuth(error));
    return resultadoDesdeSesion(supabase);
  });

/** Correo ya autenticado en esta sesión, o null si hay que volver a ingresar. */
export const estadoSesionIngreso = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = crearClienteAuth();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return { correo: validarCorreoLider(data.user.email) };
});

export const cerrarSesionIngreso = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = crearClienteAuth();
  await supabase.auth.signOut();
  return { ok: true as const };
});
