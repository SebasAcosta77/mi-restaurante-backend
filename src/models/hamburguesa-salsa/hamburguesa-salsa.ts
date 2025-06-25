import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HamburguesaPersonalizada } from '../hamburguesa-personalizada/hamburguesa-personalizada';
import { Salsa } from '../salsa/salsa';

@Entity('hamburguesas_salsas', { schema: 'public' })
export class HamburguesaSalsa {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_hamburguesa_salsa' })
  public codHamburguesaSalsa: number;
  @Column({ type: 'integer', name: 'cod_hamburguesa_pers' })
  public codHaburguesaPerso: number;
  @Column({ type: 'integer', name: 'cod_salsa' })
  public codSalsa: number;

  //foranea
  @ManyToOne(() => HamburguesaPersonalizada, (burguer) => burguer.burguersalsa, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cod_hamburguesa_pers', referencedColumnName: 'codHaburguesaPerso' }])
  public bugersalsaper?: HamburguesaPersonalizada;

  //foranea
  @ManyToOne(() => Salsa, (salsa) => salsa.salsas, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cod_salsa', referencedColumnName: 'codSalsa' }])
  public salsaburguer?: Salsa;

  constructor(cod?: number, codHamburguesaPerso?: number, codSalsa?: number) {
    this.codHamburguesaSalsa = cod;
    this.codHaburguesaPerso = codHamburguesaPerso;
    this.codSalsa = codSalsa;
  }
}
