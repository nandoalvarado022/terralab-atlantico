import { ImagePlus } from "lucide-react";

type Props = {
  valor: string;
  onCambiar: (dataUrl: string) => void;
  titulo: string;
  ayuda: string;
  alt: string;
};

export function SubirImagenEcoFluencer({ valor, onCambiar, titulo, ayuda, alt }: Props) {
  function onImagen(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCambiar(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <p className="text-xs font-extrabold tracking-widest text-primary uppercase">{titulo}</p>
      <p className="mt-2 text-sm font-bold text-deep">{ayuda}</p>
      <div className="mt-4 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-5 text-center">
        {valor ? (
          <div className="space-y-3">
            <img src={valor} alt={alt} className="mx-auto max-h-56 rounded-xl object-contain" />
            <div className="flex flex-wrap justify-center gap-2">
              <label className="cursor-pointer rounded-full bg-deep px-4 py-2 text-xs font-extrabold text-deep-foreground">
                Cambiar imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onImagen(e.target.files?.[0] ?? null)}
                />
              </label>
              <button
                type="button"
                onClick={() => onCambiar("")}
                className="rounded-full border-2 border-border px-4 py-2 text-xs font-extrabold text-muted-foreground hover:bg-muted"
              >
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer flex-col items-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" aria-hidden />
            <span className="text-sm font-extrabold">Subir imagen</span>
            <span className="text-xs text-muted-foreground">PNG, JPG o similar</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImagen(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
