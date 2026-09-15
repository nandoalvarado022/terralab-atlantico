import { useEffect } from "react";

import { FileUploader } from "@/components/commons/FileUploader";
import { Checkbox } from "@/components/ui/checkbox";
import {
  clavesBiodiversidadViva,
  intervencionesDiseno,
  sugerenciasDisenoDesdeDefinir,
  type IntervencionDiseno,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

function CampoRecuperado({
  id,
  etiqueta,
  color,
  valor,
  onCambiar,
  className = "",
}: {
  id: string;
  etiqueta: string;
  color: string;
  valor: string;
  onCambiar: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 bg-transparent px-0 py-1 text-sm outline-none"
        style={{ borderColor: `${color}55`, color }}
      />
    </div>
  );
}

/** Misión 4 · punto 1: recuperar el reto antes de dibujar (precarga desde Definir). */
function RecuperenElReto({ respuestas, onCambiar }: MisionProps) {
  useEffect(() => {
    const sugeridas = sugerenciasDisenoDesdeDefinir(respuestas);
    for (const [clave, sugerido] of Object.entries(sugeridas)) {
      const actual = respuestas[clave]?.trim() ?? "";
      if (!actual && sugerido) onCambiar(clave, sugerido);
    }
  }, [
    respuestas[clavesBiodiversidadViva.oportunidadEspacio],
    respuestas[clavesBiodiversidadViva.oportunidadCondicion],
    respuestas[clavesBiodiversidadViva.oportunidadBeneficiario],
    respuestas[clavesBiodiversidadViva.oportunidadRiesgo],
    respuestas[clavesBiodiversidadViva.oportunidadIndicador],
    respuestas[clavesBiodiversidadViva.objetivoEcologico],
    respuestas[clavesBiodiversidadViva.objetivoPedagogico],
    respuestas[clavesBiodiversidadViva.activosConservar],
    respuestas[clavesBiodiversidadViva.diagnosticoSitio("sostiene-vida")],
    respuestas[clavesBiodiversidadViva.diagnosticoSitio("verificar")],
    respuestas[clavesBiodiversidadViva.datoConsultar],
    respuestas[clavesBiodiversidadViva.disenoRetoDefinido],
    respuestas[clavesBiodiversidadViva.disenoObjetivoEcologico],
    respuestas[clavesBiodiversidadViva.disenoObjetivoPedagogico],
    respuestas[clavesBiodiversidadViva.disenoEvidenciaSitio],
    respuestas[clavesBiodiversidadViva.disenoDatoVerificar],
    onCambiar,
  ]);

  return (
    <div className="space-y-4">
      <header className="flex items-start gap-3 border-b-2 border-[#3d8b5c] pb-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d8b5c] text-sm font-extrabold text-white"
          aria-hidden
        >
          1
        </span>
        <h3 className="pt-1.5 text-sm font-extrabold tracking-wide text-[#3d8b5c] uppercase sm:text-base">
          Recuperen el reto antes de dibujar
        </h3>
      </header>

      <article className="rounded-2xl border-2 border-[#7cbc8f] bg-[#eaf5ee] p-4 sm:p-5">
        <div className="space-y-4">
          <CampoRecuperado
            id={clavesBiodiversidadViva.disenoRetoDefinido}
            etiqueta="Reto definido"
            color="#2d6a4f"
            valor={respuestas[clavesBiodiversidadViva.disenoRetoDefinido] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoRetoDefinido, v)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <CampoRecuperado
              id={clavesBiodiversidadViva.disenoObjetivoEcologico}
              etiqueta="Objetivo ecológico"
              color="#2d6a4f"
              valor={respuestas[clavesBiodiversidadViva.disenoObjetivoEcologico] ?? ""}
              onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoObjetivoEcologico, v)}
            />
            <CampoRecuperado
              id={clavesBiodiversidadViva.disenoObjetivoPedagogico}
              etiqueta="Objetivo pedagógico"
              color="#7b5ea7"
              valor={respuestas[clavesBiodiversidadViva.disenoObjetivoPedagogico] ?? ""}
              onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoObjetivoPedagogico, v)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CampoRecuperado
              id={clavesBiodiversidadViva.disenoEvidenciaSitio}
              etiqueta="Evidencia del sitio"
              color="#3b82c4"
              valor={respuestas[clavesBiodiversidadViva.disenoEvidenciaSitio] ?? ""}
              onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoEvidenciaSitio, v)}
            />
            <CampoRecuperado
              id={clavesBiodiversidadViva.disenoDatoVerificar}
              etiqueta="Dato por verificar"
              color="#e07a3d"
              valor={respuestas[clavesBiodiversidadViva.disenoDatoVerificar] ?? ""}
              onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoDatoVerificar, v)}
            />
          </div>
        </div>
      </article>
    </div>
  );
}

function rolIntervencion(
  id: string,
  principal: string,
  complementaria: string,
): "principal" | "complementaria" | null {
  if (principal === id) return "principal";
  if (complementaria === id) return "complementaria";
  return null;
}

function TarjetaIntervencion({
  intervencion,
  rol,
  deshabilitada,
  onToggle,
}: {
  intervencion: IntervencionDiseno;
  rol: "principal" | "complementaria" | null;
  deshabilitada: boolean;
  onToggle: () => void;
}) {
  const elegida = rol !== null;
  const checkId = `bv4-intervencion-check-${intervencion.id}`;

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 p-3 transition-opacity sm:p-4 ${
        deshabilitada ? "opacity-45" : ""
      }`}
      style={{
        borderColor: elegida ? intervencion.color : `${intervencion.color}66`,
        backgroundColor: intervencion.fondo,
      }}
    >
      <h4
        className="text-sm font-extrabold tracking-wide uppercase"
        style={{ color: intervencion.color }}
      >
        {intervencion.titulo}
      </h4>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-[#3d4a3d]">
        {intervencion.descripcion}
      </p>
      {elegida && (
        <p
          className="mt-2 text-[10px] font-extrabold tracking-wider uppercase"
          style={{ color: intervencion.color }}
        >
          {rol === "principal" ? "Principal" : "Complementaria"}
        </p>
      )}
      <label
        htmlFor={checkId}
        className={`mt-3 flex items-center justify-end gap-2 text-xs font-bold ${
          deshabilitada ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ color: intervencion.color }}
      >
        <span>elegido</span>
        <Checkbox
          id={checkId}
          checked={elegida}
          disabled={deshabilitada}
          onCheckedChange={() => {
            if (!deshabilitada) onToggle();
          }}
          className="h-4 w-4 rounded-[2px] border-2 shadow-none data-[state=checked]:text-white"
          style={{
            borderColor: intervencion.color,
            backgroundColor: elegida ? intervencion.color : "transparent",
          }}
        />
      </label>
    </div>
  );
}

/** Misión 4 · punto 2: elegir hasta 2 intervenciones. */
function ElijanIntervencion({ respuestas, onCambiar }: MisionProps) {
  const principal = respuestas[clavesBiodiversidadViva.disenoIntervencion(1)] ?? "";
  const complementaria = respuestas[clavesBiodiversidadViva.disenoIntervencion(2)] ?? "";
  const seleccionadas = [principal, complementaria].filter(Boolean);

  function toggle(id: string) {
    if (seleccionadas.includes(id)) {
      const next = seleccionadas.filter((x) => x !== id);
      onCambiar(clavesBiodiversidadViva.disenoIntervencion(1), next[0] ?? "");
      onCambiar(clavesBiodiversidadViva.disenoIntervencion(2), next[1] ?? "");
      return;
    }
    if (seleccionadas.length >= 2) return;
    if (!principal) {
      onCambiar(clavesBiodiversidadViva.disenoIntervencion(1), id);
      return;
    }
    onCambiar(clavesBiodiversidadViva.disenoIntervencion(2), id);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-start gap-3 border-b-2 border-[#3d8b5c] pb-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d8b5c] text-sm font-extrabold text-white"
          aria-hidden
        >
          2
        </span>
        <h3 className="pt-1.5 text-sm font-extrabold tracking-wide text-[#3d8b5c] uppercase sm:text-base">
          Elijan una intervención principal y, si es necesario, una complementaria
        </h3>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {intervencionesDiseno.map((intervencion) => {
          const rol = rolIntervencion(intervencion.id, principal, complementaria);
          const deshabilitada = !rol && seleccionadas.length >= 2;
          return (
            <li key={intervencion.id}>
              <TarjetaIntervencion
                intervencion={intervencion}
                rol={rol}
                deshabilitada={deshabilitada}
                onToggle={() => toggle(intervencion.id)}
              />
            </li>
          );
        })}
      </ul>

      <p className="text-xs font-bold text-[#e07a3d]">
        Regla de diseño: combinen máximo dos opciones y expliquen cómo se conectan.
      </p>
    </div>
  );
}

/** Misión 4 · punto 3: dibujar el esquema (subir imagen). */
function DibujenElEsquema({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-4">
      <header className="flex items-start gap-3 border-b-2 border-[#3d8b5c] pb-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d8b5c] text-sm font-extrabold text-white"
          aria-hidden
        >
          3
        </span>
        <h3 className="pt-1.5 text-sm font-extrabold tracking-wide text-[#3d8b5c] uppercase sm:text-base">
          Dibujen el esquema
        </h3>
      </header>

      <FileUploader
        valor={respuestas[clavesBiodiversidadViva.disenoEsquemaImagen] ?? ""}
        onCambiar={(v) => onCambiar(clavesBiodiversidadViva.disenoEsquemaImagen, v)}
        titulo="Esquema de la propuesta"
        ayuda="Suban el dibujo o foto del esquema de la intervención."
        etiquetaSubir="Subir esquema"
        alt="Esquema de la intervención"
        variante="card"
      />
    </div>
  );
}

/** Misión 4 · Diseñar. */
export function Mision4Disenar({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-8">
      <RecuperenElReto respuestas={respuestas} onCambiar={onCambiar} />
      <ElijanIntervencion respuestas={respuestas} onCambiar={onCambiar} />
      <DibujenElEsquema respuestas={respuestas} onCambiar={onCambiar} />
    </div>
  );
}
