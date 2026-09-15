/**
 * Util de desarrollo: rellena canvas + todas las misiones EcoFluencer.
 *
 * En la consola del navegador (solo en DEV, en /mvp):
 *   fillEcoFluencer()
 *   fillEcoFluencer({ paso: 3, misionIndice: 7 })  // ir a la última misión
 *   fillEcoFluencer({ reload: false })             // solo escribe localStorage
 */

import {
  atributosCanal,
  canalesAccesibles,
  clavesEcoFluencer,
  criteriosImpacto,
  criteriosMensaje,
  camposBriefCampana,
  momentosCampana,
  personasImpacto,
  tarjetasBrief,
  tarjetasComprension,
} from "@/data/ecofluencer-misiones";
import {
  escribirForjaStorage,
  FORJA_STORAGE_KEY,
  isTerralabDevFillEnabled,
} from "@/lib/forja-storage";

export { FORJA_STORAGE_KEY } from "@/lib/forja-storage";

/** PNG 1×1 transparente (para campos de imagen en demo). */
const DEMO_IMAGEN_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export type FillEcoFluencerOptions = {
  /** Paso del flujo Forja (1–5). Por defecto 3 (misiones). */
  paso?: number;
  /** Índice de misión EcoFluencer (0–7). Por defecto 0. */
  misionIndice?: number;
  /** Si false, no recarga ni navega. Por defecto true. */
  reload?: boolean;
};

function canvasDemo() {
  return {
    colegio: "Marymount School Barranquilla (demo)",
    brigada: "Guardianes del Mensaje",
    lema: "Cada hábito cuenta, cada voz suma",
    correoLider: "lider.demo.ecofluencer@colegio.edu.co",
    integrantes: "Ana — comunicadora; Luis — investigador; Sofía — diseñadora; Mateo — vocero",
    pistas: "",
    desafio:
      "En el recreo, muchos estudiantes dejan envases en mesas y pisos aunque hay puntos de separación cerca.",
    ideaSemilla:
      "Campaña ECOFluencer con retos por curso y señalética clara para separar en el momento del snack.",
    lab: "influencia",
  };
}

function respuestasEcoFluencerDemo(): Record<string, string> {
  const r: Record<string, string> = {};

  // Reto 1 · Mensaje / Pulso / Eco
  r[clavesEcoFluencer.mensaje] =
    "Antes de irte del snack, deja tu envase en el punto correcto: limpio, rápido y en equipo.";
  r[clavesEcoFluencer.pulso] = "Orgullo / pertenencia";
  r[clavesEcoFluencer.eco] = "Vergüenza / flojera";
  r[clavesEcoFluencer.ajuste] =
    "Separamos en el snack: 10 segundos, el punto correcto, y tu curso suma puntos.";
  for (const c of criteriosMensaje) {
    r[clavesEcoFluencer.criterio(c.id)] = "si";
  }

  // Reto 2 · Comprender
  r[clavesEcoFluencer.casoInvestigado] =
    "Observamos el patio durante el segundo descanso: botellas y empaques quedan en mesas aunque el punto está a 8 metros.";
  const tarjetas: Record<string, string> = {
    quien: "Estudiantes de 6.º a 8.º que meriendan en el patio central",
    "que-hace": "Dejan envases sobre la mesa o el piso al terminar de comer",
    "donde-cuando": "Patio central, segundo descanso (10:30–10:50)",
    barrera: "El punto de separación no se ve desde las mesas y da flojera caminar",
    motivacion: "Sumar puntos para el curso y sentirse parte del equipo cuidador",
    senal: "El campanazo del fin del descanso y los monitores de patio",
  };
  for (const t of tarjetasComprension) {
    r[clavesEcoFluencer.tarjeta(t.id)] = tarjetas[t.id] ?? `Demo ${t.titulo}`;
  }
  r[clavesEcoFluencer.hallazgoComportamiento] =
    "Si el punto no está a la vista, el envase se queda en la mesa aunque la intención sea buena.";

  // Reto 3 · Evaluación
  r[clavesEcoFluencer.publicoObjetivo] = "bachillerato";
  r[clavesEcoFluencer.mensajeAjustado] =
    "Bachillerato: en el snack, camina al punto que ves desde tu mesa y deja el envase limpio. Tu curso suma.";
  for (const n of personasImpacto) {
    r[clavesEcoFluencer.personaImpacto(n)] = `Persona de prueba ${n}`;
    for (const c of criteriosImpacto) {
      r[clavesEcoFluencer.checkImpacto(n, c.id)] = "si";
    }
  }

  // Reto 4 · Brief
  const brief: Record<string, string> = {
    publico: "Estudiantes de bachillerato en el patio",
    verbo: "Separar",
    objeto: "envases del snack",
    lugar: "patio central",
    momento: "segundo descanso",
    frecuencia: "todos los días escolares",
  };
  for (const t of tarjetasBrief) {
    r[clavesEcoFluencer.brief(t.id)] = brief[t.id] ?? `Demo ${t.titulo}`;
  }

  // Reto 5 · Fábrica de campañas
  const briefCampana: Record<string, string> = {
    publico: "Bachillerato del patio central",
    "accion-observable": "Separar envases del snack en el punto visible",
    "lugar-momento": "Patio · segundo descanso",
    barrera: "El punto no se ve desde las mesas",
    beneficio: "Puntos por curso y reconocimiento semanal",
    indicador: "% de mesas limpias al final del descanso",
  };
  for (const c of camposBriefCampana) {
    r[clavesEcoFluencer.briefCampana(c.id)] = briefCampana[c.id] ?? `Demo ${c.etiqueta}`;
  }

  const momentos: Record<string, { decision: string; canal: string }> = {
    gancho: { decision: "Banner en la entrada del patio", canal: "Señalización" },
    evidencia: { decision: "Foto semanal de mesas limpias vs antes", canal: "Video corto" },
    mensaje: { decision: "Frase de 8 palabras en afiche", canal: "Señalización" },
    accion: { decision: "Flecha al punto desde cada zona de mesas", canal: "Señalización" },
    recordatorio: {
      decision: "Monitor recuerda 2 minutos antes del campanazo",
      canal: "Intervención",
    },
    retroalimentacion: {
      decision: "Tablero de puntos por curso el lunes",
      canal: "Canal oficial / cartelera",
    },
  };
  for (const m of momentosCampana) {
    const demo = momentos[m.id] ?? { decision: `Decisión ${m.titulo}`, canal: "Señalización" };
    r[clavesEcoFluencer.momentoDecision(m.id)] = demo.decision;
    r[clavesEcoFluencer.momentoCanal(m.id)] = demo.canal;
  }

  r[clavesEcoFluencer.campanaNombre] = "Punto a la vista";
  r[clavesEcoFluencer.campanaLema] = "Si lo ves, lo separas";
  r[clavesEcoFluencer.campanaTono] = "cercano";
  r[clavesEcoFluencer.campanaTonoOtro] = "";
  r[clavesEcoFluencer.campanaSimbolo] = DEMO_IMAGEN_PNG;
  r[clavesEcoFluencer.mensajePrincipal] =
    "Separa · tu envase del snack · en el punto que ves desde tu mesa";

  for (const canal of canalesAccesibles.slice(0, 4)) {
    r[clavesEcoFluencer.canalAccesible(canal.id)] = "si";
  }

  r[clavesEcoFluencer.canalDetalle("principal", "canal")] = "Señalización + flechas";
  r[clavesEcoFluencer.canalDetalle("principal", "momento")] = "Todo el segundo descanso";
  r[clavesEcoFluencer.canalDetalle("apoyo", "canal")] = "Reto por cursos";
  r[clavesEcoFluencer.canalDetalle("apoyo", "momento")] = "Cierre del descanso / lunes";

  for (const tipo of ["principal", "apoyo"] as const) {
    for (const attr of atributosCanal) {
      r[clavesEcoFluencer.canalAtributo(tipo, attr.id)] = "si";
    }
  }

  // Reto 6–8
  r[clavesEcoFluencer.construirImagen] = DEMO_IMAGEN_PNG;
  r[clavesEcoFluencer.probarMejora] =
    "Acercar más las flechas a las mesas y ensayar el recordatorio oral 1 minuto antes.";
  r[clavesEcoFluencer.inspirarTexto] =
    "Nos inspiró ver que un mensaje corto y una señal visible sí cambian el patio en una semana.";

  return r;
}

export function buildEcoFluencerDemoGuardado(options: FillEcoFluencerOptions = {}) {
  const paso = options.paso ?? 3;
  const misionIndice = options.misionIndice ?? 0;

  return {
    paso,
    pasoMax: Math.max(paso, 3),
    canvas: canvasDemo(),
    preguntas: [] as Array<{ id: string; pregunta: string; ayuda: string; sugerencia: string }>,
    respuestas: {} as Record<string, string>,
    respuestasEcoTech: {} as Record<string, string>,
    respuestasEcoFluencer: respuestasEcoFluencerDemo(),
    respuestasEmprendeCircular: {} as Record<string, string>,
    misionIndice,
    resultado: null,
  };
}

/** Escribe el demo en localStorage y, por defecto, navega a /mvp. */
export function fillEcoFluencer(options: FillEcoFluencerOptions = {}) {
  const guardado = buildEcoFluencerDemoGuardado(options);
  escribirForjaStorage(JSON.stringify(guardado));

  if (options.reload === false) {
    console.info(
      "[terralab] EcoFluencer demo guardado en localStorage. Recarga /mvp para verlo.",
      guardado,
    );
    return guardado;
  }

  const url = new URL("/mvp", window.location.origin);
  window.location.assign(url.toString());
  return guardado;
}

/** Expone `fillEcoFluencer` / `window.fillEcoFluencer` en la consola. */
export function installDevFillEcoFluencer(options: { force?: boolean } = {}) {
  if (typeof window === "undefined") return;

  if (!options.force && !isTerralabDevFillEnabled()) {
    console.info(
      '[terralab] fillEcoFluencer desactivado. En preview: localStorage.setItem("terralab-dev-fill","1"); location.reload()',
    );
    return;
  }

  const w = window as Window & {
    fillEcoFluencer?: typeof fillEcoFluencer;
    terralabDev?: {
      fillEcoFluencer?: typeof fillEcoFluencer;
      fillEmprendeCircular?: unknown;
    };
  };
  w.fillEcoFluencer = fillEcoFluencer;
  w.terralabDev = { ...w.terralabDev, fillEcoFluencer };
  console.info(
    "[terralab] Listo. En consola escribe:\n  window.fillEcoFluencer()\n  window.fillEcoFluencer({ paso: 3, misionIndice: 7 })",
  );
}

// Registro inmediato al importar el módulo en el cliente (DEV o flag localStorage).
if (typeof window !== "undefined") {
  installDevFillEcoFluencer();
}
