# Emprende Circular — overview para agentes

Documento de contexto sobre el flujo de misiones estructuradas de **LAB Circular (Emprende Circular)** en Forja MVP. Sustituye el flujo genérico de “preguntas del PRD” (IA) cuando el lab seleccionado es `circular`.

## Cómo se activa

- Lab en catálogo: `id: "circular"` → título UI **Emprende Circular** (`src/data/labs.ts`).
- En el paso 2 de Forja MVP (“Elegir lab y enfoque”), si `canvas.lab === "circular"`:
  - CTA: **“Continuar con las misiones”** (no “Generar las preguntas del PRD”).
  - Paso 3 del wizard: componente `EmprendeCircularQuestions`.
- Orquestación: `src/components/mvp/ForjaMvp.tsx` (`esEmprendeCircular`, estado `respuestasEmprendeCircular`, persistencia en `localStorage`).

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/data/emprende-circular-misiones.ts` | Pantallas, catálogos, claves de respuesta |
| `src/components/mvp/EmprendeCircularQuestions.tsx` | Orquestador (navegación + switch de retos) |
| `src/components/mvp/emprende-circular/Reto1Activar.tsx` | Reto 1 |
| `src/components/mvp/emprende-circular/Reto2Comprender.tsx` | Reto 2 |
| `src/components/mvp/emprende-circular/Reto3Experimentar.tsx` | Reto 3 |
| `src/components/mvp/emprende-circular/Reto4Definir.tsx` | Reto 4 |
| `src/components/mvp/emprende-circular/Reto5Disenar.tsx` | Reto 5 |
| `src/components/mvp/emprende-circular/flatten.ts` | Flatten hacia MVP |
| `src/components/mvp/emprende-circular/types.ts` | `RetoProps` compartido |
| `src/assets/images/emprende-circular-acciones-ayuda.png` | Referencia 9 acciones |
| `src/assets/images/emprende-circular-reto2-comprender.png` | Referencia recorrido |
| `src/assets/images/emprende-circular-reto3-experimentar.png` | Referencia ficha + oportunidades |
| `src/assets/images/emprende-circular-reto4-definir.png` | Referencia indicador + comprobación |

Patrón análogo a ECOFluencer / EcoTech: datos + UI multi-pantalla + `flatten*` → `construirMvp`.

## Pantallas (retos)

Navegación libre entre números. Estado compartido: `Record<string, string>` con claves `ec*`.

### 1. Activar (`nuestro-material`) — `Reto1Activar`

1. **Material**: cajón grande (dibujo/foto, nombre, descripción) + **¿Dónde aparece?** + **Una pista del día**.
2. **Estado**: Limpio, Seco, Mezclado, Con una parte dañada.
3. **Acciones**: 3 opciones con modal de ayuda (9 acciones) + “¿Cómo sería aquí?”.

### 2. Comprender (`comprender`) — `Reto2Comprender`

6 cajones en flujo en S + **Hallazgo clave** (“El material pierde valor cuando”) + **Pregunta prioritaria**.

### 3. Experimentar (`experimentar`) — `Reto3Experimentar`

Dos paneles:

1. **Ficha de auditoría del material** (2 columnas): Tipo o familia, Origen, Cantidad estimada, Frecuencia, Estado actual, Destino actual, Actores, Evidencia disponible.
2. **Oportunidades circulares**: checklist de las 9 acciones (resumen corto) + nombre de la **Alternativa A**.
3. **Detalle de Alternativa A**: tarjeta con **Descripción**, **Recursos** y **Resultado esperado**.

### 4. Definir (`definir`) — `Reto4Definir`

Tres bloques:

1. **Dibujen el recorrido real**: tres cajones (Entra → Se usa → Sale o circula) con lugar, actor, qué ocurre, cantidad/frecuencia y costo/tiempo + leyenda.
   - Precarga desde Reto 2: nota → “Qué ocurre…”, Quién → “Actor…” (entra←entra, se-usa←se-usa, sale←destino). No sobrescribe si el destino ya tiene texto.
2. **Construyan el reto**: frase guiada (Para / reduciremos|mantendremos en uso + material / En / Mediante / Y lo verificaremos con).
3. **Definan el indicador** (azul): qué mediremos, unidad base, línea base, periodo/fuente, meta, fecha de revisión.
4. **Comprueben la definición** (morado): checklist en 2 columnas.

### 5. Diseñar (`disenar`) — `Reto5Disenar`

Paso 1: **Alternativa A** (descripción, recursos, resultado esperado).

Paso 2: cuatro dimensiones con ícono (F / M / T / R), título y textarea + **logo o marca del producto**.

## Comportamientos UX a respetar

- Navegación por pills de número: **libre**.
- Lab Emprende Circular: no llamar a `generarPreguntas` (IA PRD).
- Al cambiar de lab en el paso 2, se resetea `misionIndice`.
- Respuestas en `localStorage` (`terralab-forja-mvp` → `respuestasEmprendeCircular`). Solo se borran al confirmar **Empezar con otra brigada**.
- Al finalizar: `flattenRespuestasEmprendeCircular` → `pedirMvp` / `construirMvp`.

### Demo en consola

En `/mvp` (DEV o con `localStorage.setItem("terralab-dev-fill","1")`):

```js
fillEmprendeCircular()
fillEmprendeCircular({ paso: 3, misionIndice: 7 })
```

Archivo: `src/lib/dev-fill-emprende-circular.ts`.

## Extender el flujo

1. Añadir entrada en `pantallasEmprendeCircular`.
2. Claves nuevas en `clavesEmprendeCircular`.
3. Crear `src/components/mvp/emprende-circular/RetoN….tsx` e importarlo en el `switch` de `EmprendeCircularQuestions`.
4. Ampliar `flatten.ts`.
5. Actualizar este documento.
