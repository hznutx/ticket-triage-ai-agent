import { ApiProperty } from '@nestjs/swagger';
import {
  DECISIONS,
  ISSUE_TYPES,
  CASE_SENSITIVE,
  URGENT_LEVELS,
} from '../../agents-connect/interfaces/agent-triage.interface.js';
import type {
  AgentTriageResult,
  Decision,
  IssueType,
  Sentiment,
  Urgency,
} from '../../agents-connect/interfaces/agent-triage.interface.js';

export class MessageTimeDto {
  @ApiProperty({ example: 1 })
  message_index: number;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ example: '2 วันที่แล้ว' })
  relative_time: string;
}

export class TriageResponseDto implements AgentTriageResult {
  @ApiProperty({ format: 'date-time' })
  analyzed_at: string;

  @ApiProperty({ type: [MessageTimeDto] })
  message_times: MessageTimeDto[];

  @ApiProperty({ enum: URGENT_LEVELS })
  priority_level: Urgency;

  @ApiProperty()
  product: string;

  @ApiProperty({ enum: ISSUE_TYPES, isArray: true })
  issue_types: IssueType[];

  @ApiProperty({ enum: CASE_SENSITIVE })
  case_sensitive: Sentiment;

  @ApiProperty({ enum: DECISIONS })
  decision: Decision;

  @ApiProperty({ type: String, nullable: true })
  route_to: string | null;

  @ApiProperty()
  rationale: string;

  @ApiProperty()
  suggested_reply: string;

  @ApiProperty()
  uncertainty: string;

  @ApiProperty({ type: [String] })
  knowledge_refs: string[];
}
