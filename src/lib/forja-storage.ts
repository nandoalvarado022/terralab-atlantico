/** Clave compartida del estado Forja MVP en localStorage (persiste al cerrar el navegador). */
export const FORJA_STORAGE_KEY = "terralab-forja-mvp";

export function isTerralabDevFillEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (Boolean(import.meta.env.DEV)) return true;
  try {
    return window.localStorage.getItem("terralab-dev-fill") === "1";
  } catch {
    return false;
  }
}

/** Lee el JSON guardado. Migra una sola vez desde sessionStorage si aún no hay localStorage. */
export function leerForjaStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const local = window.localStorage.getItem(FORJA_STORAGE_KEY);
    if (local) return local;

    const sesion = window.sessionStorage.getItem(FORJA_STORAGE_KEY);
    if (sesion) {
      window.localStorage.setItem(FORJA_STORAGE_KEY, sesion);
      window.sessionStorage.removeItem(FORJA_STORAGE_KEY);
      return sesion;
    }
  } catch {
    // storage no disponible
  }
  return null;
}

/** Persiste el estado Forja (solo se borra con “Empezar con otra brigada”). */
export function escribirForjaStorage(json: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FORJA_STORAGE_KEY, json);
  } catch {
    // cuota llena u otro error: el avance sigue en memoria
  }
}

/** Borra el estado Forja de localStorage y limpia restos en sessionStorage. */
export function borrarForjaStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(FORJA_STORAGE_KEY);
  } catch {
    // sin storage
  }
  try {
    window.sessionStorage.removeItem(FORJA_STORAGE_KEY);
  } catch {
    // sin storage
  }
}
