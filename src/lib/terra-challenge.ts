/** Preguntas fijas de Terralab Challenge. El `key` es la columna en `terra_challenge`. */
export const PREGUNTAS_TERRA_CHALLENGE = [
  {
    key: "reto",
    criterio: "Claridad del reto",
    porcentaje: 10,
    pregunta: "¿Cuál es el reto específico que quieren resolver?",
    ayudas: [
      "¿Dónde ocurre y a quién le afecta? Lugar específico y qué tipo de personas.",
      "¿Qué observaron, midieron o registraron para confirmar que existe?",
      "¿Por qué es importante resolverlo?",
    ],
  },
  {
    key: "solucion",
    criterio: "Solución",
    porcentaje: 20,
    pregunta: "¿Cuál es la solución que propone el equipo?",
    ayudas: [
      "Describan en detalle cuál es la propuesta del equipo.",
      "¿Quién recibirá directamente el beneficio?",
    ],
  },
  {
    key: "aprendizaje_prototipo",
    criterio: "Prototipo y validación",
    porcentaje: 5,
    pregunta: "Cuando realizaron el prototipo, ¿qué aprendieron de la prueba?",
    ayudas: [
      "¿Qué funcionó o no funcionó, o qué no habían previsto?",
      "¿Qué resultados obtuvieron?",
    ],
  },
  {
    key: "cambio_concreto",
    criterio: "Impacto esperado",
    porcentaje: 20,
    pregunta: "¿Qué cambio concreto espera lograr?",
    ayudas: [
      "¿Qué indicadores medirán su propuesta?",
      "¿Cuál es la situación inicial o línea base?",
      "¿Cuál es la meta y en cuánto tiempo la esperan lograr?",
      "¿Cómo y cada cuánto medirán este indicador?",
    ],
  },
  {
    key: "viabilidad",
    criterio: "Viabilidad",
    porcentaje: 15,
    pregunta: "¿Cuál es la viabilidad para llevar a cabo el proyecto?",
    ayudas: [
      "¿Cuáles son las acciones para implementarlo?",
      "¿Qué materiales, herramientas, tecnología o espacios necesitan?",
      "¿Qué permisos, aliados o apoyos necesitan y para qué?",
      "¿Existe algún riesgo o impedimento para llevar a cabo el proyecto?",
    ],
  },
  {
    key: "propuesta_valor",
    criterio: "Propuesta de valor e innovación",
    porcentaje: 15,
    pregunta: "¿Cuál es la propuesta de valor de su proyecto?",
    ayudas: [
      "¿Tomaron de guía una idea existente, la adaptaron o combinaron con otra?",
      "¿Qué elemento de su solución consideran más creativo o diferente?",
      "¿Por qué ese elemento es útil para resolver el reto en su colegio?",
    ],
  },
  {
    key: "compromiso_colegio",
    criterio: "Sostenibilidad",
    porcentaje: 15,
    pregunta:
      "¿Cuál es la propuesta que le harán al colegio para comprometerse a trabajar en el proyecto a largo plazo?",
    ayudas: [
      "¿Quiénes liderarán la continuidad de la propuesta aun cuando el equipo ya no esté en el colegio?",
      "¿Qué recursos necesita para continuar?",
    ],
  },
] as const;

export type ClaveTerraChallenge = (typeof PREGUNTAS_TERRA_CHALLENGE)[number]["key"];

export type RespuestasTerraChallenge = Record<ClaveTerraChallenge, string>;

export type TerraChallengeReporte = RespuestasTerraChallenge & {
  id: string;
  created_at: string;
  correo_lider: string;
  colegio: string;
  terranautas: string;
  nombre_proyecto: string;
};

export function respuestasTerraVacias(): RespuestasTerraChallenge {
  return {
    reto: "",
    solucion: "",
    aprendizaje_prototipo: "",
    cambio_concreto: "",
    viabilidad: "",
    propuesta_valor: "",
    compromiso_colegio: "",
  };
}
