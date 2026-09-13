import {
  accionPorId,
  accionesCirculares,
  accionesRetoDefinir,
  camposAuditoria,
  clavesEmprendeCircular,
  comprobacionesDefinicion,
  etapasComprender,
  etiquetaEvidencia,
  estadosMaterial,
  etapasRecorridoReal,
  camposRecorridoReal,
  dimensionesDiseno,
  unidadesBaseIndicador,
} from "@/data/emprende-circular-misiones";

export function flattenRespuestasEmprendeCircular(
  respuestas: Record<string, string>,
): { pregunta: string; respuesta: string }[] {
  const salida: { pregunta: string; respuesta: string }[] = [];

  const nombre = respuestas[clavesEmprendeCircular.materialNombre]?.trim();
  if (nombre) salida.push({ pregunta: "Nombre del material", respuesta: nombre });

  const descripcion = respuestas[clavesEmprendeCircular.materialDescripcion]?.trim();
  if (descripcion) salida.push({ pregunta: "Descripción del material", respuesta: descripcion });

  if (respuestas[clavesEmprendeCircular.materialImagen]?.trim()) {
    salida.push({ pregunta: "Dibujo o foto del material", respuesta: "(imagen adjuntada)" });
  }

  const donde = respuestas[clavesEmprendeCircular.dondeAparece]?.trim();
  if (donde) salida.push({ pregunta: "¿Dónde aparece?", respuesta: donde });

  const pista = respuestas[clavesEmprendeCircular.pistaDia]?.trim();
  if (pista) salida.push({ pregunta: "Una pista del día", respuesta: pista });

  const estadosMarcados = estadosMaterial
    .filter((e) => respuestas[clavesEmprendeCircular.estado(e.id)] === "si")
    .map((e) => e.etiqueta);
  if (estadosMarcados.length) {
    salida.push({ pregunta: "Estado del material", respuesta: estadosMarcados.join(", ") });
  }

  for (const n of [1, 2, 3] as const) {
    const accion = accionPorId(respuestas[clavesEmprendeCircular.opcionAccion(n)]);
    const como = respuestas[clavesEmprendeCircular.opcionComo(n)]?.trim();
    if (!accion && !como) continue;
    const partes = [
      accion ? `${accion.titulo}: ${accion.definicion}` : null,
      como ? `Cómo sería aquí: ${como}` : null,
    ].filter(Boolean);
    salida.push({
      pregunta: `Opción ${n} · Acción`,
      respuesta: partes.join(" · "),
    });
  }

  for (const etapa of etapasComprender) {
    const nota = respuestas[clavesEmprendeCircular.etapaNota(etapa.id)]?.trim();
    const quien = respuestas[clavesEmprendeCircular.etapaQuien(etapa.id)]?.trim();
    const evidencia = etiquetaEvidencia(respuestas[clavesEmprendeCircular.etapaEvidencia(etapa.id)]);
    const fuente = respuestas[clavesEmprendeCircular.etapaFuente(etapa.id)]?.trim();
    if (!nota && !quien && !evidencia && !fuente) continue;
    const partes = [
      nota,
      quien ? `Quién: ${quien}` : null,
      evidencia ? `Cómo lo sabemos: ${evidencia}` : null,
      fuente ? `Fuente/método: ${fuente}` : null,
    ].filter(Boolean);
    salida.push({
      pregunta: `Comprender · ${etapa.numero}. ${etapa.titulo}`,
      respuesta: partes.join(" · "),
    });
  }

  const hallazgo = respuestas[clavesEmprendeCircular.hallazgoClave]?.trim();
  if (hallazgo) {
    salida.push({
      pregunta: "Hallazgo clave · El material pierde valor cuando",
      respuesta: hallazgo,
    });
  }

  const preguntaPrioritaria = respuestas[clavesEmprendeCircular.preguntaPrioritaria]?.trim();
  if (preguntaPrioritaria) {
    salida.push({ pregunta: "Pregunta prioritaria", respuesta: preguntaPrioritaria });
  }

  for (const campo of camposAuditoria) {
    const valor = respuestas[clavesEmprendeCircular.auditoria(campo.id)]?.trim();
    if (valor) {
      salida.push({
        pregunta: `Auditoría · ${campo.titulo}`,
        respuesta: valor,
      });
    }
  }

  const oportunidades = accionesCirculares
    .filter((a) => respuestas[clavesEmprendeCircular.oportunidad(a.id)] === "si")
    .map((a) => a.titulo);
  if (oportunidades.length) {
    salida.push({
      pregunta: "Oportunidades circulares marcadas",
      respuesta: oportunidades.join(", "),
    });
  }

  const altA = respuestas[clavesEmprendeCircular.alternativaA]?.trim();
  if (altA) {
    salida.push({ pregunta: "Alternativa A", respuesta: altA });
  }

  for (const campo of [
    { id: "descripcion" as const, titulo: "Descripción" },
    { id: "recursos" as const, titulo: "Recursos" },
    { id: "resultado" as const, titulo: "Resultado esperado" },
  ]) {
    const valor = respuestas[clavesEmprendeCircular.alternativaCampo("a", campo.id)]?.trim();
    if (valor) {
      salida.push({
        pregunta: `Alternativa A · ${campo.titulo}`,
        respuesta: valor,
      });
    }
  }

  for (const etapa of etapasRecorridoReal) {
    const partes: string[] = [];
    for (const campo of camposRecorridoReal) {
      const valor = respuestas[clavesEmprendeCircular.recorridoCampo(etapa.id, campo.id)]?.trim();
      if (valor) partes.push(`${campo.etiqueta.replace(/:$/, "")}: ${valor}`);
    }
    if (partes.length) {
      salida.push({
        pregunta: `Recorrido real · ${etapa.titulo}`,
        respuesta: partes.join(" · "),
      });
    }
  }

  const retoPara = respuestas[clavesEmprendeCircular.retoPara]?.trim();
  const retoAccionId = respuestas[clavesEmprendeCircular.retoAccion];
  const retoAccion = accionesRetoDefinir.find((a) => a.id === retoAccionId)?.etiqueta;
  const retoMaterial = respuestas[clavesEmprendeCircular.retoMaterial]?.trim();
  const retoLugar = respuestas[clavesEmprendeCircular.retoLugar]?.trim();
  const retoMecanismo = respuestas[clavesEmprendeCircular.retoMecanismo]?.trim();
  const retoIndicador = respuestas[clavesEmprendeCircular.retoIndicador]?.trim();
  const partesReto = [
    retoPara ? `Para ${retoPara}` : null,
    retoAccion,
    retoMaterial,
    retoLugar ? `en ${retoLugar}` : null,
    retoMecanismo ? `mediante ${retoMecanismo}` : null,
    retoIndicador ? `y lo verificaremos con ${retoIndicador}` : null,
  ].filter(Boolean);
  if (partesReto.length) {
    salida.push({ pregunta: "Construyan el reto", respuesta: partesReto.join(" ") });
  }

  const queMediremos = respuestas[clavesEmprendeCircular.indicadorQueMediremos]?.trim();
  if (queMediremos) {
    salida.push({ pregunta: "Qué mediremos", respuesta: queMediremos });
  }

  const unidades = unidadesBaseIndicador
    .filter((u) => respuestas[clavesEmprendeCircular.unidadBase(u.id)] === "si")
    .map((u) => u.etiqueta);
  if (unidades.length) {
    salida.push({ pregunta: "Unidad base", respuesta: unidades.join(", ") });
  }

  const lineaBase = respuestas[clavesEmprendeCircular.lineaBase]?.trim();
  if (lineaBase) salida.push({ pregunta: "Línea base", respuesta: lineaBase });

  const periodo = respuestas[clavesEmprendeCircular.periodoFuente]?.trim();
  if (periodo) salida.push({ pregunta: "Periodo / fuente", respuesta: periodo });

  const meta = respuestas[clavesEmprendeCircular.meta]?.trim();
  if (meta) salida.push({ pregunta: "Meta", respuesta: meta });

  const fecha = respuestas[clavesEmprendeCircular.fechaRevision]?.trim();
  if (fecha) salida.push({ pregunta: "Fecha de revisión", respuesta: fecha });

  const checks = comprobacionesDefinicion
    .filter((c) => respuestas[clavesEmprendeCircular.comprobacion(c.id)] === "si")
    .map((c) => c.etiqueta);
  if (checks.length) {
    salida.push({ pregunta: "Comprobación de la definición", respuesta: checks.join("; ") });
  }

  for (const dim of dimensionesDiseno) {
    const valor = respuestas[clavesEmprendeCircular.diseno(dim.id)]?.trim();
    if (valor) {
      salida.push({ pregunta: `Diseñar · ${dim.titulo}`, respuesta: valor });
    }
  }

  if (respuestas[clavesEmprendeCircular.prototipoImagen]?.trim()) {
    salida.push({ pregunta: "Foto del prototipo", respuesta: "(imagen adjuntada)" });
  }

  return salida;
}
