import { DataSource, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Adicion } from 'models/adicion/adicion';

@Injectable()
export class AdicionService {
    private AdicionRepository: Repository<Adicion>;

    constructor(private poolConexion: DataSource) {
        this.AdicionRepository = poolConexion.getRepository(Adicion);
    }
    public async consultar(): Promise<any> {
        try {
            return this.AdicionRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar la Adicion', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarAdicion(cod: number):Promise<boolean>{
        try{
        const existe = await this.AdicionRepository.findBy({codAdicion: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objadicion: Adicion): Promise<any> {
        try {
            return await this.AdicionRepository.save(objadicion);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.AdicionRepository.findBy({ codAdicion: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objadicion: Adicion, codigo: number): Promise<any> {
        try {
            const objActualizado = this.AdicionRepository.update({ codAdicion: codigo }, objadicion);
            return new HttpException({ mensaje: "Adicion actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar Adicion", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.AdicionRepository.delete({ codAdicion: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar la adicion", HttpStatus.BAD_REQUEST);

        }
    }
}
