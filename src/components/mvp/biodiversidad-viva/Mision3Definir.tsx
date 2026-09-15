import {
  camposIndicadorPrincipal,
  clavesBiodiversidadViva,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

function EncabezadoNumero({
  numero,
  titulo,
  color,
}: {
  numero: number;
  titulo: string;
  color: string;
}) {
  return (
    <header className="flex items-start gap-3 border-b-2 pb-3" style={{ borderColor: color }}>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {numero}
      </span>
      <h3
        className="pt-1.5 text-sm font-extrabold tracking-wide uppercase sm:text-base"
        style={{ color }}
      >
        {titulo}
      </h3>
    </header>
  );
}

function CampoSitio({
  id,
  titulo,
  ayuda,
  color,
  fondo,
  borde,
  valor,
  onCambiar,
}: {
  id: string;
  titulo: string;
  ayuda: string;
  color: string;
  fondo: string;
  borde: string;
  valor: string;
  onCambiar: (v: string) => void;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border-2 p-4 sm:p-5"
      style={{ borderColor: borde, backgroundColor: fondo }}
    >
      <label htmlFor={id} className="text-sm font-extrabold tracking-wide uppercase" style={{ color }}>
        {titulo}
      </label>
      <p className="mt-2 text-xs leading-relaxed text-[#4a5a4a]">{ayuda}</p>
      <textarea
        id={id}
        rows={5}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-3 min-h-[7rem] flex-1 w-full resize-none border-0 bg-transparent px-0 py-1 text-sm outline-none"
        style={{
          color,
          backgroundImage: `repeating-linear-gradient(transparent, transparent 1.45rem, ${borde}66 1.45rem, ${borde}66 calc(1.45rem + 1px))`,
          backgroundAttachment: "local",
          lineHeight: "1.5rem",
        }}
      />
    </div>
  );
}

function CampoLinea({
  id,
  etiqueta,
  valor,
  onCambiar,
  color,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <label htmlFor={id} className="shrink-0 text-sm font-extrabold" style={{ color }}>
        {etiqueta}:
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="min-w-[8rem] flex-1 border-0 border-b-2 bg-transparent px-1 py-0.5 text-sm outline-none"
        style={{ borderColor: `${color}55`, color }}
      />
    </div>
  );
}

/** Misión 3 · punto 2: leer el sitio como relación vida–condiciones–personas. */
function LeanElSitio({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-4">
      <EncabezadoNumero
        numero={2}
        titulo="Lean el sitio como una relación entre vida, condiciones y personas"
        color="#2d6a6a"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CampoSitio
          id={clavesBiodiversidadViva.activosConservar}
          titulo="Activos que debemos conservar o visibilizar"
          ayuda="Especies, refugios, sombra, suelo vivo, polinización, conectividad, aprendizaje u otros."
          color="#3d8b5c"
          fondo="#eaf5ee"
          borde="#7cbc8f"
          valor={respuestas[clavesBiodiversidadViva.activosConservar] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.activosConservar, v)}
        />
        <CampoSitio
          id={clavesBiodiversidadViva.vaciosAmenazas}
          titulo="Vacíos, degradación o amenazas"
          ayuda="Ausencia de cobertura, pisoteo, basura, ruido, riesgo, poca información u otros."
          color="#c45c5c"
          fondo="#fceeee"
          borde="#e8a0a0"
          valor={respuestas[clavesBiodiversidadViva.vaciosAmenazas] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.vaciosAmenazas, v)}
        />
      </div>
    </div>
  );
}

/** Misión 3 · Formulen la oportunidad en una sola frase. */
function FormulenLaOportunidad({ respuestas, onCambiar }: MisionProps) {
  const hueco =
    "min-w-[8rem] max-w-full flex-1 border-0 border-b-2 border-[#1f4d5a]/35 bg-transparent px-1 py-0.5 text-sm font-bold text-[#1f4d5a] outline-none focus:border-[#e07a3d] sm:min-w-[10rem]";

  return (
    <div className="space-y-3">
      <h3 className="border-b-2 border-[#e07a3d] pb-2 text-sm font-extrabold tracking-wide text-[#e07a3d] uppercase sm:text-base">
        Formulen la oportunidad en una sola frase
      </h3>

      <article className="rounded-2xl border-2 border-[#e8a86a] bg-[#fff8e8] p-4 sm:p-5">
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2 text-sm font-bold leading-relaxed text-[#1f4d5a] sm:text-base">
          <span>En</span>
          <label className="sr-only" htmlFor={clavesBiodiversidadViva.oportunidadEspacio}>
            Espacio
          </label>
          <input
            id={clavesBiodiversidadViva.oportunidadEspacio}
            type="text"
            placeholder="[espacio]"
            value={respuestas[clavesBiodiversidadViva.oportunidadEspacio] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.oportunidadEspacio, e.target.value)}
            className={hueco}
          />
          <span>, mejoraremos o visibilizaremos</span>
          <label className="sr-only" htmlFor={clavesBiodiversidadViva.oportunidadCondicion}>
            Condición o grupo
          </label>
          <input
            id={clavesBiodiversidadViva.oportunidadCondicion}
            type="text"
            placeholder="[condición o grupo]"
            value={respuestas[clavesBiodiversidadViva.oportunidadCondicion] ?? ""}
            onChange={(e) =>
              onCambiar(clavesBiodiversidadViva.oportunidadCondicion, e.target.value)
            }
            className={hueco}
          />
          <span>para</span>
          <label className="sr-only" htmlFor={clavesBiodiversidadViva.oportunidadBeneficiario}>
            Beneficiario
          </label>
          <input
            id={clavesBiodiversidadViva.oportunidadBeneficiario}
            type="text"
            placeholder="[beneficiario]"
            value={respuestas[clavesBiodiversidadViva.oportunidadBeneficiario] ?? ""}
            onChange={(e) =>
              onCambiar(clavesBiodiversidadViva.oportunidadBeneficiario, e.target.value)
            }
            className={hueco}
          />
          <span>, sin</span>
          <label className="sr-only" htmlFor={clavesBiodiversidadViva.oportunidadRiesgo}>
            Riesgo
          </label>
          <input
            id={clavesBiodiversidadViva.oportunidadRiesgo}
            type="text"
            placeholder="[riesgo]"
            value={respuestas[clavesBiodiversidadViva.oportunidadRiesgo] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.oportunidadRiesgo, e.target.value)}
            className={hueco}
          />
          <span>, y verificaremos</span>
          <label className="sr-only" htmlFor={clavesBiodiversidadViva.oportunidadIndicador}>
            Indicador
          </label>
          <input
            id={clavesBiodiversidadViva.oportunidadIndicador}
            type="text"
            placeholder="[indicador]"
            value={respuestas[clavesBiodiversidadViva.oportunidadIndicador] ?? ""}
            onChange={(e) =>
              onCambiar(clavesBiodiversidadViva.oportunidadIndicador, e.target.value)
            }
            className={hueco}
          />
          <span>.</span>
        </p>
      </article>
    </div>
  );
}

/** Misión 3 · Definan dos objetivos complementarios. */
function ObjetivosComplementarios({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-4">
      <EncabezadoNumero
        numero={6}
        titulo="Definan dos objetivos complementarios"
        color="#3d8b5c"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CampoSitio
          id={clavesBiodiversidadViva.objetivoEcologico}
          titulo="Objetivo ecológico"
          ayuda="¿Qué condición, especie, grupo o conocimiento ecológico cambiará o se mantendrá?"
          color="#3d8b5c"
          fondo="#eaf5ee"
          borde="#7cbc8f"
          valor={respuestas[clavesBiodiversidadViva.objetivoEcologico] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.objetivoEcologico, v)}
        />
        <CampoSitio
          id={clavesBiodiversidadViva.objetivoPedagogico}
          titulo="Objetivo pedagógico"
          ayuda="¿Qué comprenderá, observará o practicará el público gracias a la propuesta?"
          color="#7b5ea7"
          fondo="#f3e9f8"
          borde="#b89fd4"
          valor={respuestas[clavesBiodiversidadViva.objetivoPedagogico] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.objetivoPedagogico, v)}
        />
      </div>
    </div>
  );
}

/** Misión 3 · Indicador principal (sin el filtro de cuidado). */
function IndicadorPrincipal({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-4">
      <article className="rounded-2xl border-2 border-[#6ba3c9] bg-[#e8f3fb] p-4 sm:p-5 md:max-w-xl">
        <h3 className="text-sm font-extrabold tracking-wide text-[#2d6a8a] uppercase">
          Indicador principal
        </h3>
        <div className="mt-4 space-y-3">
          {camposIndicadorPrincipal.map((campo) => {
            const clave = clavesBiodiversidadViva.indicadorPrincipal(campo.id);
            return (
              <CampoLinea
                key={campo.id}
                id={clave}
                etiqueta={campo.etiqueta}
                valor={respuestas[clave] ?? ""}
                onCambiar={(v) => onCambiar(clave, v)}
                color="#2d6a8a"
              />
            );
          })}
        </div>
      </article>
    </div>
  );
}

/** Misión 3 · Definir. */
export function Mision3Definir({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-8">
      <LeanElSitio respuestas={respuestas} onCambiar={onCambiar} />
      <FormulenLaOportunidad respuestas={respuestas} onCambiar={onCambiar} />
      <ObjetivosComplementarios respuestas={respuestas} onCambiar={onCambiar} />
      <IndicadorPrincipal respuestas={respuestas} onCambiar={onCambiar} />
    </div>
  );
}
