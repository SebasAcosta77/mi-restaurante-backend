import { Module } from '@nestjs/common';
import { SalsaService } from './salsa.service';
import { SalsaController } from './salsa.controller';

@Module({
  providers: [SalsaService],
  controllers: [SalsaController]
})
export class SalsaModule {}
