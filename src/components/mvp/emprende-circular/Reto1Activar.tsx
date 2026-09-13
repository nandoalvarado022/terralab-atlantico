import { useState } from "react";
import { CircleHelp, X } from "lucide-react";

import { FileUploader } from "@/components/commons/FileUploader";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  accionPorId,
  accionesCirculares,
  clavesEmprendeCircular,
  estadosMaterial,
  resumenGruposAcciones,
  type AccionCircular,
} from "@/data/emprende-circular-misiones";
import type { RetoProps } from "./types";

function ModalAyudaAcciones({
  abierto,
  onCerrar,
  seleccionActual,
  onElegir,
}: {
  abierto: boolean;
  onCerrar: () => void;
  seleccionActual: string;
  onElegir: (accionId: string) => void;
}) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Acciones circulares</DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            Elijan una acción para esta opción. Luego describan cómo la aplicarían aquí.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2">
          {accionesCirculares.map((accion) => {
            const activa = seleccionActual === accion.id;
            return (
              <li key={accion.id}>
                <button
                  type="button"
                  aria-pressed={activa}
                  onClick={() => {
                    onElegir(accion.id);
                    onCerrar();
                  }}
                  className={`flex w-full items-stretch gap-3 rounded-2xl border-2 p-3 text-left transition-transform hover:-translate-y-0.5 ${
                    activa ? "border-deep shadow-card" : "border-transparent hover:border-deep/30"
                  }`}
                  style={{ backgroundColor: accion.color }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-lg font-extrabold text-deep">
                    {accion.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold tracking-wide text-deep uppercase">
                      {accion.titulo}
                    </span>
                    <span className="mt-0.5 block text-xs text-deep/80">{accion.ejemplo}</span>
                  </span>
                  <span className="hidden max-w-[11rem] shrink-0 self-center text-right text-xs font-extrabold leading-snug text-deep sm:block">
                    {accion.definicion}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="rounded-2xl bg-[#e2efda] px-4 py-3 text-xs leading-relaxed text-deep">
          {resumenGruposAcciones.map((g) => (
            <p key={g.rango}>
              <span className="font-extrabold">{g.rango}:</span> {g.texto}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CajonOpcionAccion({
  numero,
  respuestas,
  onCambiar,
  onAbrirAyuda,
}: {
  numero: 1 | 2 | 3;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
  onAbrirAyuda: () => void;
}) {
  const claveAccion = clavesEmprendeCircular.opcionAccion(numero);
  const claveComo = clavesEmprendeCircular.opcionComo(numero);
  const accion: AccionCircular | undefined = accionPorId(respuestas[claveAccion]);

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-deep/15 bg-card shadow-card">
      <div className="flex items-start justify-between gap-2 bg-sand px-4 py-3">
        <div>
          <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
            Opción {numero} · Acción
          </p>
          {accion ? (
            <p className="mt-1 text-sm font-extrabold text-deep">{accion.titulo}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Sin acción elegida</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {accion && (
            <button
              type="button"
              onClick={() => onCambiar(claveAccion, "")}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-deep"
              aria-label={`Quitar acción de la opción ${numero}`}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onAbrirAyuda}
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-background px-2.5 py-1 text-xs font-extrabold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label={`Elegir acción para la opción ${numero}`}
          >
            <CircleHelp className="h-4 w-4" aria-hidden />
            Ayuda
          </button>
        </div>
      </div>

      {accion && (
        <div
          className="border-b border-border/60 px-4 py-2 text-xs"
          style={{ backgroundColor: accion.color }}
        >
          <p className="font-bold text-deep/80">{accion.ejemplo}</p>
          <p className="mt-0.5 font-extrabold text-deep">{accion.definicion}</p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <label htmlFor={claveComo} className="text-xs font-extrabold tracking-wider uppercase">
          ¿Cómo sería aquí?
        </label>
        <textarea
          id={claveComo}
          rows={4}
          value={respuestas[claveComo] ?? ""}
          placeholder="Describan cómo aplicarían esta acción con su material…"
          onChange={(e) => onCambiar(claveComo, e.target.value)}
          className="mt-2 flex-1 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}

export function Reto1Activar({
  respuestas,
  onCambiar,
}: RetoProps) {
  const [ayudaOpcion, setAyudaOpcion] = useState<1 | 2 | 3 | null>(null);

  return (
    <div className="space-y-8">
      {/* 1. Material + dónde + pista */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-3xl border-2 border-lime/60 bg-secondary/40 p-5 shadow-card lg:col-span-3">
          <h3 className="text-sm font-extrabold tracking-widest text-deep uppercase">
            Activar: Así es nuestro material
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibujen la muestra o el objeto. Pongan su nombre.
          </p>

          <div className="mt-4 space-y-3">
            <FileUploader
              valor={respuestas[clavesEmprendeCircular.materialImagen] ?? ""}
              onCambiar={(v) => onCambiar(clavesEmprendeCircular.materialImagen, v)}
              variante="compact"
              etiquetaSubir="Subir dibujo o foto"
              alt="Dibujo o foto del material"
            />
            <div>
              <label
                htmlFor={clavesEmprendeCircular.materialNombre}
                className="text-xs font-extrabold tracking-wider uppercase"
              >
                Nombre
              </label>
              <input
                id={clavesEmprendeCircular.materialNombre}
                type="text"
                value={respuestas[clavesEmprendeCircular.materialNombre] ?? ""}
                placeholder="Ej. hoja impresa, vaso desechable…"
                onChange={(e) => onCambiar(clavesEmprendeCircular.materialNombre, e.target.value)}
                className="mt-1.5 w-full rounded-2xl border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor={clavesEmprendeCircular.materialDescripcion}
                className="text-xs font-extrabold tracking-wider uppercase"
              >
                Descripción
              </label>
              <textarea
                id={clavesEmprendeCircular.materialDescripcion}
                rows={4}
                value={respuestas[clavesEmprendeCircular.materialDescripcion] ?? ""}
                placeholder="¿Qué ven? Forma, material, tamaño, marcas…"
                onChange={(e) =>
                  onCambiar(clavesEmprendeCircular.materialDescripcion, e.target.value)
                }
                className="mt-1.5 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-1 flex-col rounded-3xl border-2 border-deep/20 bg-card p-5 shadow-card">
            <h3 className="text-sm font-extrabold tracking-widest text-deep uppercase">
              ¿Dónde aparece?
            </h3>
            <textarea
              id={clavesEmprendeCircular.dondeAparece}
              rows={4}
              value={respuestas[clavesEmprendeCircular.dondeAparece] ?? ""}
              placeholder="Lugar, momento o situación en el colegio…"
              onChange={(e) => onCambiar(clavesEmprendeCircular.dondeAparece, e.target.value)}
              className="mt-3 flex-1 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-1 flex-col rounded-3xl border-2 border-deep/20 bg-card p-5 shadow-card">
            <h3 className="text-sm font-extrabold tracking-widest text-deep uppercase">
              Una pista del día
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Algo que ya observaron o registraron.
            </p>
            <textarea
              id={clavesEmprendeCircular.pistaDia}
              rows={3}
              value={respuestas[clavesEmprendeCircular.pistaDia] ?? ""}
              placeholder="Una observación concreta…"
              onChange={(e) => onCambiar(clavesEmprendeCircular.pistaDia, e.target.value)}
              className="mt-3 flex-1 w-full resize-none rounded-2xl border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Estado */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h3 className="text-sm font-extrabold tracking-widest uppercase">
          Su estado nos da pistas
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Rodeen lo que ven.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {estadosMaterial.map((estado) => {
            const clave = clavesEmprendeCircular.estado(estado.id);
            const marcado = respuestas[clave] === "si";
            return (
              <li
                key={estado.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3"
              >
                <Checkbox
                  id={clave}
                  checked={marcado}
                  onCheckedChange={(v) => onCambiar(clave, v === true ? "si" : "")}
                  className="h-5 w-5"
                />
                <label htmlFor={clave} className="cursor-pointer font-extrabold">
                  {estado.etiqueta}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. Hasta tres acciones */}
      <div>
        <h3 className="text-sm font-extrabold tracking-widest uppercase">
          Hasta tres acciones que podrían servir
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Usen la ayuda para elegir una acción por opción y describan cómo sería aquí.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => (
            <CajonOpcionAccion
              key={n}
              numero={n}
              respuestas={respuestas}
              onCambiar={onCambiar}
              onAbrirAyuda={() => setAyudaOpcion(n)}
            />
          ))}
        </div>
      </div>

      <ModalAyudaAcciones
        abierto={ayudaOpcion !== null}
        onCerrar={() => setAyudaOpcion(null)}
        seleccionActual={
          ayudaOpcion ? (respuestas[clavesEmprendeCircular.opcionAccion(ayudaOpcion)] ?? "") : ""
        }
        onElegir={(accionId) => {
          if (ayudaOpcion) onCambiar(clavesEmprendeCircular.opcionAccion(ayudaOpcion), accionId);
        }}
      />
    </div>
  );
}

