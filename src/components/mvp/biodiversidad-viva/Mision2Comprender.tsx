import { Checkbox } from "@/components/ui/checkbox";
import {
  camposDiagnosticoSitio,
  clavesBiodiversidadViva,
  criteriosObservacion,
  escalaValorObservacion,
  seccionesConexionAtlantico,
  type CriterioObservacion,
  type SeccionConexionAtlantico,
  type ValorObservacion,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

function FilaCriterio({
  criterio,
  valor,
  evidencia,
  onValor,
  onEvidencia,
}: {
  criterio: CriterioObservacion;
  valor: string;
  evidencia: string;
  onValor: (v: ValorObservacion | "") => void;
  onEvidencia: (v: string) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border-2"
      style={{ borderColor: `${criterio.color}55`, backgroundColor: criterio.fondo }}
    >
      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(11rem,0.9fr)_minmax(12rem,1.1fr)_auto_minmax(10rem,1fr)] lg:items-start">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
            style={{ backgroundColor: criterio.color }}
            aria-hidden
          >
            {criterio.numero}
          </span>
          <h4
            className="pt-1.5 text-sm font-extrabold tracking-wide uppercase"
            style={{ color: criterio.color }}
          >
            {criterio.titulo}
          </h4>
        </div>

        <div>
          <p
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: criterio.color }}
          >
            Observa
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#1f4d5a]">{criterio.observa}</p>
        </div>

        <div>
          <p
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: criterio.color }}
          >
            Valor
          </p>
          <div
            className="mt-2 flex gap-1.5"
            role="radiogroup"
            aria-label={`Valor · ${criterio.titulo}`}
          >
            {escalaValorObservacion.map((opcion) => {
              const activo = valor === opcion.id;
              return (
                <button
                  key={opcion.id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  title={`${opcion.etiqueta}: ${opcion.significado}`}
                  onClick={() => onValor(activo ? "" : opcion.id)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-md border-2 px-2 text-xs font-extrabold transition-colors ${
                    activo ? "text-white" : "bg-white/80"
                  }`}
                  style={{
                    borderColor: criterio.color,
                    backgroundColor: activo ? criterio.color : undefined,
                    color: activo ? "#fff" : criterio.color,
                  }}
                >
                  {opcion.etiqueta}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor={clavesBiodiversidadViva.criterioEvidencia(criterio.id)}
            className="text-[10px] font-extrabold tracking-widest uppercase"
            style={{ color: criterio.color }}
          >
            Evidencia / hallazgo
          </label>
          <textarea
            id={clavesBiodiversidadViva.criterioEvidencia(criterio.id)}
            rows={3}
            value={evidencia}
            onChange={(e) => onEvidencia(e.target.value)}
            className="mt-1 w-full resize-none border-0 bg-transparent px-0 py-1 text-sm text-[#1f4d5a] outline-none"
            style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent 1.45rem, ${criterio.color}44 1.45rem, ${criterio.color}44 calc(1.45rem + 1px))`,
              backgroundAttachment: "local",
              lineHeight: "1.5rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Misión 2 · punto 1: observación del lugar con escala de valor. */
function ObservaElLugar({ respuestas, onCambiar }: MisionProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border-2 border-[#2d6a6a] bg-[#eef6f5] p-4 shadow-card sm:p-5">
      <header className="rounded-2xl bg-[#1f4d5a] px-4 py-3 text-center sm:px-5">
        <p className="text-[11px] font-extrabold tracking-widest text-[#f0d878] uppercase">
          Escala
        </p>
        <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-white/95">
          {escalaValorObservacion.map((v) => (
            <li key={v.id}>
              <span className="font-extrabold text-[#f0d878]">{v.etiqueta}</span>
              <span className="ml-1">: {v.significado}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-4 space-y-3">
        {criteriosObservacion.map((criterio) => (
          <FilaCriterio
            key={criterio.id}
            criterio={criterio}
            valor={respuestas[clavesBiodiversidadViva.criterioValor(criterio.id)] ?? ""}
            evidencia={respuestas[clavesBiodiversidadViva.criterioEvidencia(criterio.id)] ?? ""}
            onValor={(v) => onCambiar(clavesBiodiversidadViva.criterioValor(criterio.id), v)}
            onEvidencia={(v) =>
              onCambiar(clavesBiodiversidadViva.criterioEvidencia(criterio.id), v)
            }
          />
        ))}
      </div>
    </article>
  );
}

function SeccionConexion({
  seccion,
  respuestas,
  onCambiar,
}: {
  seccion: SeccionConexionAtlantico;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  return (
    <section>
      <h4
        className="rounded-md px-3 py-2 text-center text-sm font-extrabold tracking-wide text-white uppercase"
        style={{ backgroundColor: seccion.color }}
      >
        {seccion.titulo}
      </h4>
      <div
        className="mt-2 grid gap-x-6 gap-y-2 rounded-xl px-3 py-3 sm:grid-cols-2"
        style={{ backgroundColor: seccion.fondo }}
      >
        {seccion.opciones.map((opcion) => {
          const clave = clavesBiodiversidadViva.conexionAtlantico(seccion.id, opcion.id);
          const marcado = respuestas[clave] === "si";
          const inputId = clave;
          return (
            <label
              key={opcion.id}
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                id={inputId}
                checked={marcado}
                onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                className="h-[15px] w-[15px] rounded-[2px] border-2 shadow-none data-[state=checked]:text-white"
                style={{
                  borderColor: seccion.color,
                  backgroundColor: marcado ? seccion.color : "transparent",
                }}
              />
              <span className="text-sm text-[#1f3a5f]">{opcion.etiqueta}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

/** Misión 2 · punto 2: condiciones del territorio / conexión Atlántico. */
function ConexionConElAtlantico({ respuestas, onCambiar }: MisionProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border-2 border-[#6b5b95] bg-white p-4 shadow-card sm:p-5">
      <header className="text-center">
        <h3 className="text-lg font-extrabold tracking-wide text-[#6b5b95] uppercase sm:text-xl">
          Conexión con el Atlántico
        </h3>
        <p className="mt-1 text-sm font-medium text-[#2d6a6a]">
          ¿Qué condiciones del territorio ayudan a explicar este sitio?
        </p>
      </header>

      <div className="mt-5 space-y-4">
        {seccionesConexionAtlantico.map((seccion) => (
          <SeccionConexion
            key={seccion.id}
            seccion={seccion}
            respuestas={respuestas}
            onCambiar={onCambiar}
          />
        ))}
      </div>

      <footer className="mt-5 rounded-2xl bg-[#1f3a5f] px-4 py-3 text-center">
        <p className="text-[11px] font-extrabold tracking-wide text-white uppercase sm:text-xs">
          Regla: si no podemos sostenerlo con observación o fuente, lo marcamos VT o pregunta.
        </p>
      </footer>
    </article>
  );
}

/** Misión 2 · punto 3: diagnóstico del sitio. */
function DiagnosticoDelSitio({ respuestas, onCambiar }: MisionProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border-2 border-[#6b8f3d] bg-[#f3f7e8] p-4 shadow-card sm:p-5">
      <h3 className="text-sm font-extrabold tracking-wide text-[#5a7a2f] uppercase sm:text-base">
        Diagnóstico del sitio
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {camposDiagnosticoSitio.map((campo) => {
          const clave = clavesBiodiversidadViva.diagnosticoSitio(campo.id);
          return (
            <div key={campo.id}>
              <label htmlFor={clave} className="text-sm font-bold text-[#3d5a28]">
                {campo.etiqueta}
              </label>
              <textarea
                id={clave}
                rows={4}
                value={respuestas[clave] ?? ""}
                onChange={(e) => onCambiar(clave, e.target.value)}
                className="mt-2 w-full resize-none border-0 bg-transparent px-0 py-1 text-sm text-[#3d5a28] outline-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 1.45rem, rgba(107,143,61,0.35) 1.45rem, rgba(107,143,61,0.35) calc(1.45rem + 1px))",
                  backgroundAttachment: "local",
                  lineHeight: "1.5rem",
                }}
              />
            </div>
          );
        })}
      </div>
    </article>
  );
}

/** Misión 2 · Comprender. */
export function Mision2Comprender({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-8">
      <ObservaElLugar respuestas={respuestas} onCambiar={onCambiar} />
      <ConexionConElAtlantico respuestas={respuestas} onCambiar={onCambiar} />
      <DiagnosticoDelSitio respuestas={respuestas} onCambiar={onCambiar} />
    </div>
  );
}
