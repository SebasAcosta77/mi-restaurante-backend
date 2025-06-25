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
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          const poolConexion = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: true,
            namingStrategy: new SnakeNamingStrategy(),
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [
              Acompañamiento,
              Acceso,
              Rol,
              Usuario,
              Imagen,
              Adicion,
              Bebida,
              DetallePedido,
              Hamburguesa,
              HamburguesaAdicion,
              HamburguesaPersonalizada,
              HamburguesaSalsa,
              Pedido,
              Salsa,
            ],
          });

          await poolConexion.initialize();
          console.log('✅ Conexión establecida con: ' + process.env.DB_NAME);
          return poolConexion;
        } catch (err) {
          console.error(' Fallo al realizar la conexión con la BD');
          throw err;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class ConnexionModule {}
