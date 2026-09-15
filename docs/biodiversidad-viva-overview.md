# Biodiversidad Viva — overview para agentes

Documento de contexto sobre el flujo de misiones estructuradas de **LAB Biodiversidad (Biodiversidad Viva)** en Forja MVP. Sustituye el flujo genérico de “preguntas del PRD” (IA) cuando el lab seleccionado es `biodiversidad`.

## Cómo se activa

- Lab en catálogo: `id: "biodiversidad"` → título UI **Biodiversidad Viva** (`src/data/labs.ts`).
- En el paso 2 de Forja MVP (“Elegir lab y enfoque”), si `canvas.lab === "biodiversidad"`:
  - CTA: **“Continuar con las misiones”** (no “Generar las preguntas del PRD”).
  - Paso 3 del wizard: componente `BiodiversidadVivaQuestions`.
- Orquestación: `src/components/mvp/ForjaMvp.tsx` (`esBiodiversidadViva`, estado `respuestasBiodiversidadViva`, persistencia en `localStorage`).

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/data/biodiversidad-viva-misiones.ts` | Pantallas, catálogos, claves de respuesta |
| `src/components/mvp/BiodiversidadVivaQuestions.tsx` | Orquestador (navegación + switch de misiones) |
| `src/components/mvp/biodiversidad-viva/Mision1EnfocaLaVida.tsx` | Misión 1 (puntos 1–3) |
| `src/components/mvp/biodiversidad-viva/RevelaLaRedInvisible.tsx` | Punto 2 de la misión 1 |
| `src/components/mvp/biodiversidad-viva/DescubreLoQueAporta.tsx` | Punto 3 de la misión 1 |
| `src/components/mvp/biodiversidad-viva/Mision2Comprender.tsx` | Misión 2 (puntos 1–3) |
| `src/components/mvp/biodiversidad-viva/Mision3Experimentar.tsx` | Misión 3 (lectura del hábitat) |
| `src/components/mvp/biodiversidad-viva/Mision4Definir.tsx` | Misión 4 (sitio + oportunidad) |
| `src/components/mvp/biodiversidad-viva/Mision5Disenar.tsx` | Misión 5 (reto + intervenciones + esquema) |
| `src/components/mvp/biodiversidad-viva/flatten.ts` | Flatten hacia MVP |
| `src/components/mvp/biodiversidad-viva/types.ts` | `MisionProps` compartido |

Patrón análogo a Emprende Circular / ECOFluencer: datos + UI multi-pantalla + `flatten*` → `construirMvp`. Usamos **misión** (no “reto”) en Biodiversidad Viva.

## Pantallas (misiones)

Navegación libre entre números. Estado compartido: `Record<string, string>` con claves `bv*`.

### 1. Enfoca la vida (`enfoca-la-vida`) — `Mision1EnfocaLaVida`

Dos puntos en la misma misión:

#### Punto 1 · Enfoca la vida

Ficha tipo libreta:

1. **Dibujo / foto / huella** (sin capturar ni manipular la especie).
2. **Nombre común o descripción**.
3. **Tipo** (único): Fauna, Flora, Hongo, Otro.
4. **Lugar exacto y microhábitat**.
5. **Pista observada**: qué vimos, oímos o encontramos.
6. **Nivel de certeza** (único): Lo observamos, Es hipótesis, Confirmar.
7. **Dato que debemos consultar**.

#### Punto 2 · Revela la red invisible (`RevelaLaRedInvisible`)

Diagrama alrededor de **Nuestra especie** (usa el nombre del punto 1):

1. **Lo que necesita**: 2 slots; clic abre modal con catálogo A (una opción por tarjeta).
2. **Acciones de cuidado**: 2 slots; clic abre modal con catálogo C (una opción por tarjeta).
3. **Lo que podría amenazarla**: 2 slots; clic abre modal con catálogo B (una opción por tarjeta).
4. **Si esta vida faltara…**: texto libre (relación → consecuencia).
5. **¿Qué hace mientras nadie la mira?**: texto bajo el círculo central.

Catálogos en `necesidadesSerVivo` / `accionesCuidado` / `amenazasSerVivo`.

#### Punto 3 · Descubre lo que aporta (`DescubreLoQueAporta`)

1. **Servicio 1 / 2 / 3**: clic abre modal con catálogo de 20 servicios (PROVEE, REGULA, SOSTIENE, INSPIRA); una tarjeta por slot.
2. Por cada servicio elegido: campo **porque / evidencia**; si es “Otro…”, campo libre del aporte.
3. **Cuidarla importa porque…**: texto libre.
4. **Amenaza o barrera**: 1 tarjeta (modal catálogo B).
5. **Acción de cuidado**: 1 tarjeta (modal catálogo C) + campo para adaptarla.
6. **Indicador**: texto libre (qué veremos o contaremos).
7. Aviso suave si hay ≥2 servicios de una sola categoría (pide al menos 2 categorías).

Catálogo: `serviciosEcosistemicos` (+ `amenazasSerVivo` / `accionesCuidado` para la misión de cuidado).

### 2. Comprender (`comprender`) — `Mision2Comprender`

#### Punto 1 · Observa el lugar

Rúbrica con escala **2 / 1 / 0 / VT** (selección única por criterio) + evidencia/hallazgo:

1. Vegetación apropiada  
2. Alimento y refugio  
3. Agua sin riesgo  
4. Suelo y sombra  
5. Ausencia de amenazas  

Catálogo: `criteriosObservacion` / `escalaValorObservacion`.

#### Punto 2 · Conexión con el Atlántico

Checklist por secciones (multiselección):

1. Clima y microclima  
2. Ecosistema o conexión territorial  
3. Aspectos que requieren VT  

Catálogo: `seccionesConexionAtlantico`.

#### Punto 3 · Diagnóstico del sitio

Cuatro textos libres:

1. El sitio sostiene vida porque…  
2. La condición más frágil es…  
3. Necesitamos verificar…  
4. Se conecta con el territorio porque…  

Catálogo: `camposDiagnosticoSitio`.

### 3. Experimentar (`experimentar`) — `Mision3Experimentar`

**Lectura rápida del hábitat:**

Antes: punto de inicio, cierre, y textos libres — tipo de árboles y plantas, tipos de ave, tipo de insectos o polinizadores.

1. Cobertura vegetal — rango único (`0-25%` … `76-100%`)  
2. Sombra — rango único  
3. Suelo — multiselección (`opcionesSueloHabitat`)  
4. Visitas de polinizadores — total + flor/planta  
5. Amenazas visibles — multiselección (`amenazasVisiblesHabitat`)  

### 4. Definir (`definir`) — `Mision4Definir`

#### Punto 2 · Lean el sitio como una relación…

Dos textos libres:

1. Activos que debemos conservar o visibilizar  
2. Vacíos, degradación o amenazas  

#### Oportunidad en una frase

Plantilla con huecos:

`En [espacio], mejoraremos o visibilizaremos [condición o grupo] para [beneficiario], sin [riesgo], y verificaremos [indicador].`

Helper: `fraseOportunidadBiodiversidad`.

#### Objetivos complementarios

1. Objetivo ecológico  
2. Objetivo pedagógico  

#### Indicador principal

Campos: qué se medirá, unidad, línea base, meta, periodo, fuente / responsable.

Catálogo: `camposIndicadorPrincipal`. (Sin el cuadro rojo del filtro de cuidado.)

### 5. Diseñar (`disenar`) — `Mision5Disenar`

#### Punto 1 · Recuperen el reto antes de dibujar

Campos editables precargados desde misiones anteriores (solo si están vacíos):

| Campo | Origen |
|-------|--------|
| Reto definido | Frase de oportunidad (`fraseOportunidadBiodiversidad`) |
| Objetivo ecológico | Definir · objetivo ecológico |
| Objetivo pedagógico | Definir · objetivo pedagógico |
| Evidencia del sitio | Activos a conservar (o “sostiene vida” del diagnóstico) |
| Dato por verificar | Diagnóstico “Necesitamos verificar…” (o dato a consultar de M1) |

Helper: `sugerenciasDisenoDesdeDefinir`.

#### Punto 2 · Elijan intervención(es)

8 tarjetas (`intervencionesDiseno`); máximo **2** (1ª = principal, 2ª = complementaria).

#### Punto 3 · Dibujen el esquema

- Nombre de la estrategia (`bv5-nombre-estrategia`)
- Imagen / esquema (`FileUploader` → `bv5-esquema-imagen`)

### 6. Construir (`construir`) — `MisionConstruir`

Misma UI compartida que Emprende Circular / ECOFluencer: subir imagen o video.

Clave: `bv6-construir-imagen`.

### 7. Probar (`probar`) — `MisionProbar`

Texto libre: qué se puede mejorar.

Clave: `bv7-probar-mejora`.

### 8. Inspirar (`inspirar`) — `MisionInspirar`

Texto libre: cómo esto inspiró a construir.

Clave: `bv8-inspirar-texto`.

## Comportamientos UX a respetar

- Navegación por pills de número: **libre**.
- Lab Biodiversidad Viva: no llamar a `generarPreguntas` (IA PRD).
- Al cambiar de lab en el paso 2, se resetea `misionIndice`.
- Respuestas en `localStorage` (`terralab-forja-mvp` → `respuestasBiodiversidadViva`). Solo se borran al confirmar **Empezar con otra brigada**.
- Al finalizar: `flattenRespuestasBiodiversidadViva` → `pedirMvp` / `construirMvp`.
- Entrega: **PDF** (formulación), misma regla que ECOFluencer / Emprende Circular — no prompt Lovable de EcoTech. Prompt: `promptMvpBiodiversidad`.

### Demo en consola

En `/mvp` (DEV o con `localStorage.setItem("terralab-dev-fill","1")`):

```js
fillBiodiversidadViva()
fillBiodiversidadViva({ paso: 3, misionIndice: 7 })  // última misión (Inspirar)
fillBiodiversidadViva({ reload: false })             // solo localStorage
```

Índices: `0` Enfoca · `1` Comprender · `2` Experimentar · `3` Definir · `4` Diseñar · `5` Construir · `6` Probar · `7` Inspirar.

Archivo: `src/lib/dev-fill-biodiversidad-viva.ts`.

## Extender el flujo

1. Añadir entrada en `pantallasBiodiversidadViva`.
2. Claves nuevas en `clavesBiodiversidadViva` (prefijo `bvN-`).
3. Crear `src/components/mvp/biodiversidad-viva/MisionN….tsx` e importarlo en el `switch` de `BiodiversidadVivaQuestions`.
4. Ampliar `flatten.ts`.
5. Actualizar este documento.
