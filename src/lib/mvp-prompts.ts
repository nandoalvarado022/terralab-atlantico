/**
 * Prompts del paso 4 · MVP final, separados por lab.
 *
 * Dónde editar:
 * - EcoTech …………… `promptMvpEcoTech`
 * - ECOFluencer ……… `promptMvpEcoFluencer`   (lab id: influencia)
 * - Emprende Circular … `promptMvpEmprendeCircular` (lab id: circular)
 * - Biodiversidad …… `promptMvpBiodiversidad` (fallback; mismo esquema)
 *
 * Cada prompt tiene:
 * - `sistema`: rol del modelo
 * - `instrucciones`: texto que sigue al canvas + respuestas de la brigada
 * - `entrega`: "lovable" → JSON {nombre,documento,prompt}; "pdf" → Markdown del documento
 */

export type PromptMvpLab = {
  sistema: string;
  instrucciones: string;
  /** lovable = EcoTech (vibecoding); pdf = formulación para documento PDF. */
  entrega: "lovable" | "pdf";
};

/** EcoTech — prompt actual (no cambiar el comportamiento base aquí). */
export const promptMvpEcoTech: PromptMvpLab = {
  entrega: "lovable",
  sistema:
    "Eres facilitador de Terra Lab Atlántico (CRA y ALITIC), una estrategia de educación ambiental e innovación escolar. Acompañas brigadas de estudiantes de 3.º de primaria a 9.º grado para convertir un canvas de expedición en un MVP construido con Lovable. Escribes siempre en español claro, concreto y motivador, con lenguaje adecuado para estudiantes de colegio. Nunca inventes datos del colegio que no estén en la información dada.",
  instrucciones: `Devuelve SOLO un objeto JSON, sin markdown fuera de los valores, con estas claves:
{
  "nombre": "nombre corto y memorable del producto",
  "documento": "el documento de MVP completo en Markdown",
  "prompt": "el prompt listo para pegar en Lovable"
}

El "documento" en Markdown debe tener, en este orden y con títulos ##:
1. Nombre del MVP
2. Brigada y colegio
3. El problema que descubrimos (el problema y la pista o dato real que lo respalda)
4. A quién ayuda (usuario principal, la tarea que necesita lograr y la señal de éxito)
5. Cómo funciona (el circuito: qué entrada recibe, qué regla aplica, qué salida muestra y qué acción toma la persona después)
6. Alcance del MVP (3 a 5 pantallas o piezas mínimas, cada una con su descripción y las acciones que permite)
7. Fuera de alcance
8. Datos que se registran (lista de campos)
9. Cómo lo probamos (con cuántas personas, qué tarea les daremos y qué observaremos)
10. Indicador de impacto y próximo paso
11. Criterios de listo (checklist)

El "prompt" debe estar escrito en segunda persona dirigido a Lovable, en español, entre 200 y 350 palabras: qué construir, para quién, el circuito entrada-regla-salida-acción en términos concretos de pantallas y flujos, datos y campos, indicador que se muestra, tono visual apropiado para estudiantes, y la instrucción de empezar por una primera versión navegable sin cuentas de usuario si no son indispensables. No incluyas explicaciones fuera del JSON.`,
};

/**
 * ECOFluencer (lab `influencia`).
 * Entrega: formulación de proyecto lista para PDF (no vibecoding Lovable).
 * Edita este bloque para personalizar el documento.
 */
export const promptMvpEcoFluencer: PromptMvpLab = {
  entrega: "pdf",
  sistema:
    "Eres facilitador de Terra Lab Atlántico en el LAB Influencia (ECOFluencer). Acompañas brigadas de estudiantes de 3.º de primaria a 9.º grado. Tu trabajo es redactar la FORMULACIÓN COMPLETA DEL PROYECTO / CAMPAÑA a partir de TODO lo que la brigada alimentó en el formulario (canvas, misiones y respuestas). El resultado debe servir para generar un documento PDF formal, claro y presentable ante docentes o jurado. Escribes en español claro, concreto y motivador. Nunca inventes datos que no estén en la información dada: sintetiza y organiza lo suministrado. Enfatiza mensaje, público, conducta, canales, llamado a la acción e indicador de comportamiento.",
  instrucciones: `Con la información del canvas y las respuestas de la brigada, elabora la formulación del proyecto ECOFluencer lista para PDF: profesional y presentable (tablas Markdown, listas claras; describe gráficos solo si aportan y sin inventar datos).

IMPORTANTE: NO devuelvas JSON ni explicaciones. Responde ÚNICAMENTE con el cuerpo del documento en Markdown (será convertido a PDF). Empieza con un título "# Nombre de la campaña".

Integra de forma coherente TODO lo relevante que la brigada escribió (brigada, colegio, desafío, idea, misiones, mensaje, público, evaluación, brief, fábrica de campañas, construir, probar, inspirar). No dejes secciones vacías si hay dato; si falta un dato, indica “no indicado por la brigada”. Usa títulos ## en este orden:
1. Portada del proyecto (nombre, brigada, colegio, lab ECOFluencer)
2. Resumen del reto y del cambio de hábito buscado
3. Diagnóstico y evidencia (qué observaron / investigaron)
4. Público objetivo y comportamiento a transformar
5. Mensaje, emoción (Pulso/Eco) y llamado a la acción
6. Estrategia de campaña (canales, momentos, identidad, accesibilidad)
7. Prototipo o pieza a construir (qué van a materializar)
8. Plan de prueba e iteración
9. Indicador de impacto y meta
10. Cronograma o próximos pasos
11. Anexos: síntesis de respuestas clave del formulario (lista breve pregunta → respuesta de lo más importante)`,
};

/**
 * Emprende Circular (lab `circular`).
 * Entrega: formulación de proyecto lista para PDF (no vibecoding Lovable).
 * Edita este bloque para personalizar el documento.
 */
export const promptMvpEmprendeCircular: PromptMvpLab = {
  entrega: "pdf",
  sistema:
    "Eres facilitador de Terra Lab Atlántico en el LAB Circular (Emprende Circular). Acompañas brigadas de estudiantes de 3.º de primaria a 9.º grado. Tu trabajo es redactar la FORMULACIÓN COMPLETA DEL PROYECTO / EMPRENDIMIENTO CIRCULAR a partir de TODO lo que la brigada alimentó en el formulario (canvas, retos y respuestas). El resultado debe servir para generar un documento PDF formal, claro y presentable ante docentes o jurado. Escribes en español claro, concreto y motivador. Nunca inventes datos que no estén en la información dada: sintetiza y organiza lo suministrado. Enfatiza material, flujo circular, actores, mecanismo de valor e indicador medible.",
  instrucciones: `Con la información del canvas y las respuestas de la brigada, elabora la formulación del proyecto Emprende Circular lista para PDF: profesional y presentable (tablas Markdown, listas claras; describe gráficos solo si aportan y sin inventar datos).

IMPORTANTE: NO devuelvas JSON ni explicaciones. Responde ÚNICAMENTE con el cuerpo del documento en Markdown (será convertido a PDF). Empieza con un título "# Nombre del producto o sistema circular".

Integra de forma coherente TODO lo relevante que la brigada escribió (brigada, colegio, desafío, idea, material, comprender, experimentar, definir, diseñar, construir, probar, inspirar). No dejes secciones vacías si hay dato; si falta un dato, indica “no indicado por la brigada”. Usa títulos ## en este orden:
1. Portada del proyecto (nombre, brigada, colegio, lab Emprende Circular)
2. Resumen del reto circular
3. Material o residuo y su contexto en el colegio
4. Diagnóstico del flujo (dónde se pierde valor, quiénes intervienen)
5. Oportunidad y alternativa elegida
6. Definición del reto (para quién, acción, mecanismo, indicador)
7. Diseño de la solución (dimensiones del prototipo / marca)
8. Prototipo a construir y cómo se prueba
9. Indicador de impacto, línea base y meta
10. Próximos pasos y continuidad
11. Anexos: síntesis de respuestas clave del formulario (lista breve pregunta → respuesta de lo más importante)`,
};

/**
 * Biodiversidad Viva (lab `biodiversidad`).
 * Edita este bloque si activan el flujo de MVP para este lab.
 */
export const promptMvpBiodiversidad: PromptMvpLab = {
  entrega: "lovable",
  sistema:
    "Eres facilitador de Terra Lab Atlántico en el LAB Biodiversidad (Biodiversidad Viva). Acompañas brigadas de estudiantes de 3.º de primaria a 9.º grado para convertir el monitoreo de especies o ecosistemas escolares en un MVP digital con Lovable. Escribes en español claro, concreto y motivador. Nunca inventes datos del colegio que no estén en la información dada.",
  instrucciones: promptMvpEcoTech.instrucciones,
};

const promptsPorLab: Record<string, PromptMvpLab> = {
  ecotech: promptMvpEcoTech,
  influencia: promptMvpEcoFluencer,
  circular: promptMvpEmprendeCircular,
  biodiversidad: promptMvpBiodiversidad,
};

/** Devuelve el prompt del lab; si no hay match, usa EcoTech. */
export function promptMvpParaLab(lab: string): PromptMvpLab {
  return promptsPorLab[lab] ?? promptMvpEcoTech;
}

type DatoCanvasPdf = {
  colegio: string;
  brigada: string;
  lema: string;
  correoLider: string;
  integrantes: string;
  desafio: string;
  ideaSemilla: string;
};

type ParQa = { pregunta: string; respuesta: string };

/**
 * Texto completo para el botón Copiar (ECOFluencer / Emprende Circular):
 * instrucciones + prompt IA + formulación + canvas + respuestas del formulario.
 */
export function armarTextoCopiaPdf(opts: {
  labNombre: string;
  nombreProyecto: string;
  promptIa: string;
  documento: string;
  canvas: DatoCanvasPdf;
  preguntasRespuestas: ParQa[];
}): string {
  const canvasLineas = [
    `Colegio: ${opts.canvas.colegio || "no indicado"}`,
    `Brigada: ${opts.canvas.brigada || "no indicada"}`,
    `Lema: ${opts.canvas.lema || "no indicado"}`,
    `Correo del líder: ${opts.canvas.correoLider || "no indicado"}`,
    `Integrantes: ${opts.canvas.integrantes || "no indicados"}`,
    `Desafío de expedición: ${opts.canvas.desafio || "no indicado"}`,
    `Idea semilla: ${opts.canvas.ideaSemilla || "no indicada"}`,
  ].join("\n");

  const qa = (opts.preguntasRespuestas ?? [])
    .filter((r) => r.pregunta.trim() && r.respuesta.trim())
    .map((r, i) => `${i + 1}. ${r.pregunta}\n   → ${r.respuesta}`)
    .join("\n\n");

  return `Genera un documento PDF profesional de formulación de proyecto para Terra Lab Atlántico — ${opts.labNombre}.

INSTRUCCIONES OBLIGATORIAS PARA EL PDF:
- Título del proyecto: ${opts.nombreProyecto}
- Idioma: español
- Público: docentes, mentores o jurado escolar
- Formato: PDF formal con portada, índice o secciones claras, tipografía legible y sin inventar datos
- Usa TODA la información de este mensaje (prompt, formulación, canvas y respuestas)
- Si un dato no aparece, escribe exactamente: "no indicado por la brigada"
- El PDF debe quedar listo para entregar como formulación del proyecto

PROMPT / INSTRUCCIONES DE CONTENIDO:
${opts.promptIa.trim()}

FORMULACIÓN DEL PROYECTO (cuerpo principal del PDF):
${opts.documento.trim()}

DATOS DEL CANVAS (paso 1):
${canvasLineas}

RESPUESTAS DEL FORMULARIO (misiones / retos):
${qa || "sin respuestas adicionales"}
`;
}
