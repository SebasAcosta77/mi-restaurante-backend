import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "../rol/rol";
import { Acceso } from "../acceso/acceso";
import { Pedido } from "../pedido/pedido";


@Entity("usuarios", {schema: "public"})
export class Usuario {
    @PrimaryGeneratedColumn({type: "integer", name: "cod_usuario"})
    public codUsuario: number;
    @Column({type: "varchar", length: 250, name: "nombre_usuario", nullable:false})
    public nombreUsuario: string;
    @Column({type: "date",  name: "fecha_nacimiento_usuario", default: () => "'2000-01-01'"})
    public fechaNacimientoUsuario: Date;
    @Column({type: "varchar", length: 250, name: "telefono_usuario", nullable: false  })
    public telefonoUsuario: string;
    @Column({type: "integer",  name: "genero_usuario", nullable:false})
    public generoUsuario: number;
    @Column({type: "integer",  name: "cod_rol", nullable:false})
    public codRol: number;
    //foranea
    @OneToMany(() => Rol, (objRol:Rol) => objRol.usuarios,{
        onDelete:"RESTRICT",
        onUpdate:"CASCADE"
    })

    @JoinColumn({name:"cod_rol", referencedColumnName: "cod_rol"})
    public codRolU ?: Rol[];

    @OneToOne(() => Acceso, (objAcceso: Acceso) => objAcceso.codUsuarioA)
    public acceso?: Acceso;

    @OneToMany(()=>Pedido, (Pedido)=> Pedido.codUsuarioP)
    public pedidos ?: Pedido[];

    
      

    constructor(cod: number, nom: string, fecha: Date, tel: string, gen: number, codRo: number){
        this.codUsuario = cod,
        this.nombreUsuario = nom,
        this.fechaNacimientoUsuario = fecha,
        this.telefonoUsuario = tel,
        this.generoUsuario = gen,
        this.codRol = codRo
    }


}
