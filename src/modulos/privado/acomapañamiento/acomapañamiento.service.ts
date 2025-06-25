import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Acompañamiento } from 'src/models/acompañamiento/acompañamiento';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AcomapañamientoService {
    private acompañamientoRepository: Repository<Acompañamiento>;

    constructor(private poolConexion: DataSource) {
        this.acompañamientoRepository = poolConexion.getRepository(Acompañamiento);
    }
    public async consultar(): Promise<any> {
        try {
            return this.acompañamientoRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar el acompañamiento', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarAcompañamiento(cod: number):Promise<boolean>{
        try{
        const existe = await this.acompañamientoRepository.findBy({codAcompañamiento: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objAcompñamiento: Acompañamiento): Promise<any> {
        try {
            return await this.acompañamientoRepository.save(objAcompñamiento);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.acompañamientoRepository.findBy({ codAcompañamiento: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objacompñamiento: Acompañamiento, codigo: number): Promise<any> {
        try {
            const objActualizado = this.acompañamientoRepository.update({ codAcompañamiento: codigo }, objacompñamiento);
            return new HttpException({ mensaje: "acompañamiento actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar acompañamiento", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.acompañamientoRepository.delete({ codAcompañamiento: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar el acompañamiento", HttpStatus.BAD_REQUEST);

        }
    }
}
