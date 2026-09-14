export type PantallaEmprendeCircular = {
  id: string;
  numero: number;
  nombre: string;
  tagline?: string;
  instrucciones: string;
};

export type EstadoMaterial = {
  id: string;
  etiqueta: string;
};

export type AccionCircular = {
  id: string;
  numero: number;
  titulo: string;
  ejemplo: string;
  definicion: string;
  /** Resumen corto (reto 3 · oportunidades). */
  resumenCorto: string;
  /** Grupo visual: prevenir | recuperar | disponer */
  grupo: "prevenir" | "recuperar" | "disponer";
  /** Color de fondo del ítem de ayuda (hex). */
  color: string;
};

export const estadosMaterial: EstadoMaterial[] = [
  { id: "limpio", etiqueta: "Limpio" },
  { id: "seco", etiqueta: "Seco" },
  { id: "mezclado", etiqueta: "Mezclado" },
  { id: "parte-danada", etiqueta: "Con una parte dañada" },
];

/** Catálogo de acciones circulares (ayuda del reto 1). */
export const accionesCirculares: AccionCircular[] = [
  {
    id: "evitar",
    numero: 1,
    titulo: "EVITAR",
    ejemplo: "Quitar un empaque que no se necesita.",
    definicion: "Hacer que el residuo no llegue a aparecer.",
    resumenCorto: "que no se genere",
    grupo: "prevenir",
    color: "#c5e0b4",
  },
  {
    id: "reducir",
    numero: 2,
    titulo: "REDUCIR",
    ejemplo: "Imprimir solo las hojas necesarias.",
    definicion: "Usar menos materiales, agua o energía.",
    resumenCorto: "usar menos",
    grupo: "prevenir",
    color: "#c5e0b4",
  },
  {
    id: "reutilizar",
    numero: 3,
    titulo: "REUTILIZAR",
    ejemplo: "Usar la cara libre de una hoja.",
    definicion: "Volver a usar algo que todavía sirve.",
    resumenCorto: "usar de nuevo",
    grupo: "prevenir",
    color: "#c5e0b4",
  },
  {
    id: "reparar",
    numero: 4,
    titulo: "REPARAR",
    ejemplo: "Reforzar la tapa de un cuaderno.",
    definicion: "Arreglar algo para que siga funcionando.",
    resumenCorto: "recuperar función",
    grupo: "prevenir",
    color: "#c5e0b4",
  },
  {
    id: "intercambiar",
    numero: 5,
    titulo: "INTERCAMBIAR",
    ejemplo: "Crear un banco de útiles para prestar.",
    definicion: "Compartir, prestar, donar o cambiar.",
    resumenCorto: "cambiar de usuario",
    grupo: "prevenir",
    color: "#c5e0b4",
  },
  {
    id: "aprovechar",
    numero: 6,
    titulo: "APROVECHAR",
    ejemplo: "Recuperar anillos de una libreta dañada.",
    definicion: "Rescatar partes o propiedades útiles.",
    resumenCorto: "separar y entregar",
    grupo: "recuperar",
    color: "#bdd7ee",
  },
  {
    id: "reciclar",
    numero: 7,
    titulo: "RECICLAR",
    ejemplo: "El papel usado se procesa para hacer papel.",
    definicion: "Procesar un material para hacer materia prima.",
    resumenCorto: "recuperar material",
    grupo: "recuperar",
    color: "#bdd7ee",
  },
  {
    id: "transformar",
    numero: 8,
    titulo: "TRANSFORMAR",
    ejemplo: "Hacer compost con orgánicos adecuados.",
    definicion: "Dar otro uso mediante un proceso o cambio.",
    resumenCorto: "crear utilidad nueva",
    grupo: "recuperar",
    color: "#d5c4e8",
  },
  {
    id: "disponer",
    numero: 9,
    titulo: "DISPONER",
    ejemplo: "Usar el sistema autorizado del lugar.",
    definicion: "Entregar lo que ya no se puede recuperar.",
    resumenCorto: "gestionar lo no recuperable",
    grupo: "disponer",
    color: "#f8cbad",
  },
];

export const resumenGruposAcciones = [
  { rango: "1 a 5", texto: "prevenir y mantener en uso." },
  { rango: "6 a 8", texto: "recuperar valor." },
  { rango: "9", texto: "última opción para lo que ya no puede recuperarse." },
] as const;

export type EtapaComprender = {
  id: string;
  numero: number;
  titulo: string;
  pregunta: string;
};

export type EvidenciaComprender = {
  id: "dato" | "estimacion" | "pregunta";
  letra: string;
  etiqueta: string;
};

/** Seis etapas del recorrido del material (reto 2). */
export const etapasComprender: EtapaComprender[] = [
  {
    id: "entra",
    numero: 1,
    titulo: "ENTRA AL COLEGIO",
    pregunta: "Reconstruyan la compra, entrega o ingreso del material.",
  },
  {
    id: "se-usa",
    numero: 2,
    titulo: "SE USA",
    pregunta: "Identifiquen quien lo usa, para que y durante cuanto tiempo.",
  },
  {
    id: "se-descarta",
    numero: 3,
    titulo: "SE DESCARTA",
    pregunta: "Expliquen donde, cuando y por que deja de considerarse util.",
  },
  {
    id: "se-mezcla",
    numero: 4,
    titulo: "SE MEZCLA O SEPARA",
    pregunta: "Marquen con que se junta y si conserva o pierde valor.",
  },
  {
    id: "se-mueve",
    numero: 5,
    titulo: "SE MUEVE",
    pregunta: "Sigan la recoleccion, el transporte y el almacenamiento.",
  },
  {
    id: "destino",
    numero: 6,
    titulo: "LLEGA A UN DESTINO",
    pregunta: "Registren el destino conocido. Si no se sabe, formulen la pregunta.",
  },
];

export const evidenciasComprender: EvidenciaComprender[] = [
  { id: "dato", letra: "D", etiqueta: "dato" },
  { id: "estimacion", letra: "E", etiqueta: "estimación" },
  { id: "pregunta", letra: "?", etiqueta: "pregunta" },
];

export function etiquetaEvidencia(id: string | undefined): string {
  if (!id) return "";
  return evidenciasComprender.find((e) => e.id === id)?.etiqueta ?? id;
}

export type CampoAuditoria = {
  id: string;
  titulo: string;
  pista: string;
  /** Columna visual en la ficha: izquierda | derecha */
  columna: "izq" | "der";
};

/** Campos de la ficha de auditoría (reto 3). */
export const camposAuditoria: CampoAuditoria[] = [
  {
    id: "tipo-familia",
    titulo: "TIPO O FAMILIA",
    pista: "papel, cartón, plástico, textil, metal seguro u otro",
    columna: "izq",
  },
  {
    id: "origen",
    titulo: "ORIGEN",
    pista: "actividad, compra, lugar o proceso que lo genera",
    columna: "der",
  },
  {
    id: "cantidad",
    titulo: "CANTIDAD ESTIMADA",
    pista: "número, peso, volumen o conteo disponible",
    columna: "izq",
  },
  {
    id: "frecuencia",
    titulo: "FRECUENCIA",
    pista: "por día, semana, evento o periodo observado",
    columna: "der",
  },
  {
    id: "estado-actual",
    titulo: "ESTADO ACTUAL",
    pista: "limpio, seco, entero, mezclado o deteriorado",
    columna: "izq",
  },
  {
    id: "destino-actual",
    titulo: "DESTINO ACTUAL",
    pista: "reuso, almacenamiento, mezcla, entrega o disposición",
    columna: "der",
  },
  {
    id: "actores",
    titulo: "ACTORES",
    pista: "quien lo usa, entrega, separa, repara o mantiene",
    columna: "izq",
  },
  {
    id: "evidencia",
    titulo: "EVIDENCIA DISPONIBLE",
    pista: "observación, foto, conteo, registro o testimonio",
    columna: "der",
  },
];

/** Pantallas actuales; se irán sumando retos. */
export const pantallasEmprendeCircular: PantallaEmprendeCircular[] = [
  {
    id: "nuestro-material",
    numero: 1,
    nombre: "Activar",
    tagline: "Activar: Así es nuestro material",
    instrucciones:
      "Observen el material o residuo: descríbanlo, digan dónde aparece, anoten una pista del día, rodeen su estado y propongan hasta tres acciones que podrían servir.",
  },
  {
    id: "comprender",
    numero: 2,
    nombre: "Comprender",
    tagline: "Comprender: el recorrido del material",
    instrucciones:
      "Sigan el camino del material en seis pasos. En cada caja escriban lo que saben, indiquen quién interviene y rodeen cómo lo saben (dato, estimación o pregunta).",
  },
  {
    id: "experimentar",
    numero: 3,
    nombre: "Experimentar",
    tagline: "Experimentar: ficha y oportunidades",
    instrucciones:
      "Completen la ficha de auditoría del material, marquen las oportunidades circulares posibles y nombren la alternativa A a desarrollar.",
  },
  {
    id: "definir",
    numero: 4,
    nombre: "Definir",
    tagline: "Definir: recorrido, reto, indicador y comprobación",
    instrucciones:
      "Dibujen el recorrido real, construyan el reto, definan el indicador y comprueben que la definición cumple los criterios.",
  },
  {
    id: "disenar",
    numero: 5,
    nombre: "Diseñar",
    tagline: "Diseñar: criterios de la solución",
    instrucciones:
      "Detallen la alternativa A: nombre del producto, lema comercial, descripción y resultado esperado.",
  },
  {
    id: "construir",
    numero: 6,
    nombre: "Construir",
    tagline: "Construir",
    instrucciones: "Suban una imagen o un video de lo que van a construir.",
  },
  {
    id: "probar",
    numero: 7,
    nombre: "Probar",
    tagline: "Probar",
    instrucciones: "Después de probar, anoten qué se puede mejorar.",
  },
  {
    id: "inspirar",
    numero: 8,
    nombre: "Inspirar",
    tagline: "Inspirar",
    instrucciones: "Reflexionen sobre cómo esto los inspiró a construir.",
  },
];

export const clavesEmprendeCircular = {
  materialImagen: "ec1-material-imagen",
  materialNombre: "ec1-material-nombre",
  materialDescripcion: "ec1-material-descripcion",
  dondeAparece: "ec1-donde-aparece",
  pistaDia: "ec1-pista-dia",
  estado: (id: string) => `ec1-estado-${id}`,
  opcionAccion: (n: 1 | 2 | 3) => `ec1-opcion-${n}-accion`,
  opcionComo: (n: 1 | 2 | 3) => `ec1-opcion-${n}-como`,
  etapaNota: (id: string) => `ec2-${id}-nota`,
  etapaQuien: (id: string) => `ec2-${id}-quien`,
  etapaEvidencia: (id: string) => `ec2-${id}-evidencia`,
  etapaFuente: (id: string) => `ec2-${id}-fuente`,
  hallazgoClave: "ec2-hallazgo-clave",
  preguntaPrioritaria: "ec2-pregunta-prioritaria",
  auditoria: (id: string) => `ec3-auditoria-${id}`,
  oportunidad: (id: string) => `ec3-oportunidad-${id}`,
  alternativaA: "ec3-alternativa-a",
  alternativaB: "ec3-alternativa-b",
  alternativaCampo: (
    letra: "a" | "b",
    campo: "nombre" | "lema" | "descripcion" | "recursos" | "resultado",
  ) => `ec3-alt-${letra}-${campo}`,
  recorridoCampo: (etapaId: string, campo: "lugar" | "actor" | "ocurre" | "cantidad" | "costo") =>
    `ec4-recorrido-${etapaId}-${campo}`,
  retoPara: "ec4-reto-para",
  retoAccion: "ec4-reto-accion",
  retoMaterial: "ec4-reto-material",
  retoLugar: "ec4-reto-lugar",
  retoMecanismo: "ec4-reto-mecanismo",
  retoIndicador: "ec4-reto-indicador",
  indicadorQueMediremos: "ec4-indicador-que-mediremos",
  unidadBase: (id: string) => `ec4-unidad-${id}`,
  lineaBase: "ec4-linea-base",
  periodoFuente: "ec4-periodo-fuente",
  meta: "ec4-meta",
  fechaRevision: "ec4-fecha-revision",
  comprobacion: (id: string) => `ec4-check-${id}`,
  diseno: (id: string) => `ec5-diseno-${id}`,
  prototipoImagen: "ec5-prototipo-imagen",
  construirImagen: "ec6-construir-imagen",
  probarMejora: "ec7-probar-mejora",
  inspirarTexto: "ec8-inspirar-texto",
} as const;

/** Dimensiones del Reto 5 · paso 1. Editar solo `subtitulo` cuando se defina el copy. */
export const dimensionesDiseno = [
  {
    id: "funcion",
    letra: "F",
    titulo: "FUNCIÓN",
    subtitulo: "",
    color: "#3d8b5c",
    fondo: "#e8f5ec",
    borde: "#7eb896",
    separadorDespues: false,
  },
  {
    id: "material",
    letra: "M",
    titulo: "MATERIAL",
    subtitulo: "",
    color: "#0f766e",
    fondo: "#e6f7f5",
    borde: "#5ec4b8",
    /** Separador visual después de este ítem (como en el formulario). */
    separadorDespues: true,
  },
  {
    id: "tiempo",
    letra: "T",
    titulo: "TIEMPO Y ESFUERZO",
    subtitulo: "",
    color: "#d97706",
    fondo: "#fff4e5",
    borde: "#f0b56a",
    separadorDespues: false,
  },
  {
    id: "recursos",
    letra: "R",
    titulo: "RECURSOS",
    subtitulo: "",
    color: "#8b5cb8",
    fondo: "#f3e9f8",
    borde: "#c4a3d9",
    separadorDespues: false,
  },
] as const;

export const accionesRetoDefinir = [
  { id: "reduciremos", etiqueta: "reduciremos" },
  { id: "mantendremos", etiqueta: "mantendremos en uso" },
] as const;

export const etapasRecorridoReal = [
  {
    id: "entra",
    titulo: "ENTRA",
    subtitulo: "compra, recibe o almacena",
    color: "#3b82c4",
    fondo: "#e8f3fb",
    borde: "#7eb3d9",
  },
  {
    id: "se-usa",
    titulo: "SE USA",
    subtitulo: "entrega, consume o mantiene",
    color: "#3d8b5c",
    fondo: "#e8f5ec",
    borde: "#7eb896",
  },
  {
    id: "sale",
    titulo: "SALE O CIRCULA",
    subtitulo: "recoge, separa o entrega",
    color: "#d97706",
    fondo: "#fff4e5",
    borde: "#f0b56a",
  },
] as const;

export const camposRecorridoReal = [
  { id: "lugar" as const, etiqueta: "Lugar:", filas: 1 },
  { id: "actor" as const, etiqueta: "Actor que decide o actúa:", filas: 2 },
  { id: "ocurre" as const, etiqueta: "Qué ocurre con el material:", filas: 2 },
  { id: "cantidad" as const, etiqueta: "Cantidad / frecuencia:", filas: 1 },
  { id: "costo" as const, etiqueta: "Costo o tiempo:", filas: 1 },
] as const;

/**
 * Precarga Reto 2 → Reto 4 (recorrido real).
 * entra/se-usa/destino (comprender) → entra/se-usa/sale (definir).
 */
export const precargaRecorridoDesdeComprender: Array<{
  etapaComprenderId: string;
  etapaRecorridoId: (typeof etapasRecorridoReal)[number]["id"];
}> = [
  { etapaComprenderId: "entra", etapaRecorridoId: "entra" },
  { etapaComprenderId: "se-usa", etapaRecorridoId: "se-usa" },
  { etapaComprenderId: "destino", etapaRecorridoId: "sale" },
];

export function sugerenciasRecorridoDesdeComprender(
  respuestas: Record<string, string>,
): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const map of precargaRecorridoDesdeComprender) {
    const nota = respuestas[clavesEmprendeCircular.etapaNota(map.etapaComprenderId)]?.trim() ?? "";
    const quien =
      respuestas[clavesEmprendeCircular.etapaQuien(map.etapaComprenderId)]?.trim() ?? "";
    if (nota) {
      salida[clavesEmprendeCircular.recorridoCampo(map.etapaRecorridoId, "ocurre")] = nota;
    }
    if (quien) {
      salida[clavesEmprendeCircular.recorridoCampo(map.etapaRecorridoId, "actor")] = quien;
    }
  }
  return salida;
}

export const unidadesBaseIndicador = [
  { id: "unidades", etiqueta: "unidades" },
  { id: "kg", etiqueta: "kg" },
  { id: "litros", etiqueta: "litros" },
  { id: "frecuencia", etiqueta: "frecuencia" },
  { id: "costo", etiqueta: "costo" },
  { id: "porcentaje-dias", etiqueta: "% / días" },
] as const;

export const comprobacionesDefinicion = [
  { id: "usuario-actor", etiqueta: "usuario o actor específico", columna: "izq" as const },
  { id: "material-lugar", etiqueta: "material y lugar definidos", columna: "der" as const },
  { id: "mecanismo", etiqueta: "mecanismo en el punto crítico", columna: "izq" as const },
  { id: "indicador-unidad", etiqueta: "indicador con unidad", columna: "der" as const },
  { id: "linea-base", etiqueta: "línea base o pregunta pendiente", columna: "izq" as const },
  { id: "alcance", etiqueta: "alcance del colegio", columna: "der" as const },
  { id: "seguro-inclusivo", etiqueta: "seguro e inclusivo", columna: "izq" as const },
];

/** Campos de Alternativa A en Reto 5 · Diseñar (sin “recursos”; ese va en dimensiones F/M/T/R). */
export const camposDetalleAlternativa = [
  {
    id: "nombre" as const,
    titulo: "NOMBRE DEL PRODUCTO",
    pista: "cómo se llamará el producto o servicio",
    filas: 1,
  },
  {
    id: "lema" as const,
    titulo: "LEMA COMERCIAL",
    pista: "frase corta que lo identifica",
    filas: 1,
  },
  {
    id: "descripcion" as const,
    titulo: "DESCRIPCIÓN",
    pista: "qué cambiaremos o probaremos",
    filas: 2,
  },
  {
    id: "resultado" as const,
    titulo: "RESULTADO ESPERADO",
    pista: "qué creemos que ocurrirá",
    filas: 2,
  },
];

export function accionPorId(id: string | undefined): AccionCircular | undefined {
  if (!id) return undefined;
  return accionesCirculares.find((a) => a.id === id);
}
