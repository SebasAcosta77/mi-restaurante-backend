import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bebida } from 'models/bebida/bebida';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BebidaService {
     private bebidaRepository: Repository<Bebida>;

    constructor(private poolConexion: DataSource) {
        this.bebidaRepository = poolConexion.getRepository(Bebida);
    }
    public async consultar(): Promise<any> {
        try {
            return this.bebidaRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar la bebida', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarbebida(cod: number):Promise<boolean>{
        try{
        const existe = await this.bebidaRepository.findBy({codBebida: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objbebida: Bebida): Promise<any> {
        try {
            return await this.bebidaRepository.save(objbebida);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.bebidaRepository.findBy({ codBebida: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objbebida: Bebida, codigo: number): Promise<any> {
        try {
            const objActualizado = this.bebidaRepository.update({ codBebida: codigo }, objbebida);
            return new HttpException({ mensaje: "bebida actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar bebida", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.bebidaRepository.delete({ codBebida: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar la bebida", HttpStatus.BAD_REQUEST);

        }
    }
}
