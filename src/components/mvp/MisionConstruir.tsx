import { FileUploader } from "@/components/commons/FileUploader";

type Props = {
  valor: string;
  onCambiar: (valor: string) => void;
};

export function MisionConstruir({ valor, onCambiar }: Props) {
  return (
    <FileUploader
      valor={valor}
      onCambiar={onCambiar}
      titulo="Construir"
      ayuda="Suban una imagen o un video de lo que van a construir."
      alt="Archivo de construcción"
      etiquetaSubir="Subir imagen o video"
      etiquetaCambiar="Cambiar archivo"
      pista="PNG, JPG, MP4, WebM u otro formato compatible"
      accept="image/*,video/*"
      variante="card"
      maxHeightClass="max-h-72"
    />
  );
}
