export type Opcion = string;

export type CampoTexto = { id: string; tipo: "texto"; etiqueta: string; ayuda?: string };
export type CampoTextarea = { id: string; tipo: "textarea"; etiqueta: string; ayuda?: string };
export type CampoNumero = { id: string; tipo: "numero"; etiqueta: string; ayuda?: string };
export type CampoOpcion = {
  id: string;
  tipo: "opcion";
  etiqueta: string;
  ayuda?: string;
  opciones: Opcion[];
};

export type ColumnaTabla = {
  id: string;
  etiqueta: string;
  tipo: "texto" | "numero" | "opcion";
  opciones?: Opcion[];
};

export type FilaTabla = { id: string; etiqueta: string };

export type CampoTabla = {
  id: string;
  tipo: "tabla";
  etiqueta: string;
  ayuda?: string;
  columnas: ColumnaTabla[];
  filas: FilaTabla[];
};

export type Campo = CampoTexto | CampoTextarea | CampoNumero | CampoOpcion | CampoTabla;

export type Seccion = {
  titulo?: string;
  instrucciones?: string;
  campos: Campo[];
};

export type Pantalla = {
  id: string;
  numero: number;
  nombre: string;
  tagline?: string;
  instrucciones: string;
  secciones: Seccion[];
};

const filasBitacora: FilaTabla[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  etiqueta: `N.º ${i + 1}`,
}));

export const misionesEcoTech: Pantalla[] = [
  {
    id: "m1",
    numero: 1,
    nombre: "Activar",
    tagline: "Nuestro radar de ayuda",
    instrucciones:
      "Dibujen una escena del Día 1. El reto ya existe: ahora vamos a mirarlo con ojos EcoTech.",
    secciones: [
      {
        campos: [
          {
            id: "m1-que-pasa",
            tipo: "texto",
            etiqueta: "¿Qué está pasando?",
            ayuda: "Un dibujo y pocas palabras. Señalen el lugar.",
          },
          { id: "m1-quien-necesita", tipo: "texto", etiqueta: "¿Quién necesita ayuda?" },
          {
            id: "m1-pista",
            tipo: "texto",
            etiqueta: "Pista que ya tenemos",
            ayuda: "Algo observado, escuchado o registrado.",
          },
          {
            id: "m1-funcion",
            tipo: "opcion",
            etiqueta: "¿Qué hace falta? Rodeen una función principal.",
            opciones: ["Medir", "Registrar", "Comparar", "Avisar"],
          },
          { id: "m1-persona-puede", tipo: "texto", etiqueta: "La persona necesita poder..." },
          { id: "m1-info-falta", tipo: "texto", etiqueta: "Una información que le falta es..." },
        ],
      },
    ],
  },
  {
    id: "m2",
    numero: 2,
    nombre: "Comprender",
    tagline: "La cadena de decisiones",
    instrucciones:
      "Cada integrante representa una parte. Completen con una frase corta o un dibujo.",
    secciones: [
      {
        campos: [
          { id: "m2-persona", tipo: "texto", etiqueta: "1. Persona — ¿Quién actúa?" },
          { id: "m2-tarea", tipo: "texto", etiqueta: "2. Tarea — ¿Qué necesita hacer?" },
          { id: "m2-dato", tipo: "texto", etiqueta: "3. Dato — ¿Qué necesita saber?" },
          { id: "m2-accion", tipo: "texto", etiqueta: "4. Acción — ¿Qué hará después?" },
          {
            id: "m2-filtro-internet",
            tipo: "opcion",
            etiqueta: "¿Puede seguir sin internet?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-filtro-materiales",
            tipo: "opcion",
            etiqueta: "¿Tenemos materiales y equipo?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-filtro-entiende",
            tipo: "opcion",
            etiqueta: "¿Se entiende y se puede usar?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-filtro-datos",
            tipo: "opcion",
            etiqueta: "¿Pide solo datos necesarios?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-filtro-revisa",
            tipo: "opcion",
            etiqueta: "¿Alguien revisará y responderá?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-filtro-compara",
            tipo: "opcion",
            etiqueta: "¿La comparamos con una opción en papel?",
            opciones: ["Listo", "Ajustar", "Por averiguar"],
          },
          {
            id: "m2-ruta",
            tipo: "opcion",
            etiqueta: "Ruta que probaremos",
            opciones: ["Papel", "Digital", "Combinada"],
          },
          { id: "m2-ajuste", tipo: "texto", etiqueta: "Ajuste o pregunta pendiente" },
        ],
      },
    ],
  },
  {
    id: "m3",
    numero: 3,
    nombre: "Experimentar",
    tagline: "Bitácora de ocho pistas",
    instrucciones:
      "Con observación real, registren aquí. Con las tarjetas de práctica, ordénenlas en la mesa; no las copien.",
    secciones: [
      {
        campos: [
          {
            id: "m3-usando",
            tipo: "opcion",
            etiqueta: "Estamos usando",
            opciones: ["Observación real", "Datos de ensayo"],
          },
          { id: "m3-que-observamos", tipo: "texto", etiqueta: "Qué observamos" },
          { id: "m3-fecha", tipo: "texto", etiqueta: "Fecha" },
          { id: "m3-hora", tipo: "texto", etiqueta: "Hora / intervalo" },
          { id: "m3-metodo", tipo: "texto", etiqueta: "Método" },
          { id: "m3-unidad", tipo: "texto", etiqueta: "Unidad u opciones" },
          {
            id: "m3-bitacora",
            tipo: "tabla",
            etiqueta: "Bitácora de ocho pistas",
            columnas: [
              { id: "punto", etiqueta: "Punto / hora si cambia", tipo: "texto" },
              { id: "valor", etiqueta: "Valor", tipo: "texto" },
              {
                id: "entiende",
                etiqueta: "¿Se entiende?",
                tipo: "opcion",
                opciones: ["Sí", "Revisar"],
              },
            ],
            filas: filasBitacora,
          },
          {
            id: "m3-mejora-instruccion",
            tipo: "texto",
            etiqueta: "Mejoramos una instrucción o nombre de campo",
          },
          { id: "m3-prueba1-dato", tipo: "texto", etiqueta: "Prueba nueva 1 · punto + dato" },
          {
            id: "m3-prueba1-entendio",
            tipo: "opcion",
            etiqueta: "Prueba nueva 1 · ¿Se entendió?",
            opciones: ["Sí", "Ajustar"],
          },
          { id: "m3-prueba2-dato", tipo: "texto", etiqueta: "Prueba nueva 2 · punto + dato" },
          {
            id: "m3-prueba2-entendio",
            tipo: "opcion",
            etiqueta: "Prueba nueva 2 · ¿Se entendió?",
            opciones: ["Sí", "Ajustar"],
          },
        ],
      },
    ],
  },
  {
    id: "m4",
    numero: 4,
    nombre: "Definir",
    tagline: "El personaje de nuestro reto",
    instrucciones:
      "Piensen en una persona usuaria real. Si están imaginando sus respuestas, marquen «por verificar».",
    secciones: [
      {
        campos: [
          {
            id: "m4-quien-usara",
            tipo: "texto",
            etiqueta: "¿Quién usará la idea?",
            ayuda: "Dibujen a la persona y pongan su rol.",
          },
          { id: "m4-quiere-lograr", tipo: "texto", etiqueta: "Quiere lograr..." },
          { id: "m4-le-cuesta", tipo: "texto", etiqueta: "Hoy le cuesta porque..." },
          { id: "m4-pista-sostiene", tipo: "texto", etiqueta: "Pista que lo sostiene" },
          {
            id: "m4-origen",
            tipo: "opcion",
            etiqueta: "Origen",
            opciones: ["Día 1", "Observación", "Conversación", "Ensayo"],
          },
          { id: "m4-por-verificar", tipo: "texto", etiqueta: "Algo por verificar" },
          { id: "m4-tarea-concreta", tipo: "texto", etiqueta: "Tarea concreta que probaremos" },
          { id: "m4-dato-minimo", tipo: "texto", etiqueta: "Dato mínimo que necesita" },
          { id: "m4-exito-logra", tipo: "texto", etiqueta: "Éxito: logra..." },
          {
            id: "m4-exito-segundos",
            tipo: "numero",
            etiqueta: "...sin pistas, en máximo cuántos segundos",
          },
        ],
      },
    ],
  },
  {
    id: "m5",
    numero: 5,
    nombre: "Diseñar",
    tagline: "El circuito de nuestra idea",
    instrucciones:
      "Un espacio por integrante. Dibujen maneras distintas de ayudar a la misma persona.",
    secciones: [
      {
        titulo: "Cuatro ideas y una mezcla",
        instrucciones:
          "Un espacio por integrante. Dibujen maneras distintas de ayudar a la misma persona.",
        campos: [
          { id: "m5a-idea1", tipo: "texto", etiqueta: "Idea 1" },
          { id: "m5a-idea2", tipo: "texto", etiqueta: "Idea 2" },
          { id: "m5a-idea3", tipo: "texto", etiqueta: "Idea 3" },
          { id: "m5a-idea4", tipo: "texto", etiqueta: "Idea 4" },
          { id: "m5a-mezcla", tipo: "textarea", etiqueta: "La mezcla que vamos a construir" },
        ],
      },
      {
        titulo: "El circuito de nuestra idea",
        instrucciones: "Conecten las piezas 1, 2, 3 y 4. La regla la puede ejecutar una persona.",
        campos: [
          { id: "m5b-entrada", tipo: "texto", etiqueta: "1. Entrada — ¿Qué recibe?" },
          { id: "m5b-regla-si", tipo: "texto", etiqueta: "2. Regla — Si..." },
          { id: "m5b-regla-entonces", tipo: "texto", etiqueta: "Entonces..." },
          { id: "m5b-regla-sino", tipo: "texto", etiqueta: "Si no..." },
          { id: "m5b-salida", tipo: "texto", etiqueta: "3. Salida — ¿Qué muestra o responde?" },
          {
            id: "m5b-accion",
            tipo: "texto",
            etiqueta: "4. Acción — ¿Qué hace la persona después?",
          },
          {
            id: "m5b-falta-dato",
            tipo: "texto",
            etiqueta: "Si falta un dato... ¿Qué mensaje ayuda a completarlo?",
          },
          {
            id: "m5b-sin-conexion",
            tipo: "texto",
            etiqueta: "Sin conexión o dispositivo... ¿Cómo seguimos con la misma tarea?",
          },
        ],
      },
    ],
  },
  {
    id: "m6",
    numero: 6,
    nombre: "Construir",
    tagline: "Nuestro prototipo responde",
    instrucciones:
      "El prototipo se construye con materiales sobre la mesa. Aquí guarden dibujos sencillos de sus cuatro momentos.",
    secciones: [
      {
        campos: [
          {
            id: "m6-formato",
            tipo: "opcion",
            etiqueta: "Formato",
            opciones: ["Papel", "Digital", "Sensor con mentor"],
          },
          { id: "m6-inicio", tipo: "texto", etiqueta: "1. Inicio — Lo primero que ve." },
          {
            id: "m6-entrada",
            tipo: "texto",
            etiqueta: "2. Entrada — Lo que elige, toca o entrega.",
          },
          {
            id: "m6-resultado",
            tipo: "texto",
            etiqueta: "3. Resultado — La respuesta después de la regla.",
          },
          {
            id: "m6-accion",
            tipo: "texto",
            etiqueta: "4. Acción — El siguiente paso de la persona.",
          },
          { id: "m6-funciona", tipo: "texto", etiqueta: "Lo que ya funciona" },
          { id: "m6-simula", tipo: "texto", etiqueta: "Lo que simula el equipo" },
          { id: "m6-falta", tipo: "texto", etiqueta: "Falta por completar..." },
          { id: "m6-opera", tipo: "texto", etiqueta: "Quién opera el plan en papel" },
        ],
      },
    ],
  },
  {
    id: "m7",
    numero: 7,
    nombre: "Probar",
    tagline: "Tres visitas y una mejora",
    instrucciones:
      "Usen la tarea y el tiempo acordados. Una persona prueba; el equipo observa sin dar pistas.",
    secciones: [
      {
        campos: [
          {
            id: "m7-visitas",
            tipo: "tabla",
            etiqueta: "Tres visitas",
            columnas: [
              {
                id: "logra",
                etiqueta: "¿Lo logra solo/a?",
                tipo: "opcion",
                opciones: ["Sí", "No"],
              },
              { id: "segundos", etiqueta: "Segundos", tipo: "numero" },
              { id: "detuvo", etiqueta: "¿Dónde se detuvo?", tipo: "texto" },
            ],
            filas: [
              { id: "v1", etiqueta: "Visita 1" },
              { id: "v2", etiqueta: "Visita 2" },
              { id: "v3", etiqueta: "Visita 3" },
            ],
          },
          {
            id: "m7-falta-dato",
            tipo: "opcion",
            etiqueta: "Falta un dato — ¿El mensaje ayuda a completarlo?",
            opciones: ["Sí", "Ajustar"],
          },
          {
            id: "m7-falla-conexion",
            tipo: "opcion",
            etiqueta: "Falla la conexión o el equipo — ¿La misma tarea sigue en papel?",
            opciones: ["Sí", "Ajustar"],
          },
          { id: "m7-antes", tipo: "textarea", etiqueta: "Antes · la dificultad" },
          { id: "m7-despues", tipo: "textarea", etiqueta: "Después · nuestro cambio" },
          {
            id: "m7-nueva-logra",
            tipo: "opcion",
            etiqueta: "Nueva prueba · misma tarea — ¿La logra sin pistas?",
            opciones: ["Sí", "No"],
          },
          { id: "m7-nueva-tiempo", tipo: "numero", etiqueta: "Tiempo (segundos)" },
        ],
      },
    ],
  },
  {
    id: "m8",
    numero: 8,
    nombre: "Inspirar",
    tagline: "Nuestro estreno en seis escenas",
    instrucciones: "Dibujen y usen palabras clave. Ensayen una demostración de 90 segundos.",
    secciones: [
      {
        campos: [
          {
            id: "m8-ayudamos",
            tipo: "texto",
            etiqueta: "1. Ayudamos a...",
            ayuda: "¿Quién necesita la idea?",
          },
          {
            id: "m8-pista-fue",
            tipo: "texto",
            etiqueta: "2. La pista fue...",
            ayuda: "¿Qué evidencia encontramos?",
          },
          {
            id: "m8-asi-se-usa",
            tipo: "texto",
            etiqueta: "3. Así se usa...",
            ayuda: "Entrada, respuesta y acción.",
          },
          {
            id: "m8-al-probar",
            tipo: "texto",
            etiqueta: "4. Al probar vimos...",
            ayuda: "Un resultado real de la prueba.",
          },
          {
            id: "m8-mejoramos",
            tipo: "texto",
            etiqueta: "5. Mejoramos...",
            ayuda: "Qué cambiamos y qué ocurrió.",
          },
          {
            id: "m8-sigue",
            tipo: "texto",
            etiqueta: "6. Sigue...",
            ayuda: "Qué queremos verificar después.",
          },
        ],
      },
    ],
  },
];

export const despuesDelLab: Pantalla = {
  id: "despues-del-lab",
  numero: 9,
  nombre: "Después del lab",
  instrucciones: "Acuerden este plan con su docente. La prueba de hoy es un comienzo.",
  secciones: [
    {
      campos: [
        { id: "despues-proximo-paso", tipo: "textarea", etiqueta: "Nuestro próximo paso pequeño" },
        { id: "despues-quien-acompana", tipo: "texto", etiqueta: "Quién nos acompaña y cuándo" },
        { id: "despues-apoyo", tipo: "texto", etiqueta: "Qué apoyo o material necesitamos" },
        {
          id: "despues-indicador",
          tipo: "textarea",
          etiqueta: "Contaremos o mediremos... en... con esta regla...",
        },
        {
          id: "despues-revision",
          tipo: "tabla",
          etiqueta: "Revisión del indicador",
          columnas: [
            { id: "fecha", etiqueta: "Fecha", tipo: "texto" },
            { id: "dato", etiqueta: "Dato y unidad", tipo: "texto" },
            { id: "condiciones", etiqueta: "Condiciones", tipo: "texto" },
          ],
          filas: [
            { id: "partida", etiqueta: "Punto de partida" },
            { id: "revision2", etiqueta: "Revisión 2" },
            { id: "revision3", etiqueta: "Revisión 3" },
          ],
        },
        {
          id: "despues-quien-revisa",
          tipo: "texto",
          etiqueta: "Quién revisa, actualiza y responde",
        },
        {
          id: "despues-donde-guardamos",
          tipo: "texto",
          etiqueta: "Dónde guardamos y cuándo borramos",
        },
      ],
    },
  ],
};

export const pantallasEcoTech: Pantalla[] = [...misionesEcoTech, despuesDelLab];
