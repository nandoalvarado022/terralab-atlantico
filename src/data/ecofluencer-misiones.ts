export type CriterioMensaje = {
  id: string;
  etiqueta: string;
  descripcion: string;
};

export type TarjetaComprension = {
  id: string;
  numero: number;
  titulo: string;
  pregunta: string;
  pista: string;
  /** Color del encabezado y del borde (hex o CSS color). */
  color: string;
};

export type PantallaEcoFluencer = {
  id: string;
  numero: number;
  nombre: string;
  tagline?: string;
  instrucciones: string;
};

/** Criterios para validar el mensaje (sin duplicados). */
export const criteriosMensaje: CriterioMensaje[] = [
  {
    id: "claro",
    etiqueta: "Claro",
    descripcion: "Comunica una sola idea principal.",
  },
  {
    id: "creible",
    etiqueta: "Creíble",
    descripcion: "Se apoya en una observación, experiencia o evidencia real.",
  },
  {
    id: "realizable",
    etiqueta: "Realizable",
    descripcion: "Propone algo concreto y posible de realizar.",
  },
  {
    id: "inclusivo",
    etiqueta: "Inclusivo",
    descripcion: "Invita a participar sin acusar, avergonzar o dejar personas por fuera.",
  },
];

/** Seis tarjetas de la sub-pantalla 2: comprender a la audiencia. */
export const tarjetasComprension: TarjetaComprension[] = [
  {
    id: "quien",
    numero: 1,
    titulo: "¿Quién?",
    pregunta: "¿Qué grupo específico queremos comprender?",
    pista: "No escriban «local». Describan a quienes y qué los distingue.",
    color: "#2d6a4f",
  },
  {
    id: "que-hace",
    numero: 2,
    titulo: "¿Qué hace?",
    pregunta: "¿Qué conducta podemos ver o escuchar?",
    pista: "Usen un verbo observable: separa, deja, apaga, comparte…",
    color: "#d97706",
  },
  {
    id: "donde-cuando",
    numero: 3,
    titulo: "¿Dónde/Cuándo?",
    pregunta: "¿En qué lugar y momento ocurre?",
    pista: "Definan una escena concreta, no una situación general.",
    color: "#1d4e89",
  },
  {
    id: "barrera",
    numero: 4,
    titulo: "Barrera",
    pregunta: "¿Qué dificulta o frena la acción?",
    pista: "Puede ser esfuerzo, tiempo, acceso, hábito, norma o confusión.",
    color: "#b91c1c",
  },
  {
    id: "motivacion",
    numero: 5,
    titulo: "Motivación",
    pregunta: "¿Qué beneficio, valor o emoción puede moverlo?",
    pista: "Piensen en lo que la audiencia gana, protege o valora.",
    color: "#7c3aed",
  },
  {
    id: "senal",
    numero: 6,
    titulo: "Señal disponible",
    pregunta: "¿Qué recordatorio o señal ya existe?",
    pista: "Busquen personas, objetos, sonidos, lugares o momentos visibles.",
    color: "#0f766e",
  },
];

export const pantallasEcoFluencer: PantallaEcoFluencer[] = [
  {
    id: "mensaje-pulso-eco",
    numero: 1,
    nombre: "Mensaje",
    tagline: "Pulso y Eco del mensaje",
    instrucciones:
      "Escriban el mensaje que quieren proyectar. Nombren la emoción PULSO que lo impulsa y la contraemoción ECO que podría frenarlo. Luego ajusten el mensaje y marquen los criterios que cumple.",
  },
  {
    id: "comprender-audiencia",
    numero: 2,
    nombre: "Comprender",
    tagline: "Seis preguntas para comprender",
    instrucciones:
      "Completen cada tarjeta. Cuanto más específico sea el grupo, la conducta y la escena, más fácil será diseñar el mensaje.",
  },
  {
    id: "evaluacion",
    numero: 3,
    nombre: "Evaluación",
    tagline: "Evaluación",
    instrucciones:
      "Eligan un público, ajusten el mensaje y evalúen el impacto con personas reales. Todas las normas deben cumplirse antes de continuar.",
  },
  {
    id: "brief-cambio",
    numero: 4,
    nombre: "Brief",
    tagline: "Brief del cambio",
    instrucciones:
      "Completen las seis piezas del brief. Al final verán la frase completa del cambio que quieren lograr.",
  },
  {
    id: "fabrica-campanas",
    numero: 5,
    nombre: "Fábrica",
    tagline: "Fábrica de campañas",
    instrucciones:
      "Armen el brief, los seis momentos, la identidad, el mensaje y los canales de su campaña.",
  },
  {
    id: "construir",
    numero: 6,
    nombre: "Construir",
    tagline: "Construir",
    instrucciones: "Suban el archivo o la imagen de lo que van a construir.",
  },
];

export const publicosObjetivo = [
  { id: "primaria", etiqueta: "Primaria" },
  { id: "bachillerato", etiqueta: "Bachillerato" },
  { id: "docentes", etiqueta: "Docentes" },
  { id: "familias", etiqueta: "Familias" },
  { id: "cafeteria", etiqueta: "Cafetería" },
  { id: "otros", etiqueta: "Otros" },
] as const;

export const criteriosImpacto = [
  { id: "verdadero", etiqueta: "El mensaje es verdadero" },
  { id: "posible", etiqueta: "La acción es posible" },
  { id: "sin-miedo", etiqueta: "No usa miedo o culpa" },
  { id: "beneficio", etiqueta: "El beneficio es claro" },
  { id: "no-discrimina", etiqueta: "No discrimina ni ridiculiza" },
  { id: "sin-datos", etiqueta: "No solicita datos personales" },
] as const;

export const personasImpacto = [1, 2, 3] as const;

export const verbosObservables = [
  "Llevar",
  "Usar",
  "Cerrar",
  "Apagar",
  "Separar",
  "Depositar",
  "Entregar",
  "Recoger",
  "Reutilizar",
  "Evitar",
  "Registrar",
  "Participar",
] as const;

export const verbosInvisibles = [
  "Concientizar",
  "Sensibilizar",
  "Valorar",
  "Aprender",
  "Comprender",
  "Mejorar",
  "Cuidar",
] as const;

export type TarjetaBrief = {
  id: string;
  titulo: string;
  pregunta: string;
  color: string;
  conAyudaVerbos?: boolean;
};

export const tarjetasBrief: TarjetaBrief[] = [
  {
    id: "publico",
    titulo: "Público",
    pregunta: "¿A quién va dirigido el cambio?",
    color: "#2d6a4f",
  },
  {
    id: "verbo",
    titulo: "Verbo",
    pregunta: "¿Qué hará?",
    color: "#d97706",
    conAyudaVerbos: true,
  },
  {
    id: "objeto",
    titulo: "Objeto",
    pregunta: "¿Con qué o sobre qué realizará la acción?",
    color: "#1d4e89",
  },
  {
    id: "lugar",
    titulo: "Lugar",
    pregunta: "¿Dónde ocurrirá?",
    color: "#b91c1c",
  },
  {
    id: "momento",
    titulo: "Momento",
    pregunta: "¿Cuándo o en qué situación ocurrirá?",
    color: "#7c3aed",
  },
  {
    id: "frecuencia",
    titulo: "Frecuencia",
    pregunta: "¿Cada cuánto se espera que ocurra?",
    color: "#0f766e",
  },
];

export const clavesEcoFluencer = {
  mensaje: "ef1-mensaje",
  pulso: "ef1-pulso",
  eco: "ef1-eco",
  ajuste: "ef1-ajuste",
  criterio: (id: string) => `ef1-criterio-${id}`,
  casoInvestigado: "ef2-caso",
  tarjeta: (id: string) => `ef2-${id}`,
  hallazgoComportamiento: "ef2-hallazgo",
  publicoObjetivo: "ef3-publico",
  mensajeAjustado: "ef3-mensaje",
  personaImpacto: (n: number) => `ef3-persona-${n}`,
  checkImpacto: (persona: number, criterioId: string) =>
    `ef3-check-${persona}-${criterioId}`,
  brief: (id: string) => `ef4-${id}`,
  briefCampana: (id: string) => `ef6-brief-${id}`,
  momentoDecision: (id: string) => `ef6-momento-${id}-decision`,
  momentoCanal: (id: string) => `ef6-momento-${id}-canal`,
  campanaNombre: "ef6-identidad-nombre",
  campanaLema: "ef6-identidad-lema",
  campanaTono: "ef6-identidad-tono",
  campanaTonoOtro: "ef6-identidad-tono-otro",
  campanaSimbolo: "ef6-identidad-simbolo",
  mensajePrincipal: "ef6-mensaje-principal",
  canalAccesible: (id: string) => `ef6-canal-acc-${id}`,
  canalDetalle: (tipo: "principal" | "apoyo", campo: string) =>
    `ef6-canal-${tipo}-${campo}`,
  canalAtributo: (tipo: "principal" | "apoyo", id: string) =>
    `ef6-canal-${tipo}-attr-${id}`,
  construirImagen: "ef7-construir-imagen",
} as const;

export const camposBriefCampana = [
  { id: "publico", etiqueta: "Público" },
  { id: "accion-observable", etiqueta: "Acción observable" },
  { id: "lugar-momento", etiqueta: "Lugar / momento" },
  { id: "barrera", etiqueta: "Barrera principal" },
  { id: "beneficio", etiqueta: "Motivación" },
  { id: "indicador", etiqueta: "Indicador de comportamiento" },
] as const;

export const momentosCampana = [
  {
    id: "gancho",
    titulo: "Gancho",
    subtitulo: "Hace detenerse y prestar atención",
    color: "#dbeafe",
    colorBorde: "#93c5fd",
  },
  {
    id: "evidencia",
    titulo: "Evidencia",
    subtitulo: "Hace detenerse y prestar atención",
    color: "#dcfce7",
    colorBorde: "#86efac",
  },
  {
    id: "mensaje",
    titulo: "Mensaje",
    subtitulo: "Explica la idea central con claridad",
    color: "#e0e7ff",
    colorBorde: "#a5b4fc",
  },
  {
    id: "accion",
    titulo: "Acción",
    subtitulo: "Indica qué hacer ahora",
    color: "#ffedd5",
    colorBorde: "#fdba74",
  },
  {
    id: "recordatorio",
    titulo: "Recordatorio",
    subtitulo: "Reaparece en el momento oportuno",
    color: "#f3e8ff",
    colorBorde: "#d8b4fe",
  },
  {
    id: "retroalimentacion",
    titulo: "Retroalimentación",
    subtitulo: "Devuelve resultados y escucha",
    color: "#fce7f3",
    colorBorde: "#f9a8d4",
  },
] as const;

export const tonosCampana = [
  { id: "cercano", etiqueta: "Cercano" },
  { id: "energico", etiqueta: "Enérgico" },
  { id: "sereno", etiqueta: "Sereno" },
  { id: "divertido", etiqueta: "Divertido" },
] as const;

export const canalesAccesibles = [
  { id: "senalizacion", etiqueta: "Señalización" },
  { id: "reto-cursos", etiqueta: "Reto por cursos" },
  { id: "video", etiqueta: "Video" },
  { id: "podcast", etiqueta: "Podcast / audio" },
  { id: "intervencion", etiqueta: "Intervención" },
  { id: "personaje", etiqueta: "Personaje" },
  { id: "experiencia", etiqueta: "Experiencia" },
  { id: "canal-oficial", etiqueta: "Canal oficial" },
  { id: "otros", etiqueta: "Otros" },
] as const;

export const atributosCanal = [
  { id: "se-ve", etiqueta: "Se ve" },
  { id: "se-oye", etiqueta: "Se oye" },
  { id: "se-lee", etiqueta: "Se lee fácil" },
  { id: "sin-internet", etiqueta: "Sin internet" },
  { id: "responsable", etiqueta: "Responsable" },
] as const;

export function sugerenciasBriefCampana(
  respuestas: Record<string, string>,
): Record<string, string> {
  return {
    publico: primeroNoVacio(
      respuestas[clavesEcoFluencer.brief("publico")],
      etiquetaPublico(respuestas[clavesEcoFluencer.publicoObjetivo]),
      respuestas[clavesEcoFluencer.tarjeta("quien")],
    ),
    "accion-observable": primeroNoVacio(
      unirPartes(
        respuestas[clavesEcoFluencer.brief("verbo")],
        respuestas[clavesEcoFluencer.brief("objeto")],
      ),
      respuestas[clavesEcoFluencer.tarjeta("que-hace")],
    ),
    "lugar-momento": primeroNoVacio(
      unirPartes(
        respuestas[clavesEcoFluencer.brief("lugar")],
        respuestas[clavesEcoFluencer.brief("momento")],
      ),
      respuestas[clavesEcoFluencer.tarjeta("donde-cuando")],
    ),
    barrera: primeroNoVacio(respuestas[clavesEcoFluencer.tarjeta("barrera")]),
    beneficio: primeroNoVacio(respuestas[clavesEcoFluencer.tarjeta("motivacion")]),
    indicador: primeroNoVacio(
      respuestas[clavesEcoFluencer.hallazgoComportamiento],
      respuestas[clavesEcoFluencer.brief("frecuencia")],
    ),
  };
}

export function etiquetaPublico(id: string | undefined): string {
  if (!id) return "";
  return publicosObjetivo.find((p) => p.id === id)?.etiqueta ?? "";
}

function primeroNoVacio(...valores: Array<string | undefined>): string {
  for (const v of valores) {
    const t = v?.trim();
    if (t) return t;
  }
  return "";
}

function unirPartes(...partes: Array<string | undefined>): string {
  return partes
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(" · ");
}

export function evaluacionImpactoCompleta(respuestas: Record<string, string>): boolean {
  return personasImpacto.every((persona) =>
    criteriosImpacto.every(
      (c) => respuestas[clavesEcoFluencer.checkImpacto(persona, c.id)] === "si",
    ),
  );
}
