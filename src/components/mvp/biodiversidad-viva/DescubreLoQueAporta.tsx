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
  categoriasServicio,
  clavesBiodiversidadViva,
  colorCategoriaServicio,
  coloresServicioSlot,
  etiquetaCategoriaServicio,
  servicioPorId,
  serviciosEcosistemicos,
  type ServicioEcosistemico,
  type TarjetaRedInvisible,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

type ModalExtra = "amenaza" | "accion" | null;

function ModalServicios({
  abierto,
  seleccionActual,
  idsOcupados,
  onElegir,
  onCerrar,
}: {
  abierto: boolean;
  seleccionActual: string;
  idsOcupados: Set<string>;
  onElegir: (id: string) => void;
  onCerrar: () => void;
}) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-[#7b5ea7]">
            Servicios ecosistémicos
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            Elijan una tarjeta para este servicio. Solo una por slot. Usen al menos 2 categorías
            entre los 3 servicios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {categoriasServicio.map((cat) => {
            const opciones = serviciosEcosistemicos.filter((s) => s.categoria === cat.id);
            return (
              <div key={cat.id}>
                <p
                  className="mb-2 text-xs font-extrabold tracking-widest uppercase"
                  style={{ color: cat.color }}
                >
                  {cat.etiqueta}
                </p>
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
                            backgroundColor: `${cat.color}14`,
                            borderColor: activa ? cat.color : "transparent",
                          }}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                            style={{ backgroundColor: cat.color }}
                            aria-hidden
                          >
                            {opcion.numero}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-extrabold tracking-wider uppercase opacity-70">
                              {cat.etiqueta}
                            </span>
                            <span
                              className="mt-0.5 block text-sm font-extrabold"
                              style={{ color: cat.color }}
                            >
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
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SlotServicio({
  numero,
  color,
  servicio,
  evidencia,
  otroTexto,
  onAbrir,
  onQuitar,
  onEvidencia,
  onOtro,
}: {
  numero: 1 | 2 | 3;
  color: string;
  servicio: ServicioEcosistemico | undefined;
  evidencia: string;
  otroTexto: string;
  onAbrir: () => void;
  onQuitar: () => void;
  onEvidencia: (v: string) => void;
  onOtro: (v: string) => void;
}) {
  const colorCat = servicio ? colorCategoriaServicio(servicio.categoria) : color;

  return (
    <div className="flex items-stretch gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full text-sm font-extrabold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {numero}
      </span>

      <div
        className="relative min-w-0 flex-1 rounded-2xl border-2 border-dashed bg-white/80 p-3"
        style={{ borderColor: color }}
      >
        {servicio ? (
          <>
            <button
              type="button"
              onClick={onQuitar}
              className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-deep"
              aria-label={`Quitar servicio ${numero}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
            <button type="button" onClick={onAbrir} className="w-full pr-6 text-left">
              <p className="text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
                Servicio {numero}
              </p>
              <p className="mt-1 text-[10px] font-extrabold tracking-wider uppercase opacity-70">
                {etiquetaCategoriaServicio(servicio.categoria)} · #{servicio.numero}
              </p>
              <p className="mt-0.5 text-sm font-extrabold" style={{ color: colorCat }}>
                {servicio.titulo}
              </p>
              {!servicio.esOtro && (
                <p className="mt-0.5 text-xs text-muted-foreground">{servicio.descripcion}</p>
              )}
            </button>

            {servicio.esOtro && (
              <input
                type="text"
                value={otroTexto}
                onChange={(e) => onOtro(e.target.value)}
                placeholder="Escriban el otro aporte…"
                className="mt-2 w-full border-0 border-b border-current/30 bg-transparent px-0 py-1 text-sm outline-none"
                style={{ color: colorCat, borderColor: `${colorCat}55` }}
              />
            )}

            <label
              htmlFor={`servicio-${numero}-evidencia`}
              className="mt-3 block text-[11px] font-extrabold tracking-wide uppercase"
              style={{ color }}
            >
              Porque / evidencia
            </label>
            <input
              id={`servicio-${numero}-evidencia`}
              type="text"
              value={evidencia}
              onChange={(e) => onEvidencia(e.target.value)}
              placeholder="¿Por qué y qué evidencia tienen?"
              className="mt-1 w-full border-0 border-b bg-transparent px-0 py-1 text-sm outline-none"
              style={{ borderColor: `${color}66`, color: "#1f4d5a" }}
            />
          </>
        ) : (
          <button type="button" onClick={onAbrir} className="w-full py-3 text-left">
            <p className="text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
              Servicio {numero}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Tarjeta + porque / evidencia</p>
          </button>
        )}
      </div>
    </div>
  );
}

function ModalCatalogoSimple({
  abierto,
  titulo,
  descripcion,
  icono,
  color,
  opciones,
  seleccionActual,
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
            return (
              <li key={opcion.id}>
                <button
                  type="button"
                  aria-pressed={activa}
                  onClick={() => {
                    onElegir(opcion.id);
                    onCerrar();
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition-transform hover:-translate-y-0.5 ${
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

function SlotTarjetaSimple({
  titulo,
  pistaVacia,
  color,
  icono,
  tarjeta,
  onAbrir,
  onQuitar,
  adaptacion,
  onAdaptacion,
}: {
  titulo: string;
  pistaVacia: string;
  color: string;
  icono: string;
  tarjeta: TarjetaRedInvisible | undefined;
  onAbrir: () => void;
  onQuitar: () => void;
  adaptacion?: string;
  onAdaptacion?: (v: string) => void;
}) {
  return (
    <div
      className="relative rounded-2xl border-2 border-dashed bg-white/80 p-4"
      style={{ borderColor: color }}
    >
      {tarjeta ? (
        <>
          <button
            type="button"
            onClick={onQuitar}
            className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-deep"
            aria-label={`Quitar ${titulo}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button type="button" onClick={onAbrir} className="flex w-full items-start gap-3 pr-6 text-left">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {icono}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
                {titulo}
              </span>
              <span className="mt-1 block text-sm font-extrabold" style={{ color }}>
                {tarjeta.titulo}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{tarjeta.descripcion}</span>
            </span>
          </button>
          {onAdaptacion && (
            <div className="mt-3">
              <label
                htmlFor="accion-adaptada"
                className="text-[11px] font-extrabold tracking-wide uppercase"
                style={{ color }}
              >
                Adáptenla aquí
              </label>
              <textarea
                id="accion-adaptada"
                rows={2}
                value={adaptacion ?? ""}
                onChange={(e) => onAdaptacion(e.target.value)}
                placeholder="Cómo la aplicarían en el colegio…"
                className="mt-1 w-full resize-none border-0 border-b bg-transparent px-0 py-1 text-sm outline-none"
                style={{ borderColor: `${color}55`, color: "#1f4d38" }}
              />
            </div>
          )}
        </>
      ) : (
        <button type="button" onClick={onAbrir} className="flex min-h-[4.5rem] w-full flex-col justify-between text-left">
          <span className="text-xs font-extrabold tracking-wide uppercase" style={{ color }}>
            {titulo}
          </span>
          <span className="mt-4 text-center text-sm text-muted-foreground">{pistaVacia}</span>
        </button>
      )}
    </div>
  );
}

export function DescubreLoQueAporta({ respuestas, onCambiar }: MisionProps) {
  const [slotModal, setSlotModal] = useState<1 | 2 | 3 | null>(null);
  const [modalExtra, setModalExtra] = useState<ModalExtra>(null);

  const s1 = servicioPorId(respuestas[clavesBiodiversidadViva.servicio(1)]);
  const s2 = servicioPorId(respuestas[clavesBiodiversidadViva.servicio(2)]);
  const s3 = servicioPorId(respuestas[clavesBiodiversidadViva.servicio(3)]);

  const amenaza = amenazaPorId(respuestas[clavesBiodiversidadViva.amenazaMision]);
  const accion = accionCuidadoPorId(respuestas[clavesBiodiversidadViva.accionMision]);

  const ocupados = new Set([s1?.id, s2?.id, s3?.id].filter(Boolean) as string[]);
  const categoriasElegidas = new Set(
    [s1?.categoria, s2?.categoria, s3?.categoria].filter(Boolean),
  );
  const avisoCategorias =
    [s1, s2, s3].filter(Boolean).length >= 2 && categoriasElegidas.size < 2;

  return (
    <article className="overflow-hidden rounded-[2rem] border-2 border-[#c4b5e0] bg-[#f7f3e8] p-4 shadow-card sm:p-6">
      <header className="rounded-2xl bg-[#7b5ea7] px-5 py-3 text-center">
        <h3 className="text-sm font-extrabold tracking-[0.18em] text-white uppercase">
          3. Descubre lo que aporta
        </h3>
      </header>

      <p className="mt-4 text-center text-sm text-[#5a4a6a]">
        Elige 3 servicios. Usa al menos 2 categorías y escribe la evidencia.
      </p>

      {avisoCategorias && (
        <p className="mt-3 text-center text-xs font-bold text-[#b45309]">
          Usen al menos 2 categorías distintas entre los servicios elegidos.
        </p>
      )}

      <div className="mx-auto mt-5 flex max-w-lg flex-col gap-4">
        {([1, 2, 3] as const).map((n) => {
          const servicio = n === 1 ? s1 : n === 2 ? s2 : s3;
          return (
            <SlotServicio
              key={n}
              numero={n}
              color={coloresServicioSlot[n]}
              servicio={servicio}
              evidencia={respuestas[clavesBiodiversidadViva.servicioEvidencia(n)] ?? ""}
              otroTexto={respuestas[clavesBiodiversidadViva.servicioOtro(n)] ?? ""}
              onAbrir={() => setSlotModal(n)}
              onQuitar={() => {
                onCambiar(clavesBiodiversidadViva.servicio(n), "");
                onCambiar(clavesBiodiversidadViva.servicioEvidencia(n), "");
                onCambiar(clavesBiodiversidadViva.servicioOtro(n), "");
              }}
              onEvidencia={(v) => onCambiar(clavesBiodiversidadViva.servicioEvidencia(n), v)}
              onOtro={(v) => onCambiar(clavesBiodiversidadViva.servicioOtro(n), v)}
            />
          );
        })}

        <div className="rounded-2xl border-2 border-[#3d8b5c] bg-white px-4 py-3">
          <label
            htmlFor={clavesBiodiversidadViva.cuidarlaImporta}
            className="text-sm font-extrabold text-[#3d8b5c]"
          >
            Cuidarla importa porque…
          </label>
          <input
            id={clavesBiodiversidadViva.cuidarlaImporta}
            type="text"
            value={respuestas[clavesBiodiversidadViva.cuidarlaImporta] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.cuidarlaImporta, e.target.value)}
            className="mt-1 w-full border-0 border-b border-[#3d8b5c]/40 bg-transparent px-0 py-1.5 text-sm text-[#1f4d38] outline-none focus:border-[#2d6a4f]"
          />
        </div>

        <SlotTarjetaSimple
          titulo="Amenaza o barrera"
          pistaVacia="Pega 1 tarjeta"
          color="#e07a3d"
          icono="!"
          tarjeta={amenaza}
          onAbrir={() => setModalExtra("amenaza")}
          onQuitar={() => onCambiar(clavesBiodiversidadViva.amenazaMision, "")}
        />

        <SlotTarjetaSimple
          titulo="Acción de cuidado"
          pistaVacia="Pega 1 tarjeta y adáptala"
          color="#2d6a4f"
          icono="A"
          tarjeta={accion}
          onAbrir={() => setModalExtra("accion")}
          onQuitar={() => {
            onCambiar(clavesBiodiversidadViva.accionMision, "");
            onCambiar(clavesBiodiversidadViva.accionMisionAdaptada, "");
          }}
          adaptacion={respuestas[clavesBiodiversidadViva.accionMisionAdaptada] ?? ""}
          onAdaptacion={(v) => onCambiar(clavesBiodiversidadViva.accionMisionAdaptada, v)}
        />

        <div className="rounded-2xl border-2 border-[#2d8a8a] bg-white px-4 py-3">
          <label
            htmlFor={clavesBiodiversidadViva.indicador}
            className="text-sm font-extrabold tracking-wide text-[#2d8a8a] uppercase"
          >
            Indicador: ¿qué veremos o contaremos?
          </label>
          <input
            id={clavesBiodiversidadViva.indicador}
            type="text"
            value={respuestas[clavesBiodiversidadViva.indicador] ?? ""}
            onChange={(e) => onCambiar(clavesBiodiversidadViva.indicador, e.target.value)}
            className="mt-2 w-full border-0 border-b border-[#2d8a8a]/40 bg-transparent px-0 py-1.5 text-sm text-[#1f4d5a] outline-none focus:border-[#2d8a8a]"
          />
        </div>
      </div>

      <ModalServicios
        abierto={slotModal !== null}
        seleccionActual={
          slotModal ? (respuestas[clavesBiodiversidadViva.servicio(slotModal)] ?? "") : ""
        }
        idsOcupados={ocupados}
        onElegir={(id) => {
          if (!slotModal) return;
          onCambiar(clavesBiodiversidadViva.servicio(slotModal), id);
          const elegido = servicioPorId(id);
          if (!elegido?.esOtro) {
            onCambiar(clavesBiodiversidadViva.servicioOtro(slotModal), "");
          }
        }}
        onCerrar={() => setSlotModal(null)}
      />

      <ModalCatalogoSimple
        abierto={modalExtra === "amenaza"}
        titulo="Amenaza o barrera"
        descripcion="Elijan una tarjeta de amenaza o barrera para esta misión de cuidado."
        icono="!"
        color="#e07a3d"
        opciones={amenazasSerVivo}
        seleccionActual={respuestas[clavesBiodiversidadViva.amenazaMision] ?? ""}
        onElegir={(id) => onCambiar(clavesBiodiversidadViva.amenazaMision, id)}
        onCerrar={() => setModalExtra(null)}
      />

      <ModalCatalogoSimple
        abierto={modalExtra === "accion"}
        titulo="Acción de cuidado"
        descripcion="Elijan una acción y luego adáptenla al contexto del colegio."
        icono="A"
        color="#2d6a4f"
        opciones={accionesCuidado}
        seleccionActual={respuestas[clavesBiodiversidadViva.accionMision] ?? ""}
        onElegir={(id) => {
          onCambiar(clavesBiodiversidadViva.accionMision, id);
          const actual = respuestas[clavesBiodiversidadViva.accionMisionAdaptada]?.trim();
          if (!actual) {
            const elegida = accionCuidadoPorId(id);
            if (elegida) {
              onCambiar(clavesBiodiversidadViva.accionMisionAdaptada, elegida.descripcion);
            }
          }
        }}
        onCerrar={() => setModalExtra(null)}
      />
    </article>
  );
}
