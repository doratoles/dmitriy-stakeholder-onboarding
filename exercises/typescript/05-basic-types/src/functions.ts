import { TeamMember, Role } from './types';

export function filterByRole(members: TeamMember[], role: Role): TeamMember[] {
    return members.filter((member) => member.role === role);
}

export function countAvailable(members: TeamMember[]): number {
    return members.filter((member) => member.availability === 'available').length;
}

export function formatMember(member: TeamMember): string {
    const avatarUrl = member.avatarUrl ? member.avatarUrl : 'не має аватара';
    const skillsList = member.skills.join(', ');

    return `${member.id}. ${member.name} (${member.role.toUpperCase()}) | Навички: [${skillsList}] | Статус: ${member.availability} | Аватар: ${avatarUrl}`;
}