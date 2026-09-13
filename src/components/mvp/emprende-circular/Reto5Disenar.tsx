import { FileUploader } from "@/components/commons/FileUploader";
import {
  clavesEmprendeCircular,
  dimensionesDiseno,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

export function Reto5Disenar({ respuestas, onCambiar }: RetoProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
        {dimensionesDiseno.map((dim) => {
          const clave = clavesEmprendeCircular.diseno(dim.id);
          return (
            <div key={dim.id} className="flex flex-1 items-stretch gap-4 sm:gap-0">
              <article className="flex flex-1 flex-col items-center text-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl font-extrabold shadow-card"
                  style={{
                    backgroundColor: dim.fondo,
                    borderColor: dim.borde,
                    color: dim.color,
                  }}
                  aria-hidden
                >
                  {dim.letra}
                </div>
                <h3
                  className="mt-3 text-sm font-extrabold tracking-widest uppercase"
                  style={{ color: dim.color }}
                >
                  {dim.titulo}
                </h3>
                {/* Editar `subtitulo` en dimensionesDiseno (emprende-circular-misiones.ts) */}
                {dim.subtitulo ? (
                  <p className="mt-1 max-w-[14rem] text-xs leading-snug text-muted-foreground">
                    {dim.subtitulo}
                  </p>
                ) : null}
                <label htmlFor={clave} className="sr-only">
                  {dim.titulo}
                </label>
                <textarea
                  id={clave}
                  rows={4}
                  value={respuestas[clave] ?? ""}
                  placeholder="Escriban aquí…"
                  onChange={(e) => onCambiar(clave, e.target.value)}
                  className="mt-4 w-full resize-none rounded-2xl border-2 bg-card p-3 text-left text-sm outline-none focus:border-primary"
                  style={{ borderColor: `${dim.borde}` }}
                />
              </article>

              {dim.separadorDespues ? (
                <div
                  className="mx-1 hidden w-px shrink-0 self-stretch bg-border sm:mx-3 sm:block"
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <FileUploader
        valor={respuestas[clavesEmprendeCircular.prototipoImagen] ?? ""}
        onCambiar={(v) => onCambiar(clavesEmprendeCircular.prototipoImagen, v)}
        titulo="Foto del prototipo"
        ayuda="Suban una foto o imagen del prototipo que están diseñando."
        alt="Foto del prototipo"
        etiquetaSubir="Subir foto del prototipo"
        variante="card"
      />
    </div>
  );
}
