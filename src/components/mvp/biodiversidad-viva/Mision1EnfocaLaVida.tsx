import { Checkbox } from "@/components/ui/checkbox";
import {
  clavesBiodiversidadViva,
  nivelesCerteza,
  tiposSerVivo,
} from "@/data/biodiversidad-viva-misiones";
import { DescubreLoQueAporta } from "./DescubreLoQueAporta";
import { RevelaLaRedInvisible } from "./RevelaLaRedInvisible";
import type { MisionProps } from "./types";

function CampoSubrayado({
  id,
  etiqueta,
  valor,
  onCambiar,
  filas = 1,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  filas?: number;
}) {
  const clases =
    "mt-1 w-full resize-none border-0 border-b border-[#3d8b5c]/50 bg-transparent px-0 py-1 text-sm text-[#1f4d38] outline-none focus:border-[#2d6a4f]";

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-[#1f4d38]">
        {etiqueta}
      </label>
      {filas > 1 ? (
        <textarea
          id={id}
          rows={filas}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          className={clases}
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 1.55rem, rgba(61,139,92,0.28) 1.55rem, rgba(61,139,92,0.28) calc(1.55rem + 1px))",
            backgroundAttachment: "local",
            lineHeight: "1.6rem",
          }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          className={clases}
        />
      )}
    </div>
  );
}

function CasillaUnica({
  id,
  etiqueta,
  marcado,
  onToggle,
}: {
  id: string;
  etiqueta: string;
  marcado: boolean;
  onToggle: () => void;
}) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2">
      <Checkbox
        id={id}
        checked={marcado}
        onCheckedChange={onToggle}
        className="h-[15px] w-[15px] rounded-[2px] border-[#3d8b5c] shadow-none data-[state=checked]:bg-[#2d6a4f] data-[state=checked]:text-white"
      />
      <span className="text-sm text-[#1f4d38]">{etiqueta}</span>
    </label>
  );
}

function ZonaEvidencia({
  valor,
  onCambiar,
}: {
  valor: string;
  onCambiar: (dataUrl: string) => void;
}) {
  function onArchivo(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCambiar(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-[1.75rem] border-2 border-dashed border-[#6aaa6a] bg-[#f7fbf5]/70 px-4 py-8 text-center">
      {valor ? (
        <div className="space-y-3">
          <img
            src={valor}
            alt="Dibujo, foto o huella de la especie"
            className="mx-auto max-h-44 rounded-xl object-contain"
          />
          <div className="flex flex-wrap justify-center gap-2">
            <label className="cursor-pointer rounded-full bg-[#2d6a4f] px-3 py-1.5 text-xs font-extrabold text-white">
              Cambiar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={() => onCambiar("")}
              className="rounded-full border-2 border-[#3d8b5c]/40 px-3 py-1.5 text-xs font-extrabold text-[#1f4d38] hover:bg-white/70"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label className="inline-flex cursor-pointer flex-col items-center gap-2 py-6">
          <span className="text-lg font-extrabold tracking-wide text-[#3d8b4a] uppercase sm:text-xl">
            Dibujo / foto / huella
          </span>
          <span className="max-w-[16rem] text-xs text-[#5a8a6a]">
            No captures ni manipules la especie.
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}

function Punto1EnfocaLaVida({ respuestas, onCambiar }: MisionProps) {
  const tipoActual = respuestas[clavesBiodiversidadViva.tipo] ?? "";
  const certezaActual = respuestas[clavesBiodiversidadViva.certeza] ?? "";

  return (
    <article className="mx-auto max-w-lg overflow-hidden rounded-[2rem] border-2 border-[#4caf6a] bg-[#eef7ea] p-4 shadow-card sm:p-5">
      <header className="rounded-2xl bg-[#2d6a4f] px-5 py-3 text-center">
        <h3 className="text-sm font-extrabold tracking-[0.18em] text-white uppercase">
          1. Enfoca la vida
        </h3>
      </header>

      <div className="space-y-5 px-2 pt-5 pb-2 sm:px-4">
        <p className="text-center text-sm leading-relaxed text-[#3d6b50]">
          Elige una especie o elemento vivo registrado en el primer momento.
        </p>

        <ZonaEvidencia
          valor={respuestas[clavesBiodiversidadViva.evidenciaImagen] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.evidenciaImagen, v)}
        />

        <CampoSubrayado
          id={clavesBiodiversidadViva.nombreComun}
          etiqueta="Nombre común o descripción:"
          valor={respuestas[clavesBiodiversidadViva.nombreComun] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.nombreComun, v)}
        />

        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {tiposSerVivo.map((tipo) => (
            <li key={tipo.id}>
              <CasillaUnica
                id={`${clavesBiodiversidadViva.tipo}-${tipo.id}`}
                etiqueta={tipo.etiqueta}
                marcado={tipoActual === tipo.id}
                onToggle={() =>
                  onCambiar(clavesBiodiversidadViva.tipo, tipoActual === tipo.id ? "" : tipo.id)
                }
              />
            </li>
          ))}
        </ul>

        <CampoSubrayado
          id={clavesBiodiversidadViva.lugarMicrohabitat}
          etiqueta="Lugar exacto y microhábitat:"
          valor={respuestas[clavesBiodiversidadViva.lugarMicrohabitat] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.lugarMicrohabitat, v)}
        />

        <CampoSubrayado
          id={clavesBiodiversidadViva.pistaObservada}
          etiqueta="Pista observada: ¿qué vimos, oímos o encontramos?"
          valor={respuestas[clavesBiodiversidadViva.pistaObservada] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.pistaObservada, v)}
          filas={2}
        />

        <div className="pt-2">
          <p className="text-sm font-extrabold tracking-widest text-[#1a7a72] uppercase">
            Nivel de certeza
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {nivelesCerteza.map((nivel) => (
              <li key={nivel.id}>
                <CasillaUnica
                  id={`${clavesBiodiversidadViva.certeza}-${nivel.id}`}
                  etiqueta={nivel.etiqueta}
                  marcado={certezaActual === nivel.id}
                  onToggle={() =>
                    onCambiar(
                      clavesBiodiversidadViva.certeza,
                      certezaActual === nivel.id ? "" : nivel.id,
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        <CampoSubrayado
          id={clavesBiodiversidadViva.datoConsultar}
          etiqueta="Dato que debemos consultar:"
          valor={respuestas[clavesBiodiversidadViva.datoConsultar] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.datoConsultar, v)}
        />
      </div>
    </article>
  );
}

/** Misión 1: puntos 1 · Enfoca · 2 · Red · 3 · Aporta. */
export function Mision1EnfocaLaVida({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-8">
      <Punto1EnfocaLaVida respuestas={respuestas} onCambiar={onCambiar} />
      <RevelaLaRedInvisible respuestas={respuestas} onCambiar={onCambiar} />
      <DescubreLoQueAporta respuestas={respuestas} onCambiar={onCambiar} />
    </div>
  );
}
