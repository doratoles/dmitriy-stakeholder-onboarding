import { Card } from './Card';
import { SkillBadge } from './SkillBadge';
import type { TeamMember } from './types';

interface TeamMemberCardProps {
    member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
    return (
        <Card>
            <div className="card-header">
                {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="avatar" />
                ) : (
                    <div className="avatar avatar-fallback" aria-label={member.name}>
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className={`status-badge ${member.availability}`}>
                        {member.availability === 'available' ? 'Вільний(-а)' : 'Зайнятий(-а)'}
                    </div>
                </div>
            </div>

            <div className="member-role">
                <strong>Роль:</strong> {member.role}
            </div>

            <p className="member-bio">{member.bio}</p>

            <div className="skills-list">
                {member.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} />
                ))}
            </div>
        </Card>
    )
}