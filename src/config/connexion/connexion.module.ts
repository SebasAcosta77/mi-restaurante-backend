
import { Global, Module } from '@nestjs/common';
import { Acceso } from 'src/models/acceso/acceso';
import { Acompañamiento } from 'src/models/acompañamiento/acompañamiento';
import { Rol } from 'src/models/rol/rol';
import { Usuario } from 'src/models/usuario/usuario';

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Imagen } from 'src/models/imagen/imagen';
import { Adicion } from 'src/models/adicion/adicion';
import { Bebida } from 'src/models/bebida/bebida';
import { DetallePedido } from 'src/models/detalle-pedido/detalle-pedido';
import { Hamburguesa } from 'src/models/hamburguesa/hamburguesa';
import { HamburguesaAdicion } from 'src/models/hamburguesa-adicion/hamburguesa-adicion';
import { HamburguesaPersonalizada } from 'src/models/hamburguesa-personalizada/hamburguesa-personalizada';
import { HamburguesaSalsa } from 'src/models/hamburguesa-salsa/hamburguesa-salsa';
import { Pedido } from 'src/models/pedido/pedido';
import { Salsa } from 'src/models/salsa/salsa';


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
