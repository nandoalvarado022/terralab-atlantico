import {
  clavesEmprendeCircular,
  etapasComprender,
  evidenciasComprender,
  type EtapaComprender,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

function FlechaFlujo({
  direccion,
  className = "",
}: {
  direccion: "derecha" | "izquierda" | "abajo";
  className?: string;
}) {
  if (direccion === "abajo") {
    return (
      <span
        aria-hidden
        className={`inline-flex flex-col items-center gap-0.5 text-[#1f5c4a]/70 ${className}`}
      >
        <span className="h-5 w-0 border-l-2 border-dotted border-[#1f5c4a]/55" />
        <span className="text-lg font-extrabold leading-none">↓</span>
      </span>
    );
  }

  const simbolo = direccion === "derecha" ? "→" : "←";
  const puntos = direccion === "derecha" ? `···${simbolo}` : `${simbolo}···`;

  return (
    <span
      aria-hidden
      className={`select-none text-lg font-extrabold tracking-widest text-[#1f5c4a]/70 ${className}`}
    >
      {puntos}
    </span>
  );
}

function CajonEtapaComprender({
  etapa,
  respuestas,
  onCambiar,
  idPrefijo = "",
}: {
  etapa: EtapaComprender;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
  idPrefijo?: string;
}) {
  const claveNota = clavesEmprendeCircular.etapaNota(etapa.id);
  const claveQuien = clavesEmprendeCircular.etapaQuien(etapa.id);
  const claveEvidencia = clavesEmprendeCircular.etapaEvidencia(etapa.id);
  const claveFuente = clavesEmprendeCircular.etapaFuente(etapa.id);
  const evidencia = respuestas[claveEvidencia] ?? "";
  const idNota = `${idPrefijo}${claveNota}`;
  const idQuien = `${idPrefijo}${claveQuien}`;
  const idFuente = `${idPrefijo}${claveFuente}`;

  return (
    <article className="flex h-full flex-col rounded-3xl border-2 border-[#5a9e8a] bg-[#dceee6] p-4 shadow-card sm:p-5">
      <h3 className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
        {etapa.numero}. {etapa.titulo}
      </h3>
      <p className="mt-1 text-sm font-bold text-[#1f5c4a]/85">{etapa.pregunta}</p>

      <textarea
        id={idNota}
        rows={5}
        value={respuestas[claveNota] ?? ""}
        placeholder="Escriban lo que saben o dibujen la idea…"
        onChange={(e) => onCambiar(claveNota, e.target.value)}
        className="mt-3 min-h-28 flex-1 w-full resize-none rounded-2xl border border-[#5a9e8a]/40 bg-white/90 p-3 text-sm text-deep outline-none focus:border-[#1f5c4a]"
      />

      <div className="mt-3 space-y-3 border-t border-[#5a9e8a]/35 pt-3">
        <div className="flex items-baseline gap-2">
          <label htmlFor={idQuien} className="shrink-0 text-sm font-extrabold text-[#1f5c4a]">
            Quién:
          </label>
          <input
            id={idQuien}
            type="text"
            value={respuestas[claveQuien] ?? ""}
            placeholder="Persona, rol o grupo…"
            onChange={(e) => onCambiar(claveQuien, e.target.value)}
            className="min-w-0 flex-1 border-0 border-b-2 border-[#1f5c4a]/50 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
          />
        </div>

        <div>
          <p className="text-sm font-extrabold text-[#1f5c4a]">¿Cómo lo sabemos?</p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de evidencia">
            {evidenciasComprender.map((ev) => {
              const activo = evidencia === ev.id;
              return (
                <button
                  key={ev.id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  aria-label={ev.etiqueta}
                  title={ev.etiqueta}
                  onClick={() => onCambiar(claveEvidencia, activo ? "" : ev.id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-colors ${
                    activo
                      ? "border-[#1f5c4a] bg-[#1f5c4a] text-white"
                      : "border-[#1f5c4a]/70 bg-white/80 text-[#1f5c4a] hover:bg-white"
                  }`}
                >
                  {ev.letra}
                </button>
              );
            })}
          </div>
          <input
            id={idFuente}
            type="text"
            value={respuestas[claveFuente] ?? ""}
            placeholder="Fuente o método…"
            onChange={(e) => onCambiar(claveFuente, e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#5a9e8a]/40 bg-white/80 px-2.5 py-1.5 text-xs outline-none focus:border-[#1f5c4a]"
          />
        </div>
      </div>
    </article>
  );
}

export function Reto2Comprender({
  respuestas,
  onCambiar,
}: RetoProps) {
  const porId = Object.fromEntries(etapasComprender.map((e) => [e.id, e])) as Record<
    string,
    EtapaComprender
  >;

  return (
    <div className="space-y-4">
      {/* Escritorio: filas del flujo en S; flechas en el flujo del documento */}
      <div className="hidden sm:block">
        <div className="grid items-stretch grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-0">
          <CajonEtapaComprender etapa={porId["entra"]!} respuestas={respuestas} onCambiar={onCambiar} />
          <div className="flex items-center justify-center px-1">
            <FlechaFlujo direccion="derecha" />
          </div>
          <CajonEtapaComprender etapa={porId["se-usa"]!} respuestas={respuestas} onCambiar={onCambiar} />

          <div className="col-span-3 grid grid-cols-[1fr_auto_1fr] py-3">
            <div />
            <div />
            <div className="flex justify-center">
              <FlechaFlujo direccion="abajo" />
            </div>
          </div>

          <CajonEtapaComprender etapa={porId["se-mezcla"]!} respuestas={respuestas} onCambiar={onCambiar} />
          <div className="flex items-center justify-center px-1">
            <FlechaFlujo direccion="izquierda" />
          </div>
          <CajonEtapaComprender
            etapa={porId["se-descarta"]!}
            respuestas={respuestas}
            onCambiar={onCambiar}
          />

          <div className="col-span-3 grid grid-cols-[1fr_auto_1fr] py-3">
            <div className="flex justify-center">
              <FlechaFlujo direccion="abajo" />
            </div>
            <div />
            <div />
          </div>

          <CajonEtapaComprender etapa={porId["se-mueve"]!} respuestas={respuestas} onCambiar={onCambiar} />
          <div className="flex items-center justify-center px-1">
            <FlechaFlujo direccion="derecha" />
          </div>
          <CajonEtapaComprender etapa={porId["destino"]!} respuestas={respuestas} onCambiar={onCambiar} />
        </div>
      </div>

      {/* Móvil: secuencia 1→6 */}
      <div className="space-y-2 sm:hidden">
        {etapasComprender.map((etapa, i) => (
          <div key={etapa.id}>
            <CajonEtapaComprender
              etapa={etapa}
              respuestas={respuestas}
              onCambiar={onCambiar}
              idPrefijo="m-"
            />
            {i < etapasComprender.length - 1 && (
              <div className="flex justify-center py-1.5">
                <FlechaFlujo direccion="abajo" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-[#1f5c4a]">
        <span className="font-extrabold">D</span> = dato ·{" "}
        <span className="font-extrabold">E</span> = estimación ·{" "}
        <span className="font-extrabold">?</span> = pregunta. Rodeen uno y expliquen su fuente o
        método.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-[#5a9e8a] bg-[#dceee6] p-5 shadow-card">
          <h3 className="text-sm font-extrabold tracking-widest text-[#1f5c4a] uppercase">
            Hallazgo clave
          </h3>
          <label
            htmlFor={clavesEmprendeCircular.hallazgoClave}
            className="mt-2 block text-sm font-bold text-[#1f5c4a]/90"
          >
            El material pierde valor cuando
          </label>
          <textarea
            id={clavesEmprendeCircular.hallazgoClave}
            rows={4}
            value={respuestas[clavesEmprendeCircular.hallazgoClave] ?? ""}
            placeholder="Completen el hallazgo…"
            onChange={(e) => onCambiar(clavesEmprendeCircular.hallazgoClave, e.target.value)}
            className="mt-3 w-full resize-none rounded-2xl border border-[#5a9e8a]/40 bg-white/90 p-3 text-sm text-deep outline-none focus:border-[#1f5c4a]"
          />
        </div>

        <div className="rounded-3xl border-2 border-[#5a9e8a] bg-[#dceee6] p-5 shadow-card">
          <label
            htmlFor={clavesEmprendeCircular.preguntaPrioritaria}
            className="block text-sm font-extrabold tracking-widest text-[#1f5c4a] uppercase"
          >
            Pregunta prioritaria
          </label>
          <textarea
            id={clavesEmprendeCircular.preguntaPrioritaria}
            rows={4}
            value={respuestas[clavesEmprendeCircular.preguntaPrioritaria] ?? ""}
            placeholder="¿Qué pregunta guía el siguiente paso?"
            onChange={(e) =>
              onCambiar(clavesEmprendeCircular.preguntaPrioritaria, e.target.value)
            }
            className="mt-3 w-full resize-none rounded-2xl border border-[#5a9e8a]/40 bg-white/90 p-3 text-sm text-deep outline-none focus:border-[#1f5c4a]"
          />
        </div>
      </div>
    </div>
  );
}

