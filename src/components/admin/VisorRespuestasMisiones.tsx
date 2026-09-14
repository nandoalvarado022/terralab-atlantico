import type { RespuestaMision } from "@/lib/respuestas-misiones";

function etiquetaCampo(clave: string): string {
  const sinPrefijo = clave.replace(/^(m\d+|ec\d+|ef\d+)-/, "");
  return sinPrefijo.replace(/[-_.]/g, " ");
}

export function VisorRespuestasMisiones({ misiones }: { misiones: RespuestaMision[] }) {
  return (
    <div className="space-y-6">
      {misiones.map((mision) => {
        const entradas = Object.entries(mision.campos);
        return (
          <div key={mision.id} className="rounded-3xl border border-border bg-secondary/30 p-5">
            <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
              Misión {mision.numero} · {mision.nombre}
              {mision.tagline ? ` — ${mision.tagline}` : ""}
            </p>
            {entradas.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Sin respuestas en esta misión.</p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {entradas.map(([clave, valor]) => (
                  <li key={clave} className="rounded-2xl border border-border bg-card/70 p-3">
                    <p className="text-xs font-extrabold tracking-wider uppercase">
                      {etiquetaCampo(clave)}
                    </p>
                    <p className="mt-1 text-sm break-words text-muted-foreground">{valor}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
