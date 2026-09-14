import { ImagePlus, Video } from "lucide-react";

type Props = {
  valor: string;
  onCambiar: (dataUrl: string) => void;
  /** Texto del botón/label vacío. */
  etiquetaSubir?: string;
  /** Texto del botón cuando ya hay archivo. */
  etiquetaCambiar?: string;
  /** Ayuda bajo el CTA (ej. “PNG, JPG o similar”). */
  pista?: string;
  alt?: string;
  accept?: string;
  /** Título opcional encima del área (estilo tarjeta completa). */
  titulo?: string;
  /** Descripción opcional bajo el título. */
  ayuda?: string;
  /** compact = solo el dashed box; card = con borde de tarjeta + título. */
  variante?: "compact" | "card";
  className?: string;
  maxHeightClass?: string;
};

function esVideoDataUrl(valor: string) {
  return /^data:video\//i.test(valor) || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(valor);
}

export function FileUploader({
  valor,
  onCambiar,
  etiquetaSubir = "Subir imagen",
  etiquetaCambiar = "Cambiar imagen",
  pista = "PNG, JPG o similar",
  alt = "Archivo subido",
  accept = "image/*",
  titulo,
  ayuda,
  variante = "card",
  className = "",
  maxHeightClass = "max-h-56",
}: Props) {
  function onArchivo(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCambiar(String(reader.result));
    reader.readAsDataURL(file);
  }

  const muestraVideo = Boolean(valor) && esVideoDataUrl(valor);
  const Icono =
    accept.includes("video") && accept.includes("image")
      ? ImagePlus
      : accept.includes("video")
        ? Video
        : ImagePlus;

  const area = (
    <div
      className={`rounded-2xl border-2 border-dashed p-5 text-center ${
        variante === "compact"
          ? "border-deep/25 bg-background/70 p-4"
          : "border-border bg-muted/40"
      }`}
    >
      {valor ? (
        <div className="space-y-3">
          {muestraVideo ? (
            <video
              src={valor}
              controls
              className={`mx-auto rounded-xl object-contain ${
                variante === "compact" ? "max-h-40" : maxHeightClass
              }`}
            >
              Tu navegador no reproduce este video.
            </video>
          ) : (
            <img
              src={valor}
              alt={alt}
              className={`mx-auto rounded-xl object-contain ${
                variante === "compact" ? "max-h-40" : maxHeightClass
              }`}
            />
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <label
              className={`cursor-pointer rounded-full bg-deep font-extrabold text-deep-foreground ${
                variante === "compact" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs"
              }`}
            >
              {variante === "compact" ? "Cambiar" : etiquetaCambiar}
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={() => onCambiar("")}
              className={`rounded-full border-2 border-border font-extrabold text-muted-foreground hover:bg-muted ${
                variante === "compact" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs"
              }`}
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`inline-flex cursor-pointer flex-col items-center ${
            variante === "compact" ? "gap-1.5 py-2" : "gap-2"
          }`}
        >
          <Icono
            className={variante === "compact" ? "h-7 w-7 text-muted-foreground" : "h-8 w-8 text-muted-foreground"}
            aria-hidden
          />
          <span className={variante === "compact" ? "text-xs font-extrabold" : "text-sm font-extrabold"}>
            {etiquetaSubir}
          </span>
          {pista ? (
            <span
              className={
                variante === "compact" ? "text-[11px] text-muted-foreground" : "text-xs text-muted-foreground"
              }
            >
              {pista}
            </span>
          ) : null}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );

  if (variante === "compact") {
    return <div className={className}>{area}</div>;
  }

  return (
    <div className={`rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6 ${className}`}>
      {titulo ? (
        <p className="text-xs font-extrabold tracking-widest text-primary uppercase">{titulo}</p>
      ) : null}
      {ayuda ? <p className="mt-2 text-sm font-bold text-deep">{ayuda}</p> : null}
      <div className={titulo || ayuda ? "mt-4" : undefined}>{area}</div>
    </div>
  );
}
