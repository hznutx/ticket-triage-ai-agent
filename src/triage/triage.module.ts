import { Module } from '@nestjs/common';
import { AgentModule } from '../agents-connect/agent.module.js';
import { TriageController } from './triage.controller.js';
import { TriageService } from './triage.service.js';

@Module({
  imports: [AgentModule],
  controllers: [TriageController],
  providers: [TriageService],
})
export class TriageModule {}
