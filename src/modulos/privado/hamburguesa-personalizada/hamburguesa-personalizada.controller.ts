import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { HamburguesaPersonalizadaService } from './hamburguesa-personalizada.service';
import { HamburguesaPersonalizada } from 'models/hamburguesa-personalizada/hamburguesa-personalizada';


@Controller('hamburguesa-personalizada')
export class HamburguesaPersonalizadaController {
    constructor(private readonly burguerService: HamburguesaPersonalizadaService) { }
    //condultar todos las burguer
    @Get("/all")                   //traer data peticion get
    public obtenerBurguer(): any {
        return this.burguerService.consultar();
    }
    //Registrar un asistente
    @Post("/add")
    public registrarBurguer(@Body() objBurguer:HamburguesaPersonalizada):any{
        return this.burguerService.registrar(objBurguer);
    }
    //consultar uno
    @Get("/one/:codHaburguesaPerso")
    public consultarUaMembresia(@Param() parametro: any): any {
        const codigoBurguer: number = Number(parametro.codHaburguesaPerso);
        if (!isNaN(codigoBurguer)) {
            return this.burguerService.consultarUno(codigoBurguer);
        } else {
            return new HttpException("el codigo de la burguer  no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar burguer
    @Put("/update")
    public actualizarBurguer(@Body() objActualizar: HamburguesaPersonalizada): any{
        return this.burguerService.actualizar(objActualizar, objActualizar.codHaburguesaPerso);
    }
    //Actalizar burguer por parametros
    @Put("/update/:codHaburguesaPerso")//get y delete no llevan body si no parametros    //:codUsuario este
    public actializarburguerParametro(@Body() objActualizar: HamburguesaPersonalizada, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codHaburguesaPerso);
        if(!isNaN(codigo)){
            return this.burguerService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de buguer no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar burguer
    @Delete("/delete/:codHaburguesaPerso")//get y delete no llevan body si no parametros    //:codUsuario este
    public elimiarBurguer(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codHaburguesaPerso); //:codUsuario es el mismo
        if(!isNaN(codigo)){
            return this.burguerService.eliminar( codigo);

        }else{
            return new HttpException("codigo de burguer no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
