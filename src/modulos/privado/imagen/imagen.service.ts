import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Imagen } from 'src/models/imagen/imagen';
import { DataSource, Repository } from 'typeorm';
import rutasImagen from '../../../utilidades/dominios/var_imagenes';
import AdministrarImagen from '../../../utilidades/funciones/administrarImagenes';
import ImagenVerificar from './imagenVerificar';
import { SQL_IMAGEN } from './imagen_sql';

@Injectable()
export class ImagenService {
  private imagenRepositorio: Repository<Imagen>;

  constructor(private poolConexion: DataSource) {
    this.imagenRepositorio = poolConexion.getRepository(Imagen);
  }

  public async consultar(codHamburguesa: number): Promise<any> {
    try {
      const arrImagenes = await this.imagenRepositorio.findBy({
        codHamburguesa,
      });
      return ImagenVerificar.consultarBase64(arrImagenes);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Fallo al consultar imágenes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verificarImagen(nombre: string): Promise<boolean> {
    try {
      const existe = await this.imagenRepositorio.findBy({
        nombrePublicoImagen: nombre,
      });
      return existe.length > 0;
    } catch (error) {
      throw new HttpException(
        'No hay envío de información',
        HttpStatus.CONFLICT,
      );
    }
  }

  public async registrar(
    objImagen: Imagen & { tipoProducto: string; codProducto: number },
  ): Promise<any> {
    try {
      // 1. Determinar ruta según tipo de producto y asignar ID correspondiente
      let rutaUbicacionimagen: string;

      objImagen.codHamburguesa = null;
      objImagen.codBebida = null;
      objImagen.codSalsa = null;
      objImagen.codAcompanamiento = null;
      objImagen.codAdicion = null;

      switch (objImagen.tipoProducto) {
        case 'hamburguesa':
          rutaUbicacionimagen = rutasImagen.rutaFotosSitio;
          objImagen.codHamburguesa = objImagen.codProducto;
          break;
        case 'bebida':
          rutaUbicacionimagen = rutasImagen.rutaFotosBebida;
          objImagen.codBebida = objImagen.codProducto;
          break;
        case 'acompanamiento':
          rutaUbicacionimagen = rutasImagen.rutaFotosAcompanamiento;
          objImagen.codAcompanamiento = objImagen.codProducto;
          break;
        case 'salsa':
          rutaUbicacionimagen = rutasImagen.rutaFotosSalsa;
          objImagen.codSalsa = objImagen.codProducto;
          break;
        case 'adicion':
          rutaUbicacionimagen = rutasImagen.rutaFotosAdicion;
          objImagen.codAdicion = objImagen.codProducto;
          break;
        default:
          throw new HttpException(
            'Tipo de producto no válido',
            HttpStatus.BAD_REQUEST,
          );
      }

      // 2. Eliminar campo auxiliar que no va en la base de datos
      delete objImagen.codProducto;

      // 3. Guardar la imagen en el sistema de archivos
      AdministrarImagen.agregarImagen(
        objImagen.nombrePrivadoImagen,
        objImagen.base64Imagen,
        rutaUbicacionimagen,
      );

      // 4. Eliminar base64 antes de guardar en la base de datos
      delete objImagen.base64Imagen;

      // 5. Guardar en la base de datos
      return await this.imagenRepositorio.save(objImagen);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Fallo al hacer el registro',
        HttpStatus.CONFLICT,
      );
    }
  }

  public async consultarUno(codigo: number): Promise<any> {
    try {
      return this.imagenRepositorio.findBy({ codImagen: codigo });
    } catch (error) {
      throw new HttpException(
        'Fallo al consultar la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async actualizar(objImagen: Imagen, codigo: number): Promise<any> {
    try {
      const existe = await this.verificarImagen(objImagen.nombrePublicoImagen);
      if (existe) {
        return new HttpException('La imagen ya existe', HttpStatus.BAD_REQUEST);
      }

      const resultado = await this.imagenRepositorio.update(
        { codImagen: codigo },
        objImagen,
      );
      return { mensaje: 'Imagen actualizada', objeto: resultado };
    } catch (error) {
      throw new HttpException(
        'Fallo al actualizar imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async eliminar(codigoImg: number): Promise<any> {
    try {
      const ruta = rutasImagen.rutaFotosSitio;
      const imagen = await this.imagenRepositorio.findOne({
        where: { codImagen: codigoImg },
      });

      if (!imagen) {
        throw new HttpException('Imagen no encontrada', HttpStatus.NOT_FOUND);
      }

      await this.imagenRepositorio.delete({ codImagen: codigoImg });
      AdministrarImagen.removerImagen(imagen.nombrePrivadoImagen, ruta);

      if (imagen.favoritoImagen === 1) {
        await this.imagenRepositorio.query(SQL_IMAGEN.cambiar_favo, [
          imagen.codHamburguesa,
        ]);
      }

      return { mensaje: 'Imagen eliminada correctamente' };
    } catch (error) {
      throw new HttpException(
        'Fallo al eliminar la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async favorito(
    codHamburguesa: number,
    codImagen: number,
  ): Promise<any> {
    try {
      // Desactivar anterior favorito
      await this.imagenRepositorio.update(
        { codHamburguesa },
        { favoritoImagen: 2 },
      );
      // Activar nuevo favorito
      await this.imagenRepositorio.update({ codImagen }, { favoritoImagen: 1 });

      return { mensaje: 'Imagen marcada como favorita' };
    } catch (error) {
      throw new HttpException(
        'Fallo al actualizar imagen favorita',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async consultarPorTipo(codigo: number, tipo: string): Promise<any> {
    try {
      let where = {};
      switch (tipo) {
        case 'hamburguesa':
          where = { codHamburguesa: codigo };
          break;
        case 'bebida':
          where = { codBebida: codigo };
          break;
        case 'acompanamiento':
          where = { codAcompanamiento: codigo };
          break;
        case 'adicion':
          where = { codAdicion: codigo };
          break;
        case 'salsa':
          where = { codSalsa: codigo };
          break;
        default:
          throw new HttpException('Tipo no válido', HttpStatus.BAD_REQUEST);
      }

      const imagenes = await this.imagenRepositorio.findBy(where);
      return ImagenVerificar.consultarBase64(imagenes);
    } catch (error) {
      throw new HttpException(
        'Error al consultar imágenes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
