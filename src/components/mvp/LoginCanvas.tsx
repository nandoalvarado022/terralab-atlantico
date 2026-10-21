import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { PEDIR_CONTRASENA_FORJA } from "@/lib/forja-ingreso";
import {
  actualizarClave,
  confirmarEnlaceAuth,
  crearCuenta,
  enviarRecuperacion,
  iniciarSesion,
  type CanvasIngreso,
  type ResultadoIngreso,
} from "@/lib/ingreso.functions";
import { obtenerCanvasPorCorreo } from "@/lib/mvp.functions";

const campoClass =
  "mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary read-only:bg-muted";

type EnlaceAuth =
  | null
  | { tipo: "error"; recuperacion: boolean }
  | { tipo: "codigo"; recuperacion: boolean; promesa: Promise<ResultadoIngreso> };

let enlaceAuth: EnlaceAuth | undefined;

function leerEnlaceAuth(
  confirmar: (args: { data: { code: string } }) => Promise<ResultadoIngreso>,
): EnlaceAuth {
  if (enlaceAuth !== undefined) return enlaceAuth;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const errorEnlace = params.get("error_description") ?? params.get("error");
  const recuperacion = params.get("recuperacion") === "1";
  if (code || errorEnlace) {
    const limpia = new URL(window.location.href);
    for (const nombre of ["code", "error", "error_code", "error_description", "recuperacion"]) {
      limpia.searchParams.delete(nombre);
    }
    window.history.replaceState(null, "", `${limpia.pathname}${limpia.search}${limpia.hash}`);
  }

  if (code) {
    enlaceAuth = { tipo: "codigo", recuperacion, promesa: confirmar({ data: { code } }) };
  } else if (errorEnlace) {
    enlaceAuth = { tipo: "error", recuperacion };
  } else {
    enlaceAuth = null;
  }
  return enlaceAuth;
}

type Modo = "ingresar" | "crear" | "recuperar";

export function LoginCanvas({
  onIngreso,
}: {
  onIngreso: (correo: string, canvas: CanvasIngreso | null) => void;
}) {
  const ingresar = useServerFn(iniciarSesion);
  const buscarCanvas = useServerFn(obtenerCanvasPorCorreo);
  const registrar = useServerFn(crearCuenta);
  const recuperar = useServerFn(enviarRecuperacion);
  const confirmar = useServerFn(confirmarEnlaceAuth);
  const cambiarClave = useServerFn(actualizarClave);

  const [modo, setModo] = useState<Modo>("ingresar");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevaClave2, setNuevaClave2] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [confirmandoEnlace, setConfirmandoEnlace] = useState(false);
  const [trasRecuperacion, setTrasRecuperacion] = useState(false);
  const onIngresoRef = useRef(onIngreso);
  onIngresoRef.current = onIngreso;
  const confirmarRef = useRef(confirmar);
  confirmarRef.current = confirmar;

  const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(correo.trim());

  useEffect(() => {
    if (!PEDIR_CONTRASENA_FORJA) return;
    const pendiente = leerEnlaceAuth((args) => confirmarRef.current(args));
    if (!pendiente) return;

    if (pendiente.tipo === "error") {
      setError("El enlace no es válido o ya venció. Pide uno nuevo.");
      if (pendiente.recuperacion) setModo("recuperar");
      return;
    }

    let activo = true;
    setConfirmandoEnlace(true);
    setError(null);
    pendiente.promesa
      .then((resultado) => {
        if (!activo) return;
        if (pendiente.recuperacion) {
          setTrasRecuperacion(true);
          setAviso("Elige una contraseña nueva para este correo.");
          return;
        }
        onIngresoRef.current(resultado.correo, resultado.canvas);
      })
      .catch((err) => {
        if (activo) setError(mensajeError(err, "No pudimos confirmar el enlace."));
      })
      .finally(() => {
        if (activo) setConfirmandoEnlace(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  function cambiarModo(siguiente: Modo) {
    setModo(siguiente);
    setError(null);
    setAviso(null);
    setClave("");
    setClave2("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!correoOk) {
      setError("Indica un correo electrónico válido.");
      return;
    }
    if (!PEDIR_CONTRASENA_FORJA) {
      setError(null);
      setAviso(null);
      setCargando(true);
      try {
        const registro = await buscarCanvas({ data: { correoLider: correo.trim() } });
        onIngreso(
          registro?.correoLider || correo.trim().toLowerCase(),
          registro
            ? {
                colegio: registro.colegio,
                brigada: registro.brigada,
                lema: registro.lema,
                integrantes: registro.integrantes,
                pistas: registro.pistas,
                desafio: registro.desafio,
                ideaSemilla: registro.ideaSemilla,
                lab: registro.lab,
              }
            : null,
        );
      } catch (err) {
        setError(mensajeError(err, "No pudimos cargar el canvas. Intenta de nuevo."));
      } finally {
        setCargando(false);
      }
      return;
    }
    if (modo !== "recuperar" && clave.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (modo === "crear" && clave !== clave2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);
    setAviso(null);
    setCargando(true);
    try {
      if (modo === "recuperar") {
        await recuperar({ data: { correo: correo.trim() } });
        setAviso(
          "Si ese correo tiene cuenta, te enviamos un enlace para elegir una contraseña nueva.",
        );
        return;
      }

      const resultado: ResultadoIngreso =
        modo === "crear"
          ? await registrar({ data: { correo: correo.trim(), clave } })
          : await ingresar({ data: { correo: correo.trim(), clave } });

      if (resultado.confirmacionPendiente) {
        setAviso(
          "Te enviamos un enlace para confirmar el correo. Ábrelo y vuelve a esta página: si el equipo ya tenía un canvas guardado, lo cargamos al entrar.",
        );
        setModo("ingresar");
        setClave("");
        setClave2("");
        return;
      }
      onIngreso(resultado.correo, resultado.canvas);
    } catch (err) {
      setError(mensajeError(err, "No pudimos completar el ingreso. Intenta de nuevo."));
    } finally {
      setCargando(false);
    }
  }

  async function onNuevaClave(e: React.FormEvent) {
    e.preventDefault();
    if (nuevaClave.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nuevaClave !== nuevaClave2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError(null);
    setCargando(true);
    try {
      const resultado = await cambiarClave({ data: { clave: nuevaClave } });
      onIngreso(resultado.correo, resultado.canvas);
    } catch (err) {
      setError(mensajeError(err, "No pudimos guardar la contraseña. Intenta de nuevo."));
    } finally {
      setCargando(false);
    }
  }

  if (confirmandoEnlace) {
    return <p className="text-sm font-bold text-muted-foreground">Confirmando el enlace…</p>;
  }

  if (trasRecuperacion) {
    return (
      <form onSubmit={onNuevaClave} className="space-y-4">
        <div>
          <label htmlFor="nueva-clave" className="text-sm font-extrabold">
            Contraseña nueva
          </label>
          <input
            id="nueva-clave"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={nuevaClave}
            onChange={(e) => {
              setNuevaClave(e.target.value);
              setError(null);
            }}
            className={campoClass}
          />
        </div>
        <div>
          <label htmlFor="nueva-clave-2" className="text-sm font-extrabold">
            Repite la contraseña
          </label>
          <input
            id="nueva-clave-2"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={nuevaClave2}
            onChange={(e) => {
              setNuevaClave2(e.target.value);
              setError(null);
            }}
            className={campoClass}
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {cargando ? "Guardando…" : "Guardar contraseña"}
        </button>
        {aviso && <p className="text-sm text-muted-foreground">{aviso}</p>}
        {error && <Alerta>{error}</Alerta>}
      </form>
    );
  }

  const tituloClave = modo === "crear" ? "Elige una contraseña" : "Contraseña";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="correo-ingreso" className="text-sm font-extrabold">
          Correo del líder del equipo
        </label>
        <input
          id="correo-ingreso"
          type="email"
          required
          autoComplete="email"
          value={correo}
          placeholder="lider@colegio.edu.co"
          onChange={(e) => {
            setCorreo(e.target.value);
            setError(null);
          }}
          className={campoClass}
        />
      </div>

      {PEDIR_CONTRASENA_FORJA && modo !== "recuperar" && (
        <div>
          <label htmlFor="clave-ingreso" className="text-sm font-extrabold">
            {tituloClave}
          </label>
          <input
            id="clave-ingreso"
            type="password"
            required
            minLength={6}
            autoComplete={modo === "crear" ? "new-password" : "current-password"}
            value={clave}
            onChange={(e) => {
              setClave(e.target.value);
              setError(null);
            }}
            className={campoClass}
          />
        </div>
      )}

      {PEDIR_CONTRASENA_FORJA && modo === "crear" && (
        <div>
          <label htmlFor="clave-ingreso-2" className="text-sm font-extrabold">
            Repite la contraseña
          </label>
          <input
            id="clave-ingreso-2"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={clave2}
            onChange={(e) => {
              setClave2(e.target.value);
              setError(null);
            }}
            className={campoClass}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={cargando || !correoOk}
          className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {cargando
            ? "Un momento…"
            : !PEDIR_CONTRASENA_FORJA
              ? "Continuar"
              : modo === "crear"
                ? "Crear cuenta"
                : modo === "recuperar"
                  ? "Enviar enlace"
                  : "Ingresar"}
        </button>
      </div>

      {PEDIR_CONTRASENA_FORJA && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-extrabold">
          {modo !== "ingresar" && (
            <button
              type="button"
              onClick={() => cambiarModo("ingresar")}
              className="underline decoration-2 underline-offset-4 hover:text-primary"
            >
              Ya tengo cuenta
            </button>
          )}
          {modo !== "crear" && (
            <button
              type="button"
              onClick={() => cambiarModo("crear")}
              className="underline decoration-2 underline-offset-4 hover:text-primary"
            >
              Crear cuenta
            </button>
          )}
          {modo !== "recuperar" && (
            <button
              type="button"
              onClick={() => cambiarModo("recuperar")}
              className="underline decoration-2 underline-offset-4 hover:text-primary"
            >
              Olvidé mi contraseña
            </button>
          )}
        </div>
      )}

      {aviso && <p className="text-sm text-muted-foreground">{aviso}</p>}
      {error && <Alerta>{error}</Alerta>}
    </form>
  );
}

function Alerta({ children }: { children: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-bold"
    >
      {children}
    </div>
  );
}

function mensajeError(err: unknown, fallback: string) {
  const mensaje = err instanceof Error ? err.message : "";
  if (/email|correo/i.test(mensaje) && /inválid|invalido|valid/i.test(mensaje)) {
    return "Indica un correo electrónico válido.";
  }
  if (/contraseña|password|sesión|enlace|cuenta|correo o contraseña|confirma/i.test(mensaje)) {
    return mensaje;
  }
  return mensaje || fallback;
}
