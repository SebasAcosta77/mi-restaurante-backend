import { Column, Double, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Imagen } from '../imagen/imagen';

@Entity('acompañamientos', { schema: 'public' })
export class Acompañamiento {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_acompañamiento' })
  public codAcompañamiento: number;
  @Column({ type: 'varchar', length: 250, name: 'nombre_acompañamiento' })
  public nombreAcompañamiento: string;
  @Column({ type: 'varchar', length: 250, name: 'descripcion_acompañamiento' })
  public descripcionAcompañamiento: string;
  @Column({ type: 'double', name: 'precio_acompañamiento' })
  public precioAcompañamiento: number;

  @OneToMany(() => Imagen, (objImagen: Imagen) => objImagen.acompanamientoI)
  public imagenes?: Imagen[]; // Relación con múltiples imágenes

  constructor(cod?: number, nom?: string, desc?: string, precio?: number) {
    this.codAcompañamiento = cod;
    this.nombreAcompañamiento = nom;
    this.descripcionAcompañamiento = desc;
    this.precioAcompañamiento = precio;
  }
}
