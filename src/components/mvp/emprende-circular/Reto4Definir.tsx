import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  accionesRetoDefinir,
  camposRecorridoReal,
  clavesEmprendeCircular,
  comprobacionesDefinicion,
  etapasRecorridoReal,
  precargaRecorridoDesdeComprender,
  sugerenciasRecorridoDesdeComprender,
  unidadesBaseIndicador,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

function EncabezadoPaso({
  numero,
  titulo,
  color,
  linea,
}: {
  numero: number;
  titulo: string;
  color: string;
  linea: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {numero}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-extrabold tracking-widest uppercase" style={{ color }}>
          {titulo}
        </h3>
        <div className="mt-1 h-px w-full" style={{ backgroundColor: linea }} />
      </div>
    </div>
  );
}

function CampoLinea({
  id,
  etiqueta,
  valor,
  onCambiar,
  color,
  className = "",
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  color: string;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 items-baseline gap-2 ${className}`}>
      <label htmlFor={id} className="shrink-0 text-sm font-extrabold" style={{ color }}>
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="min-w-0 flex-1 border-0 border-b bg-transparent px-1 py-0.5 text-sm outline-none"
        style={{ borderColor: `${color}55` }}
      />
    </div>
  );
}

function CajonRecorrido({
  etapa,
  respuestas,
  onCambiar,
}: {
  etapa: (typeof etapasRecorridoReal)[number];
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  return (
    <article
      className="flex h-full flex-col rounded-3xl border-2 p-4 shadow-card sm:p-5"
      style={{ backgroundColor: etapa.fondo, borderColor: etapa.borde }}
    >
      <h4 className="text-sm font-extrabold tracking-wide uppercase" style={{ color: etapa.color }}>
        {etapa.titulo}
      </h4>
      <p className="mt-0.5 text-xs" style={{ color: `${etapa.color}cc` }}>
        {etapa.subtitulo}
      </p>

      <div className="mt-4 space-y-3">
        {camposRecorridoReal.map((campo) => {
          const clave = clavesEmprendeCircular.recorridoCampo(etapa.id, campo.id);
          return (
            <div key={campo.id}>
              <label
                htmlFor={clave}
                className="block text-xs font-extrabold"
                style={{ color: etapa.color }}
              >
                {campo.etiqueta}
              </label>
              <textarea
                id={clave}
                rows={campo.filas}
                value={respuestas[clave] ?? ""}
                onChange={(e) => onCambiar(clave, e.target.value)}
                className="mt-1 w-full resize-none rounded-none border-0 border-b bg-transparent px-0 py-1 text-sm outline-none"
                style={{ borderColor: `${etapa.color}55`, color: "#1a2e28" }}
              />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function Reto4Definir({ respuestas, onCambiar }: RetoProps) {
  const azul = "#3b82c4";
  const azulFondo = "#e8f3fb";
  const azulBorde = "#7eb3d9";
  const morado = "#8b5cb8";
  const moradoFondo = "#f3e9f8";
  const moradoBorde = "#c4a3d9";
  const deep = "#1f5c4a";

  const checksIzq = comprobacionesDefinicion.filter((c) => c.columna === "izq");
  const checksDer = comprobacionesDefinicion.filter((c) => c.columna === "der");

  useEffect(() => {
    const sugeridas = sugerenciasRecorridoDesdeComprender(respuestas);
    for (const [clave, sugerido] of Object.entries(sugeridas)) {
      const actual = respuestas[clave]?.trim() ?? "";
      if (!actual && sugerido) onCambiar(clave, sugerido);
    }
  }, [
    // fuentes del Reto 2
    ...precargaRecorridoDesdeComprender.flatMap((m) => [
      respuestas[clavesEmprendeCircular.etapaNota(m.etapaComprenderId)],
      respuestas[clavesEmprendeCircular.etapaQuien(m.etapaComprenderId)],
    ]),
    // destinos del Reto 4 (para no re-precargar si ya hay texto)
    ...precargaRecorridoDesdeComprender.flatMap((m) => [
      respuestas[clavesEmprendeCircular.recorridoCampo(m.etapaRecorridoId, "ocurre")],
      respuestas[clavesEmprendeCircular.recorridoCampo(m.etapaRecorridoId, "actor")],
    ]),
  ]);

  return (
    <div className="space-y-8">
      {/* 1. Dibujen el recorrido real */}
      <section>
        <EncabezadoPaso
          numero={1}
          titulo="Dibujen el recorrido real"
          color={deep}
          linea={`${deep}55`}
        />
        <p className="mb-4 text-sm text-muted-foreground">
          Representen lo que ocurre hoy. Lo desconocido se convierte en pregunta; no inventen el
          flujo ideal.
        </p>

        <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <CajonRecorrido
            etapa={etapasRecorridoReal[0]!}
            respuestas={respuestas}
            onCambiar={onCambiar}
          />
          <div className="hidden items-center justify-center lg:flex" aria-hidden>
            <span className="text-2xl font-extrabold text-amber-400">→</span>
          </div>
          <CajonRecorrido
            etapa={etapasRecorridoReal[1]!}
            respuestas={respuestas}
            onCambiar={onCambiar}
          />
          <div className="hidden items-center justify-center lg:flex" aria-hidden>
            <span className="text-2xl font-extrabold text-amber-400">→</span>
          </div>
          <CajonRecorrido
            etapa={etapasRecorridoReal[2]!}
            respuestas={respuestas}
            onCambiar={onCambiar}
          />
        </div>
      </section>

      {/* 2. Construyan el reto */}
      <section>
        <EncabezadoPaso numero={2} titulo="Construyan el reto" color={deep} linea={`${deep}55`} />
        <div className="rounded-3xl border-2 border-[#5a9e8a] bg-[#eaf6f1] p-5 shadow-card sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
                Para
              </span>
              <span className="text-xs text-[#1f5c4a]/70">[usuario o actor]</span>
              <input
                id={clavesEmprendeCircular.retoPara}
                type="text"
                value={respuestas[clavesEmprendeCircular.retoPara] ?? ""}
                onChange={(e) => onCambiar(clavesEmprendeCircular.retoPara, e.target.value)}
                className="min-w-[12rem] flex-1 border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {accionesRetoDefinir.map((accion) => {
                const activo = (respuestas[clavesEmprendeCircular.retoAccion] ?? "") === accion.id;
                return (
                  <label key={accion.id} className="inline-flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={activo}
                      onCheckedChange={() =>
                        onCambiar(clavesEmprendeCircular.retoAccion, activo ? "" : accion.id)
                      }
                      className="h-4 w-4 border-[#1f5c4a]/50 data-[state=checked]:border-[#1f5c4a] data-[state=checked]:bg-[#1f5c4a]"
                    />
                    <span className="text-sm text-[#1f5c4a]">{accion.etiqueta}</span>
                  </label>
                );
              })}
              <span className="text-xs font-extrabold text-[#1f5c4a]">[material]</span>
              <input
                id={clavesEmprendeCircular.retoMaterial}
                type="text"
                value={respuestas[clavesEmprendeCircular.retoMaterial] ?? ""}
                onChange={(e) => onCambiar(clavesEmprendeCircular.retoMaterial, e.target.value)}
                className="min-w-[10rem] flex-1 border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
              />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
                En
              </span>
              <span className="text-xs text-[#1f5c4a]/70">[lugar]</span>
              <input
                id={clavesEmprendeCircular.retoLugar}
                type="text"
                value={respuestas[clavesEmprendeCircular.retoLugar] ?? ""}
                onChange={(e) => onCambiar(clavesEmprendeCircular.retoLugar, e.target.value)}
                className="min-w-[12rem] flex-1 border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
              />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
                Mediante
              </span>
              <span className="text-xs text-[#1f5c4a]/70">[mecanismo]</span>
              <input
                id={clavesEmprendeCircular.retoMecanismo}
                type="text"
                value={respuestas[clavesEmprendeCircular.retoMecanismo] ?? ""}
                onChange={(e) => onCambiar(clavesEmprendeCircular.retoMecanismo, e.target.value)}
                className="min-w-[12rem] flex-1 border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
              />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
                Y lo verificaremos con
              </span>
              <span className="text-xs text-[#1f5c4a]/70">[indicador]</span>
              <input
                id={clavesEmprendeCircular.retoIndicador}
                type="text"
                value={respuestas[clavesEmprendeCircular.retoIndicador] ?? ""}
                onChange={(e) => onCambiar(clavesEmprendeCircular.retoIndicador, e.target.value)}
                className="min-w-[12rem] flex-1 border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#1f5c4a]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3. Definan el indicador */}
        <section>
          <EncabezadoPaso numero={3} titulo="Definan el indicador" color={azul} linea={azulBorde} />
          <div
            className="rounded-3xl border-2 p-5 shadow-card sm:p-6"
            style={{ backgroundColor: azulFondo, borderColor: azulBorde }}
          >
            <CampoLinea
              id={clavesEmprendeCircular.indicadorQueMediremos}
              etiqueta="Qué mediremos:"
              valor={respuestas[clavesEmprendeCircular.indicadorQueMediremos] ?? ""}
              onCambiar={(v) => onCambiar(clavesEmprendeCircular.indicadorQueMediremos, v)}
              color={azul}
            />

            <p
              className="mt-5 text-xs font-extrabold tracking-widest uppercase"
              style={{ color: azul }}
            >
              Unidad base
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {unidadesBaseIndicador.map((u) => {
                const clave = clavesEmprendeCircular.unidadBase(u.id);
                const marcado = respuestas[clave] === "si";
                return (
                  <li key={u.id} className="flex items-center gap-2">
                    <Checkbox
                      id={clave}
                      checked={marcado}
                      onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                      className="h-4 w-4 border-[#3b82c4]/50 data-[state=checked]:border-[#3b82c4] data-[state=checked]:bg-[#3b82c4]"
                    />
                    <label
                      htmlFor={clave}
                      className="cursor-pointer text-sm"
                      style={{ color: azul }}
                    >
                      {u.etiqueta}
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CampoLinea
                id={clavesEmprendeCircular.lineaBase}
                etiqueta="Línea base:"
                valor={respuestas[clavesEmprendeCircular.lineaBase] ?? ""}
                onCambiar={(v) => onCambiar(clavesEmprendeCircular.lineaBase, v)}
                color={azul}
              />
              <CampoLinea
                id={clavesEmprendeCircular.periodoFuente}
                etiqueta="Periodo / fuente:"
                valor={respuestas[clavesEmprendeCircular.periodoFuente] ?? ""}
                onCambiar={(v) => onCambiar(clavesEmprendeCircular.periodoFuente, v)}
                color={azul}
              />
              <CampoLinea
                id={clavesEmprendeCircular.meta}
                etiqueta="Meta:"
                valor={respuestas[clavesEmprendeCircular.meta] ?? ""}
                onCambiar={(v) => onCambiar(clavesEmprendeCircular.meta, v)}
                color={azul}
              />
              <CampoLinea
                id={clavesEmprendeCircular.fechaRevision}
                etiqueta="Fecha de revisión:"
                valor={respuestas[clavesEmprendeCircular.fechaRevision] ?? ""}
                onCambiar={(v) => onCambiar(clavesEmprendeCircular.fechaRevision, v)}
                color={azul}
              />
            </div>
          </div>
        </section>

        {/* 4. Comprueben la definición */}
        <section>
          <EncabezadoPaso
            numero={4}
            titulo="Comprueben la definición"
            color={morado}
            linea={moradoBorde}
          />
          <div
            className="rounded-3xl border-2 p-5 shadow-card sm:p-6"
            style={{ backgroundColor: moradoFondo, borderColor: moradoBorde }}
          >
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              <ul className="space-y-3">
                {checksIzq.map((c) => {
                  const clave = clavesEmprendeCircular.comprobacion(c.id);
                  const marcado = respuestas[clave] === "si";
                  return (
                    <li key={c.id} className="flex items-start gap-2.5">
                      <Checkbox
                        id={clave}
                        checked={marcado}
                        onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                        className="mt-0.5 h-4 w-4 border-[#8b5cb8]/50 data-[state=checked]:border-[#8b5cb8] data-[state=checked]:bg-[#8b5cb8]"
                      />
                      <label
                        htmlFor={clave}
                        className="cursor-pointer text-sm leading-snug"
                        style={{ color: morado }}
                      >
                        {c.etiqueta}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <ul className="space-y-3">
                {checksDer.map((c) => {
                  const clave = clavesEmprendeCircular.comprobacion(c.id);
                  const marcado = respuestas[clave] === "si";
                  return (
                    <li key={c.id} className="flex items-start gap-2.5">
                      <Checkbox
                        id={clave}
                        checked={marcado}
                        onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                        className="mt-0.5 h-4 w-4 border-[#8b5cb8]/50 data-[state=checked]:border-[#8b5cb8] data-[state=checked]:bg-[#8b5cb8]"
                      />
                      <label
                        htmlFor={clave}
                        className="cursor-pointer text-sm leading-snug"
                        style={{ color: morado }}
                      >
                        {c.etiqueta}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
