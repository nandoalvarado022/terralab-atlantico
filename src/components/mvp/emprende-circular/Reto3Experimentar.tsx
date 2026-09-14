import { Checkbox } from "@/components/ui/checkbox";
import {
  accionesCirculares,
  camposAuditoria,
  clavesEmprendeCircular,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

function CampoFicha({
  id,
  titulo,
  pista,
  valor,
  onCambiar,
}: {
  id: string;
  titulo: string;
  pista: string;
  valor: string;
  onCambiar: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase">
        {titulo}
      </label>
      <p className="mt-0.5 text-xs text-muted-foreground">{pista}</p>
      <textarea
        id={id}
        rows={2}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-2 w-full resize-none rounded-none border-0 border-b-2 border-[#1f5c4a]/35 bg-transparent px-0 py-1.5 text-sm outline-none focus:border-[#1f5c4a]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 1.5rem, rgba(31,92,74,0.12) 1.5rem, rgba(31,92,74,0.12) calc(1.5rem + 1px))",
          backgroundAttachment: "local",
          lineHeight: "1.55rem",
        }}
      />
    </div>
  );
}

export function Reto3Experimentar({ respuestas, onCambiar }: RetoProps) {
  const camposIzq = camposAuditoria.filter((c) => c.columna === "izq");
  const camposDer = camposAuditoria.filter((c) => c.columna === "der");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-5">
        <section className="rounded-3xl border-2 border-[#1f5c4a]/70 bg-card p-5 shadow-card sm:p-6 lg:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-extrabold tracking-widest text-[#1f5c4a] uppercase">
              Ficha de auditoría del material
            </h3>
            <p className="max-w-xs text-right text-xs text-muted-foreground">
              Usen una muestra aprobada o el registro obtenido durante la ecoauditoría.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7">
            <div className="space-y-7">
              {camposIzq.map((campo) => {
                const clave = clavesEmprendeCircular.auditoria(campo.id);
                return (
                  <CampoFicha
                    key={campo.id}
                    id={clave}
                    titulo={campo.titulo}
                    pista={campo.pista}
                    valor={respuestas[clave] ?? ""}
                    onCambiar={(v) => onCambiar(clave, v)}
                  />
                );
              })}
            </div>
            <div className="space-y-7">
              {camposDer.map((campo) => {
                const clave = clavesEmprendeCircular.auditoria(campo.id);
                return (
                  <CampoFicha
                    key={campo.id}
                    id={clave}
                    titulo={campo.titulo}
                    pista={campo.pista}
                    valor={respuestas[clave] ?? ""}
                    onCambiar={(v) => onCambiar(clave, v)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-3xl border-2 border-[#1f5c4a]/70 bg-card p-5 shadow-card sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-extrabold tracking-widest text-[#1f5c4a] uppercase">
            Oportunidades circulares
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Marquen las opciones posibles y elijan una alternativa para desarrollar.
          </p>

          <ul className="mt-5 space-y-2.5">
            {accionesCirculares.map((accion) => {
              const clave = clavesEmprendeCircular.oportunidad(accion.id);
              const marcado = respuestas[clave] === "si";
              return (
                <li key={accion.id} className="flex items-start gap-2.5">
                  <Checkbox
                    id={clave}
                    checked={marcado}
                    onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                    className="mt-0.5 h-5 w-5 border-[#1f5c4a]/60 data-[state=checked]:border-[#1f5c4a] data-[state=checked]:bg-[#1f5c4a]"
                  />
                  <label htmlFor={clave} className="cursor-pointer leading-snug">
                    <span className="font-extrabold text-[#1f5c4a]">{accion.titulo}</span>{" "}
                    <span className="text-sm text-muted-foreground">{accion.resumenCorto}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-5">
            <div className="rounded-2xl border-2 border-[#e07a3a] bg-[#fff8f3] p-4">
              <h4 className="text-xs font-extrabold tracking-widest text-[#e07a3a] uppercase">
                Alternativa a desarrollar
              </h4>
              <div className="mt-3 flex items-baseline gap-2">
                <label
                  htmlFor={clavesEmprendeCircular.alternativaA}
                  className="shrink-0 text-sm font-extrabold text-[#e07a3a]"
                >
                  A:
                </label>
                <input
                  id={clavesEmprendeCircular.alternativaA}
                  type="text"
                  value={respuestas[clavesEmprendeCircular.alternativaA] ?? ""}
                  placeholder="Nombre de la alternativa…"
                  onChange={(e) => onCambiar(clavesEmprendeCircular.alternativaA, e.target.value)}
                  className="min-w-0 flex-1 border-0 border-b-2 border-[#e07a3a]/50 bg-transparent px-1 py-0.5 text-sm outline-none focus:border-[#e07a3a]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
