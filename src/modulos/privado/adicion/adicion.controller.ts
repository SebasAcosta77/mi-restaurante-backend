import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdicionService } from './adicion.service';
import { JwtGuard } from 'common/guards/jwt.guard';
import { RolesGuardia } from 'common/guards/roles.guardia';
import { Roles } from 'common/decorators/roles.decorator';
import { Adicion } from 'models/adicion/adicion';


@UseGuards(JwtGuard, RolesGuardia)

@Controller('adicion')
export class AdicionController {
    constructor(private readonly adicionService: AdicionService) { }
    //condultar todos las Adiciones

    @Roles('Usuario', 'admin')
    @Get("/all")                   //traer data peticion get
    public obtenerAdiciones(): any {
        return this.adicionService.consultar();
    }
    //Registrar un adicion
    @Roles('admin')
    @Post("/add")
    public registrarAdicion(@Body() objAdicion:Adicion):any{
        return this.adicionService.registrar(objAdicion);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codAdicion")
    public consultarUnaAdicion(@Param() parametro: any): any {
        const codigoAdicion: number = Number(parametro.codAdicion);
        if (!isNaN(codigoAdicion)) {
            return this.adicionService.consultarUno(codigoAdicion);
        } else {
            return new HttpException("el codigo de la adicion  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar adicion
    @Roles('admin')
    @Put("/update")
    public actualizarAdicion(@Body() objActualizar: Adicion): any{
        return this.adicionService.actualizar(objActualizar, objActualizar.codAdicion);
    }
    //Actalizar adicion por parametros
    @Roles('admin')
    @Put("/update/:codAdicion") //get y delete no llevan body si no parametros
    public actializaradicionParametro(@Body() objActualizar: Adicion, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codAdicion);
        if(!isNaN(codigo)){
            return this.adicionService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de adicion no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar membresia
    @Roles('admin')
    @Delete("/delete/:codAdicion")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarAdicion(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codAdicion); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.adicionService.eliminar( codigo);

        }else{
            return new HttpException("codigo de adicion no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
