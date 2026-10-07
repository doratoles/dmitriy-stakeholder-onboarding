export type Role = 'frontend' | 'backend' | 'fullstack';
export type Availability = 'available' | 'busy';

export interface TeamMember {
    id: number;
    name: string;
    role: Role;
    bio: string;
    skills: string[];
    availability: Availability;
    avatarUrl?: string;
}