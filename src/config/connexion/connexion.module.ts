
import { Global, Module } from '@nestjs/common';
import { Acceso } from 'models/acceso/acceso';
import { Acompañamiento } from 'models/acompañamiento/acompañamiento';
import { Adicion } from 'models/adicion/adicion';
import { Bebida } from 'models/bebida/bebida';
import { DetallePedido } from 'models/detalle-pedido/detalle-pedido';
import { HamburguesaAdicion } from 'models/hamburguesa-adicion/hamburguesa-adicion';
import { HamburguesaPersonalizada } from 'models/hamburguesa-personalizada/hamburguesa-personalizada';
import { HamburguesaSalsa } from 'models/hamburguesa-salsa/hamburguesa-salsa';
import { Hamburguesa } from 'models/hamburguesa/hamburguesa';
import { Imagen } from 'models/imagen/imagen';
import { Pedido } from 'models/pedido/pedido';
import { Rol } from 'models/rol/rol';
import { Salsa } from 'models/salsa/salsa';
import { Usuario } from 'models/usuario/usuario';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';



@Global()
@Module({
    imports:[],
    providers:[

        {provide: DataSource,
            inject:[],
            useFactory:async ()=>{
                try{
                    const poolConexion = new DataSource({
                     type:"mysql",
                     host:String(process.env.HOST),
                     port:Number(process.env.PORT),
                     username:String(process.env.USER),
                     password:String(process.env.PASSWORD),
                     database:String(process.env.DATA_BASE),
                     synchronize:true, //sincronza la bd
                     logging:true,//muestra o oculta la bd
                     namingStrategy: new SnakeNamingStrategy(),
                     entities:[Acompañamiento, Acceso, Rol, Usuario, Imagen, Adicion, Bebida, DetallePedido, Hamburguesa, HamburguesaAdicion, HamburguesaPersonalizada, HamburguesaSalsa, Pedido, Salsa],
                    });
                    await poolConexion.initialize();
                    console.log("conexion establecida con: "+ String(process.env.DATA_BASE));
                    return poolConexion;
                }catch(miErrorsito){
                    console.log("fallo al realizar la conexion con la bd");
                    throw miErrorsito;
                }
            }
        }
    ],
    exports:[DataSource],
})
export class ConnexionModule {}
