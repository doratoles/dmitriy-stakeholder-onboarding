export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
}