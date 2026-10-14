import React, { useState } from 'react';
import type { Stakeholder } from './types';

const ROLES = [
    'Замовник / Клієнт',
    'Product Manager',
    'Tech Lead / Розробник',
    'Інвестор',
];

interface StakeholderEditorProps {
    stakeholder: Stakeholder;
    onSave: (updated: Stakeholder) => void;
    onCancel: () => void;
}

export function StakeholderEditor({ stakeholder, onSave, onCancel }: StakeholderEditorProps) {
    const [draft, setDraft] = useState<Stakeholder>({ ...stakeholder });

    const handleSave = () => {
        if (!draft.name.trim() || !draft.organization.trim()) {
            return;
        }
        onSave(draft);
    };

    return (
        <tr className="stakeholder-table-row stakeholder-editor-row">
            <td className="stakeholder-table-cell">
                <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="stakeholder-editor-row-input"
                />
            </td>
            <td className="stakeholder-table-cell">
                <select
                    value={draft.role}
                    onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    className="stakeholder-editor-row-select"
                >
                    {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </td>
            <td className="stakeholder-table-cell">
                <input
                    type="text"
                    value={draft.organization}
                    onChange={(e) => setDraft({ ...draft, organization: e.target.value })}
                    className="stakeholder-editor-row-input"
                />
            </td>
            <td className="stakeholder-table-cell stakeholder-table-cell-actions">
                <button
                    onClick={handleSave}
                    className="stakeholder-btn stakeholder-btn-save"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="stakeholder-btn stakeholder-btn-cancel"
                >
                    Cancel
                </button>
            </td>
        </tr>
    );
}

interface StakeholderCreateFormProps {
    onCreate: (data: Omit<Stakeholder, 'id'>) => void;
}

export function StakeholderCreateForm({ onCreate }: StakeholderCreateFormProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(ROLES[0]);
    const [organization, setOrganization] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !organization.trim()) return;

        onCreate({
            name: name.trim(),
            role,
            organization: organization.trim(),
        });

        setName('');
        setRole(ROLES[0]);
        setOrganization('');
    };

    return (
        <form onSubmit={handleSubmit} className="stakeholder-create-form">
            <input
                type="text"
                placeholder="ПІБ стейкхолдера"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="stakeholder-create-form-input"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="stakeholder-create-form-select"
            >
                {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Організація"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="stakeholder-create-form-input"
            />
            <button type="submit" className="stakeholder-create-form-btn">
                Додати
            </button>
        </form>
    );
}