import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HamburguesaSalsa } from '../hamburguesa-salsa/hamburguesa-salsa';
import { HamburguesaAdicion } from '../hamburguesa-adicion/hamburguesa-adicion';
import { Adicion } from '../adicion/adicion';
import { Pedido } from '../pedido/pedido';
import { Hamburguesa } from '../hamburguesa/hamburguesa';
@Entity('hamburguesas_personalizadas', { schema: 'public' })
export class HamburguesaPersonalizada {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_hamburguesa_pers' })
  public codHaburguesaPerso: number;
  @Column({ type: 'double', name: 'precio_base', nullable: false })
  public precioBase: number;
  @Column({ type: 'double precision', name: 'precio_final' })
  public precioHamburguesa: number;
  @Column({ type: 'integer', name: 'cod_pedido' })
  public codPedido: number;
  @Column({ type: 'integer', name: 'cod_hamburguesa' })
  public codHamburguesa: number;

  //foranea
  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoBurger, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'cod_pedido',
      referencedColumnName: 'codPedido',
    },
  ])
  public burguerPedido?: Pedido;

  //foranea
  @ManyToOne(() => Hamburguesa, (hamburguesa) => hamburguesa.burguerPer, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'cod_hamburguesa', referencedColumnName: 'codHamburguesa' },
  ])
  public persoBirguer?: Hamburguesa;

  @OneToMany(() => HamburguesaSalsa, (buguersalsa) => buguersalsa.bugersalsaper)
  public burguersalsa?: HamburguesaSalsa[];

  @OneToMany(
    () => HamburguesaAdicion,
    (burgueradicion) => burgueradicion.bugeradicionper,
  )
  public adiciones?: HamburguesaAdicion[];

  constructor(
  codPerso?: number,
  precioBase?: number,
  precioFinal?: number,
  codPedido?: number,
  codHamburguesa?: number,
) {
  this.codHaburguesaPerso = codPerso;
  this.precioBase = precioBase;
  this.precioHamburguesa = precioFinal;
  this.codPedido = codPedido;
  this.codHamburguesa = codHamburguesa;
}

}
