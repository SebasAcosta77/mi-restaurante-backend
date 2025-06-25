import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { SendGridModule } from 'common/services/sendgrid.module';


@Module({
  imports: [SendGridModule],
  providers: [PedidoService],
  controllers: [PedidoController]
})
export class PedidoModule {}
