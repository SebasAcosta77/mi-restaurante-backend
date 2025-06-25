import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Usuario } from "../usuario/usuario";
@Entity("accesos", {schema: "public"})
export class Acceso {

    @PrimaryColumn({type: "integer", name: "cod_usuario", nullable: false})
    public codUsuario: number;

    @Column({type:"varchar", length:500, name: "nombre_acceso", nullable: false})
    public nombreAcceso: string;

    @Column({type: "varchar", length: 500, name: "clave_acceso", nullable: false})
    public claveAcceso: string;

    @OneToOne(()=> Usuario, (objUsuario)=>objUsuario.acceso,{
        onDelete:"RESTRICT",
        onUpdate:"CASCADE"
    })

    @JoinColumn({name:"cod_usuario", referencedColumnName: "codUsuario"})
    public codUsuarioA ?: Usuario;    



    constructor(cod: number, nom: string, cla: string){
        this.codUsuario = cod,
        this.nombreAcceso = nom,
        this.claveAcceso = cla
    }
}
