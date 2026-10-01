import { createFileRoute } from "@tanstack/react-router";

import { TerraChallengeForm } from "@/components/mvp/TerraChallengeForm";
import { MvpHeader } from "@/components/mvp/MvpHeader";

export const Route = createFileRoute("/terra-challenge")({
  head: () => ({
    meta: [
      { title: "Terralab Challenge | Terra Lab Atlántico" },
      {
        name: "description",
        content:
          "El equipo carga su correo de líder, revisa colegio, terranautas y proyecto, y responde las preguntas de Terralab Challenge.",
      },
      { property: "og:title", content: "Terralab Challenge | Terra Lab Atlántico" },
      {
        property: "og:description",
        content: "Formulario de Terralab Challenge para las brigadas de Terra Lab Atlántico.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TerraChallengePage,
});

function TerraChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <MvpHeader />
      <TerraChallengeForm />
    </div>
  );
}
