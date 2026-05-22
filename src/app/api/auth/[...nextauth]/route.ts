import { handlers } from '@/auth';

// Expose GET and POST to NextAuth's internal handler
export const { GET, POST } = handlers;
