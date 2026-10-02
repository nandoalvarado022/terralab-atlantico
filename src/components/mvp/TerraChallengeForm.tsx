import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, ImagePlus } from "lucide-react";

import { subirArchivo } from "@/lib/firebase-upload";
import { obtenerCanvasPorCorreo } from "@/lib/mvp.functions";
import {
  PREGUNTAS_TERRA_CHALLENGE,
  respuestasTerraVacias,
  type RespuestasTerraChallenge,
} from "@/lib/terra-challenge";
import { guardarTerraChallenge } from "@/lib/terra-challenge.functions";
import { ModalInfoLab } from "./ModalInfoLab";

type Equipo = {
  correoLider: string;
  colegio: string;
  integrantes: string;
  nombre: string;
};

const campoClass =
  "mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary";

export function TerraChallengeForm() {
  const buscar = useServerFn(obtenerCanvasPorCorreo);
  const guardar = useServerFn(guardarTerraChallenge);

  const [correo, setCorreo] = useState("");
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestasTerraChallenge>(respuestasTerraVacias);
  const [cargando, setCargando] = useState<null | "buscar" | "guardar">(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [modalLab, setModalLab] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [imagenPrototipo, setImagenPrototipo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [progreso, setProgreso] = useState<string | null>(null);

  const correoListo =
    equipo !== null && correo.trim().toLowerCase() === equipo.correoLider.toLowerCase();

  async function onBuscar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(false);
    setEquipo(null);
    setRespuestas(respuestasTerraVacias());
    setLogo(null);
    setImagenPrototipo(null);
    setPdf(null);
    setCargando("buscar");
    try {
      const canvas = await buscar({ data: { correoLider: correo.trim() } });
      if (!canvas) {
        setError("No encontramos un equipo con ese correo de líder.");
        return;
      }
      setEquipo({
        correoLider: canvas.correoLider,
        colegio: canvas.colegio,
        integrantes: canvas.integrantes,
        nombre: canvas.nombre,
      });
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "";
      setError(
        /invalid|inválid|invalido|email/i.test(mensaje)
          ? "Indica un correo electrónico válido del líder del equipo."
          : mensaje || "No pudimos consultar el correo del líder. Intenta de nuevo.",
      );
    } finally {
      setCargando(null);
    }
  }

  async function onGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!equipo || !correoListo) return;
    const limpias = respuestasTerraVacias();
    for (const p of PREGUNTAS_TERRA_CHALLENGE) {
      limpias[p.key] = respuestas[p.key].trim();
    }
    if (PREGUNTAS_TERRA_CHALLENGE.some((p) => !limpias[p.key])) {
      setError("Responde todas las preguntas.");
      return;
    }
    if ((logo && !esImagen(logo)) || (imagenPrototipo && !esImagen(imagenPrototipo))) {
      setError("El logo y la imagen del prototipo deben ser archivos de imagen.");
      return;
    }
    if (pdf && pdf.type !== "application/pdf" && !pdf.name.toLowerCase().endsWith(".pdf")) {
      setError("El documento debe ser un PDF.");
      return;
    }
    setError(null);
    setExito(false);
    setCargando("guardar");
    try {
      const carpeta = `proyectos/${equipo.correoLider.trim().toLowerCase()}`;

      async function subirOpcional(archivo: File | null, prefijo: string, etiqueta: string) {
        if (!archivo) return null;
        setProgreso(`Subiendo ${etiqueta}…`);
        const subido = await subirArchivo(archivo, {
          carpeta,
          nombre: nombreArchivo(prefijo, archivo),
          onProgreso: (n) => setProgreso(`Subiendo ${etiqueta}… ${n}%`),
        });
        return subido.url;
      }

      const logoUrl = await subirOpcional(logo, "logo", "logo");
      const imagenPrototipoUrl = await subirOpcional(
        imagenPrototipo,
        "imagen-prototipo",
        "imagen del prototipo",
      );
      const pdfUrl = await subirOpcional(pdf, "documento", "PDF");

      setProgreso("Guardando respuestas…");
      await guardar({
        data: {
          correoLider: equipo.correoLider,
          ...limpias,
          logo: logoUrl,
          imagenPrototipo: imagenPrototipoUrl,
          pdf: pdfUrl,
        },
      });
      setRespuestas(respuestasTerraVacias());
      setLogo(null);
      setImagenPrototipo(null);
      setPdf(null);
      setExito(true);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "";
      setError(mensaje || "No pudimos guardar las respuestas. Intenta de nuevo.");
    } finally {
      setCargando(null);
      setProgreso(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
        Terra Lab Atlántico
      </p>
      <h1 className="mt-2 text-4xl font-extrabold">Terralab Challenge</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Escribe el correo del líder del equipo para ver el colegio, los terranautas y el nombre del
        proyecto. Después responde las preguntas del reto.
      </p>

      <AvisoEnvio error={error} exito={exito} />

      <form onSubmit={onBuscar} className="mt-8">
        <label htmlFor="correo-lider" className="text-xs font-extrabold tracking-wider uppercase">
          Correo electrónico del líder del equipo
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="correo-lider"
            type="email"
            required
            autoComplete="email"
            value={correo}
            placeholder="lider@colegio.edu.co"
            onChange={(e) => {
              setCorreo(e.target.value);
              setExito(false);
            }}
            className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={cargando !== null || !correo.trim()}
            className="shrink-0 rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando === "buscar" ? "Buscando…" : "Cargar equipo"}
          </button>
        </div>
      </form>

      {correoListo && equipo && (
        <form onSubmit={onGuardar} className="mt-10 space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoLectura id="colegio" label="Colegio" valor={equipo.colegio} />
            <CampoLectura id="proyecto" label="Nombre del proyecto" valor={equipo.nombre} />
            <CampoLectura
              id="terranautas"
              label="Terranautas"
              valor={equipo.integrantes}
              area
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setModalLab(true)}
                className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-extrabold text-primary transition-transform hover:-translate-y-0.5"
              >
                Ver información del laboratorio
              </button>
            </div>
          </div>
          <ModalInfoLab
            correo={equipo.correoLider}
            abierto={modalLab}
            onCerrar={() => setModalLab(false)}
          />

          <div className="space-y-5">
            {PREGUNTAS_TERRA_CHALLENGE.map((p, i) => (
              <div key={p.key} className="rounded-3xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
                    {i + 1}. {p.criterio}
                  </p>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-extrabold">
                    {p.porcentaje}%
                  </span>
                </div>
                <label htmlFor={`pregunta-${p.key}`} className="mt-3 block text-sm font-extrabold">
                  {p.pregunta}
                </label>
                <p className="mt-3 text-sm font-extrabold">
                  Para responder esta pregunta ten en cuenta esto:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {p.ayudas.map((ayuda) => (
                    <li key={ayuda}>{ayuda}</li>
                  ))}
                </ul>
                <textarea
                  id={`pregunta-${p.key}`}
                  required
                  rows={4}
                  value={respuestas[p.key]}
                  onChange={(e) => setRespuestas((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  className={campoClass}
                />
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <CampoArchivo
              id="logo"
              label="Logo"
              pista="Opcional · PNG, JPG o similar"
              accept="image/*"
              archivo={logo}
              onArchivo={setLogo}
            />
            <CampoArchivo
              id="imagen-prototipo"
              label="Imagen prototipo"
              pista="Opcional · PNG, JPG o similar"
              accept="image/*"
              archivo={imagenPrototipo}
              onArchivo={setImagenPrototipo}
            />
            <CampoArchivo
              id="pdf"
              label="PDF"
              pista="Opcional · Sube una presentación de tu proyecto (PDF)"
              accept="application/pdf,.pdf"
              archivo={pdf}
              onArchivo={setPdf}
            />
          </div>

          <button
            type="submit"
            disabled={cargando !== null}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando === "guardar" ? (progreso ?? "Guardando…") : "Enviar respuestas"}
          </button>

          <AvisoEnvio error={error} exito={exito} />
        </form>
      )}
    </div>
  );
}

function AvisoEnvio({ error, exito }: { error: string | null; exito: boolean }) {
  return (
    <>
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-bold"
        >
          {error}
        </div>
      )}

      {exito && (
        <div
          role="status"
          className="mt-6 rounded-2xl border-2 border-lime bg-secondary p-4 text-sm font-bold"
        >
          Respuestas guardadas.
        </div>
      )}
    </>
  );
}

function esImagen(archivo: File) {
  return archivo.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(archivo.name);
}

function nombreArchivo(prefijo: string, archivo: File) {
  const punto = archivo.name.lastIndexOf(".");
  const extension = punto > 0 ? archivo.name.slice(punto).toLowerCase() : "";
  return `${prefijo}-${Date.now()}${extension}`;
}

function CampoArchivo({
  id,
  label,
  pista,
  accept,
  archivo,
  onArchivo,
}: {
  id: string;
  label: string;
  pista: string;
  accept: string;
  archivo: File | null;
  onArchivo: (archivo: File | null) => void;
}) {
  const [vista, setVista] = useState<string | null>(null);
  const esPdf = accept.includes("pdf");

  useEffect(() => {
    if (!archivo || esPdf) {
      setVista(null);
      return;
    }
    const url = URL.createObjectURL(archivo);
    setVista(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo, esPdf]);

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <label htmlFor={id} className="text-sm font-extrabold">
        {label}
      </label>
      <p className="mt-1 text-sm text-muted-foreground">{pista}</p>
      {vista && <img src={vista} alt={label} className="mt-4 max-h-48 rounded-xl object-contain" />}
      {archivo && esPdf && (
        <p className="mt-4 flex items-center gap-2 text-sm font-bold">
          <FileText className="h-4 w-4" aria-hidden />
          {archivo.name}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-deep px-4 py-2 text-xs font-extrabold text-deep-foreground">
          {esPdf ? (
            <FileText className="h-4 w-4" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          {archivo ? "Cambiar" : "Subir archivo"}
          <input
            id={id}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
          />
        </label>
        {archivo && (
          <button
            type="button"
            onClick={() => onArchivo(null)}
            className="rounded-full border-2 border-border px-4 py-2 text-xs font-extrabold text-muted-foreground hover:bg-muted"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
}

function CampoLectura({
  id,
  label,
  valor,
  area,
  className,
}: {
  id: string;
  label: string;
  valor: string;
  area?: boolean;
  className?: string;
}) {
  const mostrar = valor.trim() || "Sin dato";
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-extrabold tracking-wider uppercase">
        {label}
      </label>
      {area ? (
        <textarea
          id={id}
          readOnly
          rows={3}
          value={mostrar}
          className={`${campoClass} bg-muted text-muted-foreground`}
        />
      ) : (
        <input
          id={id}
          readOnly
          value={mostrar}
          className={`${campoClass} bg-muted text-muted-foreground`}
        />
      )}
    </div>
  );
}
