/**
 * Util de desarrollo: rellena canvas + todas las misiones Emprende Circular.
 *
 * En la consola del navegador (solo en DEV, en /mvp):
 *   fillEmprendeCircular()
 *   fillEmprendeCircular({ paso: 3, misionIndice: 7 })  // ir a la última misión
 *   fillEmprendeCircular({ reload: false })             // solo escribe sessionStorage
 */

import {
  accionesCirculares,
  accionesRetoDefinir,
  camposAuditoria,
  camposDetalleAlternativa,
  camposRecorridoReal,
  clavesEmprendeCircular,
  comprobacionesDefinicion,
  dimensionesDiseno,
  estadosMaterial,
  etapasComprender,
  etapasRecorridoReal,
  evidenciasComprender,
  pantallasEmprendeCircular,
  unidadesBaseIndicador,
} from "@/data/emprende-circular-misiones";
import { FORJA_STORAGE_KEY, isTerralabDevFillEnabled } from "@/lib/forja-storage";

/** PNG 1×1 transparente (para campos de imagen en demo). */
const DEMO_IMAGEN_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export type FillEmprendeCircularOptions = {
  /** Paso del flujo Forja (1–5). Por defecto 3 (misiones). */
  paso?: number;
  /** Índice de misión Emprende Circular (0–7). Por defecto 0. */
  misionIndice?: number;
  /** Si false, no recarga ni navega. Por defecto true. */
  reload?: boolean;
};

function canvasDemo() {
  return {
    colegio: "Marymount School Barranquilla (demo)",
    brigada: "Ciclo Verde",
    lema: "Del residuo al valor, en cada salón",
    correoLider: "lider.demo.circular@colegio.edu.co",
    integrantes:
      "Camila — investigadora; Diego — prototipista; Valentina — comunicadora; Andrés — registro",
    pistas: "Hojas de una sola cara; vasos en cafetería; útiles guardados sin uso",
    desafio:
      "Sobran hojas impresas por una sola cara y terminan mezcladas en canecas sin aprovecharse.",
    ideaSemilla:
      "Segunda Página: fabricar blocs y libretas escolares reutilizando papel del colegio.",
    lab: "circular",
  };
}

function respuestasEmprendeCircularDemo(): Record<string, string> {
  const r: Record<string, string> = {};

  // Reto 1 · Activar
  r[clavesEmprendeCircular.materialImagen] = DEMO_IMAGEN_PNG;
  r[clavesEmprendeCircular.materialNombre] = "Hoja impresa por una sola cara";
  r[clavesEmprendeCircular.materialDescripcion] =
    "Papel tamaño carta, tinta negra, una cara en blanco; aparece en impresoras y salones.";
  r[clavesEmprendeCircular.dondeAparece] =
    "Sala de profesores, impresoras del bloque B y escritorios al final de clase.";
  r[clavesEmprendeCircular.pistaDia] =
    "En una hora vimos 40 hojas botadas en la caneca gris mezcladas con empaques.";
  for (const e of estadosMaterial.slice(0, 3)) {
    r[clavesEmprendeCircular.estado(e.id)] = "si";
  }
  const accionesDemo = ["reutilizar", "reducir", "aprovechar"] as const;
  accionesDemo.forEach((id, i) => {
    const n = (i + 1) as 1 | 2 | 3;
    r[clavesEmprendeCircular.opcionAccion(n)] = id;
    r[clavesEmprendeCircular.opcionComo(n)] =
      `En el colegio aplicaríamos ${id}: recolectar hojas limpias y convertirlas en blocs.`;
  });

  // Reto 2 · Comprender
  const notasEtapa: Record<string, string> = {
    entra: "Llega en resmas compradas por la administración y se reparte a docentes.",
    "se-usa": "Se imprime tareas, guías y circulares; muchas quedan a media cara.",
    "se-descarta": "Al terminar la clase se tira a la caneca más cercana.",
    "se-mezcla": "Se junta con snacks y papeles sucios en la caneca gris.",
    "se-mueve": "Servicios generales recogen bolsas al mediodía hacia el cuarto de aseo.",
    destino: "Sale del colegio mezclado; no hay ruta clara de reciclaje de papel limpio.",
  };
  const quienes: Record<string, string> = {
    entra: "Administración / proveedor de papelería",
    "se-usa": "Docentes y estudiantes",
    "se-descarta": "Estudiantes al cerrar el cuaderno o la guía",
    "se-mezcla": "Quien vacía el pupitre o limpia el salón",
    "se-mueve": "Personal de aseo",
    destino: "Operador de residuos del colegio (ruta desconocida)",
  };
  for (const etapa of etapasComprender) {
    r[clavesEmprendeCircular.etapaNota(etapa.id)] =
      notasEtapa[etapa.id] ?? `Demo nota ${etapa.titulo}`;
    r[clavesEmprendeCircular.etapaQuien(etapa.id)] =
      quienes[etapa.id] ?? `Actor demo ${etapa.titulo}`;
    r[clavesEmprendeCircular.etapaEvidencia(etapa.id)] =
      evidenciasComprender[etapa.numero % evidenciasComprender.length]!.id;
    r[clavesEmprendeCircular.etapaFuente(etapa.id)] = "Observación de patio + entrevista corta";
  }
  r[clavesEmprendeCircular.hallazgoClave] =
    "se mezcla con residuos húmedos y pierde valor de reutilización.";
  r[clavesEmprendeCircular.preguntaPrioritaria] =
    "¿Cómo separar papel limpio en el salón antes de que llegue a la caneca mixta?";

  // Reto 3 · Experimentar
  const auditoria: Record<string, string> = {
    "tipo-familia": "Papel / cartón escolar",
    origen: "Impresión de guías y circulares",
    cantidad: "≈ 120 hojas/día en el bloque B",
    frecuencia: "Días hábiles, picos antes de exámenes",
    "estado-actual": "Limpio y seco en su mayoría; a veces doblado",
    "destino-actual": "Caneca mixta → bolsa de aseo",
    actores: "Docentes, estudiantes, aseo, administración",
    evidencia: "Conteo de 40 hojas en 1 hora + fotos de caneca",
  };
  for (const c of camposAuditoria) {
    r[clavesEmprendeCircular.auditoria(c.id)] = auditoria[c.id] ?? `Demo ${c.titulo}`;
  }
  for (const a of accionesCirculares.slice(0, 5)) {
    r[clavesEmprendeCircular.oportunidad(a.id)] = "si";
  }
  r[clavesEmprendeCircular.alternativaA] = "Segunda Página (blocs con papel recuperado)";
  const detalleAlt: Record<string, string> = {
    nombre: "Segunda Página",
    lema: "Una hoja más, un bloc menos de basura",
    descripcion: "Recoger hojas limpias y fabricar blocs de 40 hojas para vender o prestar.",
    resultado: "Al menos 20 blocs piloto en 2 semanas y menos papel en caneca mixta.",
  };
  for (const c of camposDetalleAlternativa) {
    r[clavesEmprendeCircular.alternativaCampo("a", c.id)] = detalleAlt[c.id] ?? `Demo ${c.titulo}`;
  }

  // Reto 4 · Definir (recorrido + reto + indicador + checks)
  const recorridoDemo: Record<
    string,
    Record<(typeof camposRecorridoReal)[number]["id"], string>
  > = {
    entra: {
      lugar: "Almacén / sala de profesores",
      actor: "Administración",
      ocurre: "Ingreso de resmas y reparto a docentes",
      cantidad: "2–3 resmas / semana",
      costo: "≈ 30 min de recepción",
    },
    "se-usa": {
      lugar: "Aulas e impresoras",
      actor: "Docentes y estudiantes",
      ocurre: "Impresión y uso parcial de hojas",
      cantidad: "Alta en semanas de evaluación",
      costo: "Tiempo de impresión + papel",
    },
    sale: {
      lugar: "Canecas de salón → cuarto de aseo",
      actor: "Personal de aseo",
      ocurre: "Recolección mezclada sin separación de papel limpio",
      cantidad: "1–2 bolsas / día del bloque",
      costo: "Ronda de mediodía",
    },
  };
  for (const etapa of etapasRecorridoReal) {
    const demo = recorridoDemo[etapa.id];
    for (const campo of camposRecorridoReal) {
      r[clavesEmprendeCircular.recorridoCampo(etapa.id, campo.id)] =
        demo?.[campo.id] ?? `Demo ${etapa.titulo} · ${campo.etiqueta}`;
    }
  }

  r[clavesEmprendeCircular.retoPara] = "estudiantes y docentes del bloque B";
  r[clavesEmprendeCircular.retoAccion] = accionesRetoDefinir[0]!.id;
  r[clavesEmprendeCircular.retoMaterial] = "hojas impresas por una sola cara";
  r[clavesEmprendeCircular.retoLugar] = "salones e impresoras del bloque B";
  r[clavesEmprendeCircular.retoMecanismo] =
    "estación de acopio limpio + kit de fabricación de blocs";
  r[clavesEmprendeCircular.retoIndicador] = "hojas recuperadas por semana";

  r[clavesEmprendeCircular.indicadorQueMediremos] = "Número de hojas limpias recuperadas";
  r[clavesEmprendeCircular.unidadBase(unidadesBaseIndicador[0]!.id)] = "si";
  r[clavesEmprendeCircular.lineaBase] = "0 hojas recuperadas hoy (todo va a caneca mixta)";
  r[clavesEmprendeCircular.periodoFuente] = "Semana de prueba · conteo en estación de acopio";
  r[clavesEmprendeCircular.meta] = "200 hojas / semana en el bloque B";
  r[clavesEmprendeCircular.fechaRevision] = "Viernes de la segunda semana";
  for (const c of comprobacionesDefinicion) {
    r[clavesEmprendeCircular.comprobacion(c.id)] = "si";
  }

  // Reto 5 · Diseñar
  const disenos: Record<string, string> = {
    funcion: "Convertir papel de una cara en blocs útiles para clases.",
    material: "Hojas limpias, cartón recuperado y grapas.",
    tiempo: "2 tardes / semana · 90 minutos por sesión.",
    recursos: "Guillotina, mesas, voluntarios y permiso de aseo.",
  };
  for (const d of dimensionesDiseno) {
    r[clavesEmprendeCircular.diseno(d.id)] = disenos[d.id] ?? `Demo ${d.titulo}`;
  }
  r[clavesEmprendeCircular.prototipoImagen] = DEMO_IMAGEN_PNG;

  // Reto 6–8
  r[clavesEmprendeCircular.construirImagen] = DEMO_IMAGEN_PNG;
  r[clavesEmprendeCircular.probarMejora] =
    "Mejorar la señal de la estación limpia y ensayar un horario fijo de acopio.";
  r[clavesEmprendeCircular.inspirarTexto] =
    "Nos inspiró ver que una hoja “basura” puede volver a ser útil en el mismo colegio.";

  return r;
}

export function buildEmprendeCircularDemoGuardado(options: FillEmprendeCircularOptions = {}) {
  const paso = options.paso ?? 3;
  const maxIndice = Math.max(0, pantallasEmprendeCircular.length - 1);
  const misionIndice = Math.min(Math.max(options.misionIndice ?? 0, 0), maxIndice);

  return {
    paso,
    pasoMax: Math.max(paso, 3),
    canvas: canvasDemo(),
    preguntas: [] as Array<{ id: string; pregunta: string; ayuda: string; sugerencia: string }>,
    respuestas: {} as Record<string, string>,
    respuestasEcoTech: {} as Record<string, string>,
    respuestasEcoFluencer: {} as Record<string, string>,
    respuestasEmprendeCircular: respuestasEmprendeCircularDemo(),
    misionIndice,
    resultado: null,
  };
}

/** Escribe el demo en sessionStorage y, por defecto, navega a /mvp. */
export function fillEmprendeCircular(options: FillEmprendeCircularOptions = {}) {
  const guardado = buildEmprendeCircularDemoGuardado(options);
  sessionStorage.setItem(FORJA_STORAGE_KEY, JSON.stringify(guardado));

  if (options.reload === false) {
    console.info(
      "[terralab] Emprende Circular demo guardado en sessionStorage. Recarga /mvp para verlo.",
      guardado,
    );
    return guardado;
  }

  const url = new URL("/mvp", window.location.origin);
  window.location.assign(url.toString());
  return guardado;
}

/** Expone `fillEmprendeCircular` / `window.fillEmprendeCircular` en la consola. */
export function installDevFillEmprendeCircular(options: { force?: boolean } = {}) {
  if (typeof window === "undefined") return;

  if (!options.force && !isTerralabDevFillEnabled()) {
    console.info(
      '[terralab] fillEmprendeCircular desactivado. En preview: localStorage.setItem("terralab-dev-fill","1"); location.reload()',
    );
    return;
  }

  const w = globalThis as typeof globalThis & {
    fillEmprendeCircular?: typeof fillEmprendeCircular;
    terralabDev?: {
      fillEcoFluencer?: unknown;
      fillEmprendeCircular?: typeof fillEmprendeCircular;
    };
  };
  w.fillEmprendeCircular = fillEmprendeCircular;
  w.terralabDev = { ...w.terralabDev, fillEmprendeCircular };
  console.info(
    "[terralab] Listo. En consola escribe:\n  window.fillEmprendeCircular()\n  window.fillEmprendeCircular({ paso: 3, misionIndice: 7 })",
  );
}

if (typeof window !== "undefined") {
  installDevFillEmprendeCircular();
}
