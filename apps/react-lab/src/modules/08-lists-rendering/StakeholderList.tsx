import type { Stakeholder, Category } from "./types";

interface StakeholdersProps {
    stakeholders: Stakeholder[];
}

type GroupedStakeholders = Record<Category, Stakeholder[]>;

export function StakeholderList({ stakeholders }: StakeholdersProps) {
    if (stakeholders.length === 0) {
        return <div className="stakeholder-empty">No stakeholders found</div>;
    }

    const initialGroups: GroupedStakeholders = { internal: [], external: [] };

    const groupedStakeholders = stakeholders.reduce(
        (acc: GroupedStakeholders, item: Stakeholder) => {
            acc[item.category].push(item);
            return acc;
        },
        initialGroups
    );

    return (
        <div className="stakeholder-list">
            {groupedStakeholders.internal.length > 0 && (
            <section className="stakeholder-group">
                <h3 className="stakeholder-group-title">Internal</h3>
                <ul className="stakeholder-items">
                    {groupedStakeholders.internal.map(stakeholder => (
                        <li key={stakeholder.id} className="stakeholder-card">
                            <div className="stakeholder-info">
                                <strong className="stakeholder-name">{stakeholder.name}</strong>
                                {stakeholder.organization ? (
                                    <div className="stakeholder-org">{stakeholder.organization}</div>
                                ) : (
                                    <div className="stakeholder-org-missing">Organization not specified</div>
                                )}
                            </div>
                            <div className={`stakeholder-badge stakeholder-badge--${stakeholder.influence}`}>
                                {stakeholder.influence}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            )}
            {groupedStakeholders.external.length > 0 && (
            <section className="stakeholder-group">
                <h3 className="stakeholder-group-title">External</h3>
                <ul className="stakeholder-items">
                    {groupedStakeholders.external.map(stakeholder => (
                        <li key={stakeholder.id} className="stakeholder-card">
                            <div className="stakeholder-info">
                                <strong className="stakeholder-name">{stakeholder.name}</strong>
                                {stakeholder.organization ? (
                                    <div className="stakeholder-org">{stakeholder.organization}</div>
                                ) : (
                                    <div className="stakeholder-org-missing">Organization not specified</div>
                                )}
                            </div>
                            <div className={`stakeholder-badge stakeholder-badge--${stakeholder.influence}`}>
                                {stakeholder.influence}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            )}
        </div>
    );
}