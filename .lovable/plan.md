# Forja MVP: del canvas al prototipo en Lovable

Nueva sección del sitio (`/mvp`, enlazada en el menú como "Forja MVP") que guía a cada brigada, paso a paso, desde el canvas impreso hasta un documento de MVP listo para pegar en Lovable y hacer vibecoding.

## Flujo de 5 pasos

1. **Cargar el canvas**
   - Opción A: subir la foto del canvas (Expedición TerraLAB y/o el "Pase al Día 2"); la IA transcribe brigada, lema, integrantes y roles, pistas del safari, mapa/desafío elegido, idea semilla y lab activado.
   - Opción B: llenar el formulario a mano si no hay foto o la letra no se lee.
   - Todo lo transcrito queda editable antes de continuar.

2. **Elegir lab y enfoque**
   - Selección del lab (EcoTech, Circular, Influencia, Biodiversidad). Preguntas y tipo de MVP se adaptan al lab elegido: app/dashboard/sensor en EcoTech, sistema de retorno o marca en Circular, campaña/contenido en Influencia, registro y monitoreo en Biodiversidad.
   - Sugerencias del banco de inspiración relacionadas con el desafío detectado.

3. **Preguntas de PRD que faltan (context engineering)**
   - La IA lee el canvas y genera 6–8 preguntas específicas del reto (no genéricas): usuario principal, acción clave, dato que se mide, quién administra, evidencia, alcance del prototipo.
   - Cada pregunta trae una respuesta sugerida que el equipo acepta o reescribe, para que estudiantes de 3.º a 9.º avancen rápido.

4. **MVP final**
   - La IA arma el documento de MVP: nombre del producto, problema, usuario, propuesta de valor, alcance del MVP (3–5 pantallas o piezas), fuera de alcance, datos, indicador de impacto y criterios de "listo".
   - Junto al documento se genera el **prompt para Lovable** listo para copiar.

5. **Llevarlo a Lovable**
   - Botones: copiar prompt, descargar el MVP en Markdown, descargar en PDF imprimible para el facilitador, y enlace para abrir Lovable.
   - Mini guía de vibecoding: qué pegar primero, cómo pedir cambios, cómo probar el prototipo con compañeros.

## Detalles técnicos

- Ruta nueva `src/routes/mvp.tsx` con su propio `head()` (título, descripción y OG propios) y enlace desde el header del home.
- Componentes nuevos bajo `src/components/mvp/`: stepper, subida de foto, formulario del canvas, preguntas dinámicas, vista del documento y acciones de exportación.
- IA con Lovable AI (AI Gateway) desde funciones de servidor en `src/lib/mvp.functions.ts`: una llamada de visión para transcribir el canvas (imagen en base64), una para generar preguntas de PRD y una para redactar el MVP y el prompt. Las claves quedan solo en el servidor.
- Sin base de datos: el avance vive en la sesión (estado del componente + `sessionStorage` para no perderlo al recargar) y se conserva descargando el documento.
- Exportación: Markdown y texto por API del navegador; PDF por impresión con estilos dedicados.
- Se mantiene el diseño actual: tokens de color de TerraLAB, Baloo 2 / Nunito, tarjetas redondeadas y sombras existentes. Todo el texto en español.
- Los datos de `src/data/labs.ts` se reutilizan para las sugerencias; no se modifican.
