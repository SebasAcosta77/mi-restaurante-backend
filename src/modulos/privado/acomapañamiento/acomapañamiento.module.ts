import { Module } from '@nestjs/common';
import { AcomapañamientoService } from './acomapañamiento.service';
import { AcomapañamientoController } from './acomapañamiento.controller';

@Module({
  providers: [AcomapañamientoService],
  controllers: [AcomapañamientoController]
})
export class AcomapañamientoModule {}
