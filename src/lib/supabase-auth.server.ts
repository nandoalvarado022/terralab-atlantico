import { createServerClient } from "@supabase/ssr";
import {
  getCookies,
  getRequestProtocol,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";

function limpiar(valor: string | undefined) {
  return valor?.trim() ?? "";
}

/** Clave para Auth. La publishable/anon es la correcta; la service role solo cubre el servidor si aún no está la pública. */
function claveAuth() {
  const publica =
    limpiar(process.env["SUPABASE_ANON_KEY"]) ||
    limpiar(process.env["SUPABASE_PUBLISHABLE_KEY"]) ||
    limpiar(process.env["VITE_SUPABASE_ANON_KEY"]) ||
    limpiar(process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]);
  if (publica) return publica;

  const servicio = limpiar(process.env["SUPABASE_SERVICE_ROLE_KEY"]);
  if (!servicio) {
    throw new Error(
      "Falta la clave pública de Supabase (SUPABASE_ANON_KEY o VITE_SUPABASE_PUBLISHABLE_KEY).",
    );
  }
  return servicio;
}

/** Cliente de Auth por request. Las cookies de sesión las escribe TanStack Start. */
export function crearClienteAuth() {
  const url = limpiar(process.env["SUPABASE_URL"]);
  if (!url) {
    throw new Error("Falta la configuración de Supabase (SUPABASE_URL).");
  }

  return createServerClient(url, claveAuth(), {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: getRequestProtocol() === "https",
    },
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookies, headers) {
        cookies.forEach(({ name, value, options }) => {
          setCookie(name, value, options);
        });
        for (const [name, value] of Object.entries(headers)) {
          setResponseHeader(name as "cache-control", value);
        }
      },
    },
  });
}
