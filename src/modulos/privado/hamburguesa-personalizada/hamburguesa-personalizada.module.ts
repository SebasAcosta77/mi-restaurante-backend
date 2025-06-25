import { Module } from '@nestjs/common';
import { HamburguesaPersonalizadaService } from './hamburguesa-personalizada.service';
import { HamburguesaPersonalizadaController } from './hamburguesa-personalizada.controller';

@Module({
  providers: [HamburguesaPersonalizadaService],
  controllers: [HamburguesaPersonalizadaController]
})
export class HamburguesaPersonalizadaModule {}
