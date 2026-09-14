import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";

import { labs } from "@/data/labs";
import { adminLogin, adminLogout, listMvps, type MvpGuardado } from "@/lib/admin.functions";
import { aplanarCamposMisiones, esArrayMisiones, esArrayPlano } from "@/lib/respuestas-misiones";
import { VisorEcoTech } from "./VisorEcoTech";
import { VisorRespuestasMisiones } from "./VisorRespuestasMisiones";

function VisorRespuestas({ m }: { m: MvpGuardado }) {
  if (m.lab === "ecotech") {
    if (esArrayMisiones(m.respuestas)) {
      return <VisorEcoTech respuestas={aplanarCamposMisiones(m.respuestas)} />;
    }
    if (m.respuestas_ecotech) {
      return <VisorEcoTech respuestas={m.respuestas_ecotech} />;
    }
  }

  if (esArrayMisiones(m.respuestas)) {
    return <VisorRespuestasMisiones misiones={m.respuestas} />;
  }

  if (esArrayPlano(m.respuestas) && m.respuestas.length > 0) {
    return (
      <ul className="space-y-3">
        {m.respuestas.map((r, i) => (
          <li key={i} className="rounded-2xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-extrabold tracking-wider uppercase">{r.pregunta}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.respuesta}</p>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm text-muted-foreground">No hay respuestas registradas.</p>;
}

export function AdminDashboard() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [mvps, setMvps] = useState<MvpGuardado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [filtroColegio, setFiltroColegio] = useState("");
  const [filtroLab, setFiltroLab] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);

  const listar = useServerFn(listMvps);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);

  async function cargar() {
    setError(null);
    try {
      const data = await listar();
      setMvps(data);
      setAutenticado(true);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        setAutenticado(false);
      } else {
        setError("No pudimos cargar los MVPs guardados.");
        setAutenticado(false);
      }
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await login({ data: { password } });
      if (res.ok) {
        setPassword("");
        await cargar();
      } else {
        setError("Clave incorrecta.");
      }
    } catch {
      setError("No pudimos verificar la clave. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function onLogout() {
    try {
      await logout();
    } finally {
      setAutenticado(false);
      setMvps([]);
      setExpandido(null);
    }
  }

  const mvpsFiltrados = useMemo(() => {
    return mvps.filter((m) => {
      const coincideColegio =
        !filtroColegio.trim() ||
        m.colegio.toLowerCase().includes(filtroColegio.trim().toLowerCase());
      const coincideLab = !filtroLab || m.lab === filtroLab;
      return coincideColegio && coincideLab;
    });
  }, [mvps, filtroColegio, filtroLab]);

  function nombreLab(labId: string) {
    return labs.find((l) => l.id === labId)?.titulo ?? labId;
  }

  if (autenticado === null) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center text-muted-foreground">
        Cargando…
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-card">
          <h1 className="text-2xl font-extrabold">Panel admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Solo para el equipo CRA · ALITIC.</p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-bold"
            >
              {error}
            </div>
          )}

          <form onSubmit={onLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave del equipo"
              className="mt-5 w-full rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={cargando || !password}
              className="mt-4 w-full rounded-full bg-primary px-7 py-3 font-extrabold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {cargando ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Panel admin — MVPs</h1>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border-2 border-border px-5 py-2 text-sm font-extrabold text-muted-foreground hover:bg-muted"
        >
          Cerrar sesión
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-4 text-sm font-bold"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={filtroColegio}
          onChange={(e) => setFiltroColegio(e.target.value)}
          placeholder="Filtrar por colegio"
          className="rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={filtroLab}
          onChange={(e) => setFiltroLab(e.target.value)}
          className="rounded-2xl border-2 border-border bg-card p-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Todos los labs</option>
          {labs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.titulo}
            </option>
          ))}
        </select>
      </div>

      {mvpsFiltrados.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Aún no hay MVPs guardados.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {mvpsFiltrados.map((m) => {
            const abierto = expandido === m.id;
            return (
              <li key={m.id} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <button
                  type="button"
                  onClick={() => setExpandido(abierto ? null : m.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-xs font-extrabold tracking-widest text-primary uppercase">
                      {nombreLab(m.lab)} · {m.colegio || "Colegio sin dato"}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold">{m.nombre}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {m.brigada || "Brigada sin nombre"} ·{" "}
                      {format(new Date(m.created_at), "d MMM yyyy, HH:mm")}
                    </p>
                    {m.correo_lider && (
                      <p className="mt-1 text-sm text-muted-foreground">{m.correo_lider}</p>
                    )}
                  </div>
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">
                    {abierto ? "Ocultar" : "Ver documento"}
                  </span>
                </button>

                {abierto && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold tracking-widest uppercase">
                        Respuestas de la brigada
                      </h3>
                      <div className="mt-3">
                        <VisorRespuestas m={m} />
                      </div>
                    </div>
                    <article className="rounded-3xl border border-border bg-secondary/40 p-6">
                      <pre className="overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap">
                        {m.documento}
                      </pre>
                    </article>
                    <div className="rounded-3xl bg-deep p-6 text-deep-foreground">
                      <h3 className="text-sm font-extrabold tracking-widest uppercase">
                        Prompt para Lovable
                      </h3>
                      <pre className="mt-3 max-h-80 overflow-auto text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                        {m.prompt}
                      </pre>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
