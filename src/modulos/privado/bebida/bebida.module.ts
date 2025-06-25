import { Module } from '@nestjs/common';
import { BebidaService } from './bebida.service';
import { BebidaController } from './bebida.controller';

@Module({
  providers: [BebidaService],
  controllers: [BebidaController]
})
export class BebidaModule {}
