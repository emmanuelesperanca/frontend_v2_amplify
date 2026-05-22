// ──────────────────────────────────────────────
// Core domain types
// ──────────────────────────────────────────────

export interface Agent {
  /** Matches the AgentCore runtime name (e.g. "SupervisorAgent") */
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;              // 2-char initials, e.g. 'NS', 'RH', 'OP'
  /** Tailwind gradient classes for the card accent */
  gradient: string;
  accentColor: string;       // hex, used for avatar ring
  specialty: string;
  tags: string[];
  welcomeMessage: string;
  suggestedPrompts: string[];
  runtimeArn: string;
  /** AWS region where this runtime lives */
  region: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentId: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Serialised form stored in localStorage (dates → ISO strings)
export interface StoredConversation {
  id: string;
  agentId: string;
  title: string;
  messages: Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatAPIRequest {
  prompt: string;
  agentId: string;
  sessionId: string;
}

export interface ChatAPIResponse {
  response: string;
  sessionId: string;
  durationMs?: number;
}
