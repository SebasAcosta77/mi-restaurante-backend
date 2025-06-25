import { mkdirSync, existsSync, unlink, writeFileSync } from "fs";
import * as path from "path";
import * as sharp from "sharp";

class AdministrarImagenes {
  public static agregarImagen(nombrePublicoImagen: string, base64: string, rutaAlmacenamientoImagen: string): void {
    try {
      // 1. Decodificar la imagen base64
      const decodificacion = base64.replace(/^data:image\/\w+;base64,/, "");

      // 2. Crear directorio si no existe
      if (!existsSync(rutaAlmacenamientoImagen)) {
        mkdirSync(rutaAlmacenamientoImagen, { recursive: true });
      }

      // 3. Construir ruta completa
      const rutaCompleta = path.join(rutaAlmacenamientoImagen, nombrePublicoImagen);

      // 4. Escribir la imagen al disco
      writeFileSync(rutaCompleta, decodificacion, { encoding: "base64" });

      console.log("Imagen guardada correctamente:", rutaCompleta);
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
    }
  }

  public static removerImagen(nombrePrivadoImagen: string, rutaAlmacenamientoImagen: string): void {
    const rutaCompleta = path.join(rutaAlmacenamientoImagen, nombrePrivadoImagen);
    unlink(rutaCompleta, (error) => {
      if (error) {
        console.error(" Fallo al eliminar la imagen:", error.message);
      } else {
        console.log("Imagen eliminada correctamente:", rutaCompleta);
      }
    });
  }

  public static gestionarTamanoImagen(nombrePrivadoImagen: string, tamanoImagen: number, imagenModificada: string): Promise<any> {
    return sharp(nombrePrivadoImagen)
      .resize({ width: tamanoImagen })
      .toFile(imagenModificada)
      .then(info => {
        console.log(" Imagen redimensionada:", info);
        return info;
      })
      .catch(error => {
        console.error("Error al redimensionar imagen:", error);
        throw error;
      });
  }
}

export default AdministrarImagenes;
