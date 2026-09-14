import ExcelJS from "exceljs";
import { format } from "date-fns";

import { labs } from "@/data/labs";
import type { MvpGuardado } from "@/lib/admin.functions";
import {
  esArrayMisiones,
  esArrayPlano,
  sanitizarValorRespuesta,
} from "@/lib/respuestas-misiones";

/** Límite seguro de celda Excel (~32k). */
const MAX_CELDA = 31_000;

function celda(texto: string | null | undefined): string {
  const t = (texto ?? "").trim();
  if (!t) return "";
  if (t.length <= MAX_CELDA) return t;
  return `${t.slice(0, MAX_CELDA - 24)}\n…[truncado por límite Excel]`;
}

function tituloLab(labId: string) {
  return labs.find((l) => l.id === labId)?.titulo ?? labId;
}

type FilaRespuesta = {
  mvpId: string;
  fecha: string;
  lab: string;
  colegio: string;
  brigada: string;
  correo: string;
  proyecto: string;
  mision: string;
  campo: string;
  valor: string;
};

function filasRespuestasAplanadas(m: MvpGuardado): FilaRespuesta[] {
  const base = {
    mvpId: m.id,
    fecha: format(new Date(m.created_at), "yyyy-MM-dd HH:mm"),
    lab: tituloLab(m.lab),
    colegio: m.colegio || "",
    brigada: m.brigada || "",
    correo: m.correo_lider || "",
    proyecto: m.nombre || "",
  };

  const filas: FilaRespuesta[] = [];

  if (esArrayMisiones(m.respuestas)) {
    for (const mision of m.respuestas) {
      const etiquetaMision = `${mision.numero}. ${mision.nombre}`;
      for (const [campo, valorCrudo] of Object.entries(mision.campos ?? {})) {
        const valor = sanitizarValorRespuesta(valorCrudo ?? "");
        if (!valor) continue;
        filas.push({
          ...base,
          mision: etiquetaMision,
          campo,
          valor: celda(valor),
        });
      }
    }
  } else if (esArrayPlano(m.respuestas)) {
    for (const r of m.respuestas) {
      const valor = sanitizarValorRespuesta(r.respuesta ?? "");
      if (!valor) continue;
      filas.push({
        ...base,
        mision: "PRD / plano",
        campo: r.pregunta,
        valor: celda(valor),
      });
    }
  }

  // EcoTech legado: mapa plano adicional si no vino en misiones.
  if (m.lab === "ecotech" && m.respuestas_ecotech && !esArrayMisiones(m.respuestas)) {
    for (const [campo, valorCrudo] of Object.entries(m.respuestas_ecotech)) {
      const valor = sanitizarValorRespuesta(valorCrudo ?? "");
      if (!valor) continue;
      filas.push({
        ...base,
        mision: "EcoTech (mapa)",
        campo,
        valor: celda(valor),
      });
    }
  }

  return filas;
}

function estiloCabecera(row: ExcelJS.Row) {
  row.font = { bold: true };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE8F0EC" },
  };
  row.alignment = { vertical: "middle", wrapText: true };
}

/**
 * Genera un .xlsx con dos hojas:
 * - Documentos: una fila por MVP (canvas + IA)
 * - Respuestas: una fila por campo de misión (análisis / pivote)
 */
export async function generarExcelMvps(mvps: MvpGuardado[]): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Terra Lab Atlántico";
  wb.created = new Date();

  const hojaDocs = wb.addWorksheet("Documentos", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  hojaDocs.columns = [
    { header: "ID", key: "id", width: 36 },
    { header: "Fecha", key: "fecha", width: 18 },
    { header: "Lab", key: "lab", width: 22 },
    { header: "Colegio", key: "colegio", width: 28 },
    { header: "Brigada", key: "brigada", width: 22 },
    { header: "Lema", key: "lema", width: 22 },
    { header: "Correo líder", key: "correo", width: 28 },
    { header: "Integrantes", key: "integrantes", width: 32 },
    { header: "Pistas", key: "pistas", width: 28 },
    { header: "Desafío", key: "desafio", width: 28 },
    { header: "Idea semilla", key: "idea", width: 28 },
    { header: "Nombre proyecto", key: "nombre", width: 28 },
    { header: "Documento / formulación", key: "documento", width: 50 },
    { header: "Prompt", key: "prompt", width: 40 },
    { header: "Nº campos respuesta", key: "nCampos", width: 16 },
  ];
  estiloCabecera(hojaDocs.getRow(1));

  for (const m of mvps) {
    const nCampos = filasRespuestasAplanadas(m).length;
    hojaDocs.addRow({
      id: m.id,
      fecha: format(new Date(m.created_at), "yyyy-MM-dd HH:mm"),
      lab: tituloLab(m.lab),
      colegio: celda(m.colegio),
      brigada: celda(m.brigada),
      lema: celda(m.lema),
      correo: celda(m.correo_lider),
      integrantes: celda(m.integrantes),
      pistas: celda(m.pistas),
      desafio: celda(m.desafio),
      idea: celda(m.idea_semilla),
      nombre: celda(m.nombre),
      documento: celda(m.documento),
      prompt: celda(m.prompt),
      nCampos,
    });
  }
  hojaDocs.eachRow((row, i) => {
    if (i === 1) return;
    row.alignment = { vertical: "top", wrapText: true };
  });

  const hojaResp = wb.addWorksheet("Respuestas", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  hojaResp.columns = [
    { header: "ID documento", key: "mvpId", width: 36 },
    { header: "Fecha", key: "fecha", width: 18 },
    { header: "Lab", key: "lab", width: 22 },
    { header: "Colegio", key: "colegio", width: 28 },
    { header: "Brigada", key: "brigada", width: 22 },
    { header: "Correo líder", key: "correo", width: 28 },
    { header: "Proyecto", key: "proyecto", width: 28 },
    { header: "Misión", key: "mision", width: 28 },
    { header: "Campo", key: "campo", width: 32 },
    { header: "Valor", key: "valor", width: 50 },
  ];
  estiloCabecera(hojaResp.getRow(1));

  for (const m of mvps) {
    for (const fila of filasRespuestasAplanadas(m)) {
      hojaResp.addRow(fila);
    }
  }
  hojaResp.eachRow((row, i) => {
    if (i === 1) return;
    row.alignment = { vertical: "top", wrapText: true };
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function nombreArchivoExcelMvps(cantidad: number): string {
  const stamp = format(new Date(), "yyyy-MM-dd-HHmm");
  return `terralab-mvps-${cantidad}docs-${stamp}.xlsx`;
}

export function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
