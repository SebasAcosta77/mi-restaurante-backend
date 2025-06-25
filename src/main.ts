import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Render asigna el puerto automáticamente mediante process.env.PORT
  const port = Number(process.env.PORT) || 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Aumentar límite de tamaño para JSON y formularios
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true }));

  // Habilitar CORS (ajusta el origen si tu frontend está en Vercel)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://tu-frontend.vercel.app'], // agrega aquí tu dominio Vercel si ya lo tienes
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // Servir imágenes estáticas desde src/doc/img
  app.useStaticAssets(join(__dirname, '..', 'src/doc/img'), {
    prefix: '/img',
  });

  await app.listen(port, () => {
    console.log('🚀 Servidor funcionando en puerto: ' + port);
  });
}
bootstrap();
