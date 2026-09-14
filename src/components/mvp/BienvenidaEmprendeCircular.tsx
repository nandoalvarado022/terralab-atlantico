import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import personaje from "@/assets/images/character-emprende-circular.png";

const TEXTO = "BIENVENIDOS AL WORKBOOK DE EMPRENDE CIRCULAR";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

function TituloAnimado({ texto, reiniciar }: { texto: string; reiniciar: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!reiniciar) return;
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [reiniciar, texto]);

  if (!visible) {
    return (
      <h2 className="min-h-[3.5rem] text-center text-lg font-extrabold tracking-wide text-deep uppercase sm:text-xl" />
    );
  }

  return (
    <h2
      className="flex flex-wrap justify-center gap-x-[0.12em] gap-y-1 text-center text-lg font-extrabold tracking-wide text-deep uppercase sm:text-xl"
      aria-label={texto}
    >
      {texto.split("").map((char, i) =>
        char === " " ? (
          <span key={`sp-${i}`} className="inline-block w-[0.35em]" aria-hidden>
            {" "}
          </span>
        ) : (
          <span
            key={`${char}-${i}`}
            className="motion-safe:animate-letra-caida motion-reduce:animate-none inline-block"
            style={{ animationDelay: `${i * 45}ms` }}
            aria-hidden
          >
            {char}
          </span>
        ),
      )}
    </h2>
  );
}

export function BienvenidaEmprendeCircular({ abierto, onCerrar }: Props) {
  return (
    <Dialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <DialogContent className="max-w-md overflow-hidden border-2 border-primary/30 bg-card sm:rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Bienvenida Emprende Circular</DialogTitle>
          <DialogDescription>
            Modal de bienvenida al workbook de Emprende Circular.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 px-1 pb-2 pt-4 text-center">
          <img
            src={personaje}
            alt="Personaje Emprende Circular"
            className="mx-auto h-auto max-h-56 w-auto object-contain drop-shadow-md"
          />

          <TituloAnimado texto={TEXTO} reiniciar={abierto} />

          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            ¡Empezar!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
