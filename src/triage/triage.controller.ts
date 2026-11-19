import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiServiceUnavailableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TriageRequestDto } from './dto/triage-request.dto.js';
import { TriageResponseDto } from './dto/triage-response.dto.js';
import { TriageService } from './triage.service.js';

@ApiTags('TriageAgent')
@Controller('triage-ticket-case')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Triage a support ticket',
    description:
      'Sample request payloads are available in the project examples/ folder: billing.json, outage.json, and appearance.json.',
  })
  @ApiOkResponse({ type: TriageResponseDto })
  @ApiServiceUnavailableResponse({
    description:
      'AI service unavailable, API key missing, or OpenAI quota/rate limit reached.',
  })
  triage(@Body() request: TriageRequestDto): Promise<TriageResponseDto> {
    return this.triageService.triage(request);
  }
}
