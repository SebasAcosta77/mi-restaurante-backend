import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConnexionModule } from './config/connexion/connexion.module';
import { PublicModule } from './modules/public/public.module';
import { PrivadoModule } from './modulos/privado/privado.module';
import { Seguridad } from './middleware/seguridad/seguridad';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true, envFilePath: ".env" }), ConnexionModule, PublicModule, PrivadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(Seguridad).forRoutes({path :'/privado/*', method: RequestMethod.ALL});
      
  }
}