import { notFound } from 'next/navigation';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { AGENTS } from '@/lib/agents';

interface Props {
  params: Promise<{ agentId: string }>;
}

export async function generateStaticParams() {
  return AGENTS.map((a) => ({ agentId: a.id }));
}

export default async function ChatPage({ params }: Props) {
  const { agentId } = await params;
  const agent = AGENTS.find((a) => a.id === agentId);
  if (!agent) notFound();

  return <ChatLayout agentId={agentId} />;
}
