/**
 * Util de desarrollo: rellena canvas + la misión 1 de Biodiversidad Viva.
 *
 * En la consola del navegador (solo en DEV, en /mvp):
 *   fillBiodiversidadViva()
 *   fillBiodiversidadViva({ paso: 3, misionIndice: 0 })
 *   fillBiodiversidadViva({ reload: false })
 */

import {
  accionesCuidado,
  amenazasSerVivo,
  camposDiagnosticoSitio,
  camposIndicadorPrincipal,
  clavesBiodiversidadViva,
  criteriosObservacion,
  intervencionesDiseno,
  necesidadesSerVivo,
  pantallasBiodiversidadViva,
  seccionesConexionAtlantico,
  serviciosEcosistemicos,
} from "@/data/biodiversidad-viva-misiones";
import { FORJA_STORAGE_KEY, isTerralabDevFillEnabled } from "@/lib/forja-storage";

/** PNG 1×1 transparente (para campos de imagen en demo). */
const DEMO_IMAGEN_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export type FillBiodiversidadVivaOptions = {
  paso?: number;
  misionIndice?: number;
  reload?: boolean;
};

function canvasDemo() {
  return {
    colegio: "Marymount School Barranquilla (demo)",
    brigada: "Guardianes del Patio",
    lema: "Observar sin tocar, registrar para cuidar",
    correoLider: "lider.demo.biodiversidad@colegio.edu.co",
    integrantes:
      "Lucía — observadora; Mateo — registro; Sofía — mapa; Tomás — evidencia",
    pistas: "Mariposas en el jardín; tronco con hongos; nido en el árbol del patio",
    desafio: "La comunidad desconoce las especies presentes en el colegio",
    ideaSemilla: "Pasaporte de la Vida Escolar: ruta para descubrir especies",
    lab: "biodiversidad",
  };
}

function respuestasBiodiversidadVivaDemo(): Record<string, string> {
  const r: Record<string, string> = {};
  r[clavesBiodiversidadViva.evidenciaImagen] = DEMO_IMAGEN_PNG;
  r[clavesBiodiversidadViva.nombreComun] = "Mariposa amarilla del jardín de entrada";
  r[clavesBiodiversidadViva.tipo] = "fauna";
  r[clavesBiodiversidadViva.lugarMicrohabitat] =
    "Jardín de la portería, sobre las flores naranjas a la sombra de la bougainvillea";
  r[clavesBiodiversidadViva.pistaObservada] =
    "La vimos posarse tres veces; no oímos nada; encontramos polvo amarillo en los pétalos";
  r[clavesBiodiversidadViva.certeza] = "observamos";
  r[clavesBiodiversidadViva.datoConsultar] =
    "Nombre científico y si es polinizadora de las plantas del jardín escolar";

  r[clavesBiodiversidadViva.haceMientras] =
    "Busca néctar y se posa en las flores del jardín de entrada";
  r[clavesBiodiversidadViva.necesidad(1)] = necesidadesSerVivo[3]!.id;
  r[clavesBiodiversidadViva.necesidad(2)] = necesidadesSerVivo[0]!.id;
  r[clavesBiodiversidadViva.accionCuidado(1)] = accionesCuidado[0]!.id;
  r[clavesBiodiversidadViva.accionCuidado(2)] = accionesCuidado[5]!.id;
  r[clavesBiodiversidadViva.amenaza(1)] = amenazasSerVivo[4]!.id;
  r[clavesBiodiversidadViva.amenaza(2)] = amenazasSerVivo[1]!.id;
  r[clavesBiodiversidadViva.siFaltara] =
    "Se rompería la relación con las flores del jardín; el patio perdería visitas de polinizadores y una pista viva para las clases";

  r[clavesBiodiversidadViva.servicio(1)] = serviciosEcosistemicos[5]!.id;
  r[clavesBiodiversidadViva.servicioEvidencia(1)] =
    "La vimos pasar de flor en flor en el jardín de entrada";
  r[clavesBiodiversidadViva.servicio(2)] = serviciosEcosistemicos[15]!.id;
  r[clavesBiodiversidadViva.servicioEvidencia(2)] =
    "La brigada ya usa esta especie para observar sin capturar en clase";
  r[clavesBiodiversidadViva.servicio(3)] = serviciosEcosistemicos[0]!.id;
  r[clavesBiodiversidadViva.servicioEvidencia(3)] =
    "Otras especies visitan las flores donde se posa";
  r[clavesBiodiversidadViva.cuidarlaImporta] =
    "sin ella el jardín pierde polinización visible y una pista viva para aprender";
  r[clavesBiodiversidadViva.amenazaMision] = amenazasSerVivo[4]!.id;
  r[clavesBiodiversidadViva.accionMision] = accionesCuidado[0]!.id;
  r[clavesBiodiversidadViva.accionMisionAdaptada] =
    "Observar la mariposa a distancia desde el jardín de entrada y registrar visitas una vez por semana";
  r[clavesBiodiversidadViva.indicador] =
    "Número de visitas de mariposas observadas en el jardín por semana";

  const valoresDemo = ["2", "1", "1", "2", "0"] as const;
  criteriosObservacion.forEach((c, i) => {
    r[clavesBiodiversidadViva.criterioValor(c.id)] = valoresDemo[i] ?? "1";
    r[clavesBiodiversidadViva.criterioEvidencia(c.id)] =
      `Hallazgo demo en ${c.titulo.toLowerCase()}: observación en el jardín de entrada`;
  });

  for (const seccion of seccionesConexionAtlantico) {
    for (const opcion of seccion.opciones.slice(0, 2)) {
      r[clavesBiodiversidadViva.conexionAtlantico(seccion.id, opcion.id)] = "si";
    }
  }

  const diagnosticosDemo: Record<string, string> = {
    "sostiene-vida":
      "Hay plantas con flores, sombra parcial y visitas frecuentes de insectos polinizadores",
    "condicion-fragil": "El suelo queda expuesto y compactado en la zona de paso",
    verificar: "Si las plantas del jardín son nativas o introducidas",
    "conexion-territorio":
      "El microhábitat del colegio se relaciona con la humedad y el calor del Caribe atlántico",
  };
  for (const campo of camposDiagnosticoSitio) {
    r[clavesBiodiversidadViva.diagnosticoSitio(campo.id)] =
      diagnosticosDemo[campo.id] ?? `Respuesta demo: ${campo.etiqueta}`;
  }

  r[clavesBiodiversidadViva.activosConservar] =
    "Mariposas visitando flores, sombra del árbol del patio, suelo con hojarasca y aprendizaje en el jardín de entrada";
  r[clavesBiodiversidadViva.vaciosAmenazas] =
    "Zona de paso sin cobertura, basura ocasional y poca información señalizada sobre las especies";
  r[clavesBiodiversidadViva.oportunidadEspacio] = "el jardín de entrada";
  r[clavesBiodiversidadViva.oportunidadCondicion] = "las visitas de polinizadores";
  r[clavesBiodiversidadViva.oportunidadBeneficiario] = "estudiantes y la vida del patio";
  r[clavesBiodiversidadViva.oportunidadRiesgo] = "capturar ni dañar las especies";
  r[clavesBiodiversidadViva.oportunidadIndicador] =
    "el número de visitas de mariposas por semana";
  r[clavesBiodiversidadViva.objetivoEcologico] =
    "Mantener y visibilizar las visitas de polinizadores en el jardín de entrada";
  r[clavesBiodiversidadViva.objetivoPedagogico] =
    "Que el estudiantado observe sin capturar y registre evidencias de biodiversidad viva";

  const indicadorDemo: Record<string, string> = {
    "que-se-medira": "Visitas de mariposas observadas",
    unidad: "visitas / semana",
    "linea-base": "2 visitas por semana",
    meta: "al menos 5 visitas por semana",
    periodo: "4 semanas",
    "fuente-responsable": "Brigada Biodiversidad · líder de misión",
  };
  for (const campo of camposIndicadorPrincipal) {
    r[clavesBiodiversidadViva.indicadorPrincipal(campo.id)] =
      indicadorDemo[campo.id] ?? `Demo ${campo.etiqueta}`;
  }

  r[clavesBiodiversidadViva.disenoIntervencion(1)] = intervencionesDiseno[0]!.id;
  r[clavesBiodiversidadViva.disenoIntervencion(2)] = intervencionesDiseno[4]!.id;
  r[clavesBiodiversidadViva.disenoEsquemaImagen] = DEMO_IMAGEN_PNG;
  r[clavesBiodiversidadViva.construirImagen] = DEMO_IMAGEN_PNG;
  r[clavesBiodiversidadViva.probarMejora] =
    "Mejorar la señalización del jardín y ensayar un horario fijo de observación.";
  r[clavesBiodiversidadViva.inspirarTexto] =
    "Nos inspiró ver que cuidar una especie cercana también enseña a cuidar el territorio atlántico.";

  return r;
}

export function buildBiodiversidadVivaDemoGuardado(options: FillBiodiversidadVivaOptions = {}) {
  const paso = options.paso ?? 3;
  const maxIndice = Math.max(0, pantallasBiodiversidadViva.length - 1);
  const misionIndice = Math.min(Math.max(options.misionIndice ?? 0, 0), maxIndice);

  return {
    paso,
    pasoMax: Math.max(paso, 3),
    canvas: canvasDemo(),
    preguntas: [] as Array<{ id: string; pregunta: string; ayuda: string; sugerencia: string }>,
    respuestas: {} as Record<string, string>,
    respuestasEcoTech: {} as Record<string, string>,
    respuestasEcoFluencer: {} as Record<string, string>,
    respuestasEmprendeCircular: {} as Record<string, string>,
    respuestasBiodiversidadViva: respuestasBiodiversidadVivaDemo(),
    misionIndice,
    resultado: null,
  };
}

export function fillBiodiversidadViva(options: FillBiodiversidadVivaOptions = {}) {
  const guardado = buildBiodiversidadVivaDemoGuardado(options);
  sessionStorage.setItem(FORJA_STORAGE_KEY, JSON.stringify(guardado));

  if (options.reload === false) {
    console.info(
      "[terralab] Biodiversidad Viva demo guardado en sessionStorage. Recarga /mvp para verlo.",
      guardado,
    );
    return guardado;
  }

  const url = new URL("/mvp", window.location.origin);
  window.location.assign(url.toString());
  return guardado;
}

export function installDevFillBiodiversidadViva(options: { force?: boolean } = {}) {
  if (typeof window === "undefined") return;

  if (!options.force && !isTerralabDevFillEnabled()) {
    console.info(
      '[terralab] fillBiodiversidadViva desactivado. En preview: localStorage.setItem("terralab-dev-fill","1"); location.reload()',
    );
    return;
  }

  const w = window as Window & {
    fillBiodiversidadViva?: typeof fillBiodiversidadViva;
    terralabDev?: {
      fillEcoFluencer?: unknown;
      fillEmprendeCircular?: unknown;
      fillBiodiversidadViva?: typeof fillBiodiversidadViva;
    };
  };
  w.fillBiodiversidadViva = fillBiodiversidadViva;
  w.terralabDev = { ...w.terralabDev, fillBiodiversidadViva };
  console.info(
    "[terralab] Listo. En consola escribe:\n  window.fillBiodiversidadViva()\n  window.fillBiodiversidadViva({ paso: 3, misionIndice: 1 })",
  );
}

if (typeof window !== "undefined") {
  installDevFillBiodiversidadViva();
}
