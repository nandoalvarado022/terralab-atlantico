export type PantallaBiodiversidadViva = {
  id: string;
  numero: number;
  nombre: string;
  tagline?: string;
  instrucciones: string;
};

export type TipoSerVivo = {
  id: string;
  etiqueta: string;
};

export type NivelCerteza = {
  id: string;
  etiqueta: string;
};

/** Clasificación del ser o elemento vivo (misión 1 · punto 1). Selección única. */
export const tiposSerVivo: TipoSerVivo[] = [
  { id: "fauna", etiqueta: "Fauna" },
  { id: "flora", etiqueta: "Flora" },
  { id: "hongo", etiqueta: "Hongo" },
  { id: "otro", etiqueta: "Otro" },
];

/** Nivel de certeza de la observación (misión 1 · punto 1). Selección única. */
export const nivelesCerteza: NivelCerteza[] = [
  { id: "observamos", etiqueta: "Lo observamos" },
  { id: "hipotesis", etiqueta: "Es hipótesis" },
  { id: "confirmar", etiqueta: "Confirmar" },
];

export function etiquetaTipoSerVivo(id: string | undefined): string {
  if (!id) return "";
  return tiposSerVivo.find((t) => t.id === id)?.etiqueta ?? id;
}

export function etiquetaNivelCerteza(id: string | undefined): string {
  if (!id) return "";
  return nivelesCerteza.find((n) => n.id === id)?.etiqueta ?? id;
}

export type TarjetaRedInvisible = {
  id: string;
  titulo: string;
  descripcion: string;
};

/** Catálogo A · Lo que necesita (misión 1 · punto 2). */
export const necesidadesSerVivo: TarjetaRedInvisible[] = [
  {
    id: "agua",
    titulo: "Agua",
    descripcion: "Para beber, crecer o mantener su ciclo de vida.",
  },
  {
    id: "luz-sombra",
    titulo: "Luz o sombra",
    descripcion: "Según la especie y su microhábitat.",
  },
  {
    id: "suelo-sustrato",
    titulo: "Suelo o sustrato",
    descripcion: "Tierra, tronco, roca, hojarasca o agua.",
  },
  {
    id: "alimento-nectar",
    titulo: "Alimento o néctar",
    descripcion: "Recursos disponibles en el entorno.",
  },
  {
    id: "refugio",
    titulo: "Refugio",
    descripcion: "Sitio seguro para descansar, ocultarse o anidar.",
  },
  {
    id: "espacio-conectividad",
    titulo: "Espacio y conectividad",
    descripcion: "Poder moverse o extenderse entre lugares.",
  },
  {
    id: "ambiente-limpio",
    titulo: "Ambiente limpio",
    descripcion: "Aire, agua y suelo sin contaminación.",
  },
  {
    id: "otras-especies",
    titulo: "Otras especies",
    descripcion: "Polinizadores, plantas hospederas, presas o aliados.",
  },
];

/** Catálogo B · Lo que podría amenazarla (misión 1 · punto 2). */
export const amenazasSerVivo: TarjetaRedInvisible[] = [
  {
    id: "perdida-habitat",
    titulo: "Pérdida de hábitat",
    descripcion: "Desaparición o fragmentación del lugar donde vive.",
  },
  {
    id: "residuos-contaminacion",
    titulo: "Residuos y contaminación",
    descripcion: "Basura, vertimientos, humo o deterioro del suelo.",
  },
  {
    id: "quimicos",
    titulo: "Químicos",
    descripcion: "Plaguicidas, herbicidas o productos usados sin control.",
  },
  {
    id: "captura-acoso",
    titulo: "Captura o acoso",
    descripcion: "Manipular, perseguir, alimentar o extraer fauna.",
  },
  {
    id: "poda-pisoteo",
    titulo: "Poda o pisoteo",
    descripcion: "Intervenciones que destruyen refugios o plantas.",
  },
  {
    id: "falta-agua",
    titulo: "Falta de agua",
    descripcion: "Riego inadecuado, sequía o fuentes sin mantenimiento.",
  },
  {
    id: "ruido-iluminacion",
    titulo: "Ruido o iluminación",
    descripcion: "Alteraciones que pueden afectar descanso y actividad.",
  },
  {
    id: "falta-mantenimiento",
    titulo: "Falta de mantenimiento",
    descripcion: "Acciones sin responsables, seguimiento o recursos.",
  },
];

/** Catálogo C · Acciones de cuidado (misión 1 · punto 2). */
export const accionesCuidado: TarjetaRedInvisible[] = [
  {
    id: "observar-sin-capturar",
    titulo: "Observar sin capturar",
    descripcion: "Registrar a distancia y respetar los ciclos de vida.",
  },
  {
    id: "proteger-microhabitat",
    titulo: "Proteger el microhábitat",
    descripcion: "Conservar refugios, hojarasca, troncos o plantas.",
  },
  {
    id: "especies-nativas",
    titulo: "Usar especies nativas",
    descripcion: "Fortalecer hábitat con orientación técnica.",
  },
  {
    id: "evitar-quimicos",
    titulo: "Evitar químicos tóxicos",
    descripcion: "Buscar manejo preventivo y alternativas seguras.",
  },
  {
    id: "cuidar-agua-suelo",
    titulo: "Cuidar agua y suelo",
    descripcion: "Mantener riego, cobertura y limpieza responsable.",
  },
  {
    id: "senalizar-educar",
    titulo: "Señalizar y educar",
    descripcion: "Explicar por qué la especie y el lugar importan.",
  },
  {
    id: "monitorear",
    titulo: "Monitorear",
    descripcion: "Contar observaciones, cambios o incidentes en el tiempo.",
  },
  {
    id: "acordar-mantenimiento",
    titulo: "Acordar mantenimiento",
    descripcion: "Definir responsables, frecuencia y recursos.",
  },
];

export function necesidadPorId(id: string | undefined): TarjetaRedInvisible | undefined {
  if (!id) return undefined;
  return necesidadesSerVivo.find((n) => n.id === id);
}

export function amenazaPorId(id: string | undefined): TarjetaRedInvisible | undefined {
  if (!id) return undefined;
  return amenazasSerVivo.find((a) => a.id === id);
}

export function accionCuidadoPorId(id: string | undefined): TarjetaRedInvisible | undefined {
  if (!id) return undefined;
  return accionesCuidado.find((a) => a.id === id);
}

export type CategoriaServicio = "provee" | "regula" | "sostiene" | "inspira";

export type ServicioEcosistemico = {
  id: string;
  numero: number;
  categoria: CategoriaServicio;
  titulo: string;
  descripcion: string;
  /** Si true, la brigada escribe el aporte en un campo libre. */
  esOtro?: boolean;
};

export const categoriasServicio: Array<{
  id: CategoriaServicio;
  etiqueta: string;
  color: string;
}> = [
  { id: "provee", etiqueta: "PROVEE", color: "#d4a017" },
  { id: "regula", etiqueta: "REGULA", color: "#2d8a8a" },
  { id: "sostiene", etiqueta: "SOSTIENE", color: "#3d8b5c" },
  { id: "inspira", etiqueta: "INSPIRA", color: "#7b5ea7" },
];

/** Catálogo de servicios ecosistémicos (misión 1 · punto 3). */
export const serviciosEcosistemicos: ServicioEcosistemico[] = [
  {
    id: "alimento-nectar",
    numero: 1,
    categoria: "provee",
    titulo: "Alimento y néctar",
    descripcion:
      "Ofrece frutos, semillas, néctar, hojas o presas que alimentan a otros seres vivos.",
  },
  {
    id: "recursos-utiles",
    numero: 2,
    categoria: "provee",
    titulo: "Recursos útiles",
    descripcion:
      "Aporta fibras, madera, aromas u otras sustancias que pueden usarse de forma responsable.",
  },
  {
    id: "medicina-saberes",
    numero: 3,
    categoria: "provee",
    titulo: "Medicina y saberes",
    descripcion:
      "Conserva conocimientos, usos tradicionales o potencial de investigación. No consumir sin orientación.",
  },
  {
    id: "semillas-diversidad",
    numero: 4,
    categoria: "provee",
    titulo: "Semillas y diversidad",
    descripcion: "Contribuye a la reproducción y conserva variedad biológica para el futuro.",
  },
  {
    id: "otro-provee",
    numero: 5,
    categoria: "provee",
    titulo: "Otro aporte de provisión",
    descripcion: "Escribe otro aporte y la pista que lo demuestra.",
    esOtro: true,
  },
  {
    id: "polinizacion",
    numero: 6,
    categoria: "regula",
    titulo: "Polinización",
    descripcion: "Transporta polen o facilita la reproducción de plantas con flores.",
  },
  {
    id: "dispersion-semillas",
    numero: 7,
    categoria: "regula",
    titulo: "Dispersión de semillas",
    descripcion: "Mueve semillas hacia nuevos lugares y ayuda a que crezcan nuevas plantas.",
  },
  {
    id: "control-natural",
    numero: 8,
    categoria: "regula",
    titulo: "Control natural",
    descripcion:
      "Ayuda a equilibrar poblaciones al alimentarse de otros organismos o competir con ellos.",
  },
  {
    id: "clima-agua-erosion",
    numero: 9,
    categoria: "regula",
    titulo: "Clima, agua y erosión",
    descripcion: "Da sombra, retiene agua, filtra, protege el suelo o mejora el microclima.",
  },
  {
    id: "otro-regula",
    numero: 10,
    categoria: "regula",
    titulo: "Otro aporte de regulación",
    descripcion: "Escribe otro aporte y la pista que lo demuestra.",
    esOtro: true,
  },
  {
    id: "refugio-habitat",
    numero: 11,
    categoria: "sostiene",
    titulo: "Refugio y hábitat",
    descripcion: "Ofrece lugar para vivir, descansar, esconderse, anidar o reproducirse.",
  },
  {
    id: "red-alimentaria",
    numero: 12,
    categoria: "sostiene",
    titulo: "Red alimentaria",
    descripcion: "Forma parte de cadenas de alimentación y mantiene conexiones entre especies.",
  },
  {
    id: "ciclo-nutrientes",
    numero: 13,
    categoria: "sostiene",
    titulo: "Ciclo de nutrientes",
    descripcion: "Descompone, recicla materia orgánica o devuelve nutrientes al suelo.",
  },
  {
    id: "suelo-conectividad",
    numero: 14,
    categoria: "sostiene",
    titulo: "Suelo y conectividad",
    descripcion: "Ayuda a formar suelo o conecta espacios para que la vida pueda desplazarse.",
  },
  {
    id: "otro-sostiene",
    numero: 15,
    categoria: "sostiene",
    titulo: "Otro aporte de soporte",
    descripcion: "Escribe otro aporte y la pista que lo demuestra.",
    esOtro: true,
  },
  {
    id: "aprendizaje-ciencia",
    numero: 16,
    categoria: "inspira",
    titulo: "Aprendizaje y ciencia",
    descripcion: "Permite observar, investigar, hacer preguntas y aprender en un aula viva.",
  },
  {
    id: "belleza-identidad",
    numero: 17,
    categoria: "inspira",
    titulo: "Belleza e identidad",
    descripcion: "Aporta colores, sonidos, paisajes y sentido de pertenencia al colegio.",
  },
  {
    id: "bienestar-recreacion",
    numero: 18,
    categoria: "inspira",
    titulo: "Bienestar y recreación",
    descripcion: "Favorece descanso, juego, calma, encuentro y disfrute responsable.",
  },
  {
    id: "cultura-memoria",
    numero: 19,
    categoria: "inspira",
    titulo: "Cultura y memoria",
    descripcion:
      "Se relaciona con historias, símbolos, costumbres o conocimientos del territorio.",
  },
  {
    id: "otro-inspira",
    numero: 20,
    categoria: "inspira",
    titulo: "Otro aporte cultural",
    descripcion: "Escribe otro aporte y la pista que lo demuestra.",
    esOtro: true,
  },
];

export const coloresServicioSlot: Record<1 | 2 | 3, string> = {
  1: "#d4a017",
  2: "#2d8a8a",
  3: "#7b5ea7",
};

export function servicioPorId(id: string | undefined): ServicioEcosistemico | undefined {
  if (!id) return undefined;
  return serviciosEcosistemicos.find((s) => s.id === id);
}

export function etiquetaCategoriaServicio(id: CategoriaServicio | undefined): string {
  if (!id) return "";
  return categoriasServicio.find((c) => c.id === id)?.etiqueta ?? id;
}

export function colorCategoriaServicio(id: CategoriaServicio | undefined): string {
  if (!id) return "#2d6a4f";
  return categoriasServicio.find((c) => c.id === id)?.color ?? "#2d6a4f";
}

/** Pantallas actuales; se irán sumando misiones. */
export const pantallasBiodiversidadViva: PantallaBiodiversidadViva[] = [
  {
    id: "enfoca-la-vida",
    numero: 1,
    nombre: "Enfoca la vida",
    tagline: "1. Enfoca la vida",
    instrucciones:
      "Elige una especie, revela su red invisible y descubre qué aporta al colegio.",
  },
  {
    id: "comprender",
    numero: 2,
    nombre: "Comprender",
    tagline: "2. Comprender",
    instrucciones:
      "Observen el lugar, marquen la conexión territorial y cierren con el diagnóstico del sitio.",
  },
  {
    id: "definir",
    numero: 3,
    nombre: "Definir",
    tagline: "3. Definir",
    instrucciones:
      "Lean el sitio, formulen la oportunidad, definan objetivos complementarios y el indicador principal.",
  },
  {
    id: "disenar",
    numero: 4,
    nombre: "Diseñar",
    tagline: "4. Diseñar",
    instrucciones:
      "Recuperen el reto, elijan hasta dos intervenciones y dibujen el esquema de la propuesta.",
  },
  {
    id: "construir",
    numero: 6,
    nombre: "Construir",
    tagline: "6. Construir",
    instrucciones: "Suban una imagen o un video de lo que van a construir.",
  },
  {
    id: "probar",
    numero: 7,
    nombre: "Probar",
    tagline: "7. Probar",
    instrucciones: "Después de probar, anoten qué se puede mejorar.",
  },
  {
    id: "inspirar",
    numero: 8,
    nombre: "Inspirar",
    tagline: "8. Inspirar",
    instrucciones: "Reflexionen sobre cómo esto los inspiró a construir.",
  },
];

export type ValorObservacion = "2" | "1" | "0" | "vt";

export type CriterioObservacion = {
  id: string;
  numero: number;
  titulo: string;
  observa: string;
  color: string;
  fondo: string;
};

/** Escala de valor (misión 2 · punto 1). */
export const escalaValorObservacion: Array<{
  id: ValorObservacion;
  etiqueta: string;
  significado: string;
}> = [
  { id: "2", etiqueta: "2", significado: "favorable y observado" },
  { id: "1", etiqueta: "1", significado: "parcial, estacional o incompleto" },
  { id: "0", etiqueta: "0", significado: "ausencia o riesgo visible" },
  { id: "vt", etiqueta: "VT", significado: "requiere verificación técnica" },
];

/** Criterios de observación del lugar (misión 2 · punto 1). */
export const criteriosObservacion: CriterioObservacion[] = [
  {
    id: "vegetacion",
    numero: 1,
    titulo: "Vegetación apropiada",
    observa:
      "Plantas acordes con luz, espacio, agua y clima. No afirmar origen o especie sin verificar.",
    color: "#3d8b5c",
    fondo: "#e8f5ec",
  },
  {
    id: "alimento-refugio",
    numero: 2,
    titulo: "Alimento y refugio",
    observa:
      "Flores, frutos, semillas, hojarasca, ramas, cavidades o cobertura para distintas especies.",
    color: "#7b5ea7",
    fondo: "#f3e9f8",
  },
  {
    id: "agua",
    numero: 3,
    titulo: "Agua sin riesgo",
    observa:
      "Agua accesible sin contaminación, trampas, recipientes peligrosos o estancamiento inseguro.",
    color: "#3b82c4",
    fondo: "#e8f3fb",
  },
  {
    id: "suelo-sombra",
    numero: 4,
    titulo: "Suelo y sombra",
    observa:
      "Suelo cubierto, no muy compactado, con materia orgánica, humedad y sombra disponible.",
    color: "#a67c52",
    fondo: "#f5efe6",
  },
  {
    id: "amenazas",
    numero: 5,
    titulo: "Ausencia de amenazas",
    observa:
      "Sin basura, captura, químicos, poda excesiva, ruido constante o destrucción de refugios.",
    color: "#e07a3d",
    fondo: "#fff4e8",
  },
];

export function etiquetaValorObservacion(id: string | undefined): string {
  if (!id) return "";
  const item = escalaValorObservacion.find((v) => v.id === id);
  if (!item) return id;
  return `${item.etiqueta} — ${item.significado}`;
}

export type OpcionConexionAtlantico = {
  id: string;
  etiqueta: string;
};

export type SeccionConexionAtlantico = {
  id: "clima" | "ecosistema" | "vt";
  titulo: string;
  color: string;
  fondo: string;
  opciones: OpcionConexionAtlantico[];
};

/** Conexión con el Atlántico (misión 2 · punto 2). Multiselección por sección. */
export const seccionesConexionAtlantico: SeccionConexionAtlantico[] = [
  {
    id: "clima",
    titulo: "Clima y microclima",
    color: "#4a9bc7",
    fondo: "#e8f4fb",
    opciones: [
      { id: "sol-calor", etiqueta: "sol / calor" },
      { id: "lluvia-sequia", etiqueta: "lluvia / sequía" },
      { id: "viento", etiqueta: "viento" },
      { id: "humedad", etiqueta: "humedad" },
      { id: "salinidad", etiqueta: "salinidad si aplica" },
    ],
  },
  {
    id: "ecosistema",
    titulo: "Ecosistema o conexión territorial",
    color: "#7a8f3d",
    fondo: "#eef3e0",
    opciones: [
      { id: "rio-magdalena", etiqueta: "Río Magdalena" },
      { id: "manglar", etiqueta: "manglar" },
      { id: "cienaga-humedal", etiqueta: "ciénaga / humedal" },
      { id: "bosque-seco", etiqueta: "bosque seco tropical" },
      { id: "ecosistema-costero", etiqueta: "ecosistema costero" },
      { id: "biodiversidad-urbana", etiqueta: "biodiversidad urbana" },
      { id: "otro", etiqueta: "otro / por verificar" },
    ],
  },
  {
    id: "vt",
    titulo: "Aspectos que requieren VT",
    color: "#e07a3d",
    fondo: "#fff4e8",
    opciones: [
      { id: "identidad-especie", etiqueta: "identidad de especie" },
      { id: "origen", etiqueta: "origen nativo / introducido" },
      { id: "agua-seguridad", etiqueta: "agua y seguridad" },
      { id: "estado-suelo", etiqueta: "estado del suelo" },
      { id: "riesgo-invasora", etiqueta: "riesgo de invasora" },
      { id: "compatibilidad-climatica", etiqueta: "compatibilidad climática" },
    ],
  },
];

export type CampoDiagnosticoSitio = {
  id: string;
  etiqueta: string;
};

/** Diagnóstico del sitio (misión 2 · punto 3). */
export const camposDiagnosticoSitio: CampoDiagnosticoSitio[] = [
  { id: "sostiene-vida", etiqueta: "El sitio sostiene vida porque…" },
  { id: "condicion-fragil", etiqueta: "La condición más frágil es…" },
  { id: "verificar", etiqueta: "Necesitamos verificar…" },
  { id: "conexion-territorio", etiqueta: "Se conecta con el territorio porque…" },
];

export const clavesBiodiversidadViva = {
  evidenciaImagen: "bv1-evidencia-imagen",
  nombreComun: "bv1-nombre-comun",
  tipo: "bv1-tipo",
  lugarMicrohabitat: "bv1-lugar-microhabitat",
  pistaObservada: "bv1-pista-observada",
  certeza: "bv1-certeza",
  datoConsultar: "bv1-dato-consultar",
  haceMientras: "bv1-hace-mientras",
  necesidad: (n: 1 | 2) => `bv1-necesidad-${n}`,
  amenaza: (n: 1 | 2) => `bv1-amenaza-${n}`,
  accionCuidado: (n: 1 | 2) => `bv1-accion-${n}`,
  siFaltara: "bv1-si-faltara",
  servicio: (n: 1 | 2 | 3) => `bv1-servicio-${n}`,
  servicioEvidencia: (n: 1 | 2 | 3) => `bv1-servicio-${n}-evidencia`,
  servicioOtro: (n: 1 | 2 | 3) => `bv1-servicio-${n}-otro`,
  cuidarlaImporta: "bv1-cuidarla-importa",
  amenazaMision: "bv1-amenaza-mision",
  accionMision: "bv1-accion-mision",
  accionMisionAdaptada: "bv1-accion-mision-adaptada",
  indicador: "bv1-indicador",
  criterioValor: (id: string) => `bv2-criterio-${id}-valor`,
  criterioEvidencia: (id: string) => `bv2-criterio-${id}-evidencia`,
  conexionAtlantico: (seccionId: string, opcionId: string) =>
    `bv2-conexion-${seccionId}-${opcionId}`,
  diagnosticoSitio: (id: string) => `bv2-diagnostico-${id}`,
  activosConservar: "bv3-activos-conservar",
  vaciosAmenazas: "bv3-vacios-amenazas",
  oportunidadEspacio: "bv3-oportunidad-espacio",
  oportunidadCondicion: "bv3-oportunidad-condicion",
  oportunidadBeneficiario: "bv3-oportunidad-beneficiario",
  oportunidadRiesgo: "bv3-oportunidad-riesgo",
  oportunidadIndicador: "bv3-oportunidad-indicador",
  objetivoEcologico: "bv3-objetivo-ecologico",
  objetivoPedagogico: "bv3-objetivo-pedagogico",
  indicadorPrincipal: (campo: string) => `bv3-indicador-${campo}`,
  disenoRetoDefinido: "bv4-reto-definido",
  disenoObjetivoEcologico: "bv4-objetivo-ecologico",
  disenoObjetivoPedagogico: "bv4-objetivo-pedagogico",
  disenoEvidenciaSitio: "bv4-evidencia-sitio",
  disenoDatoVerificar: "bv4-dato-verificar",
  disenoIntervencion: (n: 1 | 2) => `bv4-intervencion-${n}`,
  disenoEsquemaImagen: "bv4-esquema-imagen",
  construirImagen: "bv6-construir-imagen",
  probarMejora: "bv7-probar-mejora",
  inspirarTexto: "bv8-inspirar-texto",
} as const;

export type IntervencionDiseno = {
  id: string;
  titulo: string;
  descripcion: string;
  color: string;
  fondo: string;
};

/** Intervenciones (misión 4 · punto 2). Máximo 2 elegidas. */
export const intervencionesDiseno: IntervencionDiseno[] = [
  {
    id: "jardin-polinizadores",
    titulo: "Jardín para polinizadores",
    descripcion: "Ofrece alimento, refugio y observación de visitantes.",
    color: "#3d8b5c",
    fondo: "#eaf5ee",
  },
  {
    id: "ruta-especies",
    titulo: "Ruta de especies",
    descripcion: "Conecta puntos para reconocer y cuidar la vida del colegio.",
    color: "#3b82c4",
    fondo: "#e8f3fb",
  },
  {
    id: "aula-viva",
    titulo: "Aula viva",
    descripcion: "Convierte un espacio en escenario de observación y aprendizaje.",
    color: "#7b5ea7",
    fondo: "#f3e9f8",
  },
  {
    id: "huerta-biodiversa",
    titulo: "Huerta biodiversa",
    descripcion: "Integra cultivos, suelo vivo, asociaciones y cuidado continuo.",
    color: "#e07a3d",
    fondo: "#fff4e8",
  },
  {
    id: "senalizacion",
    titulo: "Señalización",
    descripcion: "Hace visible una especie, relación, cuidado o norma del sitio.",
    color: "#2d8a8a",
    fondo: "#e6f5f5",
  },
  {
    id: "inventario",
    titulo: "Inventario",
    descripcion: "Organiza registros para conocer qué vida existe y dónde.",
    color: "#c4a035",
    fondo: "#fbf6e0",
  },
  {
    id: "campana",
    titulo: "Campaña",
    descripcion: "Moviliza a la comunidad para proteger o valorar el espacio.",
    color: "#c45c5c",
    fondo: "#fceeee",
  },
  {
    id: "monitoreo",
    titulo: "Monitoreo",
    descripcion: "Observa cambios con un indicador, una frecuencia y un responsable.",
    color: "#4a9bc7",
    fondo: "#e8f4fb",
  },
];

export function intervencionDisenoPorId(
  id: string | undefined,
): IntervencionDiseno | undefined {
  if (!id) return undefined;
  return intervencionesDiseno.find((i) => i.id === id);
}

export type CampoIndicadorPrincipal = {
  id: string;
  etiqueta: string;
};

/** Campos del indicador principal (misión 3 · Definir). */
export const camposIndicadorPrincipal: CampoIndicadorPrincipal[] = [
  { id: "que-se-medira", etiqueta: "Qué se medirá" },
  { id: "unidad", etiqueta: "Unidad" },
  { id: "linea-base", etiqueta: "Línea base" },
  { id: "meta", etiqueta: "Meta" },
  { id: "periodo", etiqueta: "Periodo" },
  { id: "fuente-responsable", etiqueta: "Fuente / responsable" },
];

/** Arma la frase de oportunidad (misión 3) a partir de los huecos. */
export function fraseOportunidadBiodiversidad(
  respuestas: Record<string, string>,
): string | null {
  const espacio = respuestas[clavesBiodiversidadViva.oportunidadEspacio]?.trim();
  const condicion = respuestas[clavesBiodiversidadViva.oportunidadCondicion]?.trim();
  const beneficiario = respuestas[clavesBiodiversidadViva.oportunidadBeneficiario]?.trim();
  const riesgo = respuestas[clavesBiodiversidadViva.oportunidadRiesgo]?.trim();
  const indicador = respuestas[clavesBiodiversidadViva.oportunidadIndicador]?.trim();
  if (!espacio && !condicion && !beneficiario && !riesgo && !indicador) return null;
  return `En ${espacio || "[espacio]"}, mejoraremos o visibilizaremos ${condicion || "[condición o grupo]"} para ${beneficiario || "[beneficiario]"}, sin ${riesgo || "[riesgo]"}, y verificaremos ${indicador || "[indicador]"}.`;
}

/** Precarga de Diseñar (misión 4) desde Definir / Comprender. */
export function sugerenciasDisenoDesdeDefinir(
  respuestas: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};

  const reto = fraseOportunidadBiodiversidad(respuestas);
  if (reto) out[clavesBiodiversidadViva.disenoRetoDefinido] = reto;

  const objetivoEcologico = respuestas[clavesBiodiversidadViva.objetivoEcologico]?.trim();
  if (objetivoEcologico) {
    out[clavesBiodiversidadViva.disenoObjetivoEcologico] = objetivoEcologico;
  }

  const objetivoPedagogico = respuestas[clavesBiodiversidadViva.objetivoPedagogico]?.trim();
  if (objetivoPedagogico) {
    out[clavesBiodiversidadViva.disenoObjetivoPedagogico] = objetivoPedagogico;
  }

  const evidencia =
    respuestas[clavesBiodiversidadViva.activosConservar]?.trim() ||
    respuestas[clavesBiodiversidadViva.diagnosticoSitio("sostiene-vida")]?.trim() ||
    "";
  if (evidencia) out[clavesBiodiversidadViva.disenoEvidenciaSitio] = evidencia;

  const datoVerificar =
    respuestas[clavesBiodiversidadViva.diagnosticoSitio("verificar")]?.trim() ||
    respuestas[clavesBiodiversidadViva.datoConsultar]?.trim() ||
    "";
  if (datoVerificar) out[clavesBiodiversidadViva.disenoDatoVerificar] = datoVerificar;

  return out;
}
