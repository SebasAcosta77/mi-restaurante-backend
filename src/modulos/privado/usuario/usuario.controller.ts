import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from 'models/usuario/usuario';


@Controller('/usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }
//condultar todos los usuarios
    @Get("/all")                   //traer data peticion get
    public obtenerUsuario(): any {
        return this.usuarioService.consultar();
    }
    //Registrar un usuario
    @Post("/add")
    public registrarUsuario(@Body() objUsuario:Usuario):any{
        return this.usuarioService.registrar(objUsuario);
    }
    //consultar uno
    @Get("/one/:codUsuario")
    public consultarUnUsuario(@Param() parametro: any): any {
        const codigoUsuario: number = Number(parametro.codUsuario);
        if (!isNaN(codigoUsuario)) {
            return this.usuarioService.consultarUno(codigoUsuario);
        } else {
            return new HttpException("el codigo del usuario no es valido", HttpStatus.NOT_ACCEPTABLE);
        }
    }
    //actualizar usuario
    @Put("/update")
    public actualizarUsuario(@Body() objActualizar: Usuario): any{
        return this.usuarioService.actualizar(objActualizar, objActualizar.codUsuario);
    }
    //Actalizar usuario por parametros
    @Put("/update/:codUsuario")
    public actializarUsuarioParametro(@Body() objActualizar: Usuario, @Param() parametros: any): any{
        const codigo: number = Number(parametros.codUsuario);
        if(!isNaN(codigo)){
            return this.usuarioService.actualizar(objActualizar , codigo);

        }else{
            return new HttpException("codigo de usuario no valido", HttpStatus.NOT_ACCEPTABLE);
        }

    }
    //eliminar rol
    @Delete("/delete/:codUsuario")//get y delete no llevan body si no parametros
    public elimiarUsuario(@Param()  parametros:any): any{
        const codigo: number = Number(parametros.codUsuario);
        if(!isNaN(codigo)){
            return this.usuarioService.eliminar( codigo);

        }else{
            return new HttpException("codigo de sitio no valido", HttpStatus.NOT_ACCEPTABLE);
        }    
    }
}
