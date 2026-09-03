export type Idea = {
  problema: string;
  proyecto: string;
  descripcion: string;
  prototipo: string;
  indicador: string;
};

export type Lab = {
  id: string;
  nombre: string;
  titulo: string;
  claim: string;
  foco: string;
  emoji: string;
  ideas: Idea[];
};

function split(proyecto: string) {
  const i = proyecto.indexOf(":");
  return i === -1
    ? { proyecto, descripcion: "" }
    : { proyecto: proyecto.slice(0, i), descripcion: proyecto.slice(i + 1).trim() };
}

const raw: Array<Omit<Lab, "ideas"> & { ideas: Array<Omit<Idea, "descripcion">> }> = [
  {
    id: "circular",
    nombre: "LAB Circular",
    titulo: "Emprende Circular",
    claim: "Convertir residuos en valor",
    foco: "Residuos, aprovechamiento, consumo responsable y emprendimiento.",
    emoji: "♻️",
    ideas: [
      {
        problema: "Uso frecuente de vasos, cubiertos y empaques desechables",
        proyecto:
          "Cafetería Retornable: sistema de recipientes prestados mediante fichas o pasaporte de devolución",
        prototipo: "Estación de préstamo, recipientes de muestra y registro",
        indicador: "Desechables evitados por semana",
      },
      {
        problema: "Libros, uniformes y útiles todavía útiles terminan guardados o desechados",
        proyecto:
          "Banco Circular Escolar: intercambio con puntos por entregar, reparar o reutilizar",
        prototipo: "Módulo de intercambio y catálogo visual",
        indicador: "Objetos intercambiados o recuperados",
      },
      {
        problema: "Se desperdician hojas impresas por una sola cara",
        proyecto:
          "Segunda Página: fabricación de libretas, blocs y materiales escolares reutilizando papel",
        prototipo: "Kit de clasificación y libreta piloto",
        indicador: "Hojas recuperadas",
      },
      {
        problema: "Residuos orgánicos de la cafetería no se aprovechan",
        proyecto:
          "Del Plato al Suelo: separación y compostaje demostrativo para jardines escolares",
        prototipo: "Compostera a escala y guía de uso",
        indicador: "Kilogramos aprovechados",
      },
      {
        problema: "Decoraciones de eventos se utilizan una sola vez",
        proyecto:
          "Biblioteca de Celebraciones: piezas modulares que puedan armarse, desmontarse y prestarse",
        prototipo: "Kit modular de decoración",
        indicador: "Eventos que reutilizan el kit",
      },
      {
        problema: "Aparatos pequeños se desechan sin diagnóstico",
        proyecto:
          "Clínica de Objetos: jornada de diagnóstico, reparación básica o recuperación de partes",
        prototipo: "Ficha de diagnóstico y banco de componentes seguros",
        indicador: "Objetos reparados o partes recuperadas",
      },
      {
        problema: "Botellas y envases ocupan mucho espacio y se mezclan",
        proyecto:
          "Estación Inteligente de Retorno: punto claro de entrega, compactación manual segura y trazabilidad",
        prototipo: "Maqueta funcional y tablero de seguimiento",
        indicador: "Volumen recuperado y errores de separación",
      },
      {
        problema: "Sobran materiales de proyectos y clases",
        proyecto:
          "Pasaporte de Materiales: cada material registra procedencia, usos anteriores y próximo destino",
        prototipo: "Etiquetas o fichas con QR opcional",
        indicador: "Número de ciclos de uso por material",
      },
    ],
  },
  {
    id: "influencia",
    nombre: "LAB Influencia",
    titulo: "ECOFluencer",
    claim: "Mensajes que cambian hábitos",
    foco: "Comunicación ambiental, contenidos, campañas persuasivas y cambio de hábitos.",
    emoji: "📣",
    ideas: [
      {
        problema:
          "Los estudiantes conocen los colores de las canecas, pero separan incorrectamente",
        proyecto:
          "La Caneca Responde: mensajes, señales y retroalimentación inmediata en el punto de disposición",
        prototipo: "Dos versiones de señalización para prueba A/B",
        indicador: "Porcentaje de separación correcta",
      },
      {
        problema: "Se dejan luces, ventiladores o equipos encendidos",
        proyecto:
          "El Último Apaga: campaña basada en compromisos por salón y recordatorios en el punto de salida",
        prototipo: "Señal, personaje y tablero por cursos",
        indicador: "Equipos apagados correctamente",
      },
      {
        problema: "Se desperdicia agua porque pequeñas fugas se normalizan",
        proyecto: "Cada Gota Cuenta: campaña para observar, reportar y atender fugas",
        prototipo: "Sistema visual de reporte y mensaje de activación",
        indicador: "Reportes válidos y fugas atendidas",
      },
      {
        problema: "Parte de los alimentos servidos termina en la basura",
        proyecto:
          "Reto Plato Consciente: mensajes positivos y registro visual del desperdicio diario",
        prototipo: "Identidad, estación de medición y reto semanal",
        indicador: "Disminución del desperdicio",
      },
      {
        problema: "Algunos insectos, aves o plantas generan miedo o rechazo",
        proyecto:
          "Vecinos Invisibles: historias breves que muestran su función ecológica y enseñan a convivir",
        prototipo: "Cartas, señales, audio o recorrido narrativo",
        indicador: "Cambio en percepción antes/después",
      },
      {
        problema: "Las campañas ambientales se olvidan rápidamente",
        proyecto:
          "Misión de 21 Acciones: pequeños retos verificables realizados en lugares y momentos específicos",
        prototipo: "Pasaporte de misiones e insignias",
        indicador: "Acciones completadas",
      },
      {
        problema: "Las familias participan poco en las iniciativas ambientales",
        proyecto:
          "Reto que Viaja a Casa: micromisiones que conectan una práctica escolar con el hogar",
        prototipo: "Tarjetas, mensajes de audio o QR opcional",
        indicador: "Familias participantes",
      },
      {
        problema: "Los mensajes ambientales utilizan culpa o miedo excesivo",
        proyecto:
          "Laboratorio de Emociones Verdes: campaña que compara mensajes de miedo, esperanza, orgullo y pertenencia",
        prototipo: "Piezas A/B y medidor de emociones",
        indicador: "Comprensión e intención de actuar",
      },
    ],
  },
  {
    id: "biodiversidad",
    nombre: "LAB Biodiversidad",
    titulo: "Biodiversidad Viva",
    claim: "Descubrir la vida del colegio",
    foco: "Identificación de especies, huertas, recuperación de zonas verdes y aulas vivas.",
    emoji: "🌿",
    ideas: [
      {
        problema: "La comunidad desconoce las especies presentes en el colegio",
        proyecto:
          "Pasaporte de la Vida Escolar: ruta para descubrir especies y servicios ecosistémicos",
        prototipo: "Pasaporte, mapa y fichas “por verificar”",
        indicador: "Especies observadas y participantes",
      },
      {
        problema: "Existen pocas fuentes de alimento y refugio para polinizadores",
        proyecto:
          "Islas de Polinizadores: módulos con especies nativas adecuadas y puntos de observación",
        prototipo: "Maqueta de jardín y calendario de cuidado",
        indicador: "Visitas de polinizadores",
      },
      {
        problema: "Las aves pueden chocar contra ventanas transparentes o reflectantes",
        proyecto:
          "Ventanas Amigas de las Aves: identificación de puntos de riesgo y patrones visibles de prevención",
        prototipo: "Modelo de ventana con diseños removibles",
        indicador: "Puntos de riesgo intervenidos",
      },
      {
        problema: "Hay zonas calientes, sin sombra y con poca vegetación",
        proyecto:
          "Refugio Climático Vivo: diseño de sombra vegetal, suelo permeable y espacios de descanso",
        prototipo: "Maqueta bioclimática",
        indicador: "Temperatura, sombra o cobertura vegetal",
      },
      {
        problema: "Algunas zonas verdes están compactadas o degradadas",
        proyecto:
          "Suelo Esponja: recuperación demostrativa del suelo mediante cobertura y captación controlada de lluvia",
        prototipo: "Modelo comparativo de infiltración",
        indicador: "Tiempo de infiltración o cobertura",
      },
      {
        problema: "La iluminación nocturna afecta insectos y otros organismos",
        proyecto:
          "Corredor de Noche Amigable: mapa de iluminación innecesaria y propuesta de manejo",
        prototipo: "Mapa lumínico y prototipo de señalización",
        indicador: "Puntos de luz ajustados",
      },
      {
        problema: "La biodiversidad se observa, pero no se monitorea",
        proyecto:
          "Observatorio Escolar de Biodiversidad: registro periódico de morfoespecies y condiciones del lugar",
        prototipo: "Estación interpretativa y ficha de monitoreo",
        indicador: "Registros válidos por periodo",
      },
      {
        problema: "Las zonas verdes no se integran con las clases",
        proyecto:
          "Aula Viva: estación donde distintas asignaturas investigan suelo, clima, especies y relaciones ecológicas",
        prototipo: "Módulo o maqueta con actividades curriculares",
        indicador: "Clases y estudiantes participantes",
      },
    ],
  },
  {
    id: "ecotech",
    nombre: "LAB Tecnología",
    titulo: "EcoTech",
    claim: "Datos que se vuelven acción",
    foco: "Ciencia, recolección de datos, herramientas digitales, sensores y prototipos.",
    emoji: "🔬",
    ideas: [
      {
        problema: "Las fugas de agua se detectan, pero no se reportan ni siguen",
        proyecto: "Mapa de Fugas Activas: reporte por ubicación, estado y responsable",
        prototipo: "Formulario, QR, tablero y alternativa en papel",
        indicador: "Tiempo entre reporte y atención",
      },
      {
        problema: "No se sabe cuánto se llenan o contaminan las canecas",
        proyecto: "Semáforo de Residuos: registro del nivel de llenado y errores de separación",
        prototipo: "Sensor simulado o formulario con tablero",
        indicador: "Desbordamientos y errores registrados",
      },
      {
        problema: "Se desperdicia energía sin datos por salón",
        proyecto: "EcoPanel de Energía: registro de luces, ventiladores y equipos encendidos",
        prototipo: "Tablero digital o físico de seguimiento",
        indicador: "Consumo estimado o acciones correctivas",
      },
      {
        problema: "Algunas aulas alcanzan temperaturas incómodas",
        proyecto:
          "Mapa de Confort Climático: medición de temperatura, sombra y ventilación para tomar decisiones",
        prototipo: "Sensor seguro o registros manuales y mapa",
        indicador: "Puntos críticos identificados",
      },
      {
        problema: "Los datos ambientales se recogen, pero no generan acciones",
        proyecto:
          "Dato que Actúa: sistema que convierte cada registro en una alerta, recomendación y responsable",
        prototipo: "Flujo entrada–regla–salida–acción",
        indicador: "Decisiones tomadas con los datos",
      },
      {
        problema: "El colegio carece de información periódica sobre biodiversidad",
        proyecto:
          "BioRegistro Escolar: herramienta para registrar observaciones sin capturar organismos",
        prototipo: "Formulario, catálogo visual y mapa",
        indicador: "Observaciones completas y verificables",
      },
      {
        problema: "Las campañas usan códigos QR, pero no todos tienen internet o teléfono",
        proyecto: "EcoInformación para Todos: información accesible con rutas digital y offline",
        prototipo: "QR, panel físico, audio y tarjetas",
        indicador: "Usuarios que acceden por cada ruta",
      },
      {
        problema: "Las soluciones tecnológicas recopilan datos innecesarios",
        proyecto:
          "Privacidad Verde: rediseño de una herramienta ambiental que funcione con datos mínimos y no personales",
        prototipo: "Prototipo de formulario seguro",
        indicador: "Datos eliminados sin afectar la función",
      },
    ],
  },
];

export const labs: Lab[] = raw.map((lab) => ({
  ...lab,
  ideas: lab.ideas.map((idea) => ({ ...idea, ...split(idea.proyecto) })),
}));

export const totalIdeas = labs.reduce((n, l) => n + l.ideas.length, 0);

export const ruta = [
  { n: 1, fase: "Comprender", nombre: "Aprender", desc: "Activación de conocimientos y conformación del equipo." },
  { n: 2, fase: "Comprender", nombre: "Explorar", desc: "Cartografía escolar e identificación de problemas visibles y ocultos." },
  { n: 3, fase: "Comprender", nombre: "Investigar", desc: "Ecoauditoría escolar, recopilación de datos y formulación del reto." },
  { n: 4, fase: "Comprender", nombre: "Diseñar", desc: "Matriz de ideas y estructuración de la solución óptima." },
  { n: 5, fase: "Actuar", nombre: "Construir", desc: "Desarrollo del Producto Mínimo Viable (PMV) o prototipo." },
  { n: 6, fase: "Actuar", nombre: "Probar", desc: "Validación con usuarios reales, medición inicial y ajustes." },
  { n: 7, fase: "Actuar", nombre: "Inspirar", desc: "Storytelling, diseño visual y preparación del pitch." },
  { n: 8, fase: "Actuar", nombre: "Transformar", desc: "Expo final, evaluación de impacto y plan de continuidad." },
];
