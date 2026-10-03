import { TeamMember } from './types';

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'Дмитро',
        role: 'fullstack',
        skills: ['Git', 'Vue.js', 'Node.js',  'Laravel', 'SQL'],
        availability: 'available'
    },
    {
        id: 2,
        name: 'Катерина',
        role: 'fullstack',
        skills: ['Git', 'TypeScript', 'React', 'Laravel', 'Inertia'],
        availability: 'busy'
    },
    {
        id: 3,
        name: 'Ігор',
        role: 'backend',
        skills: ['Go', 'Redis', 'Kubernetes'],
        availability: 'available',
        avatarUrl: 'https://avatars.com/avatars/3.png'
    },
    {
        id: 4,
        name: 'Олена',
        role: 'frontend',
        skills: ['TypeScript', 'React', 'Tailwind CSS'],
        availability: 'available',
        avatarUrl: 'https://avatars.com/avatars/4.png'
    },
    {
        id: 5,
        name: 'Максим',
        role: 'backend',
        skills: ['Node.js', 'PostgreSQL', 'Docker'],
        availability: 'busy',
        avatarUrl: 'https://avatars.com/avatars/5.png'
    }
];