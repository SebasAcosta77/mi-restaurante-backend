// src/common/services/sendgrid.module.ts
import { Module } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
