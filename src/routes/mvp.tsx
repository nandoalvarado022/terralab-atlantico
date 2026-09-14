import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { ForjaMvp } from "@/components/mvp/ForjaMvp";
import { MvpHeader } from "@/components/mvp/MvpHeader";
import { installDevFillEcoFluencer } from "@/lib/dev-fill-ecofluencer";
import { installDevFillEmprendeCircular } from "@/lib/dev-fill-emprende-circular";

export const Route = createFileRoute("/mvp")({
  head: () => ({
    meta: [
      { title: "Forja MVP | Terra Lab Atlántico" },
      {
        name: "description",
        content:
          "Del canvas impreso al prototipo en Lovable: la brigada carga su canvas, elige el lab, responde el PRD y obtiene el documento de MVP con el prompt listo para vibecoding.",
      },
      { property: "og:title", content: "Forja MVP | Terra Lab Atlántico" },
      {
        property: "og:description",
        content:
          "Guía paso a paso para que cada brigada convierta su canvas de Terra Lab en un MVP listo para construir en Lovable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mvp,
});

function Mvp() {
  useEffect(() => {
    // Siempre registrar en /mvp (el visitante ya está en la herramienta de forja).
    installDevFillEcoFluencer({ force: true });
    installDevFillEmprendeCircular({ force: true });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MvpHeader />
      <ForjaMvp />
    </div>
  );
}
