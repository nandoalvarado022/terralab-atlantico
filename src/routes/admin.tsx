import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel admin | Terra Lab Atlántico" },
      {
        name: "description",
        content: "Panel interno CRA · ALITIC: MVPs generados por todas las brigadas.",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  return <AdminDashboard />;
}
