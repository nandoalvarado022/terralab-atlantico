import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { labs } from "@/data/labs";
import {
  construirMvp,
  generarPreguntas,
  type CanvasData,
  type Pregunta,
} from "@/lib/mvp.functions";
import {
  borrarForjaStorage,
  escribirForjaStorage,
  leerForjaStorage,
} from "@/lib/forja-storage";
import { EcoFluencerQuestions, flattenRespuestasEcoFluencer } from "./EcoFluencerQuestions";
import {
  EmprendeCircularQuestions,
  flattenRespuestasEmprendeCircular,
} from "./EmprendeCircularQuestions";
import {
  BiodiversidadVivaQuestions,
  flattenRespuestasBiodiversidadViva,
} from "./BiodiversidadVivaQuestions";
import { MisionesEcoTech, flattenRespuestasEcoTech } from "./MisionesEcoTech";

const CANVAS_VACIO: CanvasData = {
  colegio: "",
  brigada: "",
  lema: "",
  correoLider: "",
  integrantes: "",
  pistas: "",
  desafio: "",
  ideaSemilla: "",
  lab: "ecotech",
};

const CAMPOS: Array<{
  key: keyof CanvasData;
  label: string;
  hint: string;
  area?: boolean;
  type?: "email";
}> = [
  { key: "colegio", label: "Colegio", hint: "Ej. Marymount School Barranquilla" },
  { key: "brigada", label: "Nombre de la brigada", hint: "Ej. Los Marineros" },
  { key: "lema", label: "Lema de la brigada", hint: "Ej. Cuidando todo, hasta más allá del mar" },
  {
    key: "correoLider",
    label: "Correo electrónico del líder del equipo",
    hint: "Ej. lider@colegio.edu.co",
    type: "email",
  },
  {
    key: "integrantes",
    label: "Terranautas y roles",
    hint: "Nombre — rol, separados por comas",
    area: true,
  },
  {
    key: "desafio",
    label: "Desafío de expedición terra lab definido",
    hint: "El reto que decidieron resolver en la expedición",
    area: true,
  },
  {
    key: "ideaSemilla",
    label: "Idea semilla",
    hint: "La solución que imaginaron en el canvas",
    area: true,
  },
];

type Resultado = { nombre: string; documento: string; prompt: string };

type Guardado = {
  paso: number;
  pasoMax: number;
  canvas: CanvasData;
  preguntas: Pregunta[];
  respuestas: Record<string, string>;
  respuestasEcoTech: Record<string, string>;
  respuestasEcoFluencer: Record<string, string>;
  respuestasEmprendeCircular: Record<string, string>;
  respuestasBiodiversidadViva: Record<string, string>;
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
  const [pasoMax, setPasoMax] = useState(1);
  const [canvas, setCanvas] = useState<CanvasData>(CANVAS_VACIO);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [respuestasEcoTech, setRespuestasEcoTech] = useState<Record<string, string>>({});
  const [respuestasEcoFluencer, setRespuestasEcoFluencer] = useState<Record<string, string>>({});
  const [respuestasEmprendeCircular, setRespuestasEmprendeCircular] = useState<
    Record<string, string>
  >({});
  const [respuestasBiodiversidadViva, setRespuestasBiodiversidadViva] = useState<
    Record<string, string>
  >({});
  const [misionIndice, setMisionIndice] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [cargando, setCargando] = useState<null | "preguntas" | "mvp" | "word" | "pdf">(null);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [hidratado, setHidratado] = useState(false);

  const preguntar = useServerFn(generarPreguntas);
  const construir = useServerFn(construirMvp);

  const esEcoTech = canvas.lab === "ecotech";
  const esEcoFluencer = canvas.lab === "influencia";
  const esEmprendeCircular = canvas.lab === "circular";
  const esBiodiversidadViva = canvas.lab === "biodiversidad";
  const esMisiones = esEcoTech || esEcoFluencer || esEmprendeCircular || esBiodiversidadViva;
  const entregaPdf = esEcoFluencer || esEmprendeCircular || esBiodiversidadViva;

  const pasos = useMemo(
    () => [
      "Cargar el canvas",
      "Elegir lab y enfoque",
      esMisiones ? "Recorrer las misiones" : "Preguntas del PRD",
      entregaPdf ? "Formulación del proyecto" : "MVP final",
      entregaPdf ? "Exportar PDF" : "Llevarlo a Lovable",
    ],
    [esMisiones, entregaPdf],
  );

  useEffect(() => {
    try {
      const raw = leerForjaStorage();
      if (raw) {
        const g = JSON.parse(raw) as Guardado;
        setPaso(g.paso ?? 1);
        const maxGuardado = Math.max(g.pasoMax ?? 1, g.paso ?? 1, g.resultado ? 4 : 1);
        setPasoMax(maxGuardado);
        const canvasCargado = { ...CANVAS_VACIO, ...g.canvas };
        // Si el desafío quedó en el campo viejo `pistas`, muévelo a `desafio`.
        if (
          !String(canvasCargado.desafio ?? "").trim() &&
          String(canvasCargado.pistas ?? "").trim()
        ) {
          canvasCargado.desafio = canvasCargado.pistas;
          canvasCargado.pistas = "";
        }
        setCanvas({
          ...CANVAS_VACIO,
          ...canvasCargado,
          correoLider: String(canvasCargado.correoLider ?? ""),
          desafio: String(canvasCargado.desafio ?? ""),
          ideaSemilla: String(canvasCargado.ideaSemilla ?? ""),
          pistas: String(canvasCargado.pistas ?? ""),
        });
        setPreguntas(g.preguntas ?? []);
        setRespuestas(g.respuestas ?? {});
        setRespuestasEcoTech(g.respuestasEcoTech ?? {});
        setRespuestasEcoFluencer(g.respuestasEcoFluencer ?? {});
        setRespuestasEmprendeCircular(g.respuestasEmprendeCircular ?? {});
        setRespuestasBiodiversidadViva(g.respuestasBiodiversidadViva ?? {});
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
      pasoMax,
      canvas,
      preguntas,
      respuestas,
      respuestasEcoTech,
      respuestasEcoFluencer,
      respuestasEmprendeCircular,
      respuestasBiodiversidadViva,
      misionIndice,
      resultado,
    };
    try {
      escribirForjaStorage(JSON.stringify(g));
    } catch {
      // cuota llena: el avance sigue en memoria
    }
  }, [
    hidratado,
    paso,
    pasoMax,
    canvas,
    preguntas,
    respuestas,
    respuestasEcoTech,
    respuestasEcoFluencer,
    respuestasEmprendeCircular,
    respuestasBiodiversidadViva,
    misionIndice,
    resultado,
  ]);

  const labActual = useMemo(
    () => labs.find((l) => l.id === canvas.lab) ?? labs[labs.length - 1]!,
    [canvas.lab],
  );

  function fallar(e: unknown) {
    setError(
      e instanceof Error && e.message
        ? e.message
        : "No pudimos completar el paso. Intenta de nuevo en unos segundos.",
    );
  }

  function irAPaso(n: number) {
    setPaso(n);
    setPasoMax((m) => Math.max(m, n));
  }

  async function pedirPreguntas() {
    setError(null);
    setCargando("preguntas");
    try {
      const data = await preguntar({ data: { canvas } });
      setPreguntas(data);
      setRespuestas(Object.fromEntries(data.map((q) => [q.id, q.sugerencia])));
      irAPaso(3);
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  async function pedirMvp(
    respuestasParaConstruir: { pregunta: string; respuesta: string }[],
    respuestasMisiones?: Record<string, string>,
    regenerar = false,
  ) {
    setError(null);
    setCargando("mvp");
    try {
      const data = await construir({
        data: {
          canvas,
          respuestas: respuestasParaConstruir,
          respuestasMisiones,
          regenerar,
        },
      });
      setResultado(data);
      irAPaso(4);
      if (entregaPdf) {
        await descargarFormulacionPdf(data);
      }
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  function payloadMvpActual(): {
    respuestasParaConstruir: { pregunta: string; respuesta: string }[];
    respuestasMisiones?: Record<string, string>;
  } {
    if (esEcoTech) {
      return {
        respuestasParaConstruir: flattenRespuestasEcoTech(respuestasEcoTech),
        respuestasMisiones: respuestasEcoTech,
      };
    }
    if (esEcoFluencer) {
      return {
        respuestasParaConstruir: flattenRespuestasEcoFluencer(respuestasEcoFluencer),
        respuestasMisiones: respuestasEcoFluencer,
      };
    }
    if (esEmprendeCircular) {
      return {
        respuestasParaConstruir: flattenRespuestasEmprendeCircular(respuestasEmprendeCircular),
        respuestasMisiones: respuestasEmprendeCircular,
      };
    }
    if (esBiodiversidadViva) {
      return {
        respuestasParaConstruir: flattenRespuestasBiodiversidadViva(respuestasBiodiversidadViva),
        respuestasMisiones: respuestasBiodiversidadViva,
      };
    }
    return {
      respuestasParaConstruir: preguntas.map((q) => ({
        pregunta: q.pregunta,
        respuesta: respuestas[q.id] ?? "",
      })),
    };
  }

  function regenerarMvp() {
    const payload = payloadMvpActual();
    void pedirMvp(payload.respuestasParaConstruir, payload.respuestasMisiones, true);
  }

  function textoParaCopiar(): string {
    return resultado?.prompt ?? "";
  }

  async function descargarFormulacionPdf(override?: Resultado) {
    const r = override ?? resultado;
    if (!r) {
      setError("Primero generen la formulación del proyecto.");
      return;
    }
    setError(null);
    setCargando("pdf");
    try {
      const respuestasMedia = esEcoFluencer
        ? respuestasEcoFluencer
        : esEmprendeCircular
          ? respuestasEmprendeCircular
          : esBiodiversidadViva
            ? respuestasBiodiversidadViva
            : {};

      const { generarPdfFormulacion } = await import("@/lib/mvp-pdf");
      const blob = await generarPdfFormulacion({
        canvas,
        labNombre: labActual.nombre,
        nombreProyecto: r.nombre,
        documento: r.documento,
        ficha: r.prompt,
        respuestasMedia,
      });

      descargarBlob(
        blob,
        `formulacion-${fileSlug(r.nombre || canvas.brigada || "proyecto")}.pdf`,
      );
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  async function copiar(texto: string, etiqueta: string) {
    const contenido = texto?.trim();
    if (!contenido) {
      setError("No hay texto para copiar todavía.");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contenido);
      } else {
        const area = document.createElement("textarea");
        area.value = contenido;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (!ok) throw new Error("execCommand copy failed");
      }
      setCopiado(etiqueta);
      setError(null);
      window.setTimeout(() => setCopiado((actual) => (actual === etiqueta ? null : actual)), 2200);
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

  function descargarBlob(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function descargarWord() {
    setError(null);
    setCargando("word");
    try {
      const preguntasRespuestas = esEcoTech
        ? flattenRespuestasEcoTech(respuestasEcoTech)
        : esEcoFluencer
          ? flattenRespuestasEcoFluencer(respuestasEcoFluencer)
          : esEmprendeCircular
            ? flattenRespuestasEmprendeCircular(respuestasEmprendeCircular)
            : esBiodiversidadViva
              ? flattenRespuestasBiodiversidadViva(respuestasBiodiversidadViva)
              : preguntas.map((q) => ({
                  pregunta: q.pregunta,
                  respuesta: respuestas[q.id] ?? "",
                }));

      const respuestasMedia = esEcoTech
        ? respuestasEcoTech
        : esEcoFluencer
          ? respuestasEcoFluencer
          : esEmprendeCircular
            ? respuestasEmprendeCircular
            : esBiodiversidadViva
              ? respuestasBiodiversidadViva
              : {};

      const { generarDocumentoWordMvp } = await import("@/lib/mvp-word");
      const blob = await generarDocumentoWordMvp({
        canvas,
        labNombre: labActual.nombre,
        preguntasRespuestas,
        respuestasMedia,
        ...(resultado?.nombre ? { mvpNombre: resultado.nombre } : {}),
        ...(resultado?.documento ? { mvpDocumento: resultado.documento } : {}),
      });

      descargarBlob(
        blob,
        `respuestas-${fileSlug(resultado?.nombre || canvas.brigada || "mvp-terralab")}.docx`,
      );
    } catch (e) {
      fallar(e);
    } finally {
      setCargando(null);
    }
  }

  function reiniciar() {
    borrarForjaStorage();
    setPaso(1);
    setPasoMax(1);
    setCanvas(CANVAS_VACIO);
    setPreguntas([]);
    setRespuestas({});
    setRespuestasEcoTech({});
    setRespuestasEcoFluencer({});
    setRespuestasEmprendeCircular({});
    setRespuestasBiodiversidadViva({});
    setMisionIndice(0);
    setResultado(null);
    setError(null);
  }

  const correoLider = String(canvas.correoLider ?? "").trim();
  const correoLiderOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(correoLider);
  const desafioOk = String(canvas.desafio ?? "").trim().length > 0;
  const ideaSemillaOk = String(canvas.ideaSemilla ?? "").trim().length > 0;
  const tieneDesafioOIdea = desafioOk || ideaSemillaOk;
  const puedeAvanzar = correoLiderOk && tieneDesafioOIdea;

  if (!hidratado) {
    return <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14" aria-busy="true" />;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <ol className="mb-10 flex flex-wrap gap-2 print:hidden">
        {pasos.map((p, i) => {
          const n = i + 1;
          const activo = n === paso;
          const alcanzable = n <= pasoMax;
          const hecho = alcanzable && !activo;
          return (
            <li key={p}>
              <button
                type="button"
                onClick={() => alcanzable && irAPaso(n)}
                disabled={!alcanzable}
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
              Escribe aquí lo que anotaron en el canvas <strong>Expedición TerraLAB</strong> y en el{" "}
              <strong>Pase al Día 2</strong>: brigada, desafío, idea semilla y demás.
            </p>
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
                    value={canvas[c.key] ?? ""}
                    placeholder={c.hint}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setCanvas((prev) => ({ ...prev, [c.key]: valor }));
                    }}
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
                  />
                ) : (
                  <input
                    id={`campo-${c.key}`}
                    type={c.type ?? "text"}
                    value={canvas[c.key] ?? ""}
                    placeholder={c.hint}
                    autoComplete={c.type === "email" ? "email" : undefined}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setCanvas((prev) => ({ ...prev, [c.key]: valor }));
                    }}
                    onBlur={
                      c.type === "email"
                        ? () =>
                            setCanvas((prev) => ({
                              ...prev,
                              correoLider: String(prev.correoLider ?? "").trim(),
                            }))
                        : undefined
                    }
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => irAPaso(2)}
              disabled={!puedeAvanzar}
              className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Continuar al lab
            </button>
            {!puedeAvanzar && (
              <span className="text-sm text-muted-foreground">
                {!correoLiderOk && !tieneDesafioOIdea
                  ? "Completa el correo del líder y el desafío o la idea semilla."
                  : !correoLiderOk
                    ? "Revisa el correo del líder (debe verse como nombre@dominio.com)."
                    : !desafioOk && !ideaSemillaOk
                      ? "Escribe el desafío de expedición terra lab o la idea semilla."
                      : "Completa los campos pendientes para continuar."}
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

          <div className="flex flex-wrap gap-3">
            {esMisiones ? (
              <button
                type="button"
                onClick={() => irAPaso(3)}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
              >
                {esEcoTech ? "Continuar a las misiones" : "Continuar con las misiones"}
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
              onClick={() => irAPaso(1)}
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
          onFinalizar={() =>
            pedirMvp(
              flattenRespuestasEcoTech(respuestasEcoTech),
              respuestasEcoTech,
              Boolean(resultado),
            )
          }
          cargando={cargando === "mvp"}
        />
      )}

      {paso === 3 && esEcoFluencer && (
        <EcoFluencerQuestions
          respuestas={respuestasEcoFluencer}
          onCambiar={(k, v) => setRespuestasEcoFluencer((prev) => ({ ...prev, [k]: v }))}
          indice={misionIndice}
          onCambiarIndice={setMisionIndice}
          onFinalizar={() =>
            pedirMvp(
              flattenRespuestasEcoFluencer(respuestasEcoFluencer),
              respuestasEcoFluencer,
              Boolean(resultado),
            )
          }
          cargando={cargando === "mvp"}
        />
      )}

      {paso === 3 && esEmprendeCircular && (
        <EmprendeCircularQuestions
          respuestas={respuestasEmprendeCircular}
          onCambiar={(k, v) => setRespuestasEmprendeCircular((prev) => ({ ...prev, [k]: v }))}
          indice={misionIndice}
          onCambiarIndice={setMisionIndice}
          onFinalizar={() =>
            pedirMvp(
              flattenRespuestasEmprendeCircular(respuestasEmprendeCircular),
              respuestasEmprendeCircular,
              Boolean(resultado),
            )
          }
          cargando={cargando === "mvp"}
        />
      )}

      {paso === 3 && esBiodiversidadViva && (
        <BiodiversidadVivaQuestions
          respuestas={respuestasBiodiversidadViva}
          onCambiar={(k, v) => setRespuestasBiodiversidadViva((prev) => ({ ...prev, [k]: v }))}
          indice={misionIndice}
          onCambiarIndice={setMisionIndice}
          onFinalizar={() =>
            pedirMvp(
              flattenRespuestasBiodiversidadViva(respuestasBiodiversidadViva),
              respuestasBiodiversidadViva,
              Boolean(resultado),
            )
          }
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
                  undefined,
                  Boolean(resultado),
                )
              }
              disabled={cargando === "mvp"}
              className="rounded-full bg-deep px-7 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {cargando === "mvp" ? "Redactando el MVP…" : "Crear el documento del MVP"}
            </button>
            <button
              type="button"
              onClick={() => irAPaso(2)}
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
              {paso === 4
                ? entregaPdf
                  ? "4. Formulación del proyecto"
                  : "4. El MVP de la brigada"
                : entregaPdf
                  ? "5. Exporten su PDF"
                  : "5. Llévenlo a Lovable"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {paso === 4
                ? entregaPdf
                  ? "Revisen la formulación. Este documento reúne lo que alimentaron en el canvas y las misiones, listo para PDF."
                  : "Revisen el documento. Es el PRD que Lovable usará para construir el prototipo."
                : entregaPdf
                  ? "Descarguen el PDF de la formulación: incluye el documento generado y las imágenes que subieron en las misiones."
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

          {entregaPdf ? (
            <div className="rounded-3xl bg-deep p-7 text-deep-foreground print:hidden">
              <h3 className="text-xl font-extrabold">Formulación lista para entregar</h3>
              <p className="mt-2 text-sm opacity-80">
                El PDF incluye la formulación generada, los datos del canvas y las imágenes que
                subieron en cada paso (símbolo, prototipo, construir, etc.).
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void descargarFormulacionPdf()}
                  disabled={cargando === "pdf"}
                  className="rounded-full bg-lime px-6 py-3 font-extrabold text-lime-foreground disabled:opacity-50"
                >
                  {cargando === "pdf" ? "Preparando PDF…" : "Descargar formulación de proyecto"}
                </button>
                <button
                  type="button"
                  onClick={() => void descargarWord()}
                  disabled={cargando === "word"}
                  className="rounded-full border-2 border-lime px-6 py-3 font-extrabold disabled:opacity-50"
                >
                  {cargando === "word" ? "Preparando Word…" : "Descargar documento Word"}
                </button>
              </div>
              {resultado.prompt?.trim() && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-extrabold opacity-90">
                    Ver ficha / resumen incluido en el PDF
                  </summary>
                  <pre className="mt-3 max-h-64 overflow-auto text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                    {resultado.prompt}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="rounded-3xl bg-deep p-7 text-deep-foreground print:hidden">
              <h3 className="text-xl font-extrabold">Prompt para Lovable</h3>
              <pre className="mt-4 max-h-80 overflow-auto text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                {resultado.prompt}
              </pre>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void copiar(textoParaCopiar(), "prompt")}
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
                  onClick={() => void descargarWord()}
                  disabled={cargando === "word"}
                  className="rounded-full border-2 border-lime px-6 py-3 font-extrabold disabled:opacity-50"
                >
                  {cargando === "word" ? "Preparando Word…" : "Descargar documento Word"}
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
          )}

          {!entregaPdf && (
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
          )}

          {entregaPdf && (
            <div className="rounded-3xl bg-sand p-7 print:hidden">
              <h3 className="text-xl font-extrabold">Cómo descargar la formulación</h3>
              <ol className="mt-4 space-y-3 text-sm">
                {[
                  "Revisen que la formulación recoja el canvas y las misiones que completaron.",
                  "Pulsen “Descargar formulación de proyecto” para obtener el PDF con el documento y las imágenes subidas.",
                  "Si ajustaron respuestas, usen “Volver a generar documento” y descarguen de nuevo el PDF.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-display font-extrabold text-primary">{i + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex flex-wrap gap-3 print:hidden">
            {paso === 4 && (
              <button
                type="button"
                onClick={() => irAPaso(5)}
                className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop"
              >
                Siguiente paso
              </button>
            )}
            {paso === 4 && (
              <button
                type="button"
                onClick={regenerarMvp}
                disabled={cargando === "mvp"}
                className="rounded-full border-2 border-primary px-7 py-3 font-extrabold text-primary hover:bg-secondary disabled:opacity-50"
              >
                {cargando === "mvp"
                  ? entregaPdf
                    ? "Regenerando documento…"
                    : "Regenerando MVP…"
                  : entregaPdf
                    ? "Volver a generar documento"
                    : "Volver a generar MVP"}
              </button>
            )}
            <button
              type="button"
              onClick={() => irAPaso(3)}
              className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary"
            >
              Ajustar respuestas
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="rounded-full border-2 border-border px-7 py-3 font-extrabold text-muted-foreground hover:bg-muted"
                >
                  Empezar con otra brigada
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Empezar con otra brigada?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se borrará la información guardada en este navegador: canvas, respuestas de las
                    misiones y el MVP o documento generado. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={reiniciar}>
                    Sí, borrar e iniciar de nuevo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      )}

      {paso >= 4 && !resultado && (
        <p className="text-muted-foreground">
          Aún no hay un MVP generado.{" "}
          <button type="button" onClick={() => irAPaso(1)} className="font-extrabold underline">
            Comienza por el canvas
          </button>
          .
        </p>
      )}
    </div>
  );
}
