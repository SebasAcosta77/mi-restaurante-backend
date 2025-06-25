import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hamburguesa } from 'src/models/hamburguesa/hamburguesa';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class HamburguesaService {
    private burguerRepository: Repository<Hamburguesa>;

    constructor(private poolConexion: DataSource) {
        this.burguerRepository = poolConexion.getRepository(Hamburguesa);
    }
    public async consultar(): Promise<any> {
        try {
            return this.burguerRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar la burguer', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarBurguer(cod: number):Promise<boolean>{
        try{
        const existe = await this.burguerRepository.findBy({codHamburguesa: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objburguer: Hamburguesa): Promise<any> {
        try {
            return await this.burguerRepository.save(objburguer);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.burguerRepository.findBy({ codHamburguesa: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objburguer: Hamburguesa, codigo: number): Promise<any> {
        try {
            const objActualizado = this.burguerRepository.update({ codHamburguesa: codigo }, objburguer);
            return new HttpException({ mensaje: "burguer actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar burguer", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.burguerRepository.delete({ codHamburguesa: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar la burguer", HttpStatus.BAD_REQUEST);

        }
    }

}
