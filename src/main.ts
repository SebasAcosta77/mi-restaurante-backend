import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const port = Number(process.env.PORT_SERVER) || 3001;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Middleware manual para resolver CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://dulcet-torte-8fb5c3.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true }));

  app.useStaticAssets(join(__dirname, '..', 'src/doc/img'), {
    prefix: '/img',
  });

  await app.listen(port, () => {
    console.log('Servidor funcionando en puerto: ' + port);
  });
}
bootstrap();
