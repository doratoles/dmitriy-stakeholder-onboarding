export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface Stakeholder {
    id: number;
    name: string;
    email: string;
    role: number;
    organization: string;
    influence: number;
}
export interface RoleOption {
    id: number;
    title: string;
}

export interface StakeholderFormValues {
    name: string;
    email: string;
    role: number;
    organization: string;
    influence: number;
}

export type StakeholderInput = Omit<Stakeholder, 'id'>;
export type FormErrors = Partial<Record<keyof StakeholderFormValues, string>>;