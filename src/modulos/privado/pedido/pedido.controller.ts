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
  Req,
  UseGuards,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { JwtGuard } from 'common/guards/jwt.guard';
import { RolesGuardia } from 'common/guards/roles.guardia';
import { Roles } from 'common/decorators/roles.decorator';
import { Pedido } from 'models/pedido/pedido';


@UseGuards(JwtGuard, RolesGuardia)
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}
  //condultar todos las pedido
  @Roles('admin')
  @Get('/all') //traer data peticion get
  public obtenerPedido(): any {
    return this.pedidoService.consultar();
  }
  //Registrar un pedido
  @Roles('Usuario', 'admin')
  @Post('/add')
  public registrarPedido(@Body() body: any): any {
    
    return this.pedidoService.registrar(body);
  }
  //consultar uno
  @Roles('Usuario', 'admin')
  @Get('/one/:codPedido')
  public consultarUnPedido(@Param() parametro: any): any {
    const codigoPedido: number = Number(parametro.codPedido);
    if (!isNaN(codigoPedido)) {
      return this.pedidoService.consultarUno(codigoPedido);
    } else {
      return new HttpException(
        'el codigo de la pedido  no es valido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  //actualizar pedido
  @Put('/update')
  public actualizarPedido(@Body() objActualizar: Pedido): any {
    return this.pedidoService.actualizar(
      objActualizar,
      objActualizar.codPedido,
    );
  }

  @Roles('Usuario', 'admin')
  @Put('/update/:codPedido')
  public actualizarPedidoCompleto(
    @Param('codPedido') codPedido: number,
    @Body() body: any,
  ): any {
    const codigo = Number(codPedido);
    if (isNaN(codigo)) {
      throw new HttpException(
        'Código de pedido no válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return this.pedidoService.actualizarPedidoCompleto(codigo, body);
  }

  //eliminar pedido
  @Roles('admin')
  @Delete('/delete/:codPedido') //get y delete no llevan body si no parametros    //:codUsuario este
  public elimiarPedido(@Param() parametros: any): any {
    const codigo: number = Number(parametros.codPedido); //:codUsuario es el mismo
    if (!isNaN(codigo)) {
      return this.pedidoService.eliminar(codigo);
    } else {
      return new HttpException(
        'codigo de pedido no valido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Roles('Usuario', 'admin')
  @Put('/cambiar-estado/:codPedido')
  public cambiarEstadoPedido(
    @Param('codPedido') codPedido: number,
    @Body() body: { estado: string },
  ): any {
    if (!codPedido || isNaN(codPedido)) {
      return new HttpException(
        'Código de pedido no válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!body.estado || typeof body.estado !== 'string') {
      return new HttpException(
        'Estado no proporcionado o inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.pedidoService.cambiarEstado(codPedido, body.estado);
  }

  @Roles('Usuario', 'admin')
  @Put('/cancelar/:codPedido')
  // Solo usuarios autenticados pueden cancelar
  public cancelarPedido(@Param('codPedido') codPedido: number): any {
    if (!codPedido || isNaN(codPedido)) {
      throw new HttpException(
        'Código de pedido inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.pedidoService.cancelarPedido(codPedido);
  }
  @Roles('Usuario', 'admin')
  @Get('historial')
  async obtenerHistorial(@Req() req) {
    const codUsuario = req.user?.id;
    if (!codUsuario) {
      throw new Error('Usuario no autenticado');
    }
    return this.pedidoService.obtenerPedidosPorUsuario(codUsuario);
  }
}
