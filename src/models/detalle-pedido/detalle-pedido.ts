import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from '../pedido/pedido';

@Entity('detalle_pedidos', { schema: 'public' })
export class DetallePedido {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_detalle' })
  public codDetalle: number;

  @Column({
    name: 'tipo_item',
    type: 'enum',
    enum: ['bebida', 'acompanamiento'],
  })
  tipoItem: 'bebida' | 'acompanamiento';

  @Column({ name: 'item_id', type: 'int' })
  itemId: number;

  @Column({ type: 'varchar', length: 250, name: 'cantidad_detalle' })
  public cantidadDetalle: number;

  @Column({ type: 'double precision', name: 'precio_unitario' })
  public precioDetalle: number;

  @Column({ type: 'integer', name: 'cod_pedido', nullable: false })
  public codPedido: number;

  //foranea
  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cod_pedido', referencedColumnName: 'codPedido' }])
  public codPedidoD?: Pedido;

  constructor(
    cod?: number,
    tipoItem?: 'bebida' | 'acompanamiento',
    itemId?: number,
    cantidad?: number,
    precioDetalle?: number,
    codPedido?: number,
  ) {
    this.codDetalle = cod;
    this.tipoItem = tipoItem;
    this.itemId = itemId;
    this.cantidadDetalle = cantidad;
    this.precioDetalle = precioDetalle;
    this.codPedido = codPedido;
  }
}
