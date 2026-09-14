import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

import type { CanvasData } from "@/lib/mvp.functions";

export type ParPreguntaRespuesta = { pregunta: string; respuesta: string };

type OpcionesWord = {
  canvas: CanvasData;
  labNombre: string;
  preguntasRespuestas: ParPreguntaRespuesta[];
  /** Record plano de misiones (incluye data URLs de imágenes/videos). */
  respuestasMedia: Record<string, string>;
  mvpNombre?: string;
  mvpDocumento?: string;
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
};

const PLACEHOLDERS_MEDIA =
  /^\(?(imagen adjuntada|imagen cargada|video adjuntado|video cargado)\)?$/i;

function titulo(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 280, after: 120 },
  });
}

function cuerpo(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 80 },
  });
}

function etiquetaValor(etiqueta: string, valor: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${etiqueta}: `, bold: true, size: 22 }),
      new TextRun({ text: valor, size: 22 }),
    ],
    spacing: { after: 100 },
  });
}

function parseDataUrlImagen(
  dataUrl: string,
): { type: "png" | "jpg" | "gif" | "bmp"; data: Uint8Array } | null {
  const m = /^data:image\/(png|jpe?g|gif|bmp|webp);base64,(.+)$/i.exec(dataUrl.trim());
  if (!m?.[1] || !m[2]) return null;
  const mime = m[1].toLowerCase();
  if (mime === "webp") return null;
  const type: "png" | "jpg" | "gif" | "bmp" =
    mime === "png" ? "png" : mime === "gif" ? "gif" : mime === "bmp" ? "bmp" : "jpg";
  const binary = atob(m[2]);
  const data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) data[i] = binary.charCodeAt(i);
  return { type, data };
}

function dimensionesDesdeDataUrl(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 480;
      const scale = Math.min(1, maxW / (img.naturalWidth || maxW));
      resolve({
        width: Math.max(1, Math.round((img.naturalWidth || maxW) * scale)),
        height: Math.max(1, Math.round((img.naturalHeight || 320) * scale)),
      });
    };
    img.onerror = () => resolve({ width: 400, height: 300 });
    img.src = dataUrl;
  });
}

function etiquetaMedia(clave: string) {
  return ETIQUETAS_MEDIA[clave] ?? `Archivo · ${clave}`;
}

function esPlaceholderMedia(respuesta: string) {
  return PLACEHOLDERS_MEDIA.test(respuesta.trim());
}

async function parrafoImagen(dataUrl: string, alt: string): Promise<Paragraph | null> {
  const parsed = parseDataUrlImagen(dataUrl);
  if (!parsed) return null;
  const dims = await dimensionesDesdeDataUrl(dataUrl);
  return new Paragraph({
    children: [
      new ImageRun({
        type: parsed.type,
        data: parsed.data,
        transformation: dims,
        altText: { title: alt, description: alt, name: alt },
      }),
    ],
    spacing: { before: 80, after: 160 },
  });
}

/** Genera un .docx con canvas, respuestas de misiones e imágenes subidas. */
export async function generarDocumentoWordMvp(opts: OpcionesWord): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Terra Lab Atlántico · Forja MVP", bold: true, size: 32 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
      children: [
        new TextRun({
          text: opts.mvpNombre
            ? `${opts.mvpNombre} — registro completo de respuestas`
            : "Registro completo de respuestas",
          size: 24,
          italics: true,
        }),
      ],
    }),

    titulo("1. Datos del canvas", HeadingLevel.HEADING_1),
    etiquetaValor("Lab", opts.labNombre),
  ];

  for (const campo of CANVAS_CAMPOS) {
    const valor = String(opts.canvas[campo.key] ?? "").trim();
    if (valor) children.push(etiquetaValor(campo.label, valor));
  }

  children.push(titulo("2. Respuestas de las misiones", HeadingLevel.HEADING_1));

  const qa = opts.preguntasRespuestas.filter(
    (r) => r.pregunta.trim() && r.respuesta.trim() && !esPlaceholderMedia(r.respuesta),
  );

  if (qa.length === 0) {
    children.push(cuerpo("No hay respuestas de misiones registradas."));
  } else {
    for (const [i, item] of qa.entries()) {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({ text: `${i + 1}. ${item.pregunta}`, bold: true, size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: item.respuesta, size: 22 })],
        }),
      );
    }
  }

  const medias = Object.entries(opts.respuestasMedia).filter(([, v]) =>
    /^data:(image|video)\//i.test((v ?? "").trim()),
  );

  if (medias.length > 0) {
    children.push(titulo("3. Imágenes y archivos subidos", HeadingLevel.HEADING_1));

    for (const [clave, dataUrl] of medias) {
      const etiqueta = etiquetaMedia(clave);
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [new TextRun({ text: etiqueta, bold: true, size: 22 })],
        }),
      );

      if (/^data:video\//i.test(dataUrl)) {
        children.push(
          cuerpo(
            "Se subió un video en este paso. Los videos no se incrustan en el documento Word; revisen el archivo en la plataforma.",
          ),
        );
        continue;
      }

      if (/^data:image\/webp/i.test(dataUrl)) {
        children.push(
          cuerpo("Se subió una imagen WebP. Conviértanla a PNG o JPG para incluirla en Word."),
        );
        continue;
      }

      const parrafo = await parrafoImagen(dataUrl, etiqueta);
      if (parrafo) children.push(parrafo);
      else children.push(cuerpo("No se pudo incrustar esta imagen en el documento."));
    }
  }

  if (opts.mvpDocumento?.trim()) {
    children.push(titulo("4. Documento del MVP generado", HeadingLevel.HEADING_1));
    for (const linea of opts.mvpDocumento.split(/\n/)) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: linea || " ", size: 20 })],
        }),
      );
    }
  }

  const doc = new Document({
    creator: "Terra Lab Atlántico",
    title: opts.mvpNombre
      ? `Forja MVP — ${opts.mvpNombre}`
      : "Forja MVP — registro de respuestas",
    description: "Respuestas completas de la brigada en Forja MVP",
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}
