import {
  Column,
  Double,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HamburguesaAdicion } from '../hamburguesa-adicion/hamburguesa-adicion';
import { Imagen } from '../imagen/imagen';

@Entity('adiciones', { schema: 'public' })
export class Adicion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_adicion' })
  public codAdicion: number;
  @Column({ type: 'varchar', length: 250, name: 'nombre_adicion' })
  public nombreAdicion: string;
  @Column({ type: 'varchar', length: 250, name: 'descripcion_adicion' })
  public descripcionAdicion: string;
  @Column({ type: 'double precision', name: 'precio_adicion' })
  public precioAdicion: number;

  @OneToMany(
    () => HamburguesaAdicion,
    (burgueradicion) => burgueradicion.burguerAdicion,
  )
  public adicionburguer?: HamburguesaAdicion[];

  @OneToMany(() => Imagen, (objImagen: Imagen) => objImagen.adicionI)
  public imagenes?: Imagen[]; // Relación con múltiples imágenes

  constructor(cod: number, nom: string, desc: string, precio: number) {
    this.codAdicion = cod;
    this.nombreAdicion = nom;
    this.descripcionAdicion = desc;
    this.precioAdicion = precio;
  }
}
