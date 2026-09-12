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
    id: "mapa-usuario",
    numero: 5,
    nombre: "Mapa",
    tagline: "Mapa del usuario",
    instrucciones:
      "Organicen lo que saben de la persona o grupo y la pista que sustenta el reto. Algunos campos llegan precargados desde pasos anteriores.",
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

export const tiposPista = [
  { id: "observacion", etiqueta: "Observación" },
  { id: "testimonio", etiqueta: "Testimonio" },
  { id: "dato", etiqueta: "Dato" },
  { id: "dia-1", etiqueta: "Día 1" },
  { id: "prueba-anterior", etiqueta: "Prueba anterior" },
] as const;

export const camposMapaUsuario = [
  { id: "usuario", etiqueta: "Usuario o grupo" },
  { id: "lugar-momento", etiqueta: "Lugar y momento" },
  { id: "intenta-lograr", etiqueta: "Qué intenta lograr" },
  { id: "dificulta", etiqueta: "Qué le dificulta actuar" },
  { id: "apoyo", etiqueta: "Qué apoyo ya tiene" },
] as const;

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
  mapa: (id: string) => `ef5-${id}`,
  tipoPista: (id: string) => `ef5-pista-tipo-${id}`,
  evidenciaPista: "ef5-pista-evidencia",
} as const;

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

/** Valores sugeridos del mapa a partir de respuestas previas. */
export function sugerenciasMapaUsuario(respuestas: Record<string, string>): Record<string, string> {
  return {
    usuario: primeroNoVacio(
      respuestas[clavesEcoFluencer.brief("publico")],
      etiquetaPublico(respuestas[clavesEcoFluencer.publicoObjetivo]),
      respuestas[clavesEcoFluencer.tarjeta("quien")],
    ),
    "lugar-momento": primeroNoVacio(
      unirPartes(
        respuestas[clavesEcoFluencer.brief("lugar")],
        respuestas[clavesEcoFluencer.brief("momento")],
      ),
      respuestas[clavesEcoFluencer.tarjeta("donde-cuando")],
    ),
    "intenta-lograr": primeroNoVacio(
      unirPartes(
        respuestas[clavesEcoFluencer.brief("verbo")],
        respuestas[clavesEcoFluencer.brief("objeto")],
      ),
      respuestas[clavesEcoFluencer.mensajeAjustado],
      respuestas[clavesEcoFluencer.mensaje],
      respuestas[clavesEcoFluencer.tarjeta("que-hace")],
    ),
    dificulta: primeroNoVacio(respuestas[clavesEcoFluencer.tarjeta("barrera")]),
    apoyo: primeroNoVacio(
      respuestas[clavesEcoFluencer.tarjeta("senal")],
      respuestas[clavesEcoFluencer.tarjeta("motivacion")],
    ),
  };
}

export function evaluacionImpactoCompleta(respuestas: Record<string, string>): boolean {
  return personasImpacto.every((persona) =>
    criteriosImpacto.every(
      (c) => respuestas[clavesEcoFluencer.checkImpacto(persona, c.id)] === "si",
    ),
  );
}
