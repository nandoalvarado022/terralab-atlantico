import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { labs } from "@/data/labs";
import {
  construirMvp,
  generarPreguntas,
  transcribirCanvas,
  type CanvasData,
  type Pregunta,
} from "@/lib/mvp.functions";
import { EcoFluencerQuestions, flattenRespuestasEcoFluencer } from "./EcoFluencerQuestions";
import { MisionesEcoTech, flattenRespuestasEcoTech } from "./MisionesEcoTech";

const CANVAS_VACIO: CanvasData = {
  colegio: "",
  brigada: "",
  lema: "",
  integrantes: "",
  pistas: "",
  desafio: "",
  ideaSemilla: "",
  lab: "ecotech",
};

const CAMPOS: Array<{ key: keyof CanvasData; label: string; hint: string; area?: boolean }> = [
  { key: "colegio", label: "Colegio", hint: "Ej. Marymount School Barranquilla" },
  { key: "brigada", label: "Nombre de la brigada", hint: "Ej. Los Marineros" },
  { key: "lema", label: "Lema de la brigada", hint: "Ej. Cuidando todo, hasta más allá del mar" },
  {
    key: "integrantes",
    label: "Terranautas y roles",
    hint: "Nombre — rol, separados por comas",
    area: true,
  },
  {
    key: "pistas",
    label: "Pistas del safari",
    hint: "Los hallazgos del recorrido, separados por punto y coma",
    area: true,
  },
  { key: "desafio", label: "Desafío elegido", hint: "El reto que decidieron resolver", area: true },
  {
    key: "ideaSemilla",
    label: "Idea semilla",
    hint: "La solución que imaginaron en el canvas",
    area: true,
  },
];

const STORAGE_KEY = "terralab-forja-mvp";

type Resultado = { nombre: string; documento: string; prompt: string };

type Guardado = {
  paso: number;
  canvas: CanvasData;
  preguntas: Pregunta[];
  respuestas: Record<string, string>;
  respuestasEcoTech: Record<string, string>;
  respuestasEcoFluencer: Record<string, string>;
  misionIndice: number;
  resultado: Resultado | null;
};

function fileSlug(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "mvp-terralab"
  );
}

export function ForjaMvp() {
  const [paso, setPaso] = useState(1);
  const [canvas, setCanvas] = useState<CanvasData>(CANVAS_VACIO);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [respuestasEcoTech, setRespuestasEcoTech] = useState<Record<string, string>>({});
  const [respuestasEcoFluencer, setRespuestasEcoFluencer] = useState<Record<string, string>>({});
  const [misionIndice, setMisionIndice] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [cargando, setCargando] = useState<null | "foto" | "preguntas" | "mvp">(null);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [hidratado, setHidratado] = useState(false);

  const transcribir = useServerFn(transcribirCanvas);
  const preguntar = useServerFn(generarPreguntas);
  const construir = useServerFn(construirMvp);

  const esEcoTech = canvas.lab === "ecotech";
  const esEcoFluencer = canvas.lab === "influencia";
  const esMisiones = esEcoTech || esEcoFluencer;

  const pasos = useMemo(
    () => [
      "Cargar el canvas",
      "Elegir lab y enfoque",
      esMisiones ? "Recorrer las misiones" : "Preguntas del PRD",
      "MVP final",
      "Llevarlo a Lovable",
    ],
    [esMisiones],
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const g = JSON.parse(raw) as Guardado;
        setPaso(g.paso ?? 1);
        setCanvas({ ...CANVAS_VACIO, ...g.canvas });
        setPreguntas(g.preguntas ?? []);
        setRespuestas(g.respuestas ?? {});
        setRespuestasEcoTech(g.respuestasEcoTech ?? {});
        setRespuestasEcoFluencer(g.respuestasEcoFluencer ?? {});
        setMisionIndice(g.misionIndice ?? 0);
        setResultado(g.resultado ?? null);
      }
    } catch {
      // sesión sin datos válidos
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    const g: Guardado = {
      paso,
      canvas,
      preguntas,
      respuestas,
      respuestasEcoTech,
      respuestasEcoFluencer,
      misionIndice,
      resultado,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(g));
    } catch {
      // cuota llena: el avance sigue en memoria
    }
  }, [
    hidratado,
    paso,
    canvas,
    preguntas,
    respuestas,
    respuestasEcoTech,
    respuestasEcoFluencer,
    misionIndice,
    resultado,
  ]);

  const labActual = useMemo(
    () => labs.find((l) => l.id === canvas.lab) ?? labs[labs.length - 1]!,
    [canvas.lab],
  );

  const sugerencias = useMemo(() => {
    const texto = `${canvas.desafio} ${canvas.ideaSemilla} ${canvas.pistas}`.toLowerCase();
    const palabras = texto.split(/[^a-záéíóúñ]+/i).filter((w) => w.length > 4);
    return [...labActual.ideas]
      .map((idea) => {
        const blob = `${idea.problema} ${idea.proyecto} ${idea.descripcion}`.toLowerCase();
        const score = palabras.reduce((n, w) => (blob.includes(w) ? n + 1 : n), 0);
        return { idea, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.idea);
  }, [labActual, canvas.desafio, canvas.ideaSemilla, canvas.pistas]);

  function fallar(e: unknown) {
    setError(
      e instanceof Error && e.message
        ? e.message
        : "No pudimos completar el paso. Intenta de nuevo en unos segundos.",
    );
  }

  async function onFotos(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setCargando("foto");
    try {
      const imagenes = await Promise.all(
        Array.from(files)
          .slice(0, 3)
          .map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result));
                reader.onerror = () => reject(new Error("No pudimos leer la imagen."));
                reader.readAsDataURL(file);
              }),
          ),
      );
      const data = await transcribir({ data: { imagenes } });
      setCanvas((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(data).filter(([, v]) => typeof v === "string" && v.trim()),
        ),
      }));
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  async function pedirPreguntas() {
    setError(null);
    setCargando("preguntas");
    try {
      const data = await preguntar({ data: { canvas } });
      setPreguntas(data);
      setRespuestas(Object.fromEntries(data.map((q) => [q.id, q.sugerencia])));
      setPaso(3);
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  async function pedirMvp(respuestasParaConstruir: { pregunta: string; respuesta: string }[]) {
    setError(null);
    setCargando("mvp");
    try {
      const data = await construir({
        data: {
          canvas,
          respuestas: respuestasParaConstruir,
          respuestasEcoTech: esEcoTech ? respuestasEcoTech : undefined,
        },
      });
      setResultado(data);
      setPaso(4);
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  async function copiar(texto: string, etiqueta: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(etiqueta);
      setTimeout(() => setCopiado(null), 2200);
    } catch {
      setError("Tu navegador no permitió copiar. Selecciona el texto y cópialo a mano.");
    }
  }

  function descargar(texto: string, nombre: string, mime: string) {
    const blob = new Blob([texto], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reiniciar() {
    setPaso(1);
    setCanvas(CANVAS_VACIO);
    setPreguntas([]);
    setRespuestas({});
    setRespuestasEcoTech({});
    setRespuestasEcoFluencer({});
    setMisionIndice(0);
    setResultado(null);
    setError(null);
  }

  const puedeAvanzar = canvas.desafio.trim().length > 3 || canvas.ideaSemilla.trim().length > 3;

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <ol className="mb-10 flex flex-wrap gap-2 print:hidden">
        {pasos.map((p, i) => {
          const n = i + 1;
          const activo = n === paso;
          const hecho = n < paso;
          return (
            <li key={p}>
              <button
                type="button"
                onClick={() => n <= paso && setPaso(n)}
                disabled={n > paso}
                className={`rounded-full border-2 px-4 py-2 text-xs font-extrabold tracking-wide uppercase transition-colors ${
                  activo
                    ? "border-primary bg-primary text-primary-foreground"
                    : hecho
                      ? "border-lime bg-secondary"
                      : "border-border text-muted-foreground"
                }`}
              >
                {n}. {p}
              </button>
            </li>
          );
        })}
      </ol>

      {error && (
        <div
          role="alert"
          className="mb-8 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-5 text-sm font-bold print:hidden"
        >
          {error}
        </div>
      )}

      {paso === 1 && (
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold">1. Carga el canvas de la brigada</h2>
            <p className="mt-3 text-muted-foreground">
              Toma foto del canvas <strong>Expedición TerraLAB</strong> y del{" "}
              <strong>Pase al Día 2</strong>: la IA transcribe lo escrito a marcador. También puedes
              escribirlo a mano si la letra no se lee.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-lime bg-secondary/60 p-7 text-center">
            <p className="font-extrabold">Subir foto del canvas (hasta 3 imágenes)</p>
            <p className="mt-1 text-sm text-muted-foreground">
              La foto solo se usa para transcribir el canvas; no se guarda.
            </p>
            <label className="mt-5 inline-block cursor-pointer rounded-full bg-deep px-6 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5">
              {cargando === "foto" ? "Transcribiendo…" : "Elegir fotos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={cargando === "foto"}
                onChange={(e) => onFotos(e.target.files)}
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {CAMPOS.map((c) => (
              <div key={c.key} className={c.area ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={`campo-${c.key}`}
                  className="text-xs font-extrabold tracking-wider uppercase"
                >
                  {c.label}
                </label>
                {c.area ? (
                  <textarea
                    id={`campo-${c.key}`}
                    rows={3}
                    value={canvas[c.key]}
                    placeholder={c.hint}
                    onChange={(e) => setCanvas({ ...canvas, [c.key]: e.target.value })}
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
                  />
                ) : (
                  <input
                    id={`campo-${c.key}`}
                    value={canvas[c.key]}
                    placeholder={c.hint}
                    onChange={(e) => setCanvas({ ...canvas, [c.key]: e.target.value })}
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPaso(2)}
              disabled={!puedeAvanzar}
              className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Continuar al lab
            </button>
            {!puedeAvanzar && (
              <span className="text-sm text-muted-foreground">
                Escribe al menos el desafío o la idea semilla.
              </span>
            )}
          </div>
        </section>
      )}

      {paso === 2 && (
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold">2. Elige el lab y su enfoque</h2>
            <p className="mt-3 text-muted-foreground">
              El lab define qué tipo de MVP van a construir y qué preguntas hará la herramienta.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {labs.map((lab) => {
              const activo = lab.id === canvas.lab;
              return (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => {
                    if (lab.id === canvas.lab) return;
                    setCanvas({ ...canvas, lab: lab.id });
                    setMisionIndice(0);
                  }}
                  className={`rounded-3xl border-2 p-6 text-left transition-colors ${
                    activo ? "border-primary bg-secondary" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <span className="text-2xl">{lab.emoji}</span>
                  <p className="mt-3 text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
                    {lab.nombre}
                  </p>
                  <h3 className="text-xl font-extrabold">{lab.titulo}</h3>
                  <p className="mt-1 text-sm font-bold text-primary">{lab.claim}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{lab.foco}</p>
                </button>
              );
            })}
          </div>

          {sugerencias.length > 0 && (
            <div className="rounded-3xl bg-sand p-6">
              <h3 className="text-sm font-extrabold tracking-widest uppercase">
                Del banco de inspiración, cercano a su desafío
              </h3>
              <ul className="mt-4 space-y-4">
                {sugerencias.map((idea) => (
                  <li key={idea.proyecto} className="border-l-2 border-lime pl-4">
                    <p className="font-extrabold">{idea.proyecto}</p>
                    <p className="text-sm text-muted-foreground">{idea.problema}</p>
                    <p className="mt-1 text-xs font-extrabold tracking-wider uppercase">
                      Indicador: {idea.indicador}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {esEcoTech ? (
              <button
                type="button"
                onClick={() => setPaso(3)}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
              >
                Continuar a las misiones
              </button>
            ) : esEcoFluencer ? (
              <button
                type="button"
                onClick={() => setPaso(3)}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
              >
                Continuar con las misiones
              </button>
            ) : (
              <button
                type="button"
                onClick={pedirPreguntas}
                disabled={cargando === "preguntas"}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {cargando === "preguntas"
                  ? "Preparando preguntas…"
                  : "Generar las preguntas del PRD"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary"
            >
              Volver al canvas
            </button>
          </div>
        </section>
      )}

      {paso === 3 && esEcoTech && (
        <MisionesEcoTech
          respuestas={respuestasEcoTech}
          onCambiar={(k, v) => setRespuestasEcoTech({ ...respuestasEcoTech, [k]: v })}
          indice={misionIndice}
          onCambiarIndice={setMisionIndice}
          onFinalizar={() => pedirMvp(flattenRespuestasEcoTech(respuestasEcoTech))}
          cargando={cargando === "mvp"}
        />
      )}

      {paso === 3 && esEcoFluencer && (
        <EcoFluencerQuestions
          respuestas={respuestasEcoFluencer}
          onCambiar={(k, v) => setRespuestasEcoFluencer((prev) => ({ ...prev, [k]: v }))}
          indice={misionIndice}
          onCambiarIndice={setMisionIndice}
          onFinalizar={() => pedirMvp(flattenRespuestasEcoFluencer(respuestasEcoFluencer))}
          cargando={cargando === "mvp"}
        />
      )}

      {paso === 3 && !esMisiones && (
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold">3. Contesten lo que falta del PRD</h2>
            <p className="mt-3 text-muted-foreground">
              Cada pregunta llega con una respuesta sugerida: acéptenla o reescríbanla con las
              palabras de la brigada.
            </p>
          </div>

          <ol className="space-y-6">
            {preguntas.map((q, i) => (
              <li key={q.id} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
                  Pregunta {i + 1}
                </p>
                <label htmlFor={`q-${q.id}`} className="mt-2 block text-lg font-extrabold">
                  {q.pregunta}
                </label>
                <p className="mt-1 text-sm text-muted-foreground">{q.ayuda}</p>
                <textarea
                  id={`q-${q.id}`}
                  rows={3}
                  value={respuestas[q.id] ?? ""}
                  onChange={(e) => setRespuestas({ ...respuestas, [q.id]: e.target.value })}
                  className="mt-3 w-full rounded-2xl border-2 border-border p-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setRespuestas({ ...respuestas, [q.id]: q.sugerencia })}
                  className="mt-2 text-xs font-extrabold underline decoration-2 underline-offset-4 hover:text-primary"
                >
                  Usar la respuesta sugerida
                </button>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                pedirMvp(
                  preguntas.map((q) => ({
                    pregunta: q.pregunta,
                    respuesta: respuestas[q.id] ?? "",
                  })),
                )
              }
              disabled={cargando === "mvp"}
              className="rounded-full bg-deep px-7 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {cargando === "mvp" ? "Redactando el MVP…" : "Crear el documento del MVP"}
            </button>
            <button
              type="button"
              onClick={() => setPaso(2)}
              className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary"
            >
              Volver
            </button>
          </div>
        </section>
      )}

      {paso >= 4 && resultado && (
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold">
              {paso === 4 ? "4. El MVP de la brigada" : "5. Llévenlo a Lovable"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {paso === 4
                ? "Revisen el documento. Es el PRD que Lovable usará para construir el prototipo."
                : "Copien el prompt, ábranlo en Lovable y hagan vibecoding con su prototipo."}
            </p>
          </div>

          <article className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
              {labActual.nombre} · {canvas.brigada || "Brigada"}
            </p>
            <h3 className="mt-1 text-2xl font-extrabold">{resultado.nombre}</h3>
            <pre className="mt-5 overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap">
              {resultado.documento}
            </pre>
          </article>

          <div className="rounded-3xl bg-deep p-7 text-deep-foreground print:hidden">
            <h3 className="text-xl font-extrabold">Prompt para Lovable</h3>
            <pre className="mt-4 max-h-80 overflow-auto text-sm leading-relaxed whitespace-pre-wrap opacity-90">
              {resultado.prompt}
            </pre>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => copiar(resultado.prompt, "prompt")}
                className="rounded-full bg-lime px-6 py-3 font-extrabold text-lime-foreground"
              >
                {copiado === "prompt" ? "¡Copiado!" : "Copiar prompt"}
              </button>
              <button
                type="button"
                onClick={() =>
                  descargar(
                    `${resultado.documento}\n\n---\n\n## Prompt para Lovable\n\n${resultado.prompt}\n`,
                    `mvp-${fileSlug(resultado.nombre)}.md`,
                    "text/markdown",
                  )
                }
                className="rounded-full border-2 border-lime px-6 py-3 font-extrabold"
              >
                Descargar Markdown
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border-2 border-lime px-6 py-3 font-extrabold"
              >
                Imprimir / PDF
              </button>
              <a
                href="https://lovable.dev/?utm_source=terralab"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-sun px-6 py-3 font-extrabold text-sun-foreground"
              >
                Abrir Lovable
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-sand p-7 print:hidden">
            <h3 className="text-xl font-extrabold">Mini guía de vibecoding</h3>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                "Peguen el prompt completo como primer mensaje en Lovable y esperen la primera versión navegable.",
                "Suban también el Markdown del MVP para que Lovable tenga todo el contexto del reto.",
                "Pidan un cambio a la vez: “agrega el marcador por curso”, “muestra el indicador en la portada”.",
                "Prueben el prototipo con 5 compañeros o docentes y anoten qué no entendieron.",
                "Vuelvan a Lovable con esas observaciones: eso es iterar y es parte del reto.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="font-display font-extrabold text-primary">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            {paso === 4 && (
              <button
                type="button"
                onClick={() => setPaso(5)}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop"
              >
                Siguiente paso
              </button>
            )}
            <button
              type="button"
              onClick={() => setPaso(3)}
              className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary"
            >
              Ajustar respuestas
            </button>
            <button
              type="button"
              onClick={reiniciar}
              className="rounded-full border-2 border-border px-7 py-3 font-extrabold text-muted-foreground hover:bg-muted"
            >
              Empezar con otra brigada
            </button>
          </div>
        </section>
      )}

      {paso >= 4 && !resultado && (
        <p className="text-muted-foreground">
          Aún no hay un MVP generado.{" "}
          <button type="button" onClick={() => setPaso(1)} className="font-extrabold underline">
            Comienza por el canvas
          </button>
          .
        </p>
      )}
    </div>
  );
}
