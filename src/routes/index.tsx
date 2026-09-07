import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/terralab-logo.jpg.asset.json";
import { labs, ruta, totalIdeas } from "@/data/labs";
import { BancoInspiracion } from "@/components/BancoInspiracion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terra Lab Atlántico | Banco de inspiración de retos escolares" },
      {
        name: "description",
        content:
          "Estrategia de educación ambiental e innovación escolar en el Atlántico. Explora 32 retos de inspiración en los labs Circular, Influencia, Biodiversidad y EcoTech.",
      },
      { property: "og:title", content: "Terra Lab Atlántico | Banco de inspiración" },
      {
        property: "og:description",
        content:
          "32 retos con problemática, proyecto innovador, prototipo e indicador para que los colegios diseñen soluciones ambientales.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const labAccent: Record<string, string> = {
  circular: "bg-lime text-lime-foreground",
  influencia: "bg-sun text-sun-foreground",
  biodiversidad: "bg-leaf text-leaf-foreground",
  ecotech: "bg-aqua text-aqua-foreground",
};

const paradigma = [
  ["De la charla ambiental pasiva", "A la experiencia e investigación activa"],
  ["De la sensibilización temporal", "Al cambio de hábitos medibles"],
  ["De la idea abstracta", "Al producto o prototipo funcional"],
  ["De la actividad dirigida por adultos", "Al liderazgo y autonomía estudiantil"],
  ["Del proyecto aislado de un año", "A una iniciativa institucional con continuidad"],
];

const motor = [
  ["Design Thinking", "El enfoque humano: empatizar con la comunidad, idear y prototipar."],
  ["Aprendizaje Basado en Retos", "El motor: investigar, actuar y resolver problemas reales."],
  ["Enfoque STEAM", "Las herramientas: ciencia, tecnología, ingeniería, arte y matemáticas."],
  ["Gamificación", "La motivación: un sistema de avance por misiones y logros."],
  ["Innovación Social", "El impacto: soluciones que modifican comportamientos y relaciones."],
];

const cronograma = [
  {
    zona: "Zona 1 · Preparación",
    items: [
      ["Apertura institucional", "Reunión y caracterización institucional", "24 ago 2026"],
      ["Conformación de equipos", "Selección de estudiantes y docentes", "ago – sep 2026"],
      ["1ª Experiencia (Activación)", "Activación de conocimientos", "sep 2026"],
      ["Misión Ecoauditoría", "Recopilación de datos y formulación del reto", "7 – 18 sep 2026"],
      ["2ª Experiencia (Laboratorios)", "Desarrollo de los cuatro labs", "14 – 21 sep 2026"],
    ],
  },
  {
    zona: "Zona 2 · Desarrollo escolar",
    items: [
      ["Diseño y construcción", "Estructuración de la solución", "14 – 25 sep 2026"],
      ["Mentoría de avance", "Visita de seguimiento a las instituciones", "14 – 25 sep 2026"],
      ["Presentación del reto", "Entrega de proyecto por cada colegio", "25 sep 2026"],
      ["Selección de semifinalistas", "Preselección para el bootcamp", "2 oct 2026"],
      ["Bootcamp de fortalecimiento", "Fortalecimiento de 20 proyectos", "12 – 16 oct 2026"],
    ],
  },
  {
    zona: "Zona 3 · Competencia y cierre",
    items: [
      ["Prototipo y pitch", "Feria CRA EcoChallenge ante jurado", "12 nov 2026"],
      ["Selección de ganadores", "Primer, segundo y tercer puesto por lab", "12 nov 2026"],
      ["Plan de continuidad", "Entrega de premios y medición de impacto", "16 – 20 nov 2026"],
    ],
  },
];

const colegios = [
  "Aspaen Corales",
  "Colegio Alemán Deutsche Schule",
  "British International School",
  "Altamira International School",
  "Colegio Hebreo Unión",
  "Colegio Real Royal School",
  "Colegio Campestre Bilingüe",
  "Marymount School Barranquilla",
  "Colegio San José Barranquilla",
  "Berckley International School",
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-2">
            <img src={logo.url} alt="Terra Lab Atlántico" className="h-10 w-auto" />
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold md:flex">
            <a href="#estrategia" className="hover:text-primary">
              Estrategia
            </a>
            <a href="#labs" className="hover:text-primary">
              Laboratorios
            </a>
            <a href="#banco" className="hover:text-primary">
              Banco de inspiración
            </a>
            <a href="#ruta" className="hover:text-primary">
              Ruta
            </a>
            <a href="#cronograma" className="hover:text-primary">
              Cronograma
            </a>
            <Link to="/mvp" className="hover:text-primary">
              Forja MVP
            </Link>
          </div>
          <a
            href="#banco"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Ver retos
          </a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-grain">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-lime bg-secondary px-4 py-1.5 text-xs font-extrabold tracking-widest uppercase">
                CRA · ALITIC · Atlántico 2026
              </span>
              <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold text-balance-tight sm:text-6xl lg:text-7xl">
                Ideas sostenibles que{" "}
                <span className="text-primary">transforman territorios</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Terra Lab Atlántico convierte el colegio en un laboratorio de ideas: los
                estudiantes investigan retos reales de su entorno y construyen prototipos con
                impacto medible.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#banco"
                  className="rounded-full bg-deep px-7 py-3.5 font-extrabold text-deep-foreground shadow-pop transition-transform hover:-translate-y-0.5"
                >
                  Explorar el banco de inspiración
                </a>
                <a
                  href="#labs"
                  className="rounded-full border-2 border-deep px-7 py-3.5 font-extrabold transition-colors hover:bg-secondary"
                >
                  Conocer los 4 labs
                </a>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {[
                  [totalIdeas, "retos de inspiración"],
                  ["10", "colegios laboratorio"],
                  ["4", "laboratorios temáticos"],
                ].map(([n, l]) => (
                  <div key={l as string}>
                    <dt className="font-display text-4xl font-extrabold text-primary">{n}</dt>
                    <dd className="mt-1 text-sm font-bold text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-secondary" />
              <img
                src={logo.url}
                alt="Logo de Terra Lab Atlántico"
                className="mx-auto w-full max-w-md rounded-[2.5rem] bg-card p-6 shadow-card"
              />
            </div>
          </div>
        </section>

        {/* ESTRATEGIA */}
        <section id="estrategia" className="scroll-mt-24 bg-deep py-20 text-deep-foreground">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="text-4xl font-extrabold sm:text-5xl">
                  ¿Por qué nace esta estrategia?
                </h2>
                <p className="mt-5 text-lg leading-relaxed opacity-85">
                  Los colegios enfrentan retos ambientales por la generación de residuos, el
                  consumo, la pérdida de biodiversidad, el uso de los recursos y la poca
                  participación juvenil. TerraLAB convierte esos retos en oportunidades de
                  aprendizaje, innovación y acción: los estudiantes pasan de conocer los
                  problemas a diseñar soluciones para su entorno.
                </p>
                <p className="mt-4 text-lg leading-relaxed opacity-85">
                  Está dirigida a estudiantes de 3.º de primaria a 9.º grado, acompañados por
                  docentes facilitadores, directivos, familias y expertos aliados.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold tracking-widest uppercase opacity-70">
                  Del paradigma tradicional al modelo TerraLAB
                </h3>
                {paradigma.map(([antes, despues]) => (
                  <div
                    key={antes}
                    className="grid items-center gap-2 rounded-2xl border border-white/15 p-4 sm:grid-cols-[1fr_auto_1fr]"
                  >
                    <p className="text-sm opacity-60 line-through">{antes}</p>
                    <span className="font-display text-lime">→</span>
                    <p className="text-sm font-bold">{despues}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LABS */}
        <section id="labs" className="scroll-mt-24 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-4xl font-extrabold text-balance-tight sm:text-5xl">
              4 laboratorios temáticos para la innovación
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Cada equipo elige un lab y recorre la misma secuencia: activar, explorar,
              prototipar y cerrar con un pitch.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {labs.map((lab) => (
                <article
                  key={lab.id}
                  className="rounded-3xl border border-border bg-card p-7 shadow-card"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${labAccent[lab.id]}`}
                  >
                    {lab.emoji}
                  </div>
                  <p className="mt-5 text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
                    {lab.nombre}
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold">{lab.titulo}</h3>
                  <p className="mt-1 font-bold text-primary">{lab.claim}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lab.foco}</p>
                  <a
                    href="#banco"
                    className="mt-5 inline-block text-sm font-extrabold underline decoration-2 underline-offset-4 hover:text-primary"
                  >
                    Ver sus {lab.ideas.length} retos
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <BancoInspiracion />

        {/* RUTA */}
        <section id="ruta" className="scroll-mt-24 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-4xl font-extrabold sm:text-5xl">La ruta: el viaje del equipo</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Ocho pasos, dos grandes momentos: comprender el territorio y actuar sobre él.
            </p>
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ruta.map((p) => (
                <li
                  key={p.n}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl font-extrabold text-lime">
                      {String(p.n).padStart(2, "0")}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase">
                      {p.fase}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold">{p.nombre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
              {motor.map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-secondary p-5">
                  <h3 className="font-extrabold">{t}</h3>
                  <p className="mt-2 text-sm text-secondary-foreground/80">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CRONOGRAMA */}
        <section id="cronograma" className="scroll-mt-24 bg-sand py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-4xl font-extrabold sm:text-5xl">Momentos del proyecto</h2>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {cronograma.map((z) => (
                <div key={z.zona} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="text-lg font-extrabold text-primary">{z.zona}</h3>
                  <ul className="mt-5 space-y-5">
                    {z.items.map(([t, d, f]) => (
                      <li key={t} className="border-l-2 border-lime pl-4">
                        <p className="font-extrabold">{t}</p>
                        <p className="text-sm text-muted-foreground">{d}</p>
                        <p className="mt-1 text-xs font-extrabold tracking-wider uppercase">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COLEGIOS */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-3xl text-4xl font-extrabold text-balance-tight sm:text-5xl">
              10 instituciones del Atlántico se convierten en laboratorios vivos
            </h2>
            <ul className="mt-10 flex flex-wrap gap-3">
              {colegios.map((c) => (
                <li
                  key={c}
                  className="rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-bold"
                >
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-16 rounded-[2.5rem] bg-deep p-10 text-deep-foreground sm:p-14">
              <h3 className="text-3xl font-extrabold sm:text-4xl">Beneficios para el colegio</h3>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  "Fortalece el PRAE con experiencias prácticas e innovadoras.",
                  "Forma estudiantes líderes y agentes de transformación ambiental.",
                  "Desarrolla creatividad, pensamiento crítico y trabajo en equipo.",
                  "Ofrece acompañamiento, metodología y recursos especializados.",
                  "Crea soluciones para problemáticas ambientales reales del colegio.",
                  "Posiciona a la institución como referente en sostenibilidad.",
                ].map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-lime" />
                    <span className="opacity-90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
          <img src={logo.url} alt="Terra Lab Atlántico" className="h-14 w-auto" />
          <p className="max-w-md text-sm text-muted-foreground">
            Una estrategia de la Corporación Autónoma Regional del Atlántico (CRA) y ALITIC.
            TerraLAB: ideas sostenibles que transforman territorios.
          </p>
        </div>
      </footer>
    </div>
  );
}
