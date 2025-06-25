import { Module } from '@nestjs/common';
import { AdicionService } from './adicion.service';
import { AdicionController } from './adicion.controller';

@Module({
  providers: [AdicionService],
  controllers: [AdicionController]
})
export class AdicionModule {}
