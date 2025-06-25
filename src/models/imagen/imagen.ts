import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hamburguesa } from "../hamburguesa/hamburguesa";
import { Salsa } from "../salsa/salsa";
import { Bebida } from "../bebida/bebida";
import { Adicion } from "../adicion/adicion";
import { Acompañamiento } from "../acompañamiento/acompañamiento";

@Entity("imagenes", { schema: "public" })
export class Imagen {
  @PrimaryGeneratedColumn({ type: "integer", name: "cod_imagen" })
  public codImagen: number;

  @Column({ type: "integer", name: "tamano_imagen", nullable: false })
  public tamanoImagen: number;

  @Column({ type: "varchar", length: 250, name: "formato_imagen", nullable: false })
  public formatoImagen: string;

  @Column({ type: "varchar", length: 250, name: "nombre_publico_imagen", nullable: false })
  public nombrePublicoImagen: string;

  @Column({ type: "varchar", length: 250, name: "nombre_privado_imagen", nullable: false })
  public nombrePrivadoImagen: string;

  @Column({ type: "integer", name: "favorito_imagen", nullable: false, default: 2 })
  public favoritoImagen: number;

  @Column({ type: "integer", name: "cod_hamburguesa", nullable: true })
  public codHamburguesa: number;

  @Column({ type: "integer", name: "cod_salsa", nullable: true })
  public codSalsa: number;

  @Column({ type: "integer", name: "cod_acompanamiento", nullable: true })
  public codAcompanamiento: number;

  @Column({ type: "integer", name: "cod_bebida", nullable: true })
  public codBebida: number;

  @Column({ type: "integer", name: "cod_adicion", nullable: true })
  public codAdicion: number;

  @Column({ type: "varchar", length: 100, name: "tipo_producto", nullable: false })
  public tipoProducto: string; // hamburguesa | bebida | acompanamiento | etc.

  // Relación con Hamburguesa (opcional si aplica solo a hamburguesas)
  @ManyToOne(
    () => Hamburguesa,
    (objHambuguesa: Hamburguesa) => objHambuguesa.imagenes,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'cod_hamburguesa',
      referencedColumnName: 'codHamburguesa',
    },
  ])
  public hamburguesaI?: Hamburguesa;

   @ManyToOne(
    () => Salsa,
    (objSalsa: Salsa) => objSalsa.imagenes,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'cod_salsa',
      referencedColumnName: 'codSalsa',
    },
  ])
  public salsaI?: Salsa;

   @ManyToOne(
    () => Bebida,
    (objBebida: Bebida) => objBebida.imagenes,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'cod_bebida',
      referencedColumnName: 'codBebida',
    },
  ])
  public bebidaI?: Bebida;

   @ManyToOne(
    () => Adicion,
    (objAdicion: Adicion) => objAdicion.imagenes,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'cod_adicion',
      referencedColumnName: 'codAdicion',
    },
  ])
  public adicionI?: Adicion;

   @ManyToOne(
    () => Acompañamiento,
    (objAcompanamiento: Acompañamiento) => objAcompanamiento.imagenes,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'cod_acompañamiento',
      referencedColumnName: 'codAcompañamiento',
    },
  ])
  public acompanamientoI?: Acompañamiento;

  // No se guarda en la base de datos: solo para procesar
  public base64Imagen?: string;

  constructor(
    cod: number,
    nom: string,
    tamano: number,
    formato: string,
    nomPublic: string,
    nomPri: string,
    fav: number,
    codSit: number,
    tipoProducto: string,
    codSalsa: number,
    codAcompanamiento: number,
    codBebida: number,
    codAdicion: number

  ) {
    this.codImagen = cod;
    this.tamanoImagen = tamano;
    this.formatoImagen = formato;
    this.nombrePublicoImagen = nomPublic;
    this.nombrePrivadoImagen = nomPri;
    this.favoritoImagen = fav;
    this.codHamburguesa = codSit;
    this.tipoProducto = tipoProducto;
    this.codSalsa = codSalsa;
    this.codAcompanamiento = codAcompanamiento;
    this.codBebida = codBebida;
    this.codAdicion = codAdicion;

  }
}
