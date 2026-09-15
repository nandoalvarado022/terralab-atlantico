import {
  accionCuidadoPorId,
  amenazaPorId,
  camposDiagnosticoSitio,
  camposIndicadorPrincipal,
  clavesBiodiversidadViva,
  criteriosObservacion,
  etiquetaCategoriaServicio,
  etiquetaNivelCerteza,
  etiquetaTipoSerVivo,
  etiquetaValorObservacion,
  fraseOportunidadBiodiversidad,
  intervencionDisenoPorId,
  necesidadPorId,
  seccionesConexionAtlantico,
  servicioPorId,
} from "@/data/biodiversidad-viva-misiones";

export function flattenRespuestasBiodiversidadViva(
  respuestas: Record<string, string>,
): { pregunta: string; respuesta: string }[] {
  const salida: { pregunta: string; respuesta: string }[] = [];

  if (respuestas[clavesBiodiversidadViva.evidenciaImagen]?.trim()) {
    salida.push({ pregunta: "Dibujo, foto o huella", respuesta: "(imagen adjuntada)" });
  }

  const nombre = respuestas[clavesBiodiversidadViva.nombreComun]?.trim();
  if (nombre) {
    salida.push({ pregunta: "Nombre común o descripción", respuesta: nombre });
  }

  const tipo = etiquetaTipoSerVivo(respuestas[clavesBiodiversidadViva.tipo]);
  if (tipo) salida.push({ pregunta: "Tipo de ser vivo", respuesta: tipo });

  const lugar = respuestas[clavesBiodiversidadViva.lugarMicrohabitat]?.trim();
  if (lugar) {
    salida.push({ pregunta: "Lugar exacto y microhábitat", respuesta: lugar });
  }

  const pista = respuestas[clavesBiodiversidadViva.pistaObservada]?.trim();
  if (pista) {
    salida.push({
      pregunta: "Pista observada (qué vimos, oímos o encontramos)",
      respuesta: pista,
    });
  }

  const certeza = etiquetaNivelCerteza(respuestas[clavesBiodiversidadViva.certeza]);
  if (certeza) salida.push({ pregunta: "Nivel de certeza", respuesta: certeza });

  const dato = respuestas[clavesBiodiversidadViva.datoConsultar]?.trim();
  if (dato) {
    salida.push({ pregunta: "Dato que debemos consultar", respuesta: dato });
  }

  const haceMientras = respuestas[clavesBiodiversidadViva.haceMientras]?.trim();
  if (haceMientras) {
    salida.push({
      pregunta: "Qué hace mientras nadie la mira",
      respuesta: haceMientras,
    });
  }

  for (const n of [1, 2] as const) {
    const necesidad = necesidadPorId(respuestas[clavesBiodiversidadViva.necesidad(n)]);
    if (necesidad) {
      salida.push({
        pregunta: `Lo que necesita · tarjeta ${n}`,
        respuesta: `${necesidad.titulo}: ${necesidad.descripcion}`,
      });
    }
  }

  for (const n of [1, 2] as const) {
    const accion = accionCuidadoPorId(respuestas[clavesBiodiversidadViva.accionCuidado(n)]);
    if (accion) {
      salida.push({
        pregunta: `Acción de cuidado · tarjeta ${n}`,
        respuesta: `${accion.titulo}: ${accion.descripcion}`,
      });
    }
  }

  for (const n of [1, 2] as const) {
    const amenaza = amenazaPorId(respuestas[clavesBiodiversidadViva.amenaza(n)]);
    if (amenaza) {
      salida.push({
        pregunta: `Lo que podría amenazarla · tarjeta ${n}`,
        respuesta: `${amenaza.titulo}: ${amenaza.descripcion}`,
      });
    }
  }

  const siFaltara = respuestas[clavesBiodiversidadViva.siFaltara]?.trim();
  if (siFaltara) {
    salida.push({
      pregunta: "Si esta vida faltara…",
      respuesta: siFaltara,
    });
  }

  for (const n of [1, 2, 3] as const) {
    const servicio = servicioPorId(respuestas[clavesBiodiversidadViva.servicio(n)]);
    if (!servicio) continue;
    const otro = respuestas[clavesBiodiversidadViva.servicioOtro(n)]?.trim();
    const evidencia = respuestas[clavesBiodiversidadViva.servicioEvidencia(n)]?.trim();
    const titulo = servicio.esOtro && otro ? otro : servicio.titulo;
    const partes = [
      `${etiquetaCategoriaServicio(servicio.categoria)} · ${titulo}`,
      !servicio.esOtro ? servicio.descripcion : null,
      evidencia ? `Evidencia: ${evidencia}` : null,
    ].filter(Boolean);
    salida.push({
      pregunta: `Servicio ${n}`,
      respuesta: partes.join(" · "),
    });
  }

  const cuidarla = respuestas[clavesBiodiversidadViva.cuidarlaImporta]?.trim();
  if (cuidarla) {
    salida.push({ pregunta: "Cuidarla importa porque…", respuesta: cuidarla });
  }

  const amenazaMision = amenazaPorId(respuestas[clavesBiodiversidadViva.amenazaMision]);
  if (amenazaMision) {
    salida.push({
      pregunta: "Amenaza o barrera (misión de cuidado)",
      respuesta: `${amenazaMision.titulo}: ${amenazaMision.descripcion}`,
    });
  }

  const accionMision = accionCuidadoPorId(respuestas[clavesBiodiversidadViva.accionMision]);
  if (accionMision) {
    const adaptada = respuestas[clavesBiodiversidadViva.accionMisionAdaptada]?.trim();
    salida.push({
      pregunta: "Acción de cuidado (misión)",
      respuesta: adaptada
        ? `${accionMision.titulo}: ${adaptada}`
        : `${accionMision.titulo}: ${accionMision.descripcion}`,
    });
  }

  const indicador = respuestas[clavesBiodiversidadViva.indicador]?.trim();
  if (indicador) {
    salida.push({ pregunta: "Indicador (qué veremos o contaremos)", respuesta: indicador });
  }

  for (const criterio of criteriosObservacion) {
    const valor = etiquetaValorObservacion(
      respuestas[clavesBiodiversidadViva.criterioValor(criterio.id)],
    );
    const evidencia = respuestas[clavesBiodiversidadViva.criterioEvidencia(criterio.id)]?.trim();
    if (!valor && !evidencia) continue;
    const partes = [
      valor ? `Valor: ${valor}` : null,
      evidencia ? `Evidencia: ${evidencia}` : null,
    ].filter(Boolean);
    salida.push({
      pregunta: `Comprender · ${criterio.numero}. ${criterio.titulo}`,
      respuesta: partes.join(" · "),
    });
  }

  for (const seccion of seccionesConexionAtlantico) {
    const marcadas = seccion.opciones
      .filter(
        (o) =>
          respuestas[clavesBiodiversidadViva.conexionAtlantico(seccion.id, o.id)] === "si",
      )
      .map((o) => o.etiqueta);
    if (!marcadas.length) continue;
    salida.push({
      pregunta: `Conexión con el Atlántico · ${seccion.titulo}`,
      respuesta: marcadas.join(", "),
    });
  }

  for (const campo of camposDiagnosticoSitio) {
    const valor = respuestas[clavesBiodiversidadViva.diagnosticoSitio(campo.id)]?.trim();
    if (!valor) continue;
    salida.push({
      pregunta: `Diagnóstico del sitio · ${campo.etiqueta}`,
      respuesta: valor,
    });
  }

  const activos = respuestas[clavesBiodiversidadViva.activosConservar]?.trim();
  if (activos) {
    salida.push({
      pregunta: "Definir · Activos que debemos conservar o visibilizar",
      respuesta: activos,
    });
  }

  const vacios = respuestas[clavesBiodiversidadViva.vaciosAmenazas]?.trim();
  if (vacios) {
    salida.push({
      pregunta: "Definir · Vacíos, degradación o amenazas",
      respuesta: vacios,
    });
  }

  const oportunidad = fraseOportunidadBiodiversidad(respuestas);
  if (oportunidad) {
    salida.push({
      pregunta: "Definir · Oportunidad en una frase",
      respuesta: oportunidad,
    });
  }

  const objetivoEcologico = respuestas[clavesBiodiversidadViva.objetivoEcologico]?.trim();
  if (objetivoEcologico) {
    salida.push({
      pregunta: "Definir · Objetivo ecológico",
      respuesta: objetivoEcologico,
    });
  }

  const objetivoPedagogico = respuestas[clavesBiodiversidadViva.objetivoPedagogico]?.trim();
  if (objetivoPedagogico) {
    salida.push({
      pregunta: "Definir · Objetivo pedagógico",
      respuesta: objetivoPedagogico,
    });
  }

  const partesIndicador = camposIndicadorPrincipal
    .map((c) => {
      const valor = respuestas[clavesBiodiversidadViva.indicadorPrincipal(c.id)]?.trim();
      return valor ? `${c.etiqueta}: ${valor}` : null;
    })
    .filter(Boolean);
  if (partesIndicador.length) {
    salida.push({
      pregunta: "Definir · Indicador principal",
      respuesta: partesIndicador.join(" · "),
    });
  }

  const retoDiseno = respuestas[clavesBiodiversidadViva.disenoRetoDefinido]?.trim();
  if (retoDiseno) {
    salida.push({ pregunta: "Diseñar · Reto definido", respuesta: retoDiseno });
  }

  const objEcoDiseno = respuestas[clavesBiodiversidadViva.disenoObjetivoEcologico]?.trim();
  if (objEcoDiseno) {
    salida.push({ pregunta: "Diseñar · Objetivo ecológico", respuesta: objEcoDiseno });
  }

  const objPedDiseno = respuestas[clavesBiodiversidadViva.disenoObjetivoPedagogico]?.trim();
  if (objPedDiseno) {
    salida.push({ pregunta: "Diseñar · Objetivo pedagógico", respuesta: objPedDiseno });
  }

  const evidenciaDiseno = respuestas[clavesBiodiversidadViva.disenoEvidenciaSitio]?.trim();
  if (evidenciaDiseno) {
    salida.push({ pregunta: "Diseñar · Evidencia del sitio", respuesta: evidenciaDiseno });
  }

  const datoDiseno = respuestas[clavesBiodiversidadViva.disenoDatoVerificar]?.trim();
  if (datoDiseno) {
    salida.push({ pregunta: "Diseñar · Dato por verificar", respuesta: datoDiseno });
  }

  const intervencionPrincipal = intervencionDisenoPorId(
    respuestas[clavesBiodiversidadViva.disenoIntervencion(1)],
  );
  if (intervencionPrincipal) {
    salida.push({
      pregunta: "Diseñar · Intervención principal",
      respuesta: `${intervencionPrincipal.titulo}: ${intervencionPrincipal.descripcion}`,
    });
  }

  const intervencionComplementaria = intervencionDisenoPorId(
    respuestas[clavesBiodiversidadViva.disenoIntervencion(2)],
  );
  if (intervencionComplementaria) {
    salida.push({
      pregunta: "Diseñar · Intervención complementaria",
      respuesta: `${intervencionComplementaria.titulo}: ${intervencionComplementaria.descripcion}`,
    });
  }

  if (respuestas[clavesBiodiversidadViva.disenoEsquemaImagen]?.trim()) {
    salida.push({ pregunta: "Diseñar · Esquema", respuesta: "(imagen adjuntada)" });
  }

  if (respuestas[clavesBiodiversidadViva.construirImagen]?.trim()) {
    const esVideo = /^data:video\//i.test(respuestas[clavesBiodiversidadViva.construirImagen]);
    salida.push({
      pregunta: "Construir · archivo",
      respuesta: esVideo ? "video cargado" : "imagen cargada",
    });
  }

  const mejora = respuestas[clavesBiodiversidadViva.probarMejora]?.trim();
  if (mejora) {
    salida.push({ pregunta: "Probar · qué se puede mejorar", respuesta: mejora });
  }

  const inspirar = respuestas[clavesBiodiversidadViva.inspirarTexto]?.trim();
  if (inspirar) {
    salida.push({
      pregunta: "Inspirar · como esto te inspiró a construir",
      respuesta: inspirar,
    });
  }

  return salida;
}
