import { useEffect } from "react";

import {
  pantallasEmprendeCircular,
  type PantallaEmprendeCircular,
} from "@/data/emprende-circular-misiones";
import { Reto1Activar } from "./emprende-circular/Reto1Activar";
import { Reto2Comprender } from "./emprende-circular/Reto2Comprender";
import { Reto3Experimentar } from "./emprende-circular/Reto3Experimentar";
import { Reto4Definir } from "./emprende-circular/Reto4Definir";
import { Reto5Disenar } from "./emprende-circular/Reto5Disenar";

export { flattenRespuestasEmprendeCircular } from "./emprende-circular/flatten";

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
  pantalla: PantallaEmprendeCircular;
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
}) {
  switch (pantalla.id) {
    case "nuestro-material":
      return <Reto1Activar respuestas={respuestas} onCambiar={onCambiar} />;
    case "comprender":
      return <Reto2Comprender respuestas={respuestas} onCambiar={onCambiar} />;
    case "experimentar":
      return <Reto3Experimentar respuestas={respuestas} onCambiar={onCambiar} />;
    case "definir":
      return <Reto4Definir respuestas={respuestas} onCambiar={onCambiar} />;
    case "disenar":
      return <Reto5Disenar respuestas={respuestas} onCambiar={onCambiar} />;
    default:
      return null;
  }
}

export function EmprendeCircularQuestions({
  respuestas,
  onCambiar,
  indice,
  onCambiarIndice,
  onFinalizar,
  cargando,
}: Props) {
  const indiceSeguro = Math.min(Math.max(indice, 0), pantallasEmprendeCircular.length - 1);
  const pantalla = pantallasEmprendeCircular[indiceSeguro];

  useEffect(() => {
    if (indice !== indiceSeguro) onCambiarIndice(indiceSeguro);
  }, [indice, indiceSeguro, onCambiarIndice]);

  if (!pantalla) return null;

  const esUltima = indiceSeguro === pantallasEmprendeCircular.length - 1;

  return (
    <section className="space-y-8">
      <ol className="flex flex-wrap gap-2 print:hidden">
        {pantallasEmprendeCircular.map((p, i) => (
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
          Reto {pantalla.numero} de {pantallasEmprendeCircular.length} · {pantalla.nombre}
        </p>
        <h2 className="mt-1 text-3xl font-extrabold">{pantalla.tagline ?? pantalla.nombre}</h2>
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
