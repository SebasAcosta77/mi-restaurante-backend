import { Module } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { ImagenController } from './imagen.controller';

@Module({
  providers: [ImagenService],
  controllers: [ImagenController]
})
export class ImagenModule {}
