interface SkillBadgeProps {
    skill: string;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
    return <div className="skill-badge">{skill}</div>;
}