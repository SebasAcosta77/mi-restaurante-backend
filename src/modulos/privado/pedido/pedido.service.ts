import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pedido } from 'src/models/pedido/pedido';
import { DataSource, Repository } from 'typeorm';
import { Hamburguesa } from 'src/models/hamburguesa/hamburguesa';
import { HamburguesaPersonalizada } from 'src/models/hamburguesa-personalizada/hamburguesa-personalizada';
import { Adicion } from 'src/models/adicion/adicion';
import { Salsa } from 'src/models/salsa/salsa';
import { Acompañamiento } from 'src/models/acompañamiento/acompañamiento';
import { Bebida } from 'src/models/bebida/bebida';
import { DetallePedido } from 'src/models/detalle-pedido/detalle-pedido';
import { Usuario } from 'src/models/usuario/usuario';
import { HamburguesaSalsa } from 'src/models/hamburguesa-salsa/hamburguesa-salsa';
import { HamburguesaAdicion } from 'src/models/hamburguesa-adicion/hamburguesa-adicion';
import { SendGridService } from 'src/common/services/sendgrid.service';

@Injectable()
export class PedidoService {
  private pedidoRepository: Repository<Pedido>;
  private hamburguesaRepo: Repository<Hamburguesa>;
  private hamburguesaPersoRepo: Repository<HamburguesaPersonalizada>;
  private adicionRepo: Repository<Adicion>;
  private salsaRepo: Repository<Salsa>;
  private acompanamientoRepo: Repository<Acompañamiento>;
  private bebidaRepo: Repository<Bebida>;
  private detallePedidoRepo: Repository<DetallePedido>;
  private usuarioRepo: Repository<Usuario>;
  private hamburguesaSalsaRepo: Repository<HamburguesaSalsa>;
  private hamburguesaAdicionRepo: Repository<HamburguesaAdicion>;

  constructor(private poolConexion: DataSource) {
    this.pedidoRepository = poolConexion.getRepository(Pedido);
    this.hamburguesaRepo = poolConexion.getRepository(Hamburguesa);
    this.hamburguesaPersoRepo = poolConexion.getRepository(
      HamburguesaPersonalizada,
    );
    this.adicionRepo = poolConexion.getRepository(Adicion);
    this.salsaRepo = poolConexion.getRepository(Salsa);
    this.acompanamientoRepo = poolConexion.getRepository(Acompañamiento);
    this.bebidaRepo = poolConexion.getRepository(Bebida);
    this.detallePedidoRepo = poolConexion.getRepository(DetallePedido);
    this.usuarioRepo = poolConexion.getRepository(Usuario);
    this.hamburguesaSalsaRepo = poolConexion.getRepository(HamburguesaSalsa);
    this.hamburguesaAdicionRepo =
      poolConexion.getRepository(HamburguesaAdicion);
  }

  public async consultar(): Promise<any> {
    try {
      return this.pedidoRepository.find();
    } catch (miError) {
      throw new HttpException(
        'Fallo al consultar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verificarPedido(cod: number): Promise<boolean> {
    try {
      const existe = await this.pedidoRepository.findBy({ codPedido: cod });
      return existe.length > 0;
    } catch (miError) {
      throw new HttpException(
        'No hay envío de información',
        HttpStatus.CONFLICT,
      );
    }
  }

  /**
   * Lógica para registrar un pedido con hamburguesas individualmente personalizadas.
   */
  public async registrar(body: any): Promise<any> {
   
    try {
      const usuario = await this.usuarioRepo.findOne({
        where: { codUsuario: body.usuarioId },
      });
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      if (
        (!body.hamburguesas || body.hamburguesas.length === 0) &&
        (!body.acompanamientos || body.acompanamientos.length === 0) &&
        (!body.bebidas || body.bebidas.length === 0)
      ) {
        throw new HttpException('El pedido está vacío', HttpStatus.BAD_REQUEST);
      }

      let pedido = new Pedido();
      pedido.codUsuarioP = usuario;
      pedido.estadoPedido = body.estadoPedido || 'pendiente';
      pedido.fechaPedido = new Date();
      pedido.precioTotal = 0.0;
      pedido = await this.pedidoRepository.save(pedido);

      let total = 0;

      // HAMBURGUESAS (cada una como ítem personalizado)
      if (Array.isArray(body.hamburguesas)) {
        for (const item of body.hamburguesas) {
          const base = await this.hamburguesaRepo.findOne({
            where: { codHamburguesa: item.codHamburguesa },
          });
          if (!base) continue;

          for (let i = 0; i < (item.cantidad ?? 1); i++) {
            let precio = Number(base.precioHamburguesa);

            const personalizada = new HamburguesaPersonalizada();
            personalizada.burguerPedido = pedido;
            personalizada.persoBirguer = base;
            personalizada.precioBase = base.precioHamburguesa;
            personalizada.precioHamburguesa = 0;

            const hamburguesaGuardada =
              await this.hamburguesaPersoRepo.save(personalizada);

            //  Adiciones (máx 3)
            if (Array.isArray(item.adiciones)) {
              const adiciones = item.adiciones.slice(0, 3);
              for (const id of adiciones) {
                const adicion = await this.adicionRepo.findOne({
                  where: { codAdicion: id },
                });
                if (adicion) {
                  const hamburguesaAdicion = new HamburguesaAdicion();
                  hamburguesaAdicion.bugeradicionper = hamburguesaGuardada;
                  hamburguesaAdicion.burguerAdicion = adicion;
                  await this.hamburguesaAdicionRepo.save(hamburguesaAdicion);
                  precio += Number(adicion.precioAdicion);
                }
              }
            }

            // Salsas (máx 2)
            if (Array.isArray(item.salsas)) {
              const salsas = item.salsas.slice(0, 2);
              for (const id of salsas) {
                const salsa = await this.salsaRepo.findOne({
                  where: { codSalsa: id },
                });
                if (salsa) {
                  const hamburguesaSalsa = new HamburguesaSalsa();
                  hamburguesaSalsa.bugersalsaper = hamburguesaGuardada;
                  hamburguesaSalsa.salsaburguer = salsa;
                  await this.hamburguesaSalsaRepo.save(hamburguesaSalsa);
                  precio += Number(salsa.precioSalsa);
                }
              }
            }

            hamburguesaGuardada.precioHamburguesa = precio;
            await this.hamburguesaPersoRepo.save(hamburguesaGuardada);

            total += precio;
          }
        }
      }

      // ACOMPAÑAMIENTOS
      if (Array.isArray(body.acompanamientos)) {
        for (const acomp of body.acompanamientos) {
          const a = await this.acompanamientoRepo.findOne({
            where: { codAcompañamiento: acomp.idAcompanamiento },
          });
          if (!a) continue;

          const detalle = new DetallePedido();
          detalle.codPedidoD = pedido;
          detalle.tipoItem = 'acompanamiento';
          detalle.itemId = a.codAcompañamiento;
          detalle.cantidadDetalle = acomp.cantidad;
          detalle.precioDetalle = a.precioAcompañamiento;
          await this.detallePedidoRepo.save(detalle);
          total += a.precioAcompañamiento * acomp.cantidad;
        }
      }

      // BEBIDAS
      if (Array.isArray(body.bebidas)) {
        for (const bebida of body.bebidas) {
          const b = await this.bebidaRepo.findOne({
            where: { codBebida: bebida.codBebida },
          });
          if (!b) continue;

          const detalle = new DetallePedido();
          detalle.codPedidoD = pedido;
          detalle.tipoItem = 'bebida';
          detalle.itemId = b.codBebida;
          detalle.cantidadDetalle = bebida.cantidad;
          detalle.precioDetalle = b.precioBebida;
          await this.detallePedidoRepo.save(detalle);
          total += b.precioBebida * bebida.cantidad;
        }
      }

      pedido.precioTotal = parseFloat(total.toFixed(2));
      await this.pedidoRepository.save(pedido);

      return {
        mensaje: 'Pedido registrado correctamente',
        pedidoId: pedido.codPedido,
        precioTotal: pedido.precioTotal,
      };
    } catch (error) {
      console.error(' ERROR EN PEDIDO:', error);
      throw new HttpException(
        error?.response?.message ||
          error?.message ||
          'Fallo al registrar el pedido',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async consultarUno(codigo: number): Promise<any> {
    try {
      return this.pedidoRepository.findBy({ codPedido: codigo });
    } catch (miError) {
      throw new HttpException(
        'Fallo al consultar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async actualizar(objpedido: Pedido, codigo: number): Promise<any> {
    try {
      const objActualizado = this.pedidoRepository.update(
        { codPedido: codigo },
        objpedido,
      );
      return new HttpException(
        { mensaje: 'Pedido actualizado', objeto: objActualizado },
        HttpStatus.OK,
      );
    } catch (MiError) {
      throw new HttpException(
        'Fallo al actualizar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async actualizarPedidoCompleto(
    codPedido: number,
    body: any,
  ): Promise<any> {
    try {
      const pedidoExistente = await this.pedidoRepository.findOne({
        where: { codPedido },
        relations: ['codUsuarioP'],
      });

      if (!pedidoExistente) {
        throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
      }

      const usuario = await this.usuarioRepo.findOne({
        where: { codUsuario: body.usuarioId },
      });

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Actualiza los campos del pedido sin borrar nada -- Aca voy
      pedidoExistente.estadoPedido =
        body.estadoPedido || pedidoExistente.estadoPedido;
      pedidoExistente.codUsuarioP = usuario;

      // Recalcular total basado en el nuevo body (solo si se manda hamburguesas, bebidas o acompañamientos)
      let total = 0;

      if (body.hamburguesas?.length > 0) {
        for (const item of body.hamburguesas) {
          const base = await this.hamburguesaRepo.findOne({
            where: { codHamburguesa: item.codHamburguesa },
          });

          if (!base) continue;

          let precio = Number(base.precioHamburguesa);

          if (item.adiciones) {
            for (const id of item.adiciones) {
              const adicion = await this.adicionRepo.findOne({
                where: { codAdicion: id },
              });
              if (adicion) {
                precio += Number(adicion.precioAdicion);
              }
            }
          }

          if (item.salsas) {
            for (const id of item.salsas) {
              const salsa = await this.salsaRepo.findOne({
                where: { codSalsa: id },
              });
              if (salsa) {
                precio += Number(salsa.precioSalsa);
              }
            }
          }

          total += precio * (item.cantidad ?? 1);
        }
      }

      if (body.acompanamientos?.length > 0) {
        for (const acomp of body.acompanamientos) {
          const a = await this.acompanamientoRepo.findOne({
            where: { codAcompañamiento: acomp.idAcompanamiento },
          });
          if (a) {
            total += a.precioAcompañamiento * acomp.cantidad;
          }
        }
      }

      if (body.bebidas?.length > 0) {
        for (const bebida of body.bebidas) {
          const b = await this.bebidaRepo.findOne({
            where: { codBebida: bebida.codBebida },
          });
          if (b) {
            total += b.precioBebida * bebida.cantidad;
          }
        }
      }

      // Actualiza el precio total, si se recalculó
      if (total > 0) {
        pedidoExistente.precioTotal = parseFloat(total.toFixed(2));
      }

      await this.pedidoRepository.save(pedidoExistente);

      return {
        mensaje: 'Pedido actualizado correctamente',
        pedidoId: pedidoExistente.codPedido,
        precioTotal: pedidoExistente.precioTotal,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Fallo al actualizar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async eliminar(codigo: number): Promise<any> {
    try {
      return this.pedidoRepository.delete({ codPedido: codigo });
    } catch (MiError) {
      throw new HttpException(
        'Fallo al eliminar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async cancelarPedido(codPedido: number): Promise<any> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { codPedido },
      });

      if (!pedido) {
        throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
      }

      // Solo se puede cancelar si está en estado 'pendiente'
      if (pedido.estadoPedido !== 'pendiente') {
        throw new HttpException(
          'El pedido ya fue procesado y no puede ser cancelado',
          HttpStatus.BAD_REQUEST,
        );
      }

      pedido.estadoPedido = 'cancelado';
      await this.pedidoRepository.save(pedido);

      return {
        mensaje: 'Pedido cancelado correctamente',
        pedidoId: pedido.codPedido,
      };
    } catch (error) {
      throw new HttpException(
        'Fallo al cancelar el pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async cambiarEstado(
    codPedido: number,
    nuevoEstado: string,
  ): Promise<any> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { codPedido },
        relations: ['codUsuarioP', 'codUsuarioP.acceso'], // asegúrate de incluir 'acceso'
      });

      if (!pedido) {
        throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
      }

      pedido.estadoPedido = nuevoEstado;
      await this.pedidoRepository.save(pedido);

      // Enviar correo SOLO si el estado es "entregado"
      if (nuevoEstado.toLowerCase() === 'entregado') {
        const usuario = pedido.codUsuarioP;

        // Validar que tenga un correo disponible
        const correo =
          usuario?.acceso?.nombreAcceso ?? usuario?.['emailUsuario'];

        if (!correo) {
          console.warn('Usuario sin correo, no se puede enviar notificación');
        } else {
          const resumen = `
          Pedido N°: ${pedido.codPedido}
          Fecha: ${pedido.fechaPedido.toLocaleString()}
          Estado: ${pedido.estadoPedido}
          Total: $${pedido.precioTotal.toFixed(2)}
        `;

          await SendGridService.enviarCorreoPedidoEntregado(
            correo,
            usuario.nombreUsuario,
            resumen,
          );
        }
      }

      return {
        mensaje: 'Estado del pedido actualizado correctamente',
        pedidoId: pedido.codPedido,
        nuevoEstado: pedido.estadoPedido,
      };
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      throw new HttpException(
        'Fallo al cambiar el estado del pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async obtenerPedidosPorUsuario(codUsuario: number) {
  const pedidos = await this.pedidoRepository.find({
    where: { codUsuarioP: { codUsuario } },
    order: { fechaPedido: 'DESC' }
  });

  return pedidos.map(p => ({
    codPedido: p.codPedido,
    fechaPedido: p.fechaPedido,
    estadoPedido: p.estadoPedido,
    precioTotal: p.precioTotal,
    codusuario: p.codUsuarioP?.codUsuario || codUsuario
  }));
}


}
