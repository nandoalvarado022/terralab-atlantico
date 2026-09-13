import { FileUploader } from "@/components/commons/FileUploader";

type Props = {
  valor: string;
  onCambiar: (dataUrl: string) => void;
  titulo: string;
  ayuda: string;
  alt: string;
};

/** @deprecated Preferir `FileUploader` de `@/components/commons/FileUploader`. */
export function SubirImagenEcoFluencer({ valor, onCambiar, titulo, ayuda, alt }: Props) {
  return (
    <FileUploader
      valor={valor}
      onCambiar={onCambiar}
      titulo={titulo}
      ayuda={ayuda}
      alt={alt}
      variante="card"
    />
  );
}
