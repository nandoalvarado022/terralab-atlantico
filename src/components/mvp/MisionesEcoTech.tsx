import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  pantallasEcoTech,
  type Campo,
  type CampoTabla,
  type Pantalla,
} from "@/data/ecotech-misiones";

type Props = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
  indice: number;
  onCambiarIndice: (indice: number) => void;
  onFinalizar: () => void;
  cargando: boolean;
};

function claveCelda(campoId: string, filaId: string, columnaId: string) {
  return `${campoId}.${filaId}.${columnaId}`;
}

function SelectorOpcion({
  opciones,
  valor,
  onCambiar,
}: {
  opciones: string[];
  valor: string;
  onCambiar: (v: string) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {opciones.map((op) => {
        const activo = valor === op;
        return (
          <button
            key={op}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onCambiar(op)}
            className={`rounded-full border-2 px-4 py-2 text-xs font-extrabold tracking-wide uppercase transition-colors ${
              activo
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {op}
          </button>
        );
      })}
    </div>
  );
}

function TablaMision({
  campo,
  respuestas,
  onCambiar,
}: {
  campo: CampoTabla;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
      {campo.ayuda && <p className="mb-3 px-2 text-sm text-muted-foreground">{campo.ayuda}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {campo.columnas.map((col) => (
              <TableHead key={col.id}>{col.etiqueta}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {campo.filas.map((fila) => (
            <TableRow key={fila.id}>
              <TableCell className="font-extrabold whitespace-nowrap">{fila.etiqueta}</TableCell>
              {campo.columnas.map((col) => {
                const clave = claveCelda(campo.id, fila.id, col.id);
                const valor = respuestas[clave] ?? "";
                return (
                  <TableCell key={col.id}>
                    {col.tipo === "opcion" ? (
                      <SelectorOpcion
                        opciones={col.opciones ?? []}
                        valor={valor}
                        onCambiar={(v) => onCambiar(clave, v)}
                      />
                    ) : (
                      <input
                        type={col.tipo === "numero" ? "number" : "text"}
                        value={valor}
                        onChange={(e) => onCambiar(clave, e.target.value)}
                        className="w-full min-w-24 rounded-xl border-2 border-border p-2 text-sm outline-none focus:border-primary"
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CampoMision({
  campo,
  respuestas,
  onCambiar,
}: {
  campo: Campo;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  if (campo.tipo === "tabla") {
    return (
      <div>
        <label className="mb-2 block text-xs font-extrabold tracking-wider uppercase">
          {campo.etiqueta}
        </label>
        <TablaMision campo={campo} respuestas={respuestas} onCambiar={onCambiar} />
      </div>
    );
  }

  const valor = respuestas[campo.id] ?? "";

  return (
    <div>
      <label
        htmlFor={`campo-${campo.id}`}
        className="block text-xs font-extrabold tracking-wider uppercase"
      >
        {campo.etiqueta}
      </label>
      {campo.ayuda && <p className="mt-1 text-sm text-muted-foreground">{campo.ayuda}</p>}
      <div className="mt-2">
        {campo.tipo === "texto" && (
          <input
            id={`campo-${campo.id}`}
            value={valor}
            onChange={(e) => onCambiar(campo.id, e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        )}
        {campo.tipo === "fecha" && (
          <input
            id={`campo-${campo.id}`}
            type="date"
            value={valor}
            onChange={(e) => onCambiar(campo.id, e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        )}
        {campo.tipo === "numero" && (
          <input
            id={`campo-${campo.id}`}
            type="number"
            value={valor}
            onChange={(e) => onCambiar(campo.id, e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        )}
        {campo.tipo === "textarea" && (
          <textarea
            id={`campo-${campo.id}`}
            rows={3}
            value={valor}
            onChange={(e) => onCambiar(campo.id, e.target.value)}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        )}
        {campo.tipo === "opcion" && (
          <SelectorOpcion
            opciones={campo.opciones}
            valor={valor}
            onCambiar={(v) => onCambiar(campo.id, v)}
          />
        )}
      </div>
    </div>
  );
}

export function MisionesEcoTech({
  respuestas,
  onCambiar,
  indice,
  onCambiarIndice,
  onFinalizar,
  cargando,
}: Props) {
  const pantalla: Pantalla | undefined = pantallasEcoTech[indice];
  if (!pantalla) return null;

  const esUltima = indice === pantallasEcoTech.length - 1;
  const esMision = pantalla.numero <= 8;

  return (
    <section className="space-y-8">
      <ol className="flex flex-wrap gap-2 print:hidden">
        {pantallasEcoTech.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => i <= indice && onCambiarIndice(i)}
              disabled={i > indice}
              className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold transition-colors ${
                i === indice
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < indice
                    ? "border-lime bg-secondary"
                    : "border-border text-muted-foreground"
              }`}
            >
              {p.numero}
            </button>
          </li>
        ))}
      </ol>

      <div>
        <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
          {esMision ? `Misión ${pantalla.numero} de 8 · ${pantalla.nombre}` : pantalla.nombre}
        </p>
        <h2 className="mt-1 text-3xl font-extrabold">{pantalla.tagline ?? pantalla.nombre}</h2>
        <p className="mt-3 text-muted-foreground">{pantalla.instrucciones}</p>
      </div>

      {pantalla.secciones.map((seccion, i) => (
        <div key={i} className="space-y-6">
          {seccion.titulo && (
            <div className="border-t border-border pt-6 first:border-0 first:pt-0">
              <h3 className="text-xl font-extrabold">{seccion.titulo}</h3>
              {seccion.instrucciones && (
                <p className="mt-1 text-sm text-muted-foreground">{seccion.instrucciones}</p>
              )}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {seccion.campos.map((campo) => (
              <div
                key={campo.id}
                className={
                  campo.tipo === "tabla" || campo.tipo === "textarea" ? "sm:col-span-2" : ""
                }
              >
                <CampoMision campo={campo} respuestas={respuestas} onCambiar={onCambiar} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onCambiarIndice(indice - 1)}
          disabled={indice === 0}
          className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary disabled:opacity-40"
        >
          Anterior
        </button>
        {esUltima ? (
          <button
            type="button"
            onClick={onFinalizar}
            disabled={cargando}
            className="rounded-full bg-deep px-7 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando ? "Redactando el MVP…" : "Crear el documento del MVP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCambiarIndice(indice + 1)}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  );
}

export function flattenRespuestasEcoTech(
  respuestas: Record<string, string>,
): { pregunta: string; respuesta: string }[] {
  const salida: { pregunta: string; respuesta: string }[] = [];

  for (const pantalla of pantallasEcoTech) {
    for (const seccion of pantalla.secciones) {
      for (const campo of seccion.campos) {
        if (campo.tipo === "tabla") {
          const partes = campo.filas
            .map((fila) => {
              const valores = campo.columnas
                .map((col) => {
                  const v = respuestas[claveCelda(campo.id, fila.id, col.id)] ?? "";
                  return v.trim() ? `${col.etiqueta}: ${v}` : null;
                })
                .filter((v): v is string => v !== null);
              return valores.length ? `${fila.etiqueta} — ${valores.join(", ")}` : null;
            })
            .filter((v): v is string => v !== null);
          if (partes.length) {
            salida.push({ pregunta: campo.etiqueta, respuesta: partes.join("; ") });
          }
        } else {
          const respuesta = respuestas[campo.id] ?? "";
          if (respuesta.trim()) {
            salida.push({ pregunta: campo.etiqueta, respuesta });
          }
        }
      }
    }
  }

  return salida;
}
