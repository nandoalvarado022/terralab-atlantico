import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";

type Props = {
  numero: number;
  titulo: string;
  pregunta: string;
  pista?: string;
  color: string;
  valor: string;
  onCambiar: (valor: string) => void;
  /** Índice 0-based para escalonar la animación de entrada. */
  indiceAnimacion?: number;
  /** Espera en ms entre cada tarjeta (por defecto 5). */
  retardoPorTarjetaMs?: number;
  /** Clases extra del contenedor (p. ej. ancho fijo horizontal). */
  className?: string;
  /** Acción en el encabezado (p. ej. botón de ayuda). */
  onAyuda?: () => void;
  etiquetaAyuda?: string;
  /** Contenido extra bajo el textarea. */
  pie?: ReactNode;
};

export function TarjetaEcoFluencer({
  numero,
  titulo,
  pregunta,
  pista,
  color,
  valor,
  onCambiar,
  indiceAnimacion = 0,
  retardoPorTarjetaMs = 5,
  className = "",
  onAyuda,
  etiquetaAyuda = "Ayuda",
  pie,
}: Props) {
  const campoId = `tarjeta-ef-${numero}-${titulo.replace(/\s+/g, "-").toLowerCase()}`;
  const delayMs = indiceAnimacion * retardoPorTarjetaMs;

  return (
    <article
      className={`flex min-h-64 origin-center flex-col overflow-hidden rounded-t-2xl border-[3px] bg-card motion-safe:animate-tarjeta-entrada motion-reduce:animate-none ${className}`}
      style={{
        borderColor: color,
        animationDelay: `${delayMs}ms`,
      }}
    >
      <header
        className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4"
        style={{ backgroundColor: color }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold"
          style={{ color }}
          aria-hidden
        >
          {numero}
        </span>
        <h3 className="min-w-0 flex-1 text-sm font-extrabold tracking-wide text-white uppercase sm:text-base">
          {titulo}
        </h3>
        {onAyuda && (
          <button
            type="button"
            onClick={onAyuda}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase hover:bg-white/25"
            aria-label={etiquetaAyuda}
          >
            <CircleHelp className="h-3.5 w-3.5" aria-hidden />
            {etiquetaAyuda}
          </button>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <label htmlFor={campoId} className="text-sm font-bold text-deep">
          {pregunta}
        </label>
        <textarea
          id={campoId}
          rows={4}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          className="min-h-24 w-full flex-1 resize-y rounded-xl border-0 bg-transparent p-0 text-sm outline-none focus:ring-0"
        />
        {pista && <p className="text-xs text-deep/80 italic">{pista}</p>}
        {pie}
      </div>
    </article>
  );
}
