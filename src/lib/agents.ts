import { Agent } from '@/types';

// ──────────────────────────────────────────────
// Agent registry — driven by agentcore.json
// ──────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: 'SupervisorAgent',
    name: 'Neoson',
    description: 'Intelligent supervisor for Straumann Group. Answers HR, Operations questions and much more.',
    longDescription:
      'Neoson is the corporate supervisor assistant for Straumann Group. It coordinates specialized HR and Operations agents to deliver complete answers, queries internal knowledge bases, and has internet access for external information such as exchange rates, technical standards, and news.',
    icon: 'NS',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    specialty: 'Corporate Supervisor',
    tags: ['HR', 'Operations', 'Web', 'Exchange Rate', 'General'],
    welcomeMessage:
      'Hello! I\'m **Neoson**, your intelligent corporate assistant for Straumann Group. I can help you with HR matters, factory operations, currency quotes, and much more. How can I help you today?',
    suggestedPrompts: [
      'What are the meal voucher benefits?',
      'What is the current USD exchange rate?',
      'How do I request vacation?',
    ],
    runtimeArn:
      process.env.AGENT_ARN_SUPERVISOR ?? '',
    region: process.env.AGENT_REGION ?? 'us-east-2',
  },
  {
    id: 'HRAgentTestAgentCore',
    name: 'HR Agent',
    description: 'Human Resources specialist — benefits, vacation, payroll, and personnel policies.',
    longDescription:
      'The HR Agent is a specialist in all matters related to Human Resources at Straumann Group. It queries the internal knowledge base to answer questions about benefits, onboarding and offboarding processes, vacation policies, payroll, health plans, and much more.',
    icon: 'HR',
    gradient: 'from-blue-500 to-indigo-600',
    accentColor: '#6366f1',
    specialty: 'Human Resources',
    tags: ['Benefits', 'Vacation', 'Payroll', 'Policies', 'Career'],
    welcomeMessage:
      'Hello! I\'m the **HR Agent** at Straumann Group. I\'m here to help you with questions about benefits, vacation, personnel policies, payroll, and any Human Resources matter. How can I help you?',
    suggestedPrompts: [
      'How does the health plan work?',
      'What is the process for requesting maternity leave?',
      'What are the transportation allowance benefits?',
    ],
    runtimeArn:
      process.env.AGENT_ARN_HR ?? '',
    region: process.env.AGENT_REGION ?? 'us-east-2',
  },
  {
    id: 'RegulatoryAgent',
    name: 'Regulatory Agent',
    description: 'Regulatory affairs specialist — ANVISA, FDA, CE Mark, ISO 13485, and medical device compliance.',
    longDescription:
      'The Regulatory Agent is a specialist in regulatory affairs for Straumann Group. It queries the regulatory knowledge base to answer questions about ANVISA registrations, FDA guidelines, CE Mark requirements, ISO 13485 compliance, post-market surveillance, technical dossiers, and regulatory compliance in different markets.',
    icon: 'RA',
    gradient: 'from-violet-500 to-purple-600',
    accentColor: '#8b5cf6',
    specialty: 'Regulatory Affairs',
    tags: ['ANVISA', 'FDA', 'CE Mark', 'ISO 13485', 'Compliance', 'Devices'],
    welcomeMessage:
      'Hello! I\'m the **Regulatory Agent** at Straumann Group. I can help you with questions about regulatory compliance, device registrations (ANVISA, FDA, CE Mark), ISO 13485 standards, post-market surveillance, and technical dossiers. How can I help you?',
    suggestedPrompts: [
      'What are the ANVISA requirements for dental implant registration?',
      'What documents are needed for CE Mark certification?',
      'What does ISO 13485 require for risk management?',
    ],
    runtimeArn:
      process.env.AGENT_ARN_REGULATORY ?? '',
    region: process.env.AGENT_REGION ?? 'us-east-2',
  },
  {
    id: 'OperationsAgent',
    name: 'Operations Agent',
    description: 'Shop floor specialist — production, quality, maintenance, and manufacturing processes.',
    longDescription:
      'The Operations Agent is a specialist in industrial operations at Straumann Group. It answers questions about production processes, quality standards, equipment maintenance, production indicators, workplace safety, and standard operating procedures.',
    icon: 'OP',
    gradient: 'from-orange-500 to-amber-600',
    accentColor: '#f59e0b',
    specialty: 'Industrial Operations',
    tags: ['Production', 'Quality', 'Maintenance', 'Safety', 'Processes'],
    welcomeMessage:
      'Hello! I\'m the **Operations Agent** at Straumann Group. I can assist you with questions about production processes, equipment maintenance, quality indicators, and shop floor operations. How can I help you?',
    suggestedPrompts: [
      'How do I file a non-conformance report?',
      'What are the safety procedures for the production line?',
      'How do I request equipment maintenance?',
    ],
    runtimeArn:
      process.env.AGENT_ARN_OPERATIONS ?? '',
    region: process.env.AGENT_REGION ?? 'us-east-2',
  },
];

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
