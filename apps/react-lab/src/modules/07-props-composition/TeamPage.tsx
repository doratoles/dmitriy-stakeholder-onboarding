import { teamMembers } from './data';
import { TeamList } from "./TeamList";
export function TeamPage() {
    return (
        <TeamList members={teamMembers} />
    )
}