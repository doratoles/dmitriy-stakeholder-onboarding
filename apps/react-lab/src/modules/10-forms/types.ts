export interface StakeholderFormValues {
    name: string;
    email: string;
    role: number;
    influence: number;
    notes: string[];
}
export interface RoleOption {
    id: number;
    title: string;
}