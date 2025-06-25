import { Column, Double, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Imagen } from '../imagen/imagen';

@Entity('bebidas', { schema: 'public' })
export class Bebida {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_bebida' })
  public codBebida: number;
  @Column({ type: 'varchar', length: 250, name: 'nombre_bebida' })
  public nombreBebida: string;
  @Column({ type: 'varchar', length: 250, name: 'descripcion_bebida' })
  public descripcionBebida: string;
  @Column({ type: 'double', name: 'precio_bebida' })
  public precioBebida: number;

  @OneToMany(() => Imagen, (objImagen: Imagen) => objImagen.bebidaI)
  public imagenes?: Imagen[]; // Relación con múltiples imágenes

  constructor(cod?: number, nom?: string, desc?: string, precio?: number) {
    this.codBebida = cod;
    this.nombreBebida = nom;
    this.descripcionBebida = desc;
    this.precioBebida = precio;
  }
}
