import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Salsa } from 'src/models/salsa/salsa';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SalsaService {
    private salsaRepository: Repository<Salsa>;

    constructor(private poolConexion: DataSource) {
        this.salsaRepository = poolConexion.getRepository(Salsa);
    }
    public async consultar(): Promise<any> {
        try {
            return this.salsaRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar la salsa', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarSalsa(cod: number):Promise<boolean>{
        try{
        const existe = await this.salsaRepository.findBy({codSalsa: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objsalsa: Salsa): Promise<any> {
        try {
            return await this.salsaRepository.save(objsalsa);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.salsaRepository.findBy({ codSalsa: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objsalsa: Salsa, codigo: number): Promise<any> {
        try {
            const objActualizado = this.salsaRepository.update({ codSalsa: codigo }, objsalsa);
            return new HttpException({ mensaje: "salsa actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar salsa", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.salsaRepository.delete({ codSalsa: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar la membresia", HttpStatus.BAD_REQUEST);

        }
    }
}
