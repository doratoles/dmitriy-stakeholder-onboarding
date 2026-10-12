import type { Stakeholder } from "./types";

interface StakeholderRowProps {
    stakeholder: Stakeholder;
    onToggle: (id: number, selected: boolean) => void;
    onRemove: (id: number) => void;
}

export function StakeholderRow({ stakeholder, onToggle, onRemove }: StakeholderRowProps) {
    return (
        <li className={`stakeholder-item ${stakeholder.selected ? 'is-selected' : ''}`}>
            <div className="stakeholder-info">{stakeholder.name}
                {stakeholder.selected ? (<div className="status-badge">(обрано)</div>) : ''}
            </div>

            <div className="stakeholder-actions">
                <button className="btn-base btn-toggle" onClick={() =>
                    onToggle(
                        stakeholder.id,
                        !stakeholder.selected
                    )
                }>
                    Select/Unselect
                </button>

                <button className="btn-base btn-remove" onClick={() =>
                    onRemove(
                        stakeholder.id
                    )
                }>
                    Remove
                </button>
            </div>
        </li>
    );
}