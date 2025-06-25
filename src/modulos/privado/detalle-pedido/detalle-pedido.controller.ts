import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedido } from 'src/models/detalle-pedido/detalle-pedido';
import { RolesGuardia } from 'src/common/guards/roles.guardia';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuardia)
@Controller('detalle-pedido')
export class DetallePedidoController {
    constructor(private readonly detalleService: DetallePedidoService) { }
    //condultar todos las detalle
    @Roles('admin')
    @Get("/all")                   //traer data peticion get
    public obtenerDetalles(): any {
        return this.detalleService.consultar();
    }
    //Registrar un detalle
    @Roles('Usuario', 'admin')
    @Post("/add")
    public registrarDetalle(@Body() objdetalle:DetallePedido):any{
        return this.detalleService.registrar(objdetalle);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codDetalle")
    public consultarUndetalle(@Param() parametro: any): any {
        const codigoDetalle: number = Number(parametro.codDetalle);
        if (!isNaN(codigoDetalle)) {
            return this.detalleService.consultarUno(codigoDetalle);
        } else {
            return new HttpException("el codigo de detalle  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar membresia
    @Roles('Usuario', 'admin')
    @Put("/update")
    public actualizarDetalle(@Body() objActualizar: DetallePedido): any{
        return this.detalleService.actualizar(objActualizar, objActualizar.codDetalle);
    }
    //Actalizar membresia por parametros
     @Roles('Usuario', 'admin')
    @Put("/update/:codDetalle") //get y delete no llevan body si no parametros
    public actializarDetalleParametro(@Body() objActualizar: DetallePedido, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codDetalle);
        if(!isNaN(codigo)){
            return this.detalleService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de detalle no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar membresia
     @Roles( 'admin')
    @Delete("/delete/:codDetalle")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarDetalle(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codMembresia); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.detalleService.eliminar( codigo);

        }else{
            return new HttpException("codigo de detalle no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
