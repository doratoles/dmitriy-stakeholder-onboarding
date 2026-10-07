import { TeamMemberCard } from "./TeamMemberCard";
import type { TeamMember } from "./types";

interface TeamListProps {
    members: TeamMember[];
}

export function TeamList({ members }: TeamListProps) {
    return (
        <div className="team-list">
            {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>
    );
}