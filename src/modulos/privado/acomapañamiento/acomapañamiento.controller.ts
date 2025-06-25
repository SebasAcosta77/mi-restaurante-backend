import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AcomapañamientoService } from './acomapañamiento.service';
import { Acompañamiento } from 'src/models/acompañamiento/acompañamiento';
import { RolesGuardia } from 'src/common/guards/roles.guardia';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuardia)
@Controller('acomapanamiento')
export class AcomapañamientoController {
    constructor(private readonly acompanamientoService: AcomapañamientoService) { }
    //condultar todos los acompañamientos

    @Roles('Usuario', 'admin')
    @Get("/all")                   //traer data peticion get
    public obtenerAcompañamientos(): any {
        return this.acompanamientoService.consultar();
    }
    //Registrar un acompanamiento
    @Roles('admin')
    @Post("/add")
    public registrarAcompanamiento(@Body() objAcompanamiento:Acompañamiento):any{
        return this.acompanamientoService.registrar(objAcompanamiento);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codAcompañamiento") //:codAcompañamiento es un parametro
    public consultarUnAcompanamiento(@Param() parametro: any): any {
        const codigoAcompanamiento: number = Number(parametro.codAcompañamiento);
        if (!isNaN(codigoAcompanamiento)) {
            return this.acompanamientoService.consultarUno(codigoAcompanamiento);
        } else {
            return new HttpException("el codigo de el acompañamiento  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar acompanamiento
    @Roles('admin')
    @Put("/update")
    public actualizarAcompanamiento(@Body() objActualizar: Acompañamiento): any{
        return this.acompanamientoService.actualizar(objActualizar, objActualizar.codAcompañamiento);
    }
    //Actalizar acompanamiento por parametros
    @Roles('admin')
    @Put("/update/:codAcompañamiento") //:codAcompañamiento este es un parametro
    public actializarAcompanamientoParametro(@Body() objActualizar: Acompañamiento, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codAcompañamiento);
        if(!isNaN(codigo)){
            return this.acompanamientoService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de acompanamiento no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar acompanamiento
    @Roles('admin')
    @Delete("/delete/:codAcompañamiento")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarAcompañamiento(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codAcompañamiento); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.acompanamientoService.eliminar( codigo);

        }else{
            return new HttpException("codigo de acompañamiento no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }

     
}
