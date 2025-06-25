import { Column, Double, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HamburguesaPersonalizada } from '../hamburguesa-personalizada/hamburguesa-personalizada';
import { Imagen } from '../imagen/imagen';

@Entity('hamburguesas', { schema: 'public' })
export class Hamburguesa {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_hamburguesa' })
  public codHamburguesa: number;
  @Column({ type: 'varchar', length: 250, name: 'nombre_hamburguesa' })
  public nombreHamburguesa: string;
  @Column({ type: 'varchar', length: 250, name: 'descripcion_hamburguesa' })
  public descripcionHamburguesa: string;
  @Column({ type: 'double precision', name: 'precio_hamburguesa' })
  public precioHamburguesa: number;

  @OneToMany(() => HamburguesaPersonalizada, (burguerPer) => burguerPer.persoBirguer)
  public burguerPer?: HamburguesaPersonalizada[];

  @OneToMany(() => Imagen, (objImagen: Imagen) => objImagen.hamburguesaI, )
  public imagenes?: Imagen[]; // Relación con múltiples imágenes

  constructor(cod: number, nom: string, desc: string, precio: number) {
    this.codHamburguesa = cod;
    this.nombreHamburguesa = nom;
    this.descripcionHamburguesa = desc;
    this.precioHamburguesa = precio;
  }
}
