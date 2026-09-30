import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { obtenerCanvasPorCorreo } from "@/lib/mvp.functions";
import {
  PREGUNTAS_TERRA_CHALLENGE,
  respuestasTerraVacias,
  type RespuestasTerraChallenge,
} from "@/lib/terra-challenge";
import { guardarTerraChallenge } from "@/lib/terra-challenge.functions";
import { ModalInfoLab } from "./ModalInfoLab";

type Equipo = {
  correoLider: string;
  colegio: string;
  integrantes: string;
  nombre: string;
};

const campoClass =
  "mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary";

export function TerraChallengeForm() {
  const buscar = useServerFn(obtenerCanvasPorCorreo);
  const guardar = useServerFn(guardarTerraChallenge);

  const [correo, setCorreo] = useState("");
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestasTerraChallenge>(respuestasTerraVacias);
  const [cargando, setCargando] = useState<null | "buscar" | "guardar">(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [modalLab, setModalLab] = useState(false);

  const correoListo =
    equipo !== null && correo.trim().toLowerCase() === equipo.correoLider.toLowerCase();

  async function onBuscar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(false);
    setEquipo(null);
    setRespuestas(respuestasTerraVacias());
    setCargando("buscar");
    try {
      const canvas = await buscar({ data: { correoLider: correo.trim() } });
      if (!canvas) {
        setError("No encontramos un equipo con ese correo de líder.");
        return;
      }
      setEquipo({
        correoLider: canvas.correoLider,
        colegio: canvas.colegio,
        integrantes: canvas.integrantes,
        nombre: canvas.nombre,
      });
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "";
      setError(
        /invalid|inválid|invalido|email/i.test(mensaje)
          ? "Indica un correo electrónico válido del líder del equipo."
          : mensaje || "No pudimos consultar el correo del líder. Intenta de nuevo.",
      );
    } finally {
      setCargando(null);
    }
  }

  async function onGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!equipo || !correoListo) return;
    const limpias = respuestasTerraVacias();
    for (const p of PREGUNTAS_TERRA_CHALLENGE) {
      limpias[p.key] = respuestas[p.key].trim();
    }
    if (PREGUNTAS_TERRA_CHALLENGE.some((p) => !limpias[p.key])) {
      setError("Responde todas las preguntas.");
      return;
    }
    setError(null);
    setExito(false);
    setCargando("guardar");
    try {
      await guardar({
        data: {
          correoLider: equipo.correoLider,
          ...limpias,
        },
      });
      setRespuestas(respuestasTerraVacias());
      setExito(true);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "";
      setError(mensaje || "No pudimos guardar las respuestas. Intenta de nuevo.");
    } finally {
      setCargando(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
        Terra Lab Atlántico
      </p>
      <h1 className="mt-2 text-4xl font-extrabold">Terralab Challenge</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Escribe el correo del líder del equipo para ver el colegio, los terranautas y el nombre del
        proyecto. Después responde las preguntas del reto.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-bold"
        >
          {error}
        </div>
      )}

      {exito && (
        <div
          role="status"
          className="mt-6 rounded-2xl border-2 border-lime bg-secondary p-4 text-sm font-bold"
        >
          Respuestas guardadas. Puedes enviar otro registro con el mismo equipo.
        </div>
      )}

      <form onSubmit={onBuscar} className="mt-8">
        <label htmlFor="correo-lider" className="text-xs font-extrabold tracking-wider uppercase">
          Correo electrónico del líder del equipo
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="correo-lider"
            type="email"
            required
            autoComplete="email"
            value={correo}
            placeholder="lider@colegio.edu.co"
            onChange={(e) => {
              setCorreo(e.target.value);
              setExito(false);
            }}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={cargando !== null || !correo.trim()}
            className="shrink-0 rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando === "buscar" ? "Buscando…" : "Cargar equipo"}
          </button>
        </div>
      </form>

      {correoListo && equipo && (
        <form onSubmit={onGuardar} className="mt-10 space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoLectura id="colegio" label="Colegio" valor={equipo.colegio} />
            <CampoLectura id="proyecto" label="Nombre del proyecto" valor={equipo.nombre} />
            <CampoLectura
              id="terranautas"
              label="Terranautas"
              valor={equipo.integrantes}
              area
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setModalLab(true)}
                className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-extrabold text-primary transition-transform hover:-translate-y-0.5"
              >
                Ver información del laboratorio
              </button>
            </div>
          </div>
          <ModalInfoLab
            correo={equipo.correoLider}
            abierto={modalLab}
            onCerrar={() => setModalLab(false)}
          />

          <div className="space-y-5">
            {PREGUNTAS_TERRA_CHALLENGE.map((p, i) => (
              <div key={p.key} className="rounded-3xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
                    {i + 1}. {p.criterio}
                  </p>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold">
                    {p.porcentaje}%
                  </span>
                </div>
                <label htmlFor={`pregunta-${p.key}`} className="mt-3 block text-sm font-extrabold">
                  {p.pregunta}
                </label>
                <p className="mt-3 text-sm font-extrabold">
                  Para responder esta pregunta ten en cuenta esto:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {p.ayudas.map((ayuda) => (
                    <li key={ayuda}>{ayuda}</li>
                  ))}
                </ul>
                <textarea
                  id={`pregunta-${p.key}`}
                  required
                  rows={4}
                  value={respuestas[p.key]}
                  onChange={(e) => setRespuestas((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  className={campoClass}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={cargando !== null}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando === "guardar" ? "Guardando…" : "Enviar respuestas"}
          </button>
        </form>
      )}
    </div>
  );
}

function CampoLectura({
  id,
  label,
  valor,
  area,
  className,
}: {
  id: string;
  label: string;
  valor: string;
  area?: boolean;
  className?: string;
}) {
  const mostrar = valor.trim() || "Sin dato";
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-extrabold tracking-wider uppercase">
        {label}
      </label>
      {area ? (
        <textarea
          id={id}
          readOnly
          rows={3}
          value={mostrar}
          className={`${campoClass} bg-muted text-muted-foreground`}
        />
      ) : (
        <input
          id={id}
          readOnly
          value={mostrar}
          className={`${campoClass} bg-muted text-muted-foreground`}
        />
      )}
    </div>
  );
}
