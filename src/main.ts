import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const port = Number(process.env.DB_PORT);

  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true }));

  // CORS habilitado
 app.enableCors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
});

  
  app.useStaticAssets(join(__dirname, '..', 'src/doc/img'), {
    prefix: '/img',
  });

  await app.listen(port, () => {
    console.log('Servidor funcionando en puerto: ' + port);
  });
}
bootstrap();
