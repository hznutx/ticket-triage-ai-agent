import { Injectable } from '@nestjs/common';
import { AgentServiceClient } from '../agents-connect/agent-service.client.js';
import { TriageRequestDto } from './dto/triage-request.dto.js';
import { AgentTriageResult } from '../agents-connect/interfaces/agent-triage.interface.js';

@Injectable()
export class TriageService {
  constructor(private readonly agentClient: AgentServiceClient) {}

  triage(request: TriageRequestDto): Promise<AgentTriageResult> {
    return this.agentClient.triage(request);
  }
}
