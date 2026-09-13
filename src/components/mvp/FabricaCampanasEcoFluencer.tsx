import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  atributosCanal,
  camposBriefCampana,
  canalesAccesibles,
  clavesEcoFluencer,
  momentosCampana,
  sugerenciasBriefCampana,
  tonosCampana,
} from "@/data/ecofluencer-misiones";
import ayudaMomentosImg from "@/assets/images/ecofluencer-6-momentos-de-la-campana.png";
import { SubirImagenEcoFluencer } from "./SubirImagenEcoFluencer";

type Props = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
};

function valorConSugerencia(
  respuestas: Record<string, string>,
  clave: string,
  sugerido: string,
): string {
  const actual = respuestas[clave];
  if (typeof actual === "string" && actual.trim() !== "") {
    return actual;
  }
  return sugerido;
}

function DetalleCanal({
  tipo,
  titulo,
  respuestas,
  onCambiar,
}: {
  tipo: "principal" | "apoyo";
  titulo: string;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  const claveCanal = clavesEcoFluencer.canalDetalle(tipo, "canal");
  const claveMomento = clavesEcoFluencer.canalDetalle(tipo, "momento");

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <h4 className="text-sm font-extrabold tracking-widest uppercase">{titulo}</h4>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor={claveCanal} className="text-xs font-extrabold tracking-wider uppercase">
            Canal
          </label>
          <input
            id={claveCanal}
            value={respuestas[claveCanal] ?? ""}
            onChange={(e) => onCambiar(claveCanal, e.target.value)}
            className="mt-2 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor={claveMomento} className="text-xs font-extrabold tracking-wider uppercase">
            Momento de la ruta
          </label>
          <input
            id={claveMomento}
            value={respuestas[claveMomento] ?? ""}
            onChange={(e) => onCambiar(claveMomento, e.target.value)}
            className="mt-2 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {atributosCanal.map((attr) => {
            const clave = clavesEcoFluencer.canalAtributo(tipo, attr.id);
            const marcado = respuestas[clave] === "si";
            return (
              <label
                key={attr.id}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-2 text-xs font-extrabold transition-colors ${
                  marcado
                    ? "border-primary bg-secondary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={marcado}
                  onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                  className="h-4 w-4"
                />
                <span>{attr.etiqueta}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function alAlternarCanalAccesible(
  canalEtiqueta: string,
  marcar: boolean,
  respuestas: Record<string, string>,
  onCambiar: (clave: string, valor: string) => void,
) {
  const clavePrincipal = clavesEcoFluencer.canalDetalle("principal", "canal");
  const claveApoyo = clavesEcoFluencer.canalDetalle("apoyo", "canal");
  const principal = (respuestas[clavePrincipal] ?? "").trim();
  const apoyo = (respuestas[claveApoyo] ?? "").trim();

  if (marcar) {
    if (!principal) {
      onCambiar(clavePrincipal, canalEtiqueta);
    } else if (!apoyo && principal !== canalEtiqueta) {
      onCambiar(claveApoyo, canalEtiqueta);
    }
    return;
  }

  if (principal === canalEtiqueta) {
    onCambiar(clavePrincipal, apoyo);
    onCambiar(claveApoyo, "");
  } else if (apoyo === canalEtiqueta) {
    onCambiar(claveApoyo, "");
  }
}

function ModalAyudaMomentos({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-4 sm:rounded-3xl sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Los seis momentos de la campaña</DialogTitle>
          <DialogDescription>
            Guía visual de los seis momentos de la campaña EcoFluencer.
          </DialogDescription>
        </DialogHeader>
        <img
          src={ayudaMomentosImg}
          alt="Los seis momentos de la campaña: gancho, evidencia, mensaje, acción, recordatorio y retroalimentación"
          className="h-auto w-full rounded-2xl"
        />
      </DialogContent>
    </Dialog>
  );
}

export function FabricaCampanasEcoFluencer({ respuestas, onCambiar }: Props) {
  const [ayudaMomentos, setAyudaMomentos] = useState(false);
  const sugerencias = sugerenciasBriefCampana(respuestas);
  const tono = respuestas[clavesEcoFluencer.campanaTono] ?? "";

  useEffect(() => {
    const sugerenciasActuales = sugerenciasBriefCampana(respuestas);
    for (const campo of camposBriefCampana) {
      const clave = clavesEcoFluencer.briefCampana(campo.id);
      const actual = respuestas[clave]?.trim() ?? "";
      const sugerido = sugerenciasActuales[campo.id]?.trim() ?? "";
      if (!actual && sugerido) {
        onCambiar(clave, sugerido);
      }
    }
  }, [
    respuestas[clavesEcoFluencer.tarjeta("barrera")],
    respuestas[clavesEcoFluencer.tarjeta("motivacion")],
    respuestas[clavesEcoFluencer.tarjeta("quien")],
    respuestas[clavesEcoFluencer.tarjeta("que-hace")],
    respuestas[clavesEcoFluencer.tarjeta("donde-cuando")],
    respuestas[clavesEcoFluencer.brief("publico")],
    respuestas[clavesEcoFluencer.brief("verbo")],
    respuestas[clavesEcoFluencer.brief("objeto")],
    respuestas[clavesEcoFluencer.brief("lugar")],
    respuestas[clavesEcoFluencer.brief("momento")],
    respuestas[clavesEcoFluencer.brief("frecuencia")],
    respuestas[clavesEcoFluencer.publicoObjetivo],
    respuestas[clavesEcoFluencer.hallazgoComportamiento],
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h3 className="text-xl font-extrabold">Brief del cambio</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {camposBriefCampana.map((campo) => {
            const clave = clavesEcoFluencer.briefCampana(campo.id);
            const valor = valorConSugerencia(respuestas, clave, sugerencias[campo.id] ?? "");
            return (
              <div key={campo.id} className={campo.id === "indicador" ? "sm:col-span-2" : ""}>
                <label htmlFor={clave} className="text-xs font-extrabold tracking-wider uppercase">
                  {campo.etiqueta}
                </label>
                <textarea
                  id={clave}
                  rows={2}
                  value={valor}
                  onChange={(e) => onCambiar(clave, e.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold">Ensamblen los 6 momentos</h3>
          <button
            type="button"
            onClick={() => setAyudaMomentos(true)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-border px-4 py-2 text-xs font-extrabold tracking-wide text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            <CircleHelp className="h-4 w-4" aria-hidden />
            Ayuda
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {momentosCampana.map((m, i) => {
            const claveDecision = clavesEcoFluencer.momentoDecision(m.id);
            const claveCanal = clavesEcoFluencer.momentoCanal(m.id);
            return (
              <article
                key={m.id}
                className="overflow-hidden rounded-2xl border-2 shadow-card"
                style={{ backgroundColor: m.color, borderColor: m.colorBorde }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/80 text-xs font-extrabold text-deep">
                      {i + 1}
                    </span>
                    <p className="text-sm font-extrabold tracking-wide text-deep uppercase">
                      {m.titulo}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-deep/70 italic">{m.subtitulo}</p>

                  <label
                    htmlFor={claveDecision}
                    className="mt-4 block text-[11px] font-extrabold tracking-wider uppercase"
                  >
                    Nuestra decisión
                  </label>
                  <textarea
                    id={claveDecision}
                    rows={2}
                    value={respuestas[claveDecision] ?? ""}
                    onChange={(e) => onCambiar(claveDecision, e.target.value)}
                    className="mt-1 w-full rounded-xl border-0 bg-white/75 p-2 text-sm outline-none focus:bg-white"
                  />

                  <label
                    htmlFor={claveCanal}
                    className="mt-3 block text-[11px] font-extrabold tracking-wider uppercase"
                  >
                    Canal o soporte
                  </label>
                  <textarea
                    id={claveCanal}
                    rows={2}
                    value={respuestas[claveCanal] ?? ""}
                    onChange={(e) => onCambiar(claveCanal, e.target.value)}
                    className="mt-1 w-full rounded-xl border-0 bg-white/75 p-2 text-sm outline-none focus:bg-white"
                  />
                </div>
              </article>
            );
          })}
        </div>
        <ModalAyudaMomentos abierto={ayudaMomentos} onCerrar={() => setAyudaMomentos(false)} />
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-extrabold">Construyamos la identidad de la campaña</h3>

        <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
          <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
            Identidad de la campaña
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={clavesEcoFluencer.campanaNombre}
                className="text-xs font-extrabold tracking-wider uppercase"
              >
                Nombre de la campaña
              </label>
              <input
                id={clavesEcoFluencer.campanaNombre}
                value={respuestas[clavesEcoFluencer.campanaNombre] ?? ""}
                onChange={(e) => onCambiar(clavesEcoFluencer.campanaNombre, e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor={clavesEcoFluencer.campanaLema}
                className="text-xs font-extrabold tracking-wider uppercase"
              >
                Frase o lema
              </label>
              <input
                id={clavesEcoFluencer.campanaLema}
                value={respuestas[clavesEcoFluencer.campanaLema] ?? ""}
                onChange={(e) => onCambiar(clavesEcoFluencer.campanaLema, e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold tracking-wider uppercase">Tono</p>
            <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
              {tonosCampana.map((t) => {
                const activo = tono === t.id;
                return (
                  <label
                    key={t.id}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-extrabold transition-colors ${
                      activo
                        ? "border-primary bg-secondary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Checkbox
                      checked={activo}
                      onCheckedChange={() => onCambiar(clavesEcoFluencer.campanaTono, t.id)}
                      className="h-4 w-4"
                    />
                    <span>{t.etiqueta}</span>
                  </label>
                );
              })}
            </div>
            <label
              htmlFor={clavesEcoFluencer.campanaTonoOtro}
              className="mt-4 block text-xs font-extrabold tracking-wider uppercase"
            >
              Otro
            </label>
            <input
              id={clavesEcoFluencer.campanaTonoOtro}
              value={respuestas[clavesEcoFluencer.campanaTonoOtro] ?? ""}
              onChange={(e) => onCambiar(clavesEcoFluencer.campanaTonoOtro, e.target.value)}
              placeholder="Otro tono…"
              className="mt-2 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <SubirImagenEcoFluencer
          titulo="Símbolo, personaje o composición visual"
          ayuda="Dibujen una identidad simple y reconocible."
          alt="Identidad visual de la campaña"
          valor={respuestas[clavesEcoFluencer.campanaSimbolo] ?? ""}
          onCambiar={(v) => onCambiar(clavesEcoFluencer.campanaSimbolo, v)}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-extrabold">Redacten el mensaje y el llamado a la acción</h3>
        <label
          htmlFor={clavesEcoFluencer.mensajePrincipal}
          className="block text-xs font-extrabold tracking-widest uppercase"
        >
          Mensaje principal — una idea, una frase y lenguaje concreto | [Verbo] + [Que] + [Donde ó
          cuando]
        </label>
        <textarea
          id={clavesEcoFluencer.mensajePrincipal}
          rows={2}
          value={respuestas[clavesEcoFluencer.mensajePrincipal] ?? ""}
          onChange={(e) => onCambiar(clavesEcoFluencer.mensajePrincipal, e.target.value)}
          className="w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />
      </section>

      <section className="space-y-5">
        <h3 className="text-xl font-extrabold">Elijan canales accesibles</h3>
        <div className="flex flex-wrap gap-2">
          {canalesAccesibles.map((canal) => {
            const clave = clavesEcoFluencer.canalAccesible(canal.id);
            const marcado = respuestas[clave] === "si";
            return (
              <label
                key={canal.id}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-2 text-xs font-extrabold transition-colors ${
                  marcado
                    ? "border-primary bg-secondary"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={marcado}
                  onCheckedChange={(v) => {
                    const seleccionar = v === true;
                    onCambiar(clave, seleccionar ? "si" : "");
                    alAlternarCanalAccesible(canal.etiqueta, seleccionar, respuestas, onCambiar);
                  }}
                  className="h-4 w-4"
                />
                <span>{canal.etiqueta}</span>
              </label>
            );
          })}
        </div>

        <div>
          <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
            5.1 Canal principal y canal de apoyo
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <DetalleCanal
              tipo="principal"
              titulo="Canal principal"
              respuestas={respuestas}
              onCambiar={onCambiar}
            />
            <DetalleCanal
              tipo="apoyo"
              titulo="Canal de apoyo"
              respuestas={respuestas}
              onCambiar={onCambiar}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function flattenFabricaCampanas(
  respuestas: Record<string, string>,
): { pregunta: string; respuesta: string }[] {
  const salida: { pregunta: string; respuesta: string }[] = [];
  const sugerencias = sugerenciasBriefCampana(respuestas);

  for (const campo of camposBriefCampana) {
    const clave = clavesEcoFluencer.briefCampana(campo.id);
    const valor = valorConSugerencia(respuestas, clave, sugerencias[campo.id] ?? "").trim();
    if (valor) {
      salida.push({ pregunta: `Brief campaña · ${campo.etiqueta}`, respuesta: valor });
    }
  }

  for (const m of momentosCampana) {
    const decision = respuestas[clavesEcoFluencer.momentoDecision(m.id)]?.trim();
    const canal = respuestas[clavesEcoFluencer.momentoCanal(m.id)]?.trim();
    if (decision) {
      salida.push({ pregunta: `Momento ${m.titulo} · decisión`, respuesta: decision });
    }
    if (canal) {
      salida.push({ pregunta: `Momento ${m.titulo} · canal`, respuesta: canal });
    }
  }

  const nombre = respuestas[clavesEcoFluencer.campanaNombre]?.trim();
  if (nombre) salida.push({ pregunta: "Nombre de la campaña", respuesta: nombre });

  const lema = respuestas[clavesEcoFluencer.campanaLema]?.trim();
  if (lema) salida.push({ pregunta: "Frase o lema", respuesta: lema });

  const tonoId = respuestas[clavesEcoFluencer.campanaTono];
  const tonoEtiqueta = tonosCampana.find((t) => t.id === tonoId)?.etiqueta;
  if (tonoEtiqueta) salida.push({ pregunta: "Tono de la campaña", respuesta: tonoEtiqueta });

  const tonoOtro = respuestas[clavesEcoFluencer.campanaTonoOtro]?.trim();
  if (tonoOtro) salida.push({ pregunta: "Tono (otro)", respuesta: tonoOtro });

  if (respuestas[clavesEcoFluencer.campanaSimbolo]?.trim()) {
    salida.push({
      pregunta: "Símbolo / identidad visual",
      respuesta: "imagen cargada",
    });
  }

  const mensaje = respuestas[clavesEcoFluencer.mensajePrincipal]?.trim();
  if (mensaje) salida.push({ pregunta: "Mensaje principal", respuesta: mensaje });

  const canales = canalesAccesibles
    .filter((c) => respuestas[clavesEcoFluencer.canalAccesible(c.id)] === "si")
    .map((c) => c.etiqueta);
  if (canales.length) {
    salida.push({ pregunta: "Canales accesibles", respuesta: canales.join("; ") });
  }

  for (const tipo of ["principal", "apoyo"] as const) {
    const canal = respuestas[clavesEcoFluencer.canalDetalle(tipo, "canal")]?.trim();
    const momento = respuestas[clavesEcoFluencer.canalDetalle(tipo, "momento")]?.trim();
    const attrs = atributosCanal
      .filter((a) => respuestas[clavesEcoFluencer.canalAtributo(tipo, a.id)] === "si")
      .map((a) => a.etiqueta);
    if (canal || momento || attrs.length) {
      salida.push({
        pregunta: `Canal ${tipo}`,
        respuesta: [
          canal && `Canal: ${canal}`,
          momento && `Momento: ${momento}`,
          attrs.length && `Atributos: ${attrs.join(", ")}`,
        ]
          .filter(Boolean)
          .join(" · "),
      });
    }
  }

  return salida;
}
