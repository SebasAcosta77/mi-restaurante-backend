import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { RolService } from './rol.service';

import { isEmpty } from 'rxjs';
import { Rol } from 'models/rol/rol';

@Controller('rol')
export class RolController {

    constructor(private readonly rolService: RolService) { }

    @Get("/all")                   //traer data peticion get
    public obtenerRoles(): any {
        return this.rolService.consultar();
    }
    //talleer lunes 2
    @Post("/add")
    public registrarRol(@Body() objRol: Rol): any {
        return this.rolService.registrar(objRol);
    }
//3
    @Get("/one/:codRol")
    public consultarUnrol(@Param() parametro: any): any {
        const codigoRol: number = Number(parametro.codRol);
        if (!isNaN(codigoRol)) {
            return this.rolService.consultarUno(codigoRol);
        } else {
            return new HttpException("el codigo del rol no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    @Put("/update")
    public actualizarRol(@Body() objActualizar: Rol): any{
        return this.rolService.actualizar(objActualizar, objActualizar.codRol);
    }
    @Put("/update/:codRol")
    public actializarRolParametro(@Body() objActualizar: Rol, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codRol);
        if(!isNaN(codigo)){
            return this.rolService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de rol no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    @Delete("/delete/:codRol")//get y delete no llevan body si no parametros
    public elimiarRol(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codRol);
        if(!isNaN(codigo)){
            return this.rolService.eliminar( codigo);

        }else{
            return new HttpException("codigo de rol no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }


}
