import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgentServiceClient } from './agent-service.client.js';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>(
          'AGENT_SERVICE_URL',
          'http://localhost:8000',
        ),
        timeout: Number(config.get('AGENT_SERVICE_TIMEOUT_MS', 30000)),
      }),
    }),
  ],
  providers: [AgentServiceClient],
  exports: [AgentServiceClient],
})
export class AgentModule {}
