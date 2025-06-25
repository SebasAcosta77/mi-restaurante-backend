import {
  Column,
  Double,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HamburguesaSalsa } from '../hamburguesa-salsa/hamburguesa-salsa';
import { Imagen } from '../imagen/imagen';

@Entity('salsas', { schema: 'public' })
export class Salsa {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_salsa' })
  public codSalsa: number;
  @Column({ type: 'varchar', length: 250, name: 'nombre_salsa' })
  public nombreSalsa: string;
  @Column({ type: 'varchar', length: 250, name: 'descripcion_salsa' })
  public descripcionSalsa: string;
  @Column({ type: 'double precision', name: 'precio_salsa' })
  public precioSalsa: number;

  @OneToMany(() => HamburguesaSalsa, (buguersalsa) => buguersalsa.salsaburguer)
  public salsas?: HamburguesaSalsa[];

  @OneToMany(() => Imagen, (objImagen: Imagen) => objImagen.salsaI)
  public imagenes?: Imagen[]; // Relación con múltiples imágenes

  constructor(cod: number, nom: string, desc: string, precio: number) {
    this.codSalsa = cod;
    this.nombreSalsa = nom;
    this.descripcionSalsa = desc;
    this.precioSalsa = precio;
  }
}
