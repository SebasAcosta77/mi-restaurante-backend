import {
  Column,
  Double,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario';
import { HamburguesaPersonalizada } from '../hamburguesa-personalizada/hamburguesa-personalizada';
import { DetallePedido } from '../detalle-pedido/detalle-pedido';

@Entity('pedidos', { schema: 'public' })
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'cod_pedido' })
  codPedido: number;

  @Column({
    name: 'fecha_pedido',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaPedido: Date;

  @Column({ name: 'estado_pedido', type: 'varchar', length: 50 })
  estadoPedido: string;

  @Column({ name: 'precio_total', type: 'double' })
  precioTotal: number;

  @Column({ type: 'integer', name: 'cod_usuario', nullable: false })
  public codusuario: number;

  //foranea
  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cod_usuario', referencedColumnName: 'codUsuario' }])
  public codUsuarioP?: Usuario;

  @OneToMany(() => DetallePedido, (detalle) => detalle.codPedidoD)
  public detalles?: DetallePedido[];

  @OneToMany(() => HamburguesaPersonalizada, (burgerperso) => burgerperso.burguerPedido)
  public pedidoBurger?: HamburguesaPersonalizada[];

  constructor(
    cod?: number,
    fech?: Date,
    estado?: string,
    precio?: number,
    codU?: number,
  ) {
    this.codPedido = cod;
    this.fechaPedido = fech;
    this.estadoPedido = estado;
    this.precioTotal = precio;
    this.codusuario = codU;
  }
}
