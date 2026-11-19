export const URGENT_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export const CASE_SENSITIVE = [
  'Negative',
  'Concerned',
  'Normal',
  'Positive',
] as const;
export const DECISIONS = [
  'auto_respond',
  'route_specialist',
  'escalate',
  'request_info',
] as const;
export const ISSUE_TYPES = [
  'billing',
  'outage',
  'bug',
  'feature_request',
  'how_to',
  'account',
  'other',
] as const;

export type Urgency = (typeof URGENT_LEVELS)[number];
export type Sentiment = (typeof CASE_SENSITIVE)[number];
export type Decision = (typeof DECISIONS)[number];
export type IssueType = (typeof ISSUE_TYPES)[number];

export interface AgentTicketMessage {
  updatedAt: string;
  user_detail: string;
}

export interface AgentTriageRequest {
  customer_info: {
    id?: string | null;
    planType: 'Free' | 'Pro' | 'Enterprise';
    userName?: string | null;
    region?: string | null;
    seats?: number | null;
    tenureMonths?: number | null;
    notes?: string | null;
  };
  messages: AgentTicketMessage[];
}

export interface AgentTriageResult {
  analyzed_at: string;
  message_times: {
    message_index: number;
    updatedAt: string;
    relative_time: string;
  }[];
  priority_level: Urgency;
  product: string;
  issue_types: IssueType[];
  case_sensitive: Sentiment;
  decision: Decision;
  route_to: string | null;
  rationale: string;
  suggested_reply: string;
  uncertainty: string;
  knowledge_refs: string[];
}
