import { jsPDF } from "jspdf";

import type { CanvasData } from "@/lib/mvp.functions";

export type OpcionesPdfFormulacion = {
  canvas: CanvasData;
  labNombre: string;
  nombreProyecto: string;
  /** Texto markdown de la formulación generada por el prompt. */
  documento: string;
  /** Ficha / resumen ejecutivo (campo prompt del resultado). */
  ficha?: string;
  /** Record plano de misiones (incluye data URLs de imágenes/videos). */
  respuestasMedia: Record<string, string>;
};

const CANVAS_CAMPOS: Array<{ key: keyof CanvasData; label: string }> = [
  { key: "colegio", label: "Colegio" },
  { key: "brigada", label: "Nombre de la brigada" },
  { key: "lema", label: "Lema de la brigada" },
  { key: "correoLider", label: "Correo electrónico del líder del equipo" },
  { key: "integrantes", label: "Terranautas y roles" },
  { key: "desafio", label: "Desafío de expedición terra lab definido" },
  { key: "ideaSemilla", label: "Idea semilla" },
];

const ETIQUETAS_MEDIA: Record<string, string> = {
  "ef6-identidad-simbolo": "Símbolo, personaje o composición visual",
  "ef7-construir-imagen": "Construir · imagen o video",
  "ec1-material-imagen": "Dibujo o foto del material",
  "ec5-prototipo-imagen": "Logo o marca del producto / prototipo",
  "ec6-construir-imagen": "Construir · imagen o video",
  "bv1-evidencia-imagen": "Dibujo, foto o huella",
  "bv5-esquema-imagen": "Diseñar · Imagen / esquema",
  "bv6-construir-imagen": "Construir · imagen o video",
};

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 12;

function etiquetaMedia(clave: string) {
  return ETIQUETAS_MEDIA[clave] ?? `Archivo · ${clave}`;
}

function limpiarMarkdownInline(texto: string) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

/** Convierte data URL (png/jpeg/webp/gif) a JPEG/PNG usable por jsPDF. */
async function normalizarImagenParaPdf(
  dataUrl: string,
): Promise<{ format: "JPEG" | "PNG"; dataUrl: string; width: number; height: number } | null> {
  if (!/^data:image\//i.test(dataUrl.trim())) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 1600;
      const scale = Math.min(1, maxW / (img.naturalWidth || maxW));
      const w = Math.max(1, Math.round((img.naturalWidth || 800) * scale));
      const h = Math.max(1, Math.round((img.naturalHeight || 600) * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const jpeg = canvas.toDataURL("image/jpeg", 0.88);
        resolve({ format: "JPEG", dataUrl: jpeg, width: w, height: h });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

type PdfCtx = {
  doc: jsPDF;
  y: number;
  page: number;
};

function asegurarEspacio(ctx: PdfCtx, needed: number) {
  if (ctx.y + needed <= FOOTER_Y - 4) return;
  ctx.doc.addPage();
  ctx.page += 1;
  ctx.y = MARGIN;
}

function dibujarPie(doc: jsPDF, totalPages: number) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("Terra Lab Atlántico · Formulación de proyecto", MARGIN, FOOTER_Y);
    doc.text(`${i} / ${totalPages || n}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
  }
}

function escribirTitulo(ctx: PdfCtx, texto: string, size = 16) {
  asegurarEspacio(ctx, size * 0.5 + 8);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(20);
  const lineas = ctx.doc.splitTextToSize(texto, CONTENT_W) as string[];
  for (const linea of lineas) {
    asegurarEspacio(ctx, size * 0.45);
    ctx.doc.text(linea, MARGIN, ctx.y);
    ctx.y += size * 0.45;
  }
  ctx.y += 4;
}

function escribirSubtitulo(ctx: PdfCtx, texto: string) {
  asegurarEspacio(ctx, 12);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(12);
  ctx.doc.setTextColor(30);
  const lineas = ctx.doc.splitTextToSize(texto, CONTENT_W) as string[];
  for (const linea of lineas) {
    asegurarEspacio(ctx, 6);
    ctx.doc.text(linea, MARGIN, ctx.y);
    ctx.y += 6;
  }
  ctx.y += 2;
}

function escribirCuerpo(ctx: PdfCtx, texto: string, opts?: { bold?: boolean; size?: number }) {
  const limpio = limpiarMarkdownInline(texto);
  if (!limpio) {
    ctx.y += 3;
    return;
  }
  const size = opts?.size ?? 10;
  ctx.doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(40);
  const lineas = ctx.doc.splitTextToSize(limpio, CONTENT_W) as string[];
  const lineH = size * 0.42;
  for (const linea of lineas) {
    asegurarEspacio(ctx, lineH + 1);
    ctx.doc.text(linea, MARGIN, ctx.y);
    ctx.y += lineH;
  }
  ctx.y += 2;
}

function escribirEtiquetaValor(ctx: PdfCtx, etiqueta: string, valor: string) {
  asegurarEspacio(ctx, 14);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(10);
  ctx.doc.setTextColor(30);
  ctx.doc.text(`${etiqueta}:`, MARGIN, ctx.y);
  ctx.y += 5;
  escribirCuerpo(ctx, valor);
}

function volcarMarkdown(ctx: PdfCtx, markdown: string) {
  const lineas = markdown.replace(/\r\n/g, "\n").split("\n");
  for (const cruda of lineas) {
    const linea = cruda.trimEnd();
    if (!linea.trim()) {
      ctx.y += 3;
      continue;
    }
    if (/^#{1}\s+/.test(linea)) {
      escribirTitulo(ctx, limpiarMarkdownInline(linea.replace(/^#\s+/, "")), 15);
      continue;
    }
    if (/^#{2}\s+/.test(linea)) {
      escribirTitulo(ctx, limpiarMarkdownInline(linea.replace(/^##\s+/, "")), 13);
      continue;
    }
    if (/^#{3,}\s+/.test(linea)) {
      escribirSubtitulo(ctx, limpiarMarkdownInline(linea.replace(/^#{3,}\s+/, "")));
      continue;
    }
    if (/^[-*•]\s+/.test(linea)) {
      escribirCuerpo(ctx, `• ${linea.replace(/^[-*•]\s+/, "")}`);
      continue;
    }
    if (/^\d+\.\s+/.test(linea)) {
      escribirCuerpo(ctx, linea);
      continue;
    }
    if (/^---+$/.test(linea.trim())) {
      asegurarEspacio(ctx, 8);
      ctx.doc.setDrawColor(200);
      ctx.doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
      ctx.y += 6;
      continue;
    }
    escribirCuerpo(ctx, linea);
  }
}

async function agregarImagenes(ctx: PdfCtx, respuestasMedia: Record<string, string>) {
  const medias = Object.entries(respuestasMedia).filter(([, v]) =>
    /^data:(image|video)\//i.test((v ?? "").trim()),
  );
  if (medias.length === 0) return;

  escribirTitulo(ctx, "Imágenes del proyecto", 14);
  escribirCuerpo(
    ctx,
    "Evidencias visuales que la brigada subió en las misiones del recorrido.",
    { size: 9 },
  );

  for (const [clave, dataUrl] of medias) {
    const etiqueta = etiquetaMedia(clave);
    escribirSubtitulo(ctx, etiqueta);

    if (/^data:video\//i.test(dataUrl)) {
      escribirCuerpo(
        ctx,
        "Se subió un video en este paso. Los videos no se incrustan en el PDF; revisen el archivo en la plataforma.",
      );
      continue;
    }

    const normalizada = await normalizarImagenParaPdf(dataUrl);
    if (!normalizada) {
      escribirCuerpo(ctx, "No se pudo incrustar esta imagen en el PDF.");
      continue;
    }

    const maxW = CONTENT_W;
    const maxH = 110;
    const ratio = Math.min(maxW / normalizada.width, maxH / normalizada.height, 1);
    const drawW = normalizada.width * ratio;
    const drawH = normalizada.height * ratio;

    asegurarEspacio(ctx, drawH + 8);
    try {
      ctx.doc.addImage(
        normalizada.dataUrl,
        normalizada.format,
        MARGIN,
        ctx.y,
        drawW,
        drawH,
        undefined,
        "FAST",
      );
      ctx.y += drawH + 8;
    } catch {
      escribirCuerpo(ctx, "No se pudo incrustar esta imagen en el PDF.");
    }
  }
}

/** Genera un PDF con la formulación del proyecto e imágenes subidas. */
export async function generarPdfFormulacion(opts: OpcionesPdfFormulacion): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const ctx: PdfCtx = { doc, y: MARGIN, page: 1 };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Terra Lab Atlántico · Forja MVP", MARGIN, ctx.y);
  ctx.y += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(opts.labNombre, MARGIN, ctx.y);
  ctx.y += 10;

  escribirTitulo(ctx, opts.nombreProyecto || "Formulación de proyecto", 18);
  if (opts.canvas.brigada?.trim()) {
    escribirCuerpo(ctx, `Brigada: ${opts.canvas.brigada}`, { bold: true, size: 11 });
  }
  ctx.y += 2;

  escribirTitulo(ctx, "1. Datos del canvas", 13);
  for (const campo of CANVAS_CAMPOS) {
    const valor = String(opts.canvas[campo.key] ?? "").trim();
    if (valor) escribirEtiquetaValor(ctx, campo.label, valor);
  }

  if (opts.documento?.trim()) {
    escribirTitulo(ctx, "2. Formulación del proyecto", 13);
    volcarMarkdown(ctx, opts.documento);
  }

  if (opts.ficha?.trim()) {
    escribirTitulo(ctx, "3. Ficha / resumen", 13);
    volcarMarkdown(ctx, opts.ficha);
  }

  await agregarImagenes(ctx, opts.respuestasMedia);

  dibujarPie(doc, doc.getNumberOfPages());

  return doc.output("blob");
}
