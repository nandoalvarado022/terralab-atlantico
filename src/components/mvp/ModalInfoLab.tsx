import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { labs } from "@/data/labs";
import { etiquetaCampoRespuesta, valorLegibleRespuesta } from "@/lib/etiquetas-respuestas";
import { esArrayMisiones, esArrayPlano, type RespuestaMision } from "@/lib/respuestas-misiones";
import { obtenerMvpLaboratorio, type MvpLaboratorio } from "@/lib/terra-challenge.functions";

type Bloque = {
  id: string;
  titulo: string;
  campos: Array<{ clave: string; valor: string }>;
};

function esImagen(valor: string) {
  return /^data:image\//i.test(valor) || /^https?:\/\/.+\.(png|jpe?g|gif|webp)(\?|$)/i.test(valor);
}

function bloquesRespuestas(mvp: MvpLaboratorio): Bloque[] {
  const respuestas = mvp.respuestas;

  if (esArrayMisiones(respuestas)) {
    return respuestas.map((mision) => bloqueMision(mision)).filter((b) => b.campos.length > 0);
  }

  if (esArrayPlano(respuestas)) {
    return [
      {
        id: "prd",
        titulo: "Preguntas del proyecto",
        campos: respuestas
          .filter((r) => r.respuesta.trim())
          .map((r) => ({ clave: r.pregunta, valor: r.respuesta })),
      },
    ];
  }

  const plano = mvp.respuestas_ecotech;
  if (plano && Object.keys(plano).length > 0) {
    return [
      {
        id: "ecotech",
        titulo: "Respuestas del laboratorio",
        campos: Object.entries(plano)
          .filter(([, valor]) => valor.trim())
          .map(([clave, valor]) => ({ clave, valor })),
      },
    ];
  }

  return [];
}

function bloqueMision(mision: RespuestaMision): Bloque {
  return {
    id: mision.id,
    titulo: `Misión ${mision.numero} · ${mision.nombre}${mision.tagline ? ` — ${mision.tagline}` : ""}`,
    campos: Object.entries(mision.campos)
      .filter(([, valor]) => (valor ?? "").trim())
      .map(([clave, valor]) => ({ clave, valor })),
  };
}

function TextoCampo({ clave, valor, plano }: { clave: string; valor: string; plano: boolean }) {
  const etiqueta = plano ? clave : etiquetaCampoRespuesta(clave);
  const visible = valorLegibleRespuesta(clave, valor);
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-xs font-extrabold tracking-wider uppercase">{etiqueta}</p>
      {esImagen(valor) ? (
        <img src={valor} alt={etiqueta} className="mt-2 max-h-48 rounded-xl object-contain" />
      ) : (
        <p className="mt-1 text-sm break-words whitespace-pre-wrap text-muted-foreground">
          {visible}
        </p>
      )}
    </div>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  if (!valor.trim()) return null;
  return (
    <div>
      <p className="text-xs font-extrabold tracking-wider uppercase">{etiqueta}</p>
      <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">{valor}</p>
    </div>
  );
}

export function ModalInfoLab({
  correo,
  abierto,
  onCerrar,
}: {
  correo: string;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const cargar = useServerFn(obtenerMvpLaboratorio);
  const [mvp, setMvp] = useState<MvpLaboratorio | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!abierto) return;
    let cancelado = false;
    setCargando(true);
    setError(null);
    cargar({ data: { correoLider: correo } })
      .then((fila) => {
        if (cancelado) return;
        setMvp(fila);
        if (!fila) setError("No encontramos la información de este laboratorio.");
      })
      .catch(() => {
        if (!cancelado) setError("No pudimos cargar la información del laboratorio.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [abierto, correo, cargar]);

  const lab = labs.find((l) => l.id === mvp?.lab);
  const bloques = mvp ? bloquesRespuestas(mvp) : [];
  const plano = Boolean(mvp && esArrayPlano(mvp.respuestas));

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Información del laboratorio</DialogTitle>
          <DialogDescription>
            {lab?.titulo ?? "Laboratorio"}
            {mvp?.nombre ? ` · ${mvp.nombre}` : ""}
          </DialogDescription>
        </DialogHeader>

        {cargando && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {error && (
          <p role="alert" className="text-sm font-bold">
            {error}
          </p>
        )}

        {mvp && !cargando && (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2">
              <Fila etiqueta="Colegio" valor={mvp.colegio ?? ""} />
              <Fila etiqueta="Brigada" valor={mvp.brigada ?? ""} />
              <Fila etiqueta="Lema" valor={mvp.lema ?? ""} />
              <Fila etiqueta="Correo del líder" valor={mvp.correo_lider ?? ""} />
              <Fila etiqueta="Terranautas" valor={mvp.integrantes ?? ""} />
              <Fila etiqueta="Desafío" valor={mvp.desafio ?? ""} />
              <Fila etiqueta="Idea semilla" valor={mvp.idea_semilla ?? ""} />
              <Fila etiqueta="Pistas" valor={mvp.pistas ?? ""} />
              <Fila etiqueta="Nombre del proyecto" valor={mvp.nombre ?? ""} />
            </section>

            <section>
              <h3 className="text-sm font-extrabold tracking-widest uppercase">
                Respuestas del laboratorio
              </h3>
              {bloques.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Este equipo aún no tiene respuestas guardadas.
                </p>
              ) : (
                <div className="mt-4 space-y-6">
                  {bloques.map((bloque) => (
                    <div key={bloque.id}>
                      <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
                        {bloque.titulo}
                      </p>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                        {bloque.campos.map((campo) => (
                          <li
                            key={campo.clave}
                            className={esImagen(campo.valor) ? "sm:col-span-2" : ""}
                          >
                            <TextoCampo clave={campo.clave} valor={campo.valor} plano={plano} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {mvp.documento?.trim() && (
              <section>
                <h3 className="text-sm font-extrabold tracking-widest uppercase">
                  Formulación del proyecto
                </h3>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-border bg-secondary/40 p-4 text-sm whitespace-pre-wrap">
                  {mvp.documento}
                </pre>
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
