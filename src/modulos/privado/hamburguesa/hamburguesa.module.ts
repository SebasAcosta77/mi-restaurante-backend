import { Module } from '@nestjs/common';
import { HamburguesaService } from './hamburguesa.service';
import { HamburguesaController } from './hamburguesa.controller';

@Module({
  providers: [HamburguesaService],
  controllers: [HamburguesaController]
})
export class HamburguesaModule {}
