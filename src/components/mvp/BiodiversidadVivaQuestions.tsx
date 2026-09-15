import { useEffect } from "react";

import {
  clavesBiodiversidadViva,
  pantallasBiodiversidadViva,
  type PantallaBiodiversidadViva,
} from "@/data/biodiversidad-viva-misiones";
import { Mision1EnfocaLaVida } from "./biodiversidad-viva/Mision1EnfocaLaVida";
import { Mision2Comprender } from "./biodiversidad-viva/Mision2Comprender";
import { Mision3Definir } from "./biodiversidad-viva/Mision3Definir";
import { Mision4Disenar } from "./biodiversidad-viva/Mision4Disenar";
import { MisionConstruir } from "./MisionConstruir";
import { MisionInspirar } from "./MisionInspirar";
import { MisionProbar } from "./MisionProbar";

export { flattenRespuestasBiodiversidadViva } from "./biodiversidad-viva/flatten";

type Props = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
  indice: number;
  onCambiarIndice: (indice: number) => void;
  onFinalizar: () => void;
  cargando: boolean;
};

function ContenidoPantalla({
  pantalla,
  respuestas,
  onCambiar,
}: {
  pantalla: PantallaBiodiversidadViva;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  switch (pantalla.id) {
    case "enfoca-la-vida":
      return <Mision1EnfocaLaVida respuestas={respuestas} onCambiar={onCambiar} />;
    case "comprender":
      return <Mision2Comprender respuestas={respuestas} onCambiar={onCambiar} />;
    case "definir":
      return <Mision3Definir respuestas={respuestas} onCambiar={onCambiar} />;
    case "disenar":
      return <Mision4Disenar respuestas={respuestas} onCambiar={onCambiar} />;
    case "construir":
      return (
        <MisionConstruir
          valor={respuestas[clavesBiodiversidadViva.construirImagen] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.construirImagen, v)}
        />
      );
    case "probar":
      return (
        <MisionProbar
          valor={respuestas[clavesBiodiversidadViva.probarMejora] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.probarMejora, v)}
        />
      );
    case "inspirar":
      return (
        <MisionInspirar
          valor={respuestas[clavesBiodiversidadViva.inspirarTexto] ?? ""}
          onCambiar={(v) => onCambiar(clavesBiodiversidadViva.inspirarTexto, v)}
        />
      );
    default:
      return null;
  }
}

export function BiodiversidadVivaQuestions({
  respuestas,
  onCambiar,
  indice,
  onCambiarIndice,
  onFinalizar,
  cargando,
}: Props) {
  const indiceSeguro = Math.min(Math.max(indice, 0), pantallasBiodiversidadViva.length - 1);
  const pantalla = pantallasBiodiversidadViva[indiceSeguro];

  useEffect(() => {
    if (indice !== indiceSeguro) onCambiarIndice(indiceSeguro);
  }, [indice, indiceSeguro, onCambiarIndice]);

  if (!pantalla) return null;

  const esUltima = indiceSeguro === pantallasBiodiversidadViva.length - 1;

  return (
    <section className="space-y-8">
      <ol className="flex flex-wrap gap-2 print:hidden">
        {pantallasBiodiversidadViva.map((p, i) => (
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
          Misión {pantalla.numero} de {pantallasBiodiversidadViva.length} · {pantalla.nombre}
        </p>
        <p className="mt-3 text-muted-foreground">{pantalla.instrucciones}</p>
      </div>

      <ContenidoPantalla pantalla={pantalla} respuestas={respuestas} onCambiar={onCambiar} />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onCambiarIndice(indiceSeguro - 1)}
          disabled={indiceSeguro === 0}
          className="rounded-full border-2 border-deep px-7 py-3 font-extrabold hover:bg-secondary disabled:opacity-40"
        >
          Anterior
        </button>
        {esUltima ? (
          <button
            type="button"
            onClick={onFinalizar}
            disabled={cargando}
            className="rounded-full bg-deep px-7 py-3 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {cargando ? "Redactando el MVP…" : "Crear el documento del MVP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCambiarIndice(indiceSeguro + 1)}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  );
}
