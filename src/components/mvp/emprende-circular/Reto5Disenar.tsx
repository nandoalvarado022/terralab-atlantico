import { FileUploader } from "@/components/commons/FileUploader";
import {
  camposDetalleAlternativa,
  clavesEmprendeCircular,
  dimensionesDiseno,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

function TarjetaAlternativa({
  letra,
  nombre,
  respuestas,
  onCambiar,
}: {
  letra: "a" | "b";
  nombre: string;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  const etiqueta = letra.toUpperCase();

  return (
    <article className="rounded-3xl border-2 border-[#5a9e8a] bg-[#eaf6f1] p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f5c4a] text-sm font-extrabold text-white"
          aria-hidden
        >
          {etiqueta}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold tracking-widest text-[#1f5c4a] uppercase">
            Alternativa {etiqueta}
          </h3>
          {nombre.trim() ? (
            <p className="truncate text-xs font-bold text-[#1f5c4a]/80">{nombre.trim()}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {camposDetalleAlternativa.map((campo) => {
          const clave = clavesEmprendeCircular.alternativaCampo(letra, campo.id);
          return (
            <div key={campo.id}>
              <label
                htmlFor={clave}
                className="block text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase"
              >
                {campo.titulo}
              </label>
              <p className="mt-0.5 text-xs text-[#1f5c4a]/70">{campo.pista}</p>
              <textarea
                id={clave}
                rows={campo.filas}
                value={respuestas[clave] ?? ""}
                onChange={(e) => onCambiar(clave, e.target.value)}
                className="mt-2 w-full resize-none rounded-none border-0 border-b border-[#1f5c4a]/30 bg-transparent px-0 py-1.5 text-sm text-deep outline-none focus:border-[#1f5c4a]"
              />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function Reto5Disenar({ respuestas, onCambiar }: RetoProps) {
  return (
    <div className="space-y-8">
      <TarjetaAlternativa
        letra="a"
        nombre={respuestas[clavesEmprendeCircular.alternativaA] ?? ""}
        respuestas={respuestas}
        onCambiar={onCambiar}
      />

      <div className="space-y-6">
        <p className="text-muted-foreground">
          Completen cada dimensión de diseño: función, material, tiempo y esfuerzo, y recursos.
          Coloquen el logo o marca del producto.
        </p>

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
          titulo="Logo o marca del producto"
          ayuda="Coloquen el logo o la marca del producto que están diseñando."
          alt="Logo o marca del producto"
          etiquetaSubir="Coloca logo o marca del producto"
          variante="card"
        />
      </div>
    </div>
  );
}
