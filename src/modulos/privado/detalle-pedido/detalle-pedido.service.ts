import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetallePedido } from 'models/detalle-pedido/detalle-pedido';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DetallePedidoService {
    private detalleRepository: Repository<DetallePedido>;

    constructor(private poolConexion: DataSource) {
        this.detalleRepository = poolConexion.getRepository(DetallePedido);
    }
    public async consultar(): Promise<any> {
        try {
            return this.detalleRepository.find(); //status code 200 traer informacion

        } catch (miError) {
            throw new HttpException('Fallo al consultar el detalle', HttpStatus.BAD_REQUEST);

        }
    }
    // taller lunes registrar 1
    public async verificarDetalle(cod: number):Promise<boolean>{
        try{
        const existe = await this.detalleRepository.findBy({codDetalle: cod});
        return existe.length > 0;
        }catch(miError) {
            throw new HttpException('no hay envio de informacion ', HttpStatus.CONFLICT);
        }

    }
    public async registrar(objdetalle: DetallePedido): Promise<any> {
        try {
            return await this.detalleRepository.save(objdetalle);
        } catch (MiError) {
            throw new HttpException('Fallo al hacer el registro', HttpStatus.BAD_REQUEST);

        }


    }
    //consultar un dato
    public async consultarUno(codigo: number): Promise<any> {
        try {
            return this.detalleRepository.findBy({ codDetalle: codigo });
        } catch (miError) {
            throw new HttpException('fallo al consultar error', HttpStatus.BAD_REQUEST);

        }
    }
    //actualizar
    public async actualizar(objdetalle: DetallePedido, codigo: number): Promise<any> {
        try {
            const objActualizado = this.detalleRepository.update({ codDetalle: codigo }, objdetalle);
            return new HttpException({ mensaje: "detalle actualizada ", objeto: objActualizado }, HttpStatus.OK);
        }

        catch (MiError) {
            throw new HttpException("fallo al actualizar detalle", HttpStatus.BAD_REQUEST)

        }

    }
    //eliminar
    public async eliminar(codigo: number): Promise<any> {
        try {
            return this.detalleRepository.delete({ codDetalle: codigo });

        } catch (MiError) {
            throw new HttpException("Fallo al eliminar el detalle", HttpStatus.BAD_REQUEST);

        }
    }
}
