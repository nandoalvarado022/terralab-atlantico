import {
  amenazasVisiblesHabitat,
  camposDiagnosticoSitio,
  camposIndicadorPrincipal,
  clavesBiodiversidadViva,
  criteriosObservacion,
  nivelesCerteza,
  opcionesSueloHabitat,
  seccionesConexionAtlantico,
  serviciosEcosistemicos,
  tiposSerVivo,
} from "@/data/biodiversidad-viva-misiones";
import {
  atributosCanal,
  camposBriefCampana,
  canalesAccesibles,
  criteriosImpacto,
  criteriosMensaje,
  momentosCampana,
  tarjetasBrief,
  tarjetasComprension,
  tonosCampana,
} from "@/data/ecofluencer-misiones";
import { pantallasEcoTech } from "@/data/ecotech-misiones";
import {
  accionesCirculares,
  accionesRetoDefinir,
  camposAuditoria,
  camposDetalleAlternativa,
  camposRecorridoReal,
  comprobacionesDefinicion,
  dimensionesDiseno,
  estadosMaterial,
  etapasComprender,
  etapasRecorridoReal,
  unidadesBaseIndicador,
} from "@/data/emprende-circular-misiones";

const etiquetas = new Map<string, string>();

function poner(clave: string, etiqueta: string) {
  etiquetas.set(clave, etiqueta.trim());
}

function cargarEcoTech() {
  for (const pantalla of pantallasEcoTech) {
    for (const seccion of pantalla.secciones) {
      for (const campo of seccion.campos) {
        if (campo.tipo === "tabla") {
          poner(campo.id, campo.etiqueta);
          for (const fila of campo.filas) {
            for (const col of campo.columnas) {
              poner(
                `${campo.id}.${fila.id}.${col.id}`,
                `${campo.etiqueta} · ${fila.etiqueta} · ${col.etiqueta}`,
              );
            }
          }
        } else {
          poner(campo.id, campo.etiqueta);
        }
      }
    }
  }
}

function cargarEcoFluencer() {
  poner("ef1-mensaje", "Mensaje que quieren proyectar");
  poner("ef1-pulso", "Emoción PULSO");
  poner("ef1-eco", "Contraemoción ECO");
  poner("ef1-ajuste", "Ajuste del mensaje");
  for (const criterio of criteriosMensaje) {
    poner(`ef1-criterio-${criterio.id}`, `Criterio del mensaje · ${criterio.etiqueta}`);
  }
  poner("ef2-caso", "Caso que están investigando");
  poner("ef2-hallazgo", "Hallazgo de comportamiento");
  for (const tarjeta of tarjetasComprension) {
    poner(`ef2-${tarjeta.id}`, tarjeta.pregunta);
  }
  poner("ef3-publico", "Público objetivo");
  poner("ef3-mensaje", "Mensaje ajustado");
  for (const n of [1, 2, 3]) {
    poner(`ef3-persona-${n}`, `Persona ${n}`);
    for (const criterio of criteriosImpacto) {
      poner(`ef3-check-${n}-${criterio.id}`, `Persona ${n} · ${criterio.etiqueta}`);
    }
  }
  for (const tarjeta of tarjetasBrief) {
    poner(`ef4-${tarjeta.id}`, `${tarjeta.titulo} · ${tarjeta.pregunta}`);
  }
  for (const campo of camposBriefCampana) {
    poner(`ef6-brief-${campo.id}`, `Brief de campaña · ${campo.etiqueta}`);
  }
  for (const momento of momentosCampana) {
    poner(`ef6-momento-${momento.id}-decision`, `${momento.titulo} · decisión`);
    poner(`ef6-momento-${momento.id}-canal`, `${momento.titulo} · canal`);
  }
  poner("ef6-identidad-nombre", "Nombre de la campaña");
  poner("ef6-identidad-lema", "Lema de la campaña");
  poner("ef6-identidad-tono", "Tono de la campaña");
  poner("ef6-identidad-tono-otro", "Otro tono");
  poner("ef6-identidad-simbolo", "Símbolo, personaje o composición visual");
  poner("ef6-mensaje-principal", "Mensaje principal");
  for (const canal of canalesAccesibles) {
    poner(`ef6-canal-acc-${canal.id}`, `Canal accesible · ${canal.etiqueta}`);
  }
  for (const tipo of ["principal", "apoyo"] as const) {
    const nombre = tipo === "principal" ? "Canal principal" : "Canal de apoyo";
    poner(`ef6-canal-${tipo}-canal`, nombre);
    poner(`ef6-canal-${tipo}-momento`, `${nombre} · momento`);
    for (const atributo of atributosCanal) {
      poner(`ef6-canal-${tipo}-attr-${atributo.id}`, `${nombre} · ${atributo.etiqueta}`);
    }
  }
  poner("ef7-construir-imagen", "Construir · imagen o video");
  poner("ef7-probar-mejora", "Qué se puede mejorar después de probar");
  poner("ef8-inspirar-texto", "Cómo esto los inspiró a construir");
}

function cargarEmprendeCircular() {
  poner("ec1-material-imagen", "Dibujo o foto del material");
  poner("ec1-material-nombre", "Nombre del material");
  poner("ec1-material-descripcion", "Descripción del material");
  poner("ec1-donde-aparece", "Dónde aparece");
  poner("ec1-pista-dia", "Pista del día");
  for (const estado of estadosMaterial) {
    poner(`ec1-estado-${estado.id}`, `Estado del material · ${estado.etiqueta}`);
  }
  for (const n of [1, 2, 3] as const) {
    poner(`ec1-opcion-${n}-accion`, `Opción ${n} · acción`);
    poner(`ec1-opcion-${n}-como`, `Opción ${n} · cómo la aplicarían`);
  }
  for (const etapa of etapasComprender) {
    poner(`ec2-${etapa.id}-nota`, `${etapa.titulo} · qué ocurre`);
    poner(`ec2-${etapa.id}-quien`, `${etapa.titulo} · quién interviene`);
    poner(`ec2-${etapa.id}-evidencia`, `${etapa.titulo} · tipo de evidencia`);
    poner(`ec2-${etapa.id}-fuente`, `${etapa.titulo} · fuente`);
  }
  poner("ec2-hallazgo-clave", "Hallazgo clave");
  poner("ec2-pregunta-prioritaria", "Pregunta prioritaria");
  for (const campo of camposAuditoria) {
    poner(`ec3-auditoria-${campo.id}`, campo.titulo);
  }
  for (const accion of accionesCirculares) {
    poner(`ec3-oportunidad-${accion.id}`, `Oportunidad · ${accion.titulo}`);
  }
  poner("ec3-alternativa-a", "Alternativa A");
  poner("ec3-alternativa-b", "Alternativa B");
  for (const letra of ["a", "b"] as const) {
    for (const campo of ["nombre", "lema", "descripcion", "recursos", "resultado"] as const) {
      const detalle = camposDetalleAlternativa.find((c) => c.id === campo);
      poner(
        `ec3-alt-${letra}-${campo}`,
        `Alternativa ${letra.toUpperCase()} · ${detalle?.titulo ?? campo}`,
      );
    }
  }
  for (const etapa of etapasRecorridoReal) {
    for (const campo of camposRecorridoReal) {
      poner(`ec4-recorrido-${etapa.id}-${campo.id}`, `${etapa.titulo} · ${campo.etiqueta}`);
    }
  }
  poner("ec4-reto-para", "Reto · para quién");
  poner("ec4-reto-accion", "Reto · acción");
  poner("ec4-reto-material", "Reto · material");
  poner("ec4-reto-lugar", "Reto · lugar");
  poner("ec4-reto-mecanismo", "Reto · mecanismo");
  poner("ec4-reto-indicador", "Reto · indicador");
  poner("ec4-indicador-que-mediremos", "Qué mediremos");
  for (const unidad of unidadesBaseIndicador) {
    poner(`ec4-unidad-${unidad.id}`, `Unidad · ${unidad.etiqueta}`);
  }
  poner("ec4-linea-base", "Línea base");
  poner("ec4-periodo-fuente", "Periodo y fuente");
  poner("ec4-meta", "Meta");
  poner("ec4-fecha-revision", "Fecha de revisión");
  for (const check of comprobacionesDefinicion) {
    poner(`ec4-check-${check.id}`, `Comprobación · ${check.etiqueta}`);
  }
  for (const dimension of dimensionesDiseno) {
    poner(`ec5-diseno-${dimension.id}`, dimension.titulo);
  }
  poner("ec5-prototipo-imagen", "Logo o marca del producto / prototipo");
  poner("ec6-construir-imagen", "Construir · imagen o video");
  poner("ec7-probar-mejora", "Qué se puede mejorar después de probar");
  poner("ec8-inspirar-texto", "Cómo esto los inspiró a construir");
}

function cargarBiodiversidad() {
  const c = clavesBiodiversidadViva;
  poner(c.evidenciaImagen, "Dibujo, foto o huella");
  poner(c.nombreComun, "Nombre común o descripción");
  poner(c.tipo, "Tipo de ser vivo");
  poner(c.lugarMicrohabitat, "Lugar exacto y microhábitat");
  poner(c.pistaObservada, "Pista observada");
  poner(c.certeza, "Nivel de certeza");
  poner(c.datoConsultar, "Dato que debemos consultar");
  poner(c.haceMientras, "Qué hace mientras tanto");
  poner(c.siFaltara, "Si faltara");
  poner(c.cuidarlaImporta, "Por qué cuidarla importa");
  poner(c.amenazaMision, "Amenaza de la misión");
  poner(c.accionMision, "Acción de la misión");
  poner(c.accionMisionAdaptada, "Acción de la misión adaptada");
  poner(c.indicador, "Indicador");
  for (const n of [1, 2] as const) {
    poner(c.necesidad(n), `Necesidad ${n}`);
    poner(c.amenaza(n), `Amenaza ${n}`);
    poner(c.accionCuidado(n), `Acción de cuidado ${n}`);
  }
  for (const n of [1, 2, 3] as const) {
    poner(c.servicio(n), `Servicio ecosistémico ${n}`);
    poner(c.servicioEvidencia(n), `Evidencia del servicio ${n}`);
    poner(c.servicioOtro(n), `Otro aporte del servicio ${n}`);
  }
  for (const criterio of criteriosObservacion) {
    poner(c.criterioValor(criterio.id), `${criterio.titulo} · valor`);
    poner(c.criterioEvidencia(criterio.id), `${criterio.titulo} · evidencia`);
  }
  for (const seccion of seccionesConexionAtlantico) {
    for (const opcion of seccion.opciones) {
      poner(c.conexionAtlantico(seccion.id, opcion.id), `${seccion.titulo} · ${opcion.etiqueta}`);
    }
  }
  for (const campo of camposDiagnosticoSitio) {
    poner(c.diagnosticoSitio(campo.id), campo.etiqueta);
  }
  poner(c.puntoInicio, "Punto de inicio");
  poner(c.puntoCierre, "Punto de cierre");
  poner(c.tipoArbolesPlantas, "Tipo de árboles y plantas");
  poner(c.tiposAve, "Tipos de ave");
  poner(c.tipoInsectosPolinizadores, "Tipo de insectos polinizadores");
  poner(c.coberturaVegetal, "Cobertura vegetal");
  poner(c.sombra, "Sombra");
  poner(c.polinizadoresVisitas, "Visitas de polinizadores");
  poner(c.polinizadoresPlanta, "Planta de los polinizadores");
  poner(c.activosConservar, "Activos a conservar");
  poner(c.vaciosAmenazas, "Vacíos y amenazas");
  poner(c.oportunidadEspacio, "Oportunidad · espacio");
  poner(c.oportunidadCondicion, "Oportunidad · condición");
  poner(c.oportunidadBeneficiario, "Oportunidad · beneficiario");
  poner(c.oportunidadRiesgo, "Oportunidad · riesgo");
  poner(c.oportunidadIndicador, "Oportunidad · indicador");
  poner(c.objetivoEcologico, "Objetivo ecológico");
  poner(c.objetivoPedagogico, "Objetivo pedagógico");
  for (const campo of camposIndicadorPrincipal) {
    poner(c.indicadorPrincipal(campo.id), `Indicador principal · ${campo.etiqueta}`);
  }
  poner(c.disenoRetoDefinido, "Reto definido");
  poner(c.disenoObjetivoEcologico, "Diseño · objetivo ecológico");
  poner(c.disenoObjetivoPedagogico, "Diseño · objetivo pedagógico");
  poner(c.disenoEvidenciaSitio, "Evidencia del sitio");
  poner(c.disenoDatoVerificar, "Dato a verificar");
  poner(c.disenoNombreEstrategia, "Nombre de la estrategia");
  poner(c.disenoEsquemaImagen, "Diseñar · imagen o esquema");
  for (const n of [1, 2] as const) {
    poner(c.disenoIntervencion(n), `Intervención ${n}`);
  }
  for (const suelo of opcionesSueloHabitat) {
    poner(c.suelo(suelo.id), `Suelo · ${suelo.etiqueta}`);
  }
  for (const amenaza of amenazasVisiblesHabitat) {
    poner(c.amenazaVisible(amenaza.id), `Amenaza visible · ${amenaza.etiqueta}`);
  }
  poner(c.construirImagen, "Construir · imagen o video");
  poner(c.probarMejora, "Qué se puede mejorar después de probar");
  poner(c.inspirarTexto, "Cómo esto los inspiró a construir");
}

cargarEcoTech();
cargarEcoFluencer();
cargarEmprendeCircular();
cargarBiodiversidad();

function humanizarClave(clave: string): string {
  const sinPrefijo = clave.replace(/^(m\d+|ec\d+|ef\d+|bv\d+)-/, "");
  const texto = sinPrefijo.replace(/[-_.]/g, " ").replace(/\s+/g, " ").trim();
  if (!texto) return clave;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Nombre legible de una clave guardada en `respuestas`. */
export function etiquetaCampoRespuesta(clave: string): string {
  return etiquetas.get(clave) ?? humanizarClave(clave);
}

const valoresPorClave = new Map<string, Map<string, string>>();

function ponerValores(clave: string, opciones: Array<{ id: string; etiqueta: string }>) {
  valoresPorClave.set(clave, new Map(opciones.map((o) => [o.id, o.etiqueta])));
}

ponerValores(clavesBiodiversidadViva.tipo, tiposSerVivo);
ponerValores(clavesBiodiversidadViva.certeza, nivelesCerteza);
ponerValores(
  "ec4-reto-accion",
  accionesRetoDefinir.map((a) => ({ id: a.id, etiqueta: a.etiqueta })),
);
ponerValores(
  "ef6-identidad-tono",
  tonosCampana.map((t) => ({ id: t.id, etiqueta: t.etiqueta })),
);
ponerValores("ef3-publico", [
  { id: "primaria", etiqueta: "Primaria" },
  { id: "bachillerato", etiqueta: "Bachillerato" },
  { id: "docentes", etiqueta: "Docentes" },
  { id: "familias", etiqueta: "Familias" },
  { id: "cafeteria", etiqueta: "Cafetería" },
  { id: "otros", etiqueta: "Otros" },
]);

const serviciosPorId = new Map(serviciosEcosistemicos.map((s) => [s.id, s.titulo]));

/** Si el valor guardado es un id del catálogo, devuelve su etiqueta. */
export function valorLegibleRespuesta(clave: string, valor: string): string {
  const directo = valoresPorClave.get(clave)?.get(valor);
  if (directo) return directo;
  if (clave.startsWith("ec2-") && clave.endsWith("-evidencia")) {
    const evidencia = [
      { id: "dato", etiqueta: "Dato" },
      { id: "estimacion", etiqueta: "Estimación" },
      { id: "pregunta", etiqueta: "Pregunta" },
    ].find((v) => v.id === valor);
    if (evidencia) return evidencia.etiqueta;
  }
  if (/^bv1-servicio-[123]$/.test(clave)) {
    return serviciosPorId.get(valor) ?? valor;
  }
  if (/^bv2-criterio-.+-valor$/.test(clave)) {
    const item = [
      { id: "2", etiqueta: "2 — favorable y observado" },
      { id: "1", etiqueta: "1 — parcial, estacional o incompleto" },
      { id: "0", etiqueta: "0 — ausencia o riesgo visible" },
      { id: "vt", etiqueta: "VT — requiere verificación técnica" },
    ].find((v) => v.id === valor);
    if (item) return item.etiqueta;
  }
  if (valor === "si" || valor === "true") return "Sí";
  if (valor === "no" || valor === "false") return "No";
  return valor;
}
