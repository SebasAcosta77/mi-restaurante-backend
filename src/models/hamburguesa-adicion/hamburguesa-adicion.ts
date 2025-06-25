import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HamburguesaPersonalizada } from '../hamburguesa-personalizada/hamburguesa-personalizada';
import { Adicion } from '../adicion/adicion';

@Entity('hamburguesas_adiciones', { schema: 'public' })
export class HamburguesaAdicion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_burger_adicion' })
  public codHamburguesaAdicion: number;
  @Column({ type: 'integer', name: 'cod_hamburguesa_pers' })
  public codHamburguesaPersonalizada: string;
  @Column({ type: 'integer', name: 'cod_adicion' })
  public codAdicion: string;

  //foranea
  @ManyToOne(() => HamburguesaPersonalizada, (burguer) => burguer.adiciones, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'cod_hamburguesa_pers',
      referencedColumnName: 'codHaburguesaPerso',
    },
  ])
  public bugeradicionper?: HamburguesaPersonalizada;

  //foranea
  @ManyToOne(() => Adicion, (adicion) => adicion.adicionburguer, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cod_adicion', referencedColumnName: 'codAdicion' }])
  public burguerAdicion?: Adicion;

  
}
