import { teamMembers } from './data';
import { filterByRole, countAvailable, formatMember } from './functions';
import { Role } from './types';

console.log("Фільтрація за роллю:");
const roles: Role[] = ['frontend', 'backend', 'fullstack'];
for (const role of roles) {
    const members = filterByRole(teamMembers, role);
    console.log(`Роль ${role}: ${members.length} осіб`);
    members.forEach((member) => console.log(formatMember(member)));
}

const available = countAvailable(teamMembers);
console.log("Кількість доступних учасників команди: ", available);

console.log('Учасники без аватара');
const membersWithoutAvatar = teamMembers.filter((m) => m.avatarUrl === undefined);
membersWithoutAvatar.forEach((member) => {
    console.log(formatMember(member));
});