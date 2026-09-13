import { useEffect, useState, type ReactNode } from "react";
import { CircleHelp, HeartPulse, Waves } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clavesEcoFluencer,
  criteriosImpacto,
  criteriosMensaje,
  etiquetaPublico,
  evaluacionImpactoCompleta,
  pantallasEcoFluencer,
  personasImpacto,
  publicosObjetivo,
  tarjetasBrief,
  tarjetasComprension,
  verbosInvisibles,
  verbosObservables,
  type PantallaEcoFluencer,
} from "@/data/ecofluencer-misiones";
import { TarjetaEcoFluencer } from "./TarjetaEcoFluencer";
import { FabricaCampanasEcoFluencer, flattenFabricaCampanas } from "./FabricaCampanasEcoFluencer";
import { SubirImagenEcoFluencer } from "./SubirImagenEcoFluencer";

type Props = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
  indice: number;
  onCambiarIndice: (indice: number) => void;
  onFinalizar: () => void;
  cargando: boolean;
};

type TipoAyuda = "pulso" | "eco";

/** Contenedor listo para ayudas visuales (ilustraciones, diagramas, etc.). */
function AyudaVisualSlot({ tipo, children }: { tipo: TipoAyuda; children?: ReactNode }) {
  return (
    <div
      className={`mt-4 flex min-h-40 items-center justify-center rounded-2xl border-2 border-dashed p-6 ${
        tipo === "pulso" ? "border-primary/40 bg-secondary/50" : "border-lime/50 bg-sand/60"
      }`}
      data-ayuda-visual={tipo}
    >
      {children ?? (
        <p className="text-center text-sm text-muted-foreground">
          Aquí irá la ayuda visual de {tipo === "pulso" ? "PULSO" : "ECO"}.
        </p>
      )}
    </div>
  );
}

function ModalAyudaEmocion({
  tipo,
  abierto,
  onCerrar,
}: {
  tipo: TipoAyuda | null;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const esPulso = tipo === "pulso";

  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-w-md sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
            {esPulso ? (
              <HeartPulse className="h-5 w-5 text-primary" aria-hidden />
            ) : (
              <Waves className="h-5 w-5 text-lime-foreground" aria-hidden />
            )}
            Ayuda visual · {esPulso ? "PULSO" : "ECO"}
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            {esPulso
              ? "El Pulso es la emoción que mueve a la gente a actuar: curiosidad, orgullo, cuidado, esperanza…"
              : "El Eco es la contraemoción que frena o desvía: culpa, miedo, vergüenza, rechazo…"}
          </DialogDescription>
        </DialogHeader>
        <AyudaVisualSlot tipo={esPulso ? "pulso" : "eco"} />
      </DialogContent>
    </Dialog>
  );
}

function CampoConAyuda({
  id,
  etiqueta,
  valor,
  onCambiar,
  onAbrirAyuda,
  placeholder,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  onAbrirAyuda: () => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <label htmlFor={id} className="text-xs font-extrabold tracking-wider uppercase">
          {etiqueta}
        </label>
        <button
          type="button"
          onClick={onAbrirAyuda}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-border px-2.5 py-1 text-xs font-extrabold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          aria-label={`Ver ayuda visual de ${etiqueta}`}
        >
          <CircleHelp className="h-4 w-4" aria-hidden />
          Ayuda
        </button>
      </div>
      <textarea
        id={id}
        rows={3}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-3 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function PantallaMensaje({
  respuestas,
  onCambiar,
}: {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  const [ayuda, setAyuda] = useState<TipoAyuda | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor={clavesEcoFluencer.mensaje}
          className="block text-xs font-extrabold tracking-wider uppercase"
        >
          Mensaje que quieren proyectar
        </label>
        <p className="mt-1 text-sm text-muted-foreground">
          En pocas frases: ¿qué idea quieren que quede en la cabeza de quien los escuche?
        </p>
        <textarea
          id={clavesEcoFluencer.mensaje}
          rows={4}
          value={respuestas[clavesEcoFluencer.mensaje] ?? ""}
          placeholder="Ej. Si separamos el plástico en el recreo, el patio se limpia y el océano también."
          onChange={(e) => onCambiar(clavesEcoFluencer.mensaje, e.target.value)}
          className="mt-3 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <CampoConAyuda
          id={clavesEcoFluencer.pulso}
          etiqueta="Emoción PULSO"
          valor={respuestas[clavesEcoFluencer.pulso] ?? ""}
          onCambiar={(v) => onCambiar(clavesEcoFluencer.pulso, v)}
          onAbrirAyuda={() => setAyuda("pulso")}
          placeholder="¿Qué emoción positiva mueve a actuar?"
        />
        <CampoConAyuda
          id={clavesEcoFluencer.eco}
          etiqueta="Contraemoción ECO"
          valor={respuestas[clavesEcoFluencer.eco] ?? ""}
          onCambiar={(v) => onCambiar(clavesEcoFluencer.eco, v)}
          onAbrirAyuda={() => setAyuda("eco")}
          placeholder="¿Qué emoción podría frenar o desviar el mensaje?"
        />
      </div>

      <div className="rounded-3xl border-2 border-lime/40 bg-secondary/40 p-6">
        <label
          htmlFor={clavesEcoFluencer.ajuste}
          className="block text-xs font-extrabold tracking-wider uppercase"
        >
          Ajuste del mensaje
        </label>
        <p className="mt-1 text-sm font-bold text-foreground">
          Para fortalecer el Pulso y reducir el Eco, cambiaremos:
        </p>
        <textarea
          id={clavesEcoFluencer.ajuste}
          rows={3}
          value={respuestas[clavesEcoFluencer.ajuste] ?? ""}
          placeholder="Escriban qué van a cambiar en el mensaje…"
          onChange={(e) => onCambiar(clavesEcoFluencer.ajuste, e.target.value)}
          className="mt-3 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <h3 className="text-sm font-extrabold tracking-widest uppercase">
          ¿El mensaje cumple estos criterios?
        </h3>
        <ul className="mt-4 space-y-3">
          {criteriosMensaje.map((c) => {
            const clave = clavesEcoFluencer.criterio(c.id);
            const marcado = respuestas[clave] === "si";
            return (
              <li
                key={c.id}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <Checkbox
                  id={clave}
                  checked={marcado}
                  onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                  className="mt-0.5 h-5 w-5"
                />
                <label htmlFor={clave} className="cursor-pointer leading-snug">
                  <span className="font-extrabold">{c.etiqueta}:</span>{" "}
                  <span className="text-muted-foreground">{c.descripcion}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <ModalAyudaEmocion tipo={ayuda} abierto={ayuda !== null} onCerrar={() => setAyuda(null)} />
    </div>
  );
}

function CuadroLibreta({
  id,
  titulo,
  valor,
  onCambiar,
  placeholder,
}: {
  id: string;
  titulo: string;
  valor: string;
  onCambiar: (valor: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-deep bg-deep shadow-card">
      <label
        htmlFor={id}
        className="block px-5 pt-4 text-xs font-extrabold tracking-widest text-deep-foreground uppercase"
      >
        {titulo}
      </label>
      <textarea
        id={id}
        rows={3}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onCambiar(e.target.value)}
        className="w-full resize-none border-0 bg-transparent px-5 py-3 text-sm leading-7 text-deep-foreground outline-none placeholder:text-deep-foreground/40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, oklch(0.98 0.01 120 / 0.22) 27px, oklch(0.98 0.01 120 / 0.22) 28px)",
          backgroundPosition: "0 0.35rem",
        }}
      />
    </div>
  );
}

function PantallaComprension({
  respuestas,
  onCambiar,
}: {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  return (
    <div className="space-y-6">
      <CuadroLibreta
        id={clavesEcoFluencer.casoInvestigado}
        titulo="El caso que investigamos"
        valor={respuestas[clavesEcoFluencer.casoInvestigado] ?? ""}
        onCambiar={(v) => onCambiar(clavesEcoFluencer.casoInvestigado, v)}
        placeholder="Describan el caso que están investigando…"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {tarjetasComprension.map((tarjeta, i) => {
          const clave = clavesEcoFluencer.tarjeta(tarjeta.id);
          return (
            <TarjetaEcoFluencer
              key={tarjeta.id}
              numero={tarjeta.numero}
              titulo={tarjeta.titulo}
              pregunta={tarjeta.pregunta}
              pista={tarjeta.pista}
              color={tarjeta.color}
              valor={respuestas[clave] ?? ""}
              onCambiar={(v) => onCambiar(clave, v)}
              indiceAnimacion={i}
              retardoPorTarjetaMs={5}
            />
          );
        })}
      </div>

      <CuadroLibreta
        id={clavesEcoFluencer.hallazgoComportamiento}
        titulo="Hallazgo del comportamiento"
        valor={respuestas[clavesEcoFluencer.hallazgoComportamiento] ?? ""}
        onCambiar={(v) => onCambiar(clavesEcoFluencer.hallazgoComportamiento, v)}
        placeholder="¿Qué descubrieron sobre el comportamiento?"
      />
    </div>
  );
}

function PantallaEvaluacion({
  respuestas,
  onCambiar,
}: {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  const publico = respuestas[clavesEcoFluencer.publicoObjetivo] ?? "";
  const mensajeDesdeReto1 =
    respuestas[clavesEcoFluencer.ajuste]?.trim() ||
    respuestas[clavesEcoFluencer.mensaje]?.trim() ||
    "";
  const mensajeActual = respuestas[clavesEcoFluencer.mensajeAjustado]?.trim() ?? "";
  const valorMensaje = mensajeActual || mensajeDesdeReto1;

  useEffect(() => {
    if (!mensajeActual && mensajeDesdeReto1) {
      onCambiar(clavesEcoFluencer.mensajeAjustado, mensajeDesdeReto1);
    }
  }, [mensajeActual, mensajeDesdeReto1, onCambiar]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,17rem)] lg:items-start">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-extrabold tracking-widest uppercase">Público objetivo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Seleccionen solo uno: el grupo al que va dirigido el mensaje.
          </p>
          <div
            role="radiogroup"
            aria-label="Público objetivo"
            className="mt-4 flex flex-wrap gap-3"
          >
            {publicosObjetivo.map((op) => {
              const activo = publico === op.id;
              return (
                <label
                  key={op.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-extrabold transition-colors ${
                    activo ? "border-primary bg-secondary" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <Checkbox
                    checked={activo}
                    onCheckedChange={() => onCambiar(clavesEcoFluencer.publicoObjetivo, op.id)}
                    className="h-5 w-5"
                  />
                  <span>{op.etiqueta}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor={clavesEcoFluencer.mensajeAjustado}
            className="block text-lg font-extrabold"
          >
            Crea tu mensaje
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            Teniendo en cuenta tu público ajusta el mensaje
          </p>
          <textarea
            id={clavesEcoFluencer.mensajeAjustado}
            rows={4}
            value={valorMensaje}
            onChange={(e) => onCambiar(clavesEcoFluencer.mensajeAjustado, e.target.value)}
            placeholder="Escriban aquí el mensaje ajustado al público…"
            className="mt-3 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold">Evaluación del impacto</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Escriban hasta 3 nombres del público y marquen cada criterio por persona.
              </p>
            </div>
            {/* TEMP: solo para testing — quitar en producción */}
            <button
              type="button"
              onClick={() => {
                for (const n of personasImpacto) {
                  for (const c of criteriosImpacto) {
                    onCambiar(clavesEcoFluencer.checkImpacto(n, c.id), "si");
                  }
                }
              }}
              className="rounded-full border-2 border-dashed border-muted-foreground/40 px-4 py-2 text-xs font-extrabold tracking-wide text-muted-foreground uppercase hover:border-primary hover:text-primary"
            >
              Seleccionar todos
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-40 whitespace-nowrap">Público</TableHead>
                  {criteriosImpacto.map((c) => (
                    <TableHead key={c.id} className="min-w-28 text-center text-xs leading-snug">
                      {c.etiqueta}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {personasImpacto.map((n) => {
                  const claveNombre = clavesEcoFluencer.personaImpacto(n);
                  return (
                    <TableRow key={n}>
                      <TableCell>
                        <input
                          type="text"
                          value={respuestas[claveNombre] ?? ""}
                          onChange={(e) => onCambiar(claveNombre, e.target.value)}
                          placeholder={`Persona ${n}`}
                          aria-label={`Nombre de la persona ${n}`}
                          className="w-full min-w-36 rounded-xl border-2 border-border bg-background p-2 text-sm outline-none focus:border-primary"
                        />
                      </TableCell>
                      {criteriosImpacto.map((c) => {
                        const clave = clavesEcoFluencer.checkImpacto(n, c.id);
                        const marcado = respuestas[clave] === "si";
                        return (
                          <TableCell key={c.id} className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={marcado}
                                onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                                aria-label={`${c.etiqueta} — persona ${n}`}
                                className="h-5 w-5"
                              />
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <aside className="rounded-3xl border-2 border-lime bg-secondary p-5 lg:sticky lg:top-6">
        <p className="text-xs font-extrabold tracking-widest text-primary uppercase">Recuerden</p>
        <p className="mt-3 text-sm leading-relaxed font-bold text-deep">
          Un EcoInfluencer no se enamora de su primera idea. Escucha al público, aprende de la
          evidencia y mejora el mensaje antes de compartirlo.
        </p>
      </aside>
    </div>
  );
}

function parseListaVerbos(texto: string): string[] {
  return texto
    .split(/[,·\n]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function alternarVerbo(textoActual: string, verbo: string): string {
  const lista = parseListaVerbos(textoActual);
  const idx = lista.findIndex((v) => v.toLowerCase() === verbo.toLowerCase());
  if (idx >= 0) lista.splice(idx, 1);
  else lista.push(verbo);
  return lista.join(", ");
}

function ModalAyudaVerbos({
  abierto,
  onCerrar,
  seleccionados,
  onAlternar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  seleccionados: string[];
  onAlternar: (verbo: string) => void;
}) {
  const marcado = (verbo: string) =>
    seleccionados.some((v) => v.toLowerCase() === verbo.toLowerCase());

  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-w-lg sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Verbos disponibles</DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            Pueden elegir más de uno. Preferimos los observables: se pueden ver o escuchar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
              Verbos observables
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {verbosObservables.map((verbo) => {
                const activo = marcado(verbo);
                return (
                  <button
                    key={verbo}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => onAlternar(verbo)}
                    className={`rounded-full border-2 px-3 py-1.5 text-xs font-extrabold transition-colors ${
                      activo
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/30 bg-secondary text-deep hover:border-primary"
                    }`}
                  >
                    {verbo}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
              Verbos invisibles
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Úsenlos con cuidado: no se ven con facilidad.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {verbosInvisibles.map((verbo) => {
                const activo = marcado(verbo);
                return (
                  <button
                    key={verbo}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => onAlternar(verbo)}
                    className={`rounded-full border-2 px-3 py-1.5 text-xs font-extrabold transition-colors ${
                      activo
                        ? "border-deep bg-deep text-deep-foreground"
                        : "border-border bg-muted/60 text-muted-foreground hover:border-deep hover:text-deep"
                    }`}
                  >
                    {verbo}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-extrabold text-primary-foreground"
          >
            Listo
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PantallaBrief({
  respuestas,
  onCambiar,
}: {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  const [ayudaVerbos, setAyudaVerbos] = useState(false);
  const clavePublico = clavesEcoFluencer.brief("publico");
  const claveVerbo = clavesEcoFluencer.brief("verbo");
  const publicoPrevio = etiquetaPublico(respuestas[clavesEcoFluencer.publicoObjetivo]);
  const valorPublico = Object.prototype.hasOwnProperty.call(respuestas, clavePublico)
    ? (respuestas[clavePublico] ?? "")
    : publicoPrevio;
  const valorVerbo = respuestas[claveVerbo] ?? "";

  const frase = tarjetasBrief
    .map((t) => {
      if (t.id === "publico") return valorPublico.trim();
      return (respuestas[clavesEcoFluencer.brief(t.id)] ?? "").trim();
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetasBrief.map((tarjeta, i) => {
          const clave = clavesEcoFluencer.brief(tarjeta.id);
          const valor = tarjeta.id === "publico" ? valorPublico : (respuestas[clave] ?? "");

          return (
            <TarjetaEcoFluencer
              key={tarjeta.id}
              numero={i + 1}
              titulo={tarjeta.titulo}
              pregunta={tarjeta.pregunta}
              color={tarjeta.color}
              valor={valor}
              onCambiar={(v) => onCambiar(clave, v)}
              indiceAnimacion={i}
              retardoPorTarjetaMs={5}
              className="min-w-0 w-full"
              onAyuda={tarjeta.conAyudaVerbos ? () => setAyudaVerbos(true) : undefined}
              etiquetaAyuda="Verbos"
            />
          );
        })}
      </div>

      <div className="w-full overflow-hidden rounded-2xl border-2 border-deep bg-deep shadow-card">
        <p className="px-5 pt-4 text-xs font-extrabold tracking-widest text-deep-foreground uppercase">
          Frase del cambio - Queremos que...
        </p>
        <p className="px-5 py-4 text-sm leading-relaxed font-bold text-deep-foreground">
          {frase || (
            <span className="font-normal opacity-50">
              [público] + [verbo observable] + [objeto] + [lugar] + [momento] + [frecuencia]
            </span>
          )}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-sand p-5 sm:p-6">
        <p className="text-xs font-extrabold tracking-widest uppercase">Fórmula</p>
        <p className="mt-2 text-sm leading-relaxed text-deep">
          Queremos que <strong>[público]</strong> haga <strong>[acción observable]</strong> en{" "}
          <strong>[lugar y momento]</strong>, con frecuencia <strong>[frecuencia]</strong>, porque{" "}
          <strong>[beneficio]</strong>, superando <strong>[barrera]</strong>.
        </p>
        <p className="mt-4 text-xs font-extrabold tracking-widest uppercase">Ejemplo hipotético</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
          “Queremos que estudiantes de 7.º lleven una botella reutilizable a la cafetería durante el
          recreo, dos veces por semana, porque pueden ahorrar y evitar residuos desechables,
          superando el olvido, con un mensaje que recuerde la acción antes del recreo”
        </p>
      </div>

      <ModalAyudaVerbos
        abierto={ayudaVerbos}
        onCerrar={() => setAyudaVerbos(false)}
        seleccionados={parseListaVerbos(valorVerbo)}
        onAlternar={(verbo) => onCambiar(claveVerbo, alternarVerbo(valorVerbo, verbo))}
      />
    </div>
  );
}

function ContenidoPantalla({
  pantalla,
  respuestas,
  onCambiar,
}: {
  pantalla: PantallaEcoFluencer;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  if (pantalla.id === "mensaje-pulso-eco") {
    return <PantallaMensaje respuestas={respuestas} onCambiar={onCambiar} />;
  }

  if (pantalla.id === "comprender-audiencia") {
    return <PantallaComprension respuestas={respuestas} onCambiar={onCambiar} />;
  }

  if (pantalla.id === "evaluacion") {
    return <PantallaEvaluacion respuestas={respuestas} onCambiar={onCambiar} />;
  }

  if (pantalla.id === "brief-cambio") {
    return <PantallaBrief respuestas={respuestas} onCambiar={onCambiar} />;
  }

  if (pantalla.id === "fabrica-campanas") {
    return <FabricaCampanasEcoFluencer respuestas={respuestas} onCambiar={onCambiar} />;
  }

  if (pantalla.id === "construir") {
    return (
      <SubirImagenEcoFluencer
        titulo="Construir"
        ayuda="Suban el archivo o la imagen de lo que van a construir."
        alt="Archivo o imagen de construcción"
        valor={respuestas[clavesEcoFluencer.construirImagen] ?? ""}
        onCambiar={(v) => onCambiar(clavesEcoFluencer.construirImagen, v)}
      />
    );
  }

  return <p className="text-muted-foreground">Esta sub-pantalla aún no está definida.</p>;
}

export function EcoFluencerQuestions({
  respuestas,
  onCambiar,
  indice,
  onCambiarIndice,
  onFinalizar,
  cargando,
}: Props) {
  const [avisoNormas, setAvisoNormas] = useState<string | null>(null);
  const indiceSeguro = Math.min(Math.max(indice, 0), pantallasEcoFluencer.length - 1);
  const pantalla = pantallasEcoFluencer[indiceSeguro];

  useEffect(() => {
    if (indice !== indiceSeguro) onCambiarIndice(indiceSeguro);
  }, [indice, indiceSeguro, onCambiarIndice]);

  if (!pantalla) return null;

  const esUltima = indiceSeguro === pantallasEcoFluencer.length - 1;
  const esEvaluacion = pantalla.id === "evaluacion";

  function intentarAvanzar(accion: () => void) {
    if (esEvaluacion && !evaluacionImpactoCompleta(respuestas)) {
      setAvisoNormas(
        "Deben actualizar su mensaje: al menos un criterio de la evaluación del impacto no está marcado. Eso indica que el mensaje está infringiendo algunas normas. Revisen, ajusten el texto y vuelvan a marcar todos los checks antes de continuar.",
      );
      return;
    }
    setAvisoNormas(null);
    accion();
  }

  return (
    <section className="space-y-8">
      <ol className="flex flex-wrap gap-2 print:hidden">
        {pantallasEcoFluencer.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onCambiarIndice(i)}
              className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold transition-colors ${
                i === indiceSeguro
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < indiceSeguro
                    ? "border-lime bg-secondary"
                    : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {p.numero}
            </button>
          </li>
        ))}
      </ol>

      <div>
        <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
          Reto {pantalla.numero} de {pantallasEcoFluencer.length} · {pantalla.nombre}
        </p>
        <h2 className="mt-1 text-3xl font-extrabold">{pantalla.tagline ?? pantalla.nombre}</h2>
        <p className="mt-3 text-muted-foreground">{pantalla.instrucciones}</p>
      </div>

      <ContenidoPantalla pantalla={pantalla} respuestas={respuestas} onCambiar={onCambiar} />

      {avisoNormas && (
        <div
          role="alert"
          className="rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-5 text-sm font-bold"
        >
          {avisoNormas}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setAvisoNormas(null);
            onCambiarIndice(indiceSeguro - 1);
          }}
          disabled={indiceSeguro === 0}
          className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary disabled:opacity-40"
        >
          Anterior
        </button>
        {esUltima ? (
          <button
            type="button"
            onClick={() => intentarAvanzar(onFinalizar)}
            disabled={cargando}
            className="rounded-full bg-deep px-7 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando ? "Redactando el MVP…" : "Crear el documento del MVP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => intentarAvanzar(() => onCambiarIndice(indiceSeguro + 1))}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  );
}

export function flattenRespuestasEcoFluencer(
  respuestas: Record<string, string>,
): { pregunta: string; respuesta: string }[] {
  const salida: { pregunta: string; respuesta: string }[] = [];

  const mensaje = respuestas[clavesEcoFluencer.mensaje]?.trim();
  if (mensaje) salida.push({ pregunta: "Mensaje a proyectar", respuesta: mensaje });

  const pulso = respuestas[clavesEcoFluencer.pulso]?.trim();
  if (pulso) salida.push({ pregunta: "Emoción PULSO", respuesta: pulso });

  const eco = respuestas[clavesEcoFluencer.eco]?.trim();
  if (eco) salida.push({ pregunta: "Contraemoción ECO", respuesta: eco });

  const ajuste = respuestas[clavesEcoFluencer.ajuste]?.trim();
  if (ajuste) {
    salida.push({
      pregunta: "Ajuste del mensaje (fortalecer Pulso y reducir Eco)",
      respuesta: ajuste,
    });
  }

  const criteriosOk = criteriosMensaje
    .filter((c) => respuestas[clavesEcoFluencer.criterio(c.id)] === "si")
    .map((c) => `${c.etiqueta}: ${c.descripcion}`);
  if (criteriosOk.length) {
    salida.push({ pregunta: "Criterios del mensaje cumplidos", respuesta: criteriosOk.join("; ") });
  }

  const caso = respuestas[clavesEcoFluencer.casoInvestigado]?.trim();
  if (caso) salida.push({ pregunta: "El caso que investigamos", respuesta: caso });

  for (const tarjeta of tarjetasComprension) {
    const respuesta = respuestas[clavesEcoFluencer.tarjeta(tarjeta.id)]?.trim();
    if (respuesta) {
      salida.push({
        pregunta: `${tarjeta.titulo}: ${tarjeta.pregunta}`,
        respuesta,
      });
    }
  }

  const hallazgo = respuestas[clavesEcoFluencer.hallazgoComportamiento]?.trim();
  if (hallazgo) {
    salida.push({ pregunta: "Hallazgo del comportamiento", respuesta: hallazgo });
  }

  const publicoId = respuestas[clavesEcoFluencer.publicoObjetivo];
  const publico = publicosObjetivo.find((p) => p.id === publicoId);
  if (publico) {
    salida.push({ pregunta: "Público objetivo", respuesta: publico.etiqueta });
  }

  const mensajeAjustado = respuestas[clavesEcoFluencer.mensajeAjustado]?.trim();
  if (mensajeAjustado) {
    salida.push({ pregunta: "Mensaje ajustado al público", respuesta: mensajeAjustado });
  }

  for (const n of personasImpacto) {
    const nombre = respuestas[clavesEcoFluencer.personaImpacto(n)]?.trim() || `Persona ${n}`;
    const checks = criteriosImpacto
      .filter((c) => respuestas[clavesEcoFluencer.checkImpacto(n, c.id)] === "si")
      .map((c) => c.etiqueta);
    if (checks.length || respuestas[clavesEcoFluencer.personaImpacto(n)]?.trim()) {
      salida.push({
        pregunta: `Evaluación de impacto — ${nombre}`,
        respuesta: checks.length ? checks.join("; ") : "sin criterios marcados",
      });
    }
  }

  const partesBrief: string[] = [];
  for (const tarjeta of tarjetasBrief) {
    const clave = clavesEcoFluencer.brief(tarjeta.id);
    let valor = respuestas[clave]?.trim() ?? "";
    if (!valor && tarjeta.id === "publico") {
      valor = etiquetaPublico(respuestas[clavesEcoFluencer.publicoObjetivo]).trim();
    }
    if (valor) {
      salida.push({
        pregunta: `Brief · ${tarjeta.titulo}: ${tarjeta.pregunta}`,
        respuesta: valor,
      });
      partesBrief.push(valor);
    }
  }
  if (partesBrief.length) {
    salida.push({
      pregunta: "Frase del cambio (brief)",
      respuesta: partesBrief.join(" · "),
    });
  }

  salida.push(...flattenFabricaCampanas(respuestas));

  if (respuestas[clavesEcoFluencer.construirImagen]?.trim()) {
    salida.push({
      pregunta: "Construir · archivo o imagen",
      respuesta: "imagen cargada",
    });
  }

  return salida;
}
