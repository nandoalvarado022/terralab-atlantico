import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { jsPDF } from "jspdf";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = join(tmpdir(), "terralab-informe-entrega");
mkdirSync(cache, { recursive: true });

const preparado = spawnSync(
  "python3",
  [
    "-c",
    `
from PIL import Image, ImageDraw
from pathlib import Path
out = Path(${JSON.stringify(cache)})
src = Path(${JSON.stringify(join(root, "src/assets/images"))})

def crop(path):
    im = Image.open(path).convert("RGBA")
    return im.crop(im.split()[-1].getbbox())

def redondear(im, radio):
    im = im.convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width, im.height), radius=radio, fill=255)
    im.putalpha(mask)
    return im

crop(src / "logo terralab-atlantico.png").save(out / "logo.png")
crop(src / "logo terralab-02.png").save(out / "logo-blanco.png")
redondear(Image.open(src / "character-ecoinfluencer.png"), 46).save(out / "personaje-eco.png")
redondear(Image.open(src / "character-emprende-circular.png"), 46).save(out / "personaje-circular.png")
`,
  ],
  { stdio: "inherit" },
);
if (preparado.status !== 0) {
  process.exit(preparado.status ?? 1);
}

const DEEP = [0, 64, 88];
const INK = [0, 48, 72];
const LIME = [176, 200, 40];
const LEAF = [8, 152, 88];
const SUN = [240, 184, 16];
const AQUA = [8, 160, 224];
const SAND = [246, 248, 242];
const WHITE = [255, 255, 255];
const MUTED = [62, 96, 110];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 16;
const CONTENT_W = PAGE_W - M * 2;
const FOOTER_Y = 282;

const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
doc.setProperties({
  title: "Informe de entrega · Segunda fase · Terra Lab Atlántico",
  subject: "Desarrollos y actividades de la segunda fase",
  creator: "Terra Lab Atlántico",
});

function registrarFuente(archivo, familia, estilo) {
  const nombre = archivo.split("/").pop();
  doc.addFileToVFS(nombre, readFileSync(archivo).toString("base64"));
  doc.addFont(nombre, familia, estilo);
}

const fonts = join(root, "scripts/fonts");
registrarFuente(join(fonts, "Nunito-Regular.ttf"), "Nunito", "normal");
registrarFuente(join(fonts, "Nunito-Bold.ttf"), "Nunito", "bold");
registrarFuente(join(fonts, "Baloo2-ExtraBold.ttf"), "Baloo2", "normal");

function png(nombre) {
  return `data:image/png;base64,${readFileSync(join(cache, nombre)).toString("base64")}`;
}

const logo = png("logo.png");
const logoBlanco = png("logo-blanco.png");
const personajeEco = png("personaje-eco.png");
const personajeCircular = png("personaje-circular.png");

let y = 0;

function fondo() {
  doc.setFillColor(...SAND);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

function fuente(familia, estilo, tam, color) {
  doc.setFont(familia, estilo);
  doc.setFontSize(tam);
  doc.setTextColor(...color);
}

function altoLinea(tam) {
  return tam * 0.46;
}

function parrafo(texto, x, maxW, tam, color, estilo = "normal", interlineado) {
  fuente("Nunito", estilo, tam, color);
  const lineas = doc.splitTextToSize(texto, maxW);
  const lh = interlineado ?? altoLinea(tam);
  doc.text(lineas, x, y);
  y += lineas.length * lh;
  return lineas.length;
}

function nuevaPaginaInterior() {
  doc.addPage();
  fondo();
  doc.setFillColor(...DEEP);
  doc.rect(0, 0, PAGE_W, 18, "F");
  doc.setFillColor(...LIME);
  doc.rect(0, 18, PAGE_W, 1.6, "F");
  const logoH = 11;
  const logoW = logoH * (1196 / 674);
  doc.addImage(logoBlanco, "PNG", M, 3.4, logoW, logoH);
  fuente("Nunito", "bold", 9, WHITE);
  doc.text("Informe de entrega  ·  Segunda fase", PAGE_W - M, 11, { align: "right" });
  y = 30;
}

function asegurar(alto) {
  if (y + alto > FOOTER_Y) nuevaPaginaInterior();
}

function franja() {
  const colores = [LIME, LEAF, SUN, AQUA];
  const w = CONTENT_W / colores.length;
  colores.forEach((color, i) => {
    doc.setFillColor(...color);
    doc.rect(M + i * w, y, w, 2.2, "F");
  });
  y += 2.2;
}

function tarjeta(x, ancho, alto, relleno, titulo, detalle, acento) {
  doc.setFillColor(...relleno);
  doc.roundedRect(x, y, ancho, alto, 4, 4, "F");
  fuente("Baloo2", "normal", 18, acento);
  doc.text(titulo, x + 5, y + 11);
  fuente("Nunito", "bold", 8.5, acento);
  const lineas = doc.splitTextToSize(detalle, ancho - 10);
  doc.text(lineas, x + 5, y + 18);
}

function seccion(numero, titulo, bajada, viñetas) {
  fuente("Baloo2", "normal", 16, DEEP);
  const tituloLineas = doc.splitTextToSize(titulo, CONTENT_W - 16);
  const tituloAlto = tituloLineas.length * 7.2;
  fuente("Nunito", "normal", 11, INK);
  const viñetasAlto = viñetas.reduce((suma, item) => {
    const lineas = doc.splitTextToSize(item, CONTENT_W - 12);
    return suma + lineas.length * altoLinea(11) + 3.2;
  }, 0);
  const bajadaAlto = bajada ? 8 : 0;
  asegurar(Math.max(12, tituloAlto + 2) + bajadaAlto + 2 + viñetasAlto + 6);
  const inicio = y;
  doc.setFillColor(...LIME);
  doc.roundedRect(M, inicio, 10, 10, 2.5, 2.5, "F");
  fuente("Baloo2", "normal", 13, DEEP);
  doc.text(String(numero), M + 5, inicio + 7.1, { align: "center" });
  fuente("Baloo2", "normal", 16, DEEP);
  doc.text(tituloLineas, M + 14, inicio + 7.2);
  y = inicio + Math.max(12, tituloAlto + 2);
  if (bajada) {
    parrafo(bajada, M + 14, CONTENT_W - 14, 10, LEAF, "bold");
    y += 2;
  }
  y += 2;
  for (const item of viñetas) {
    fuente("Nunito", "normal", 11, INK);
    const lineas = doc.splitTextToSize(item, CONTENT_W - 12);
    const lh = altoLinea(11);
    const alto = lineas.length * lh + 3.2;
    asegurar(alto + 1);
    doc.setFillColor(...LEAF);
    doc.circle(M + 2.2, y + 1.2, 1.15, "F");
    doc.text(lineas, M + 7, y + 2.4);
    y += alto;
  }
  y += 6;
}

fondo();

const logoW = 74;
const logoH = logoW * (669 / 1196);
doc.addImage(logo, "PNG", M, 12, logoW, logoH);

fuente("Nunito", "bold", 9, MUTED);
doc.text("21 de octubre de 2026", PAGE_W - M, 20, { align: "right" });
fuente("Nunito", "bold", 9, LEAF);
doc.text("SEGUNDA FASE", PAGE_W - M, 26, { align: "right" });

y = 12 + logoH + 12;
fuente("Baloo2", "normal", 28, DEEP);
doc.text("Informe de entrega", M, y);
y += 8;
fuente("Nunito", "bold", 12, LEAF);
doc.text("Para el equipo de Terra Lab Atlántico", M, y);
y += 6;
franja();
y += 8;

const personajeW = 48;
const personajeH = personajeW * (403 / 342);
const textoW = CONTENT_W - personajeW - 8;
const yIntro = y;
parrafo(
  "A continuación, detallo los principales desarrollos y actividades realizadas durante esta segunda fase.",
  M,
  textoW,
  12,
  INK,
  "normal",
  6,
);
doc.addImage(personajeEco, "PNG", PAGE_W - M - personajeW, yIntro - 2, personajeW, personajeH);
y = Math.max(y + 4, yIntro + personajeH + 2);

const gap = 4;
const cardW = (CONTENT_W - gap * 2) / 3;
const cardH = 32;
const cardY = y;
tarjeta(M, cardW, cardH, LIME, "79", "registros reportados\nhasta el 19 de octubre", DEEP);
tarjeta(
  M + cardW + gap,
  cardW,
  cardH,
  DEEP,
  "MVP",
  "Inicio de sesión\nintegrado con Supabase",
  WHITE,
);
tarjeta(
  M + (cardW + gap) * 2,
  cardW,
  cardH,
  [232, 247, 236],
  "Soporte",
  "Consultas, WhatsApp\ny correo electrónico",
  DEEP,
);
y = cardY + cardH + 12;

seccion("1", "Módulo TerraLab Challenge", "79 registros reportados hasta el 19 de octubre de 2026.", [
  "Desarrollo del formulario para el registro de información relacionada con los proyectos.",
  "Implementación de la consulta inicial del correo electrónico del líder del equipo, utilizado como referencia para relacionar la información previamente diligenciada y almacenada en la base de datos.",
  "Habilitación de la carga de archivos asociados al proyecto, incluyendo logo, imagen o prototipo y documento PDF.",
  "Desarrollo de un reporte correspondiente al nuevo módulo, para facilitar la consulta de la información registrada.",
]);

seccion("2", "Implementación del sistema de autenticación", "", [
  "Desarrollo e integración de un sistema de inicio de sesión para el módulo MVP correspondiente a la primera fase del proyecto.",
  "Integración de la autenticación con Supabase, proveedor utilizado también para el almacenamiento de la base de datos de la plataforma.",
]);

seccion("3", "Soporte y acompañamiento", "", [
  "Atención de consultas y requerimientos relacionados con el funcionamiento de la herramienta.",
  "Acompañamiento y soporte a José mediante comunicaciones por WhatsApp y correo electrónico.",
]);

const cierreAlto = 78;
const hueco = FOOTER_Y - 8 - cierreAlto - y;
const cierreY = hueco > 12 ? FOOTER_Y - 8 - cierreAlto : y;
doc.setFillColor(...DEEP);
doc.roundedRect(M, cierreY, CONTENT_W, cierreAlto, 5, 5, "F");
const personajeCierreW = 52;
const personajeCierreH = personajeCierreW * (339 / 354);
doc.addImage(
  personajeCircular,
  "PNG",
  PAGE_W - M - personajeCierreW - 6,
  cierreY + (cierreAlto - personajeCierreH) / 2,
  personajeCierreW,
  personajeCierreH,
);
const cierreTextoW = CONTENT_W - personajeCierreW - 22;
const cierreLh = 5.3;
fuente("Nunito", "normal", 11, WHITE);
const cierreA = doc.splitTextToSize(
  "Con esta entrega, se ponen a disposición las funcionalidades desarrolladas durante esta segunda fase, junto con los ajustes y el acompañamiento realizados durante el proceso.",
  cierreTextoW,
);
fuente("Nunito", "bold", 11, LIME);
const cierreB = doc.splitTextToSize(
  "Agradezco la confianza depositada y quedo atento a sus comentarios, observaciones o requerimientos adicionales relacionados con la entrega.",
  cierreTextoW,
);
const bloqueTexto = cierreA.length * cierreLh + 4 + cierreB.length * cierreLh;
y = cierreY + (cierreAlto - bloqueTexto) / 2 + 3.2;
fuente("Nunito", "normal", 11, WHITE);
doc.text(cierreA, M + 7, y);
y += cierreA.length * cierreLh + 4;
fuente("Nunito", "bold", 11, LIME);
doc.text(cierreB, M + 7, y);

const total = doc.getNumberOfPages();
for (let i = 1; i <= total; i += 1) {
  doc.setPage(i);
  doc.setDrawColor(...LIME);
  doc.setLineWidth(0.6);
  doc.line(M, 286, PAGE_W - M, 286);
  fuente("Nunito", "bold", 8, DEEP);
  doc.text("Terra Lab Atlántico", M, 291);
  fuente("Nunito", "normal", 8, MUTED);
  doc.text("Informe de entrega  ·  Segunda fase", PAGE_W / 2, 291, { align: "center" });
  fuente("Nunito", "bold", 8, DEEP);
  doc.text(`${i} / ${total}`, PAGE_W - M, 291, { align: "right" });
}

const salida = join(root, "docs/informe-entrega-segunda-fase.pdf");
writeFileSync(salida, Buffer.from(doc.output("arraybuffer")));
console.log(salida);
