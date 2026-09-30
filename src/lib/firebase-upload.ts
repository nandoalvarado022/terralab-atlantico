import { getDownloadURL, ref, uploadBytesResumable, type UploadMetadata } from "firebase/storage";

import { getFirebaseStorage } from "./firebase-storage";

export type OpcionesSubida = {
  /** Carpeta dentro del bucket, p. ej. "evidencias/biodiversidad". */
  carpeta?: string;
  /** Nombre final del archivo. Si se omite se genera uno único conservando la extensión. */
  nombre?: string;
  /** Progreso de 0 a 100. */
  onProgreso?: (porcentaje: number) => void;
  metadata?: UploadMetadata;
};

export type ArchivoSubido = {
  url: string;
  ruta: string;
  nombre: string;
  tamano: number;
  contentType: string | undefined;
};

function nombreUnico(original: string | undefined): string {
  const punto = original?.lastIndexOf(".") ?? -1;
  const extension = original && punto > 0 ? original.slice(punto).toLowerCase() : "";
  return `${Date.now()}-${crypto.randomUUID()}${extension}`;
}

function normalizarCarpeta(carpeta: string | undefined): string {
  return (carpeta ?? "").replace(/^\/+|\/+$/g, "");
}

/** Sube un archivo a Firebase Storage y devuelve su URL pública de descarga. */
export function subirArchivo(
  archivo: File | Blob,
  opciones: OpcionesSubida = {},
): Promise<ArchivoSubido> {
  const nombreOriginal = archivo instanceof File ? archivo.name : undefined;
  const nombre = opciones.nombre ?? nombreUnico(nombreOriginal);
  const carpeta = normalizarCarpeta(opciones.carpeta);
  const ruta = carpeta ? `${carpeta}/${nombre}` : nombre;

  const metadata: UploadMetadata = {
    contentType: archivo.type || undefined,
    ...opciones.metadata,
  };

  const tarea = uploadBytesResumable(ref(getFirebaseStorage(), ruta), archivo, metadata);

  return new Promise((resolve, reject) => {
    tarea.on(
      "state_changed",
      (snapshot) => {
        if (!opciones.onProgreso || snapshot.totalBytes === 0) return;
        opciones.onProgreso(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(tarea.snapshot.ref);
          resolve({
            url,
            ruta,
            nombre,
            tamano: tarea.snapshot.totalBytes,
            contentType: tarea.snapshot.metadata.contentType,
          });
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}
