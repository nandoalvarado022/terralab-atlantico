import { useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  accionCuidadoPorId,
  accionesCuidado,
  amenazaPorId,
  amenazasSerVivo,
  clavesBiodiversidadViva,
  necesidadPorId,
  necesidadesSerVivo,
  type TarjetaRedInvisible,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

type ModalTipo = "necesidad" | "amenaza" | "accion";
type SlotModal = { tipo: ModalTipo; slot: 1 | 2 };

function ModalTarjetas({
  abierto,
  titulo,
  descripcion,
  icono,
  color,
  opciones,
  seleccionActual,
  idsOcupados,
  onElegir,
  onCerrar,
}: {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  opciones: TarjetaRedInvisible[];
  seleccionActual: string;
  idsOcupados: Set<string>;
  onElegir: (id: string) => void;
  onCerrar: () => void;
}) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold" style={{ color }}>
            {titulo}
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            {descripcion}
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2 sm:grid-cols-2">
          {opciones.map((opcion) => {
            const activa = seleccionActual === opcion.id;
            const ocupada = idsOcupados.has(opcion.id) && !activa;
            return (
              <li key={opcion.id}>
                <button
                  type="button"
                  disabled={ocupada}
                  aria-pressed={activa}
                  onClick={() => {
                    onElegir(opcion.id);
                    onCerrar();
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                    activa ? "shadow-card" : "border-transparent"
                  }`}
                  style={{
                    backgroundColor: `${color}18`,
                    borderColor: activa ? color : "transparent",
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  >
                    {icono}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold" style={{ color }}>
                      {opcion.titulo}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {opcion.descripcion}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function SlotTarjeta({
  etiqueta,
  pistaVacia,
  color,
  tarjeta,
  onAbrir,
  onQuitar,
}: {
  etiqueta: string;
  pistaVacia: string;
  color: string;
  tarjeta: TarjetaRedInvisible | undefined;
  onAbrir: () => void;
  onQuitar: () => void;
}) {
  return (
    <div
      className="relative flex min-h-[4.5rem] flex-1 flex-col rounded-2xl border-2 border-dashed bg-white/80 p-3"
      style={{ borderColor: color }}
    >
      {tarjeta ? (
        <>
          <button
            type="button"
            onClick={onQuitar}
            className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-deep"
            aria-label={`Quitar ${etiqueta}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button type="button" onClick={onAbrir} className="flex flex-1 items-start gap-2 text-left">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {etiqueta}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold" style={{ color }}>
                {tarjeta.titulo}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{tarjeta.descripcion}</span>
            </span>
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onAbrir}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-center"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold text-white"
            style={{ backgroundColor: color }}
            aria-hidden
          >
            {etiqueta}
          </span>
          <span className="text-xs text-muted-foreground">{pistaVacia}</span>
        </button>
      )}
    </div>
  );
}

export function RevelaLaRedInvisible({ respuestas, onCambiar }: MisionProps) {
  const [modal, setModal] = useState<SlotModal | null>(null);

  const especie =
    respuestas[clavesBiodiversidadViva.nombreComun]?.trim() || "Nuestra especie";

  const necesidad1 = necesidadPorId(respuestas[clavesBiodiversidadViva.necesidad(1)]);
  const necesidad2 = necesidadPorId(respuestas[clavesBiodiversidadViva.necesidad(2)]);
  const accion1 = accionCuidadoPorId(respuestas[clavesBiodiversidadViva.accionCuidado(1)]);
  const accion2 = accionCuidadoPorId(respuestas[clavesBiodiversidadViva.accionCuidado(2)]);
  const amenaza1 = amenazaPorId(respuestas[clavesBiodiversidadViva.amenaza(1)]);
  const amenaza2 = amenazaPorId(respuestas[clavesBiodiversidadViva.amenaza(2)]);

  const necesidadesOcupadas = new Set(
    [necesidad1?.id, necesidad2?.id].filter(Boolean) as string[],
  );
  const accionesOcupadas = new Set([accion1?.id, accion2?.id].filter(Boolean) as string[]);
  const amenazasOcupadas = new Set([amenaza1?.id, amenaza2?.id].filter(Boolean) as string[]);

  return (
    <article className="overflow-hidden rounded-[2rem] border-2 border-[#4a9a9a] bg-[#e8f4f2] p-4 shadow-card sm:p-6">
      <header className="rounded-2xl bg-[#2d6a6a] px-5 py-3 text-center">
        <h3 className="text-sm font-extrabold tracking-[0.18em] text-white uppercase">
          2. Revela la red invisible
        </h3>
      </header>

      <p className="mt-4 text-center text-sm text-[#3d6b6b]">
        Usa las tarjetas para mostrar necesidades, acciones de cuidado y amenazas.
      </p>

      <div className="mx-auto mt-6 flex max-w-xl flex-col items-stretch gap-4">
        <section className="rounded-2xl border-2 border-dashed border-[#3d8b5c] bg-white/70 p-4">
          <h4 className="text-center text-sm font-extrabold tracking-wide text-[#3d8b5c] uppercase">
            Lo que necesita
          </h4>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Pega 2 tarjetas de necesidades
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <SlotTarjeta
              etiqueta="N"
              pistaVacia="Elegir necesidad 1"
              color="#2d8a6a"
              tarjeta={necesidad1}
              onAbrir={() => setModal({ tipo: "necesidad", slot: 1 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.necesidad(1), "")}
            />
            <SlotTarjeta
              etiqueta="N"
              pistaVacia="Elegir necesidad 2"
              color="#2d8a6a"
              tarjeta={necesidad2}
              onAbrir={() => setModal({ tipo: "necesidad", slot: 2 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.necesidad(2), "")}
            />
          </div>
        </section>

        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-[3px] border-[#2d5a7a] bg-white px-4 text-center shadow-sm sm:h-40 sm:w-40">
            <p className="text-[10px] font-extrabold tracking-widest text-[#2d5a7a] uppercase">
              Nuestra especie
            </p>
            <p className="mt-1 text-sm font-extrabold leading-snug text-[#1f4d5a]">{especie}</p>
          </div>
          <label
            htmlFor={clavesBiodiversidadViva.haceMientras}
            className="max-w-[12rem] text-center text-xs text-[#3d6b6b]"
          >
            ¿Qué hace mientras nadie la mira?
          </label>
          <input
            id={clavesBiodiversidadViva.haceMientras}
            type="text"
            value={respuestas[clavesBiodiversidadViva.haceMientras] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.haceMientras, e.target.value)}
            className="w-full max-w-[14rem] border-0 border-b border-[#3d6b6b]/40 bg-transparent px-1 py-1 text-center text-sm outline-none focus:border-[#2d6a6a]"
          />
        </div>

        <section className="rounded-2xl border-2 border-dashed border-[#2d6a4f] bg-white/70 p-4">
          <h4 className="text-center text-sm font-extrabold tracking-wide text-[#2d6a4f] uppercase">
            Acciones de cuidado
          </h4>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Pega 2 tarjetas de acciones
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <SlotTarjeta
              etiqueta="A"
              pistaVacia="Elegir acción 1"
              color="#2d6a4f"
              tarjeta={accion1}
              onAbrir={() => setModal({ tipo: "accion", slot: 1 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.accionCuidado(1), "")}
            />
            <SlotTarjeta
              etiqueta="A"
              pistaVacia="Elegir acción 2"
              color="#2d6a4f"
              tarjeta={accion2}
              onAbrir={() => setModal({ tipo: "accion", slot: 2 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.accionCuidado(2), "")}
            />
          </div>
        </section>

        <section className="rounded-2xl border-2 border-dashed border-[#d97706] bg-white/70 p-4">
          <h4 className="text-center text-sm font-extrabold tracking-wide text-[#d97706] uppercase">
            Lo que podría amenazarla
          </h4>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Pega 2 tarjetas de amenazas
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <SlotTarjeta
              etiqueta="!"
              pistaVacia="Elegir amenaza 1"
              color="#d97706"
              tarjeta={amenaza1}
              onAbrir={() => setModal({ tipo: "amenaza", slot: 1 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.amenaza(1), "")}
            />
            <SlotTarjeta
              etiqueta="!"
              pistaVacia="Elegir amenaza 2"
              color="#d97706"
              tarjeta={amenaza2}
              onAbrir={() => setModal({ tipo: "amenaza", slot: 2 })}
              onQuitar={() => onCambiar(clavesBiodiversidadViva.amenaza(2), "")}
            />
          </div>
        </section>

        <section className="rounded-2xl border-2 border-[#e07a3d] bg-white/80 p-4">
          <label
            htmlFor={clavesBiodiversidadViva.siFaltara}
            className="block text-center text-sm font-extrabold tracking-wide text-[#e07a3d] uppercase"
          >
            Si esta vida faltara…
          </label>
          <p className="mt-1 text-center text-xs text-[#1f4d5a]">
            ¿Qué relación se rompería y qué cambiaría en el colegio?
          </p>
          <textarea
            id={clavesBiodiversidadViva.siFaltara}
            rows={3}
            value={respuestas[clavesBiodiversidadViva.siFaltara] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.siFaltara, e.target.value)}
            className="mt-3 w-full resize-none border-0 bg-transparent px-1 py-1 text-sm text-[#1f4d5a] outline-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 1.5rem, rgba(224,122,61,0.3) 1.5rem, rgba(224,122,61,0.3) calc(1.5rem + 1px))",
              backgroundAttachment: "local",
              lineHeight: "1.55rem",
            }}
          />
          <p className="mt-2 text-center text-xs font-bold text-[#e07a3d]">
            Especie → relación → consecuencia
          </p>
        </section>
      </div>

      <ModalTarjetas
        abierto={modal?.tipo === "necesidad"}
        titulo="Lo que necesita"
        descripcion="Elijan una necesidad para esta tarjeta. Solo una opción por tarjeta."
        icono="N"
        color="#2d8a6a"
        opciones={necesidadesSerVivo}
        seleccionActual={
          modal?.tipo === "necesidad"
            ? (respuestas[clavesBiodiversidadViva.necesidad(modal.slot)] ?? "")
            : ""
        }
        idsOcupados={necesidadesOcupadas}
        onElegir={(id) => {
          if (modal?.tipo === "necesidad") {
            onCambiar(clavesBiodiversidadViva.necesidad(modal.slot), id);
          }
        }}
        onCerrar={() => setModal(null)}
      />

      <ModalTarjetas
        abierto={modal?.tipo === "accion"}
        titulo="Acciones de cuidado"
        descripcion="Elijan una acción para esta tarjeta. Solo una opción por tarjeta."
        icono="A"
        color="#2d6a4f"
        opciones={accionesCuidado}
        seleccionActual={
          modal?.tipo === "accion"
            ? (respuestas[clavesBiodiversidadViva.accionCuidado(modal.slot)] ?? "")
            : ""
        }
        idsOcupados={accionesOcupadas}
        onElegir={(id) => {
          if (modal?.tipo === "accion") {
            onCambiar(clavesBiodiversidadViva.accionCuidado(modal.slot), id);
          }
        }}
        onCerrar={() => setModal(null)}
      />

      <ModalTarjetas
        abierto={modal?.tipo === "amenaza"}
        titulo="Lo que podría amenazarla"
        descripcion="Elijan una amenaza para esta tarjeta. Solo una opción por tarjeta."
        icono="!"
        color="#d97706"
        opciones={amenazasSerVivo}
        seleccionActual={
          modal?.tipo === "amenaza"
            ? (respuestas[clavesBiodiversidadViva.amenaza(modal.slot)] ?? "")
            : ""
        }
        idsOcupados={amenazasOcupadas}
        onElegir={(id) => {
          if (modal?.tipo === "amenaza") {
            onCambiar(clavesBiodiversidadViva.amenaza(modal.slot), id);
          }
        }}
        onCerrar={() => setModal(null)}
      />
    </article>
  );
}
