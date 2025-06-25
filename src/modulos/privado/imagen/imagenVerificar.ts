import { existsSync, readFileSync, unlinkSync } from 'fs';
import rutasImagenes from '../../../utilidades/dominios/var_imagenes';
import { Imagen } from 'models/imagen/imagen';
import AdministrarImagenes from 'utilidades/funciones/administrarImagenes';


class ImagenVerificar {
  public static consultarBase64(registros: Imagen[]): Imagen[] {
    return registros.map((objImagen) => {
      try {
        const rutaOriginal = rutasImagenes.rutaFotoSistema + objImagen.nombrePrivadoImagen;
        let base64: string;

        if (existsSync(rutaOriginal)) {
          const rutaReducida = rutasImagenes.rutaFotostemporal + objImagen.nombrePrivadoImagen;

          AdministrarImagenes.gestionarTamanoImagen(rutaOriginal, 500, rutaReducida);

          base64 = readFileSync(rutaReducida, 'base64');
          unlinkSync(rutaReducida);
        } else {
          base64 = readFileSync(rutasImagenes.fotoDefecto, 'base64');
        }

        objImagen.base64Imagen = base64;
      } catch (error) {
        console.error(`Error al procesar imagen ${objImagen.nombrePrivadoImagen}:`, error);
        objImagen.base64Imagen = readFileSync(rutasImagenes.fotoerror, 'base64');
      }

      return objImagen;
    });
  }
}

export default ImagenVerificar;
