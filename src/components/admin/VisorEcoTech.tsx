import { pantallasEcoTech, type Campo, type CampoTabla } from "@/data/ecotech-misiones";

function claveCelda(campoId: string, filaId: string, columnaId: string) {
  return `${campoId}.${filaId}.${columnaId}`;
}

function TablaLectura({
  campo,
  respuestas,
}: {
  campo: CampoTabla;
  respuestas: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/60">
            <th className="p-2 text-left font-extrabold"></th>
            {campo.columnas.map((col) => (
              <th key={col.id} className="p-2 text-left font-extrabold">
                {col.etiqueta}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campo.filas.map((fila) => (
            <tr key={fila.id} className="border-t border-border">
              <td className="p-2 font-extrabold whitespace-nowrap">{fila.etiqueta}</td>
              {campo.columnas.map((col) => {
                const valor = respuestas[claveCelda(campo.id, fila.id, col.id)] ?? "";
                return (
                  <td key={col.id} className="p-2 text-muted-foreground">
                    {valor.trim() || "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CampoLectura({ campo, respuestas }: { campo: Campo; respuestas: Record<string, string> }) {
  if (campo.tipo === "tabla") {
    return (
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-extrabold tracking-wider uppercase">{campo.etiqueta}</p>
        <TablaLectura campo={campo} respuestas={respuestas} />
      </div>
    );
  }

  const valor = respuestas[campo.id] ?? "";

  return (
    <div>
      <p className="text-xs font-extrabold tracking-wider uppercase">{campo.etiqueta}</p>
      <p className="mt-1 text-sm text-muted-foreground">{valor.trim() || "— sin respuesta —"}</p>
    </div>
  );
}

export function VisorEcoTech({ respuestas }: { respuestas: Record<string, string> }) {
  return (
    <div className="space-y-6">
      {pantallasEcoTech.map((pantalla) => (
        <div key={pantalla.id} className="rounded-3xl border border-border bg-secondary/30 p-5">
          <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
            {pantalla.numero <= 8 ? `Misión ${pantalla.numero} de 8` : "Después del lab"} ·{" "}
            {pantalla.nombre}
          </p>
          <div className="mt-4 space-y-5">
            {pantalla.secciones.map((seccion, i) => (
              <div key={i} className="space-y-3">
                {seccion.titulo && <h4 className="font-extrabold">{seccion.titulo}</h4>}
                <div className="grid gap-4 sm:grid-cols-2">
                  {seccion.campos.map((campo) => (
                    <CampoLectura key={campo.id} campo={campo} respuestas={respuestas} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
