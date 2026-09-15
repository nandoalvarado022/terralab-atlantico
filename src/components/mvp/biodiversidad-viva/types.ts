export type MisionProps = {
  respuestas: Record<string, string>;
  onCambiar: (clave: string, valor: string) => void;
};
