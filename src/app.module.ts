import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TriageModule } from './triage/triage.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TriageModule],
})
export class AppModule {}
