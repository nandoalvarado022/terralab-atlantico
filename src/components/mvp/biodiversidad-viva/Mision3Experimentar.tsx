import { Checkbox } from "@/components/ui/checkbox";
import {
  amenazasVisiblesHabitat,
  clavesBiodiversidadViva,
  opcionesSueloHabitat,
  rangosPorcentajeHabitat,
} from "@/data/biodiversidad-viva-misiones";
import type { MisionProps } from "./types";

function CampoLinea({
  id,
  etiqueta,
  valor,
  onCambiar,
  color = "#2d6a6a",
}: {
  id: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  color?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-extrabold tracking-wide uppercase" style={{ color }}>
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-2 w-full border-0 border-b-2 bg-transparent px-0 py-1.5 text-sm outline-none"
        style={{ borderColor: `${color}55`, color }}
      />
    </div>
  );
}

function CasillaUnica({
  id,
  etiqueta,
  color,
  marcado,
  onToggle,
}: {
  id: string;
  etiqueta: string;
  color: string;
  marcado: boolean;
  onToggle: () => void;
}) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2">
      <Checkbox
        id={id}
        checked={marcado}
        onCheckedChange={onToggle}
        className="h-[15px] w-[15px] rounded-[2px] border-2 shadow-none data-[state=checked]:text-white"
        style={{
          borderColor: color,
          backgroundColor: marcado ? color : "transparent",
        }}
      />
      <span className="text-sm" style={{ color }}>
        {etiqueta}
      </span>
    </label>
  );
}

function SeccionRango({
  titulo,
  color,
  clave,
  valor,
  onCambiar,
}: {
  titulo: string;
  color: string;
  clave: string;
  valor: string;
  onCambiar: (v: string) => void;
}) {
  return (
    <section>
      <h4 className="text-sm font-extrabold tracking-wide uppercase" style={{ color }}>
        {titulo}
      </h4>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:max-w-md">
        {rangosPorcentajeHabitat.map((rango) => {
          const marcado = valor === rango.id;
          return (
            <li key={rango.id}>
              <CasillaUnica
                id={`${clave}-${rango.id}`}
                etiqueta={rango.etiqueta}
                color={color}
                marcado={marcado}
                onToggle={() => onCambiar(marcado ? "" : rango.id)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Misión 3 · tipos observados + lectura rápida del hábitat. */
export function Mision3Experimentar({ respuestas, onCambiar }: MisionProps) {
  return (
    <div className="space-y-8">
      <article className="overflow-hidden rounded-[2rem] border-2 border-[#5a9e8a] bg-[#eaf6f1] p-4 shadow-card sm:p-6">
        <h3 className="text-sm font-extrabold tracking-wide text-[#1f5c4a] uppercase sm:text-base">
          ¿Qué vida observaron?
        </h3>
        <div className="mt-5 space-y-5">
          <CampoLinea
            id={clavesBiodiversidadViva.puntoInicio}
            etiqueta="Punto de inicio"
            valor={respuestas[clavesBiodiversidadViva.puntoInicio] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.puntoInicio, v)}
            color="#2d6a6a"
          />
          <CampoLinea
            id={clavesBiodiversidadViva.puntoCierre}
            etiqueta="Cierre"
            valor={respuestas[clavesBiodiversidadViva.puntoCierre] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.puntoCierre, v)}
            color="#2d6a6a"
          />
          <CampoLinea
            id={clavesBiodiversidadViva.tipoArbolesPlantas}
            etiqueta="Tipo de árboles y plantas"
            valor={respuestas[clavesBiodiversidadViva.tipoArbolesPlantas] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.tipoArbolesPlantas, v)}
            color="#3d8b5c"
          />
          <CampoLinea
            id={clavesBiodiversidadViva.tiposAve}
            etiqueta="Tipos de ave"
            valor={respuestas[clavesBiodiversidadViva.tiposAve] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.tiposAve, v)}
            color="#3b82c4"
          />
          <CampoLinea
            id={clavesBiodiversidadViva.tipoInsectosPolinizadores}
            etiqueta="Tipo de insectos o polinizadores"
            valor={respuestas[clavesBiodiversidadViva.tipoInsectosPolinizadores] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.tipoInsectosPolinizadores, v)}
            color="#e07a3d"
          />
        </div>
      </article>

      <article className="overflow-hidden rounded-[2rem] border-2 border-[#4a9bc7] bg-[#eef6f2] p-4 shadow-card sm:p-6">
        <h3 className="text-center text-lg font-extrabold tracking-wide text-[#2d6a8a] uppercase sm:text-xl">
          Lectura rápida del hábitat
        </h3>

        <div className="mt-6 space-y-7">
          <SeccionRango
            titulo="Cobertura vegetal"
            color="#3d8b5c"
            clave={clavesBiodiversidadViva.coberturaVegetal}
            valor={respuestas[clavesBiodiversidadViva.coberturaVegetal] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.coberturaVegetal, v)}
          />

          <SeccionRango
            titulo="Sombra"
            color="#3b82c4"
            clave={clavesBiodiversidadViva.sombra}
            valor={respuestas[clavesBiodiversidadViva.sombra] ?? ""}
            onCambiar={(v) => onCambiar(clavesBiodiversidadViva.sombra, v)}
          />

          <section>
            <h4 className="text-sm font-extrabold tracking-wide text-[#a67c52] uppercase">Suelo</h4>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:max-w-lg">
              {opcionesSueloHabitat.map((opcion) => {
                const clave = clavesBiodiversidadViva.suelo(opcion.id);
                const marcado = respuestas[clave] === "si";
                return (
                  <li key={opcion.id}>
                    <CasillaUnica
                      id={clave}
                      etiqueta={opcion.etiqueta}
                      color="#a67c52"
                      marcado={marcado}
                      onToggle={() => onCambiar(clave, marcado ? "" : "si")}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h4 className="text-sm font-extrabold tracking-wide text-[#e07a3d] uppercase">
              Visitas de polinizadores
            </h4>
            <div className="mt-3 space-y-3 sm:max-w-xl">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <label
                  htmlFor={clavesBiodiversidadViva.polinizadoresVisitas}
                  className="shrink-0 text-sm font-bold text-[#c45c2a]"
                >
                  total de visitas:
                </label>
                <input
                  id={clavesBiodiversidadViva.polinizadoresVisitas}
                  type="text"
                  inputMode="numeric"
                  value={respuestas[clavesBiodiversidadViva.polinizadoresVisitas] ?? ""}
                  onChange={(e) =>
                    onCambiar(clavesBiodiversidadViva.polinizadoresVisitas, e.target.value)
                  }
                  className="min-w-[8rem] flex-1 border-0 border-b-2 border-[#e07a3d]/45 bg-transparent px-1 py-0.5 text-sm text-[#c45c2a] outline-none focus:border-[#e07a3d]"
                />
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <label
                  htmlFor={clavesBiodiversidadViva.polinizadoresPlanta}
                  className="shrink-0 text-sm font-bold text-[#c45c2a]"
                >
                  flor o planta visitada:
                </label>
                <input
                  id={clavesBiodiversidadViva.polinizadoresPlanta}
                  type="text"
                  value={respuestas[clavesBiodiversidadViva.polinizadoresPlanta] ?? ""}
                  onChange={(e) =>
                    onCambiar(clavesBiodiversidadViva.polinizadoresPlanta, e.target.value)
                  }
                  className="min-w-[10rem] flex-1 border-0 border-b-2 border-[#e07a3d]/45 bg-transparent px-1 py-0.5 text-sm text-[#c45c2a] outline-none focus:border-[#e07a3d]"
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-extrabold tracking-wide text-[#c45c5c] uppercase">
              Amenazas visibles
            </h4>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {amenazasVisiblesHabitat.map((opcion) => {
                const clave = clavesBiodiversidadViva.amenazaVisible(opcion.id);
                const marcado = respuestas[clave] === "si";
                return (
                  <li key={opcion.id}>
                    <CasillaUnica
                      id={clave}
                      etiqueta={opcion.etiqueta}
                      color="#c45c5c"
                      marcado={marcado}
                      onToggle={() => onCambiar(clave, marcado ? "" : "si")}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
