import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import type {
  AgentTriageRequest,
  AgentTriageResult,
} from './interfaces/agent-triage.interface.js';

const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);

@Injectable()
export class AgentServiceClient {
  constructor(private readonly http: HttpService) {}

  async triage(request: AgentTriageRequest): Promise<AgentTriageResult> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<AgentTriageResult>(
          '/api/v1/triage-ticket-case',
          request,
        ),
      );
      return data;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): Error {
    if (!isAxiosError(error)) {
      return new BadGatewayException('AI service request failed');
    }
    if (
      (error.code && TIMEOUT_CODES.has(error.code)) ||
      error.response?.status === 504
    ) {
      return new GatewayTimeoutException('AI service timed out');
    }
    if (error.response?.status === 503) {
      const safeMessages = new Set([
        'OpenAI API credits are exhausted. Check billing for the configured API key.',
        'OpenAI rate limit reached. Please retry later.',
        'Configure OPENAI_API_KEY in the server environment',
      ]);
      const detail: unknown = error.response.data?.detail;
      return new ServiceUnavailableException(
        typeof detail === 'string' && safeMessages.has(detail)
          ? detail
          : 'AI service is unavailable',
      );
    }
    if (error.response) {
      return new BadGatewayException('AI service returned an error');
    }
    return new ServiceUnavailableException('AI service is unavailable');
  }
}
