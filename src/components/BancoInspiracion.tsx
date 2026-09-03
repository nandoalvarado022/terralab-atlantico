import { useMemo, useState } from "react";
import { labs, totalIdeas, type Idea } from "@/data/labs";

const accent: Record<string, { chip: string; bar: string; ring: string }> = {
  circular: {
    chip: "bg-lime text-lime-foreground",
    bar: "bg-lime",
    ring: "border-lime",
  },
  influencia: {
    chip: "bg-sun text-sun-foreground",
    bar: "bg-sun",
    ring: "border-sun",
  },
  biodiversidad: {
    chip: "bg-leaf text-leaf-foreground",
    bar: "bg-leaf",
    ring: "border-leaf",
  },
  ecotech: {
    chip: "bg-aqua text-aqua-foreground",
    bar: "bg-aqua",
    ring: "border-aqua",
  },
};

const A = (id: string) => accent[id] ?? accent["circular"]!;

type Row = Idea & { labId: string; labNombre: string; labEmoji: string };

const allRows: Row[] = labs.flatMap((lab) =>
  lab.ideas.map((idea) => ({
    ...idea,
    labId: lab.id,
    labNombre: lab.nombre,
    labEmoji: lab.emoji,
  })),
);

export function BancoInspiracion() {
  const [filtro, setFiltro] = useState<string>("todos");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allRows.filter((r) => {
      if (filtro !== "todos" && r.labId !== filtro) return false;
      if (!term) return true;
      return [r.problema, r.proyecto, r.descripcion, r.prototipo, r.indicador]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [filtro, q]);

  return (
    <section id="banco" className="scroll-mt-24 bg-sand py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-deep px-4 py-1.5 text-xs font-bold tracking-widest text-deep-foreground uppercase">
            Banco de inspiración
          </span>
          <h2 className="mt-5 text-4xl font-extrabold text-balance-tight sm:text-5xl">
            {totalIdeas} retos para encender tu iniciativa
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cada ficha parte de una problemática real del colegio y propone un proyecto
            innovador, un prototipo posible y un indicador para medir el impacto. No son
            recetas: son puntos de partida para que tu equipo diseñe algo propio.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro("todos")}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                filtro === "todos"
                  ? "border-deep bg-deep text-deep-foreground"
                  : "border-border bg-card text-foreground hover:border-deep"
              }`}
            >
              Todos los labs
            </button>
            {labs.map((lab) => (
              <button
                key={lab.id}
                onClick={() => setFiltro(lab.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                  filtro === lab.id
                    ? `${A(lab.id).ring} ${A(lab.id).chip}`
                    : "border-border bg-card text-foreground hover:border-deep"
                }`}
              >
                <span className="mr-1.5">{lab.emoji}</span>
                {lab.titulo}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar: agua, residuos, aves, datos…"
            aria-label="Buscar retos"
            className="w-full rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary lg:w-80"
          />
        </div>

        <p className="mt-5 text-sm font-bold text-muted-foreground">
          {rows.length} {rows.length === 1 ? "reto" : "retos"} visibles
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <article
              key={r.labId + r.proyecto}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card"
            >
              <div className={`h-2 w-full ${A(r.labId).bar}`} />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase ${A(r.labId).chip}`}
                >
                  {r.labEmoji} {r.labNombre}
                </span>
                <div>
                  <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase">
                    Problemática
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{r.problema}</p>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{r.proyecto}</h3>
                  {r.descripcion && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {r.descripcion}
                    </p>
                  )}
                </div>
                <dl className="mt-auto space-y-3 rounded-2xl bg-muted p-4 text-sm">
                  <div>
                    <dt className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase">
                      Prototipo posible
                    </dt>
                    <dd className="mt-0.5">{r.prototipo}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase">
                      Indicador
                    </dt>
                    <dd className="mt-0.5 font-bold text-primary">{r.indicador}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        {rows.length === 0 && (
          <p className="mt-10 rounded-3xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            No encontramos retos con esa búsqueda. Prueba con otra palabra: energía, huerta,
            cafetería, sensores.
          </p>
        )}
      </div>
    </section>
  );
}
