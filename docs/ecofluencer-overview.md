# ECOFluencer — overview para agentes

Documento de contexto sobre el flujo de misiones estructuradas de **LAB Influencia (ECOFluencer)** en Forja MVP. Sustituye el flujo genérico de “preguntas del PRD” (IA) cuando el lab seleccionado es `influencia`.

## Cómo se activa

- Lab en catálogo: `id: "influencia"` → título UI **ECOFluencer** (`src/data/labs.ts`).
- En el paso 2 de Forja MVP (“Elegir lab y enfoque”), si `canvas.lab === "influencia"`:
  - CTA: **“Continuar con las misiones”** (no “Generar las preguntas del PRD”).
  - Paso 3 del wizard: componente `EcoFluencerQuestions` (no formulario PRD ni `MisionesEcoTech`).
- Orquestación: `src/components/mvp/ForjaMvp.tsx` (`esEcoFluencer`, estado `respuestasEcoFluencer`, persistencia en `localStorage`).

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/data/ecofluencer-misiones.ts` | Pantallas, catálogos, claves de respuesta, precargas (`sugerenciasBriefCampana`, etc.) |
| `src/components/mvp/EcoFluencerQuestions.tsx` | Orquestador de retos 1–6, navegación, flatten hacia MVP |
| `src/components/mvp/TarjetaEcoFluencer.tsx` | Tarjeta reutilizable (reto 2 y brief del reto 4) |
| `src/components/mvp/FabricaCampanasEcoFluencer.tsx` | Reto 5 completo |
| `src/components/mvp/SubirImagenEcoFluencer.tsx` | Subida/preview de imagen (reto 5 símbolo + reto 6) |
| `src/assets/images/ecofluencer-6-momentos-de-la-campana.png` | Imagen de ayuda modal de los 6 momentos |

Patrón análogo a EcoTech: datos + UI multi-pantalla + `flatten*` → `construirMvp`.

## Las 6 pantallas (retos)

Navegación libre entre números (se puede saltar a un reto mayor o menor). Estado compartido: `Record<string, string>` con claves `ef*`.

### 1. Pulso y Eco del mensaje (`mensaje-pulso-eco`)

- Mensaje a proyectar.
- Emoción **PULSO** y contraemoción **ECO**, cada una con modal de ayuda (slot listo para ayudas visuales).
- **Ajuste del mensaje** (“Para fortalecer el Pulso y reducir el Eco…”).
- Checklist: Claro, Creíble, Realizable, Inclusivo.

### 2. Seis preguntas para comprender (`comprender-audiencia`)

- Cuadros tipo libreta (azul marino / `deep`): **El caso que investigamos** y **Hallazgo del comportamiento**.
- 6 tarjetas de colores distintos (componente `TarjetaEcoFluencer`), animación de entrada en escala escalonada:
  1. ¿Quién? · 2. ¿Qué hace? · 3. ¿Dónde/Cuándo? · 4. Barrera · 5. Motivación · 6. Señal disponible.

### 3. Evaluación (`evaluacion`)

- Público objetivo (aspecto checkbox, **selección única**): Primaria, Bachillerato, Docentes, Familias, Cafetería, Otros.
- **Crea tu mensaje**: se precarga desde **Ajuste del mensaje** del reto 1 (fallback: mensaje proyectado).
- **Evaluación del impacto**: 3 personas × 6 criterios; no se puede avanzar al MVP/siguiente si faltan checks (aviso de normas). Botón temporal **“Seleccionar todos”** (solo testing).
- Panel lateral con la frase del EcoInfluencer.

### 4. Brief del cambio (`brief-cambio`)

- 6 tarjetas en grid: Público (precargado del público del reto 3), Verbo (modal multi-selección de verbos observables/invisibles), Objeto, Lugar, Momento, Frecuencia.
- Frase armada en vivo + fórmula/ejemplo hipotético.

### 5. Fábrica de campañas (`fabrica-campanas`)

1. **Brief del cambio** (campos editables con precarga):
   - Público, Acción observable, Lugar/momento, Barrera principal ← Barrera reto 2, Motivación ← Motivación reto 2, Indicador ← Hallazgo del comportamiento reto 2.
2. **Ensamblen los 6 momentos** (tarjetas numeradas 1–6: Gancho… Retroalimentación; “Nuestra decisión” + “Canal o soporte”). Botón Ayuda → modal con imagen `ecofluencer-6-momentos-de-la-campana.png`.
3. **Identidad**: nombre, lema, tono (único), otro; símbolo/imagen (`SubirImagenEcoFluencer`).
4. **Mensaje principal** (textarea).
5. **Canales accesibles**: primer check → Canal principal; segundo → Canal de apoyo. Luego detalle por canal (momento + atributos se ve / se oye / etc.).

### 6. Construir (`construir`)

- Misma UX de subida de imagen que el símbolo del reto 5 (`SubirImagenEcoFluencer`, clave `construirImagen`).

## Precargas importantes (reto → reto)

| Origen | Destino |
|--------|---------|
| Reto 1 · Ajuste del mensaje (o mensaje) | Reto 3 · Crea tu mensaje |
| Reto 3 · Público objetivo | Reto 4 · tarjeta Público |
| Reto 2 · Barrera | Reto 5 · Barrera principal |
| Reto 2 · Motivación | Reto 5 · Motivación |
| Reto 2 · Hallazgo del comportamiento | Reto 5 · Indicador de comportamiento |
| Reto 4 / 2 / 3 (varios) | Reto 5 brief vía `sugerenciasBriefCampana` |

Si un campo destino ya tiene texto, no se sobrescribe.

## Qué se quitó a propósito

- Pantalla **“Mapa del usuario”** (antes era el reto 5): mapa, pista, cadena de funcionamiento y propuesta funcional. No reintroducir sin pedirlo.
- Tras quitarla, **Fábrica** pasó a ser el reto 5 y **Construir** el 6.

## Comportamientos UX a respetar

- Navegación por pills de número: **libre** (no bloquear retos mayores).
- Lab EcoFluencer: no llamar a `generarPreguntas` (IA PRD).
- Al cambiar de lab en el paso 2, se resetea `misionIndice`.
- Respuestas en `localStorage` (`terralab-forja-mvp` → `respuestasEcoFluencer`). Solo se borran al confirmar **Empezar con otra brigada**.
- Al finalizar: `flattenRespuestasEcoFluencer` → `pedirMvp` / `construirMvp`.

## Extender el flujo

1. Añadir entrada en `pantallasEcoFluencer` en `ecofluencer-misiones.ts`.
2. Claves nuevas en `clavesEcoFluencer`.
3. Rama en `ContenidoPantalla` (o componente hermano como `FabricaCampanasEcoFluencer`).
4. Ampliar `flattenRespuestasEcoFluencer` / flatten del subcomponente.
5. Actualizar este documento.
