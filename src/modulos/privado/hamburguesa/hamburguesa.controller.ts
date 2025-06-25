import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { HamburguesaService } from './hamburguesa.service';
import { Hamburguesa } from 'src/models/hamburguesa/hamburguesa';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuardia } from 'src/common/guards/roles.guardia';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuardia)
@Controller('hamburguesa')
export class HamburguesaController {
    constructor(private readonly burguerService: HamburguesaService) { }
    //condultar todos las burguers
    @Roles('admin', 'Usuario')
    @Get("/all")                   //traer data peticion get
    public obtenerBurguer(): any {
        return this.burguerService.consultar();
    }
    //Registrar un burguer
    @Roles('admin')
    @Post("/add")
    public registrarBurguer(@Body() objBurguer:Hamburguesa):any{
        return this.burguerService.registrar(objBurguer);
    }
    //consultar uno
    @Roles('Usuario', 'admin')
    @Get("/one/:codHamburguesa")
    public consultarUnaburguer(@Param() parametro: any): any {
        const codigoBirguer: number = Number(parametro.codHamburguesa);
        if (!isNaN(codigoBirguer)) {
            return this.burguerService.consultarUno(codigoBirguer);
        } else {
            return new HttpException("el codigo de la burguer  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    //actualizar burguer
    @Roles('admin')
    @Put("/update")
    public actualizarBurguer(@Body() objActualizar: Hamburguesa): any{
        return this.burguerService.actualizar(objActualizar, objActualizar.codHamburguesa);
    }
    //Actalizar burguer por parametros
    @Roles('admin')
    @Put("/update/:codHamburguesa") //get y delete no llevan body si no parametros
    public actializarburguerParametro(@Body() objActualizar: Hamburguesa, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codHamburguesa);
        if(!isNaN(codigo)){
            return this.burguerService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de burguer no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar burguer
    @Roles('admin')
    @Delete("/delete/:codHamburguesa")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarBurguer(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codHamburguesa); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.burguerService.eliminar( codigo);

        }else{
            return new HttpException("codigo de burguer no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
