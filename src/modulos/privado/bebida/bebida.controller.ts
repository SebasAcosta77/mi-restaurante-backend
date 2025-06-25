import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BebidaService } from './bebida.service';
import { Bebida } from 'src/models/bebida/bebida';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuardia } from 'src/common/guards/roles.guardia';
import { JwtGuard } from 'src/common/guards/jwt.guard';


@UseGuards(JwtGuard, RolesGuardia)
@Controller('bebida')
export class BebidaController {
    constructor(private readonly bebidaService: BebidaService) { }
    //condultar todos las bebidas
    @Roles('Usuario', 'admin')
    @Get("/all")                   //traer data peticion get
    public obtenerBebidas(): any {
        return this.bebidaService.consultar();
    }
    //Registrar un asistente
    @Roles('admin')
    @Post("/add")
    public registrarBebida(@Body() objBebdia:Bebida):any{
        return this.bebidaService.registrar(objBebdia);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codBebida")
    public consultrunaBebida(@Param() parametro: any): any {
        const codigobebida: number = Number(parametro.codBebida);
        if (!isNaN(codigobebida)) {
            return this.bebidaService.consultarUno(codigobebida);
        } else {
            return new HttpException("el codigo de la bebdia  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar bebida
    @Roles('admin')
    @Put("/update")
    public actualizarBebida(@Body() objActualizar: Bebida): any{
        return this.bebidaService.actualizar(objActualizar, objActualizar.codBebida);
    }
    //Actalizar bebdia por parametros
    @Roles('admin')
    @Put("/update/:codBebida")//get y delete no llevan body si no parametros    //:codUsuario este
    public actializarBebdiaParametro(@Body() objActualizar: Bebida, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codBebida);
        if(!isNaN(codigo)){
            return this.bebidaService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de bebida no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar membresia
    @Roles('admin')
    @Delete("/delete/:codBebida")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarMebresia(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codBebida); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.bebidaService.eliminar( codigo);

        }else{
            return new HttpException("codigo de membresia no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
