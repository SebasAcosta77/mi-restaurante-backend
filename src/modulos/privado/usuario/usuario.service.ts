import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'models/usuario/usuario';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
    private usuarioRepository : Repository<Usuario>;

    constructor(private poolConexion: DataSource){
        this.usuarioRepository= poolConexion.getRepository(Usuario);
    }
    public async consultar(): Promise<any>{
        try {
            return this.usuarioRepository.find(); //status code 200 traer informacion
            
        } catch (miError) {
            throw new HttpException('Fallo al consultar el usuario', HttpStatus.BAD_REQUEST);
            
        }
    }
    // taller lunes registrar 1
    public async verificarUsuario(nombre:string):Promise<boolean>{
        try{
        const existe = await this.usuarioRepository.findBy({nombreUsuario: nombre});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objUsuario: Usuario):Promise<any> { 
        try {
            if (await this.verificarUsuario(objUsuario.nombreUsuario)) {
                return new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
                
            } else {
                return await this.usuarioRepository.save(objUsuario);
                
            }
            
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);
            
        }


    }
    //consultar un dato
    public async consultarUno(codigo: number):Promise<any>{
        try {
            return this.usuarioRepository.findBy({codUsuario : codigo});
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);
            
        }
    }
    //actualizar
    public async actualizar (objUsuario:Usuario, codigo: number):Promise<any>{
        try {
            if(await this.verificarUsuario(objUsuario.nombreUsuario)){
                return new HttpException("El Usuario ya existe", HttpStatus.BAD_REQUEST)

            }else{
                const objActualizado= this.usuarioRepository.update({codUsuario: codigo}, objUsuario);
                return new HttpException({mensaje: "usuario actualizado ", objeto: objActualizado }, HttpStatus.OK);
                
            }
            
        } catch (MiError) {
            throw new HttpException("fallo al actualizar usuario", HttpStatus.BAD_REQUEST)
            
        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any>{
        try {
            return this.usuarioRepository.delete({codUsuario: codigo});
            
        } catch (MiError) {
            throw new HttpException("Fallo al eliminar el usuario", HttpStatus.BAD_REQUEST);
            
        }
    }
}
