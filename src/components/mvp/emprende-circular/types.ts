export type RetoProps = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
};
