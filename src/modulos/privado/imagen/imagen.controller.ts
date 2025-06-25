import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { Imagen } from 'src/models/imagen/imagen';
import { v4 as uuidv4 } from 'uuid';

@Controller('imagen')
export class ImagenController {
  constructor(private readonly imagenService: ImagenService) {}

  // Consultar todas las imágenes por hamburguesa
  @Get('all/:codBurguer')
  public obtenerImagenes(@Param('codBurguer') codBurguer: string) {
    const codigo = Number(codBurguer);
    if (!isNaN(codigo)) {
      return this.imagenService.consultar(codigo);
    } else {
      return new HttpException(
        'Código de hamburguesa inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/add')
  public registrarImagen(
    @Body() objImagen: Imagen & { tipoProducto: string; codProducto: number },
  ): any {
    if (!objImagen.codProducto || !objImagen.formatoImagen) {
      throw new HttpException(
        'Faltan datos obligatorios para generar el nombre de la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Asegurar que el formato tenga la estructura 'image/png', 'image/jpeg', etc.
    const tipoParts = objImagen.formatoImagen.split('/');
    const extension = tipoParts.length === 2 ? tipoParts[1] : 'jpg'; // Valor por defecto

    // Generar nombre privado con UUID
    const nombrePrivado = `${objImagen.codProducto}_IMG${uuidv4()}.${extension}`;
    objImagen.nombrePrivadoImagen = nombrePrivado;

    return this.imagenService.registrar(objImagen);
  }

  // Consultar una imagen por código
  @Get('one/:codImagen')
  public consultarUnaImagen(@Param('codImagen') codImagen: string): any {
    const codigo = Number(codImagen);
    if (!isNaN(codigo)) {
      return this.imagenService.consultarUno(codigo);
    } else {
      return new HttpException(
        'Código de imagen no válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  // Actualizar imagen con el código en el cuerpo
  @Put('update')
  public actualizarImagen(@Body() objActualizar: Imagen): any {
    return this.imagenService.actualizar(
      objActualizar,
      objActualizar.codImagen,
    );
  }

  // Actualizar imagen con el código por parámetro
  @Put('update/:codImagen')
  public actualizarImagenPorParametro(
    @Body() objActualizar: Imagen,
    @Param('codImagen') codImagen: string,
  ): any {
    const codigo = Number(codImagen);
    if (!isNaN(codigo)) {
      return this.imagenService.actualizar(objActualizar, codigo);
    } else {
      return new HttpException(
        'Código de imagen no válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  // Eliminar imagen
  @Delete('delete/:codImagen')
  public eliminarImagen(@Param('codImagen') codImagen: string): any {
    const codigo = Number(codImagen);
    if (!isNaN(codigo)) {
      return this.imagenService.eliminar(codigo);
    } else {
      return new HttpException(
        'Código de imagen no válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  // Marcar imagen como favorita
  @Put('favorite/:codBurguer/:codImagen')
  public actualizarFavorita(@Param() parametros: any): any {
    const codBurguer = Number(parametros.codBurguer);
    const codImagen = Number(parametros.codImagen);

    if (!isNaN(codBurguer) && !isNaN(codImagen)) {
      return this.imagenService.favorito(codBurguer, codImagen);
    } else {
      return new HttpException('Códigos no válidos', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all/:tipo/:codigo')
  public obtenerImagenesGenerico(
    @Param('tipo') tipo: string,
    @Param('codigo') codigo: string,
  ) {
    const cod = Number(codigo);
    if (isNaN(cod)) {
      return new HttpException('Código inválido', HttpStatus.BAD_REQUEST);
    }
    return this.imagenService.consultarPorTipo(cod, tipo);
  }
}
