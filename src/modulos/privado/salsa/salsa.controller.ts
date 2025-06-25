import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SalsaService } from './salsa.service';
import { JwtGuard } from 'common/guards/jwt.guard';
import { RolesGuardia } from 'common/guards/roles.guardia';
import { Roles } from 'common/decorators/roles.decorator';
import { Salsa } from 'models/salsa/salsa';



@UseGuards(JwtGuard, RolesGuardia)
@Controller('salsa')
export class SalsaController {
    constructor(private readonly salsaService: SalsaService) { }
    //condultar todos las saldas
    @Roles('admin', 'Usuario')
    @Get("/all")                   //traer data peticion get
    public obtenerSalsa(): any {
        return this.salsaService.consultar();
    }
    //Registrar un salsa
    @Roles('admin')
    @Post("/add")
    public registrarSalsa(@Body() objSalsa:Salsa):any{
        return this.salsaService.registrar(objSalsa);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codSalsa")
    public consultarUnaSalsa(@Param() parametro: any): any {
        const codigoSalsa: number = Number(parametro.codSalsa);
        if (!isNaN(codigoSalsa)) {
            return this.salsaService.consultarUno(codigoSalsa);
        } else {
            return new HttpException("el codigo de la salsa  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar salsa
    @Roles('admin')
    @Put("/update")
    public actualizarSalsa(@Body() objActualizar: Salsa): any{
        return this.salsaService.actualizar(objActualizar, objActualizar.codSalsa);
    }
    //Actalizar salsa por parametros
    @Roles('admin')
    @Put("/update/:codSalsa")//get y delete no llevan body si no parametros    //:codUsuario este
    public actializarSalsaParametro(@Body() objActualizar: Salsa, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codSalsa);
        if(!isNaN(codigo)){
            return this.salsaService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de salsa no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar salsa
    @Roles('admin')
    @Delete("/delete/:codSalsa")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarSalsa(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codSalsa); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.salsaService.eliminar( codigo);

        }else{
            return new HttpException("codigo de salsa no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
