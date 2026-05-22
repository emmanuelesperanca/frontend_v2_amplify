import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Minimum 33 characters as required by AgentCore Runtime */
export function generateSessionId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `session-${ts}-${rand}`.slice(0, 48);
}

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function truncate(str: string, max = 60): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export function firstLine(text: string): string {
  return text.split('\n')[0].replace(/[#*`]/g, '').trim();
}
