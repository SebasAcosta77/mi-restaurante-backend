import { Module } from '@nestjs/common';

import { RolModule } from './rol/rol.module';
import { RouterModule, Routes } from '@nestjs/core';

import { ImagenModule } from './imagen/imagen.module';

import { UsuarioModule } from './usuario/usuario.module';
import { AcomapañamientoModule } from './acomapañamiento/acomapañamiento.module';

import { AdicionModule } from './adicion/adicion.module';
import { BebidaModule } from './bebida/bebida.module';

import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { HamburguesaModule } from './hamburguesa/hamburguesa.module';
import { HamburguesaPersonalizadaModule } from './hamburguesa-personalizada/hamburguesa-personalizada.module';
import { PedidoModule } from './pedido/pedido.module';
import { SalsaModule } from './salsa/salsa.module';


const rutas:Routes =[{
    path:"privado",
    children: [
        RolModule,
        ImagenModule,
        UsuarioModule,
        AcomapañamientoModule,
        AdicionModule,
        BebidaModule,
        DetallePedidoModule,
        HamburguesaModule,
        HamburguesaPersonalizadaModule,
        PedidoModule,
        SalsaModule

    ]
}]

@Module({
    imports : [AcomapañamientoModule, AdicionModule, DetallePedidoModule, HamburguesaModule, PedidoModule, HamburguesaModule, PedidoModule, HamburguesaPersonalizadaModule, RolModule, SalsaModule, UsuarioModule, BebidaModule, ImagenModule, RouterModule.register(rutas),],
    
})
export class PrivadoModule {}
