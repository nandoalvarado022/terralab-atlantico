/** Clave compartida del estado Forja MVP en sessionStorage. */
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
