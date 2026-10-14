import { useState } from 'react';
import type { Stakeholder } from './types';
import { initialStakeholders } from './initialStakeholders';
import { StakeholderTable } from './StakeholderTable';
import { StakeholderCreateForm } from './StakeholderEditor';

const FILTER_ROLES = [
    'Замовник / Клієнт',
    'Product Manager',
    'Tech Lead / Розробник',
    'Інвестор',
];

export function StructuredStatePage() {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholders);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const normalizedQuery = search.trim().toLowerCase();
    const filteredStakeholders = stakeholders.filter((item) => {
        const matchesRole = roleFilter === 'All' || item.role === roleFilter;
        const matchesSearch =
            normalizedQuery === '' ||
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.organization.toLowerCase().includes(normalizedQuery);

        return matchesRole && matchesSearch;
    });

    const handleCreate = (data: Omit<Stakeholder, 'id'>) => {
        const newStakeholder: Stakeholder = {
            id: crypto.randomUUID(),
            ...data,
        };
        setStakeholders((prev) => [...prev, newStakeholder]);
    };

    const handleSave = (updated: Stakeholder) => {
        setStakeholders((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleDelete = (id: string | number) => {
        setStakeholders((prev) => prev.filter((item) => item.id !== id));
        if (editingId === id) {
            setEditingId(null);
        }
    };

    return (
        <div className="stakeholder-page">
            <h2 className="stakeholder-page-title">Управління стейкхолдерами</h2>

            <StakeholderCreateForm onCreate={handleCreate} />

            <div className="stakeholder-filters">
                <input
                    type="text"
                    placeholder="Пошук за ім'ям або організацією..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="stakeholder-filters-search"
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="stakeholder-filters-role-select"
                >
                    <option value="All">Усі ролі</option>
                    {FILTER_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="stakeholder-page-counter">
                Показано: {filteredStakeholders.length} із {stakeholders.length}
            </div>

            <StakeholderTable
                items={filteredStakeholders}
                editingId={editingId}
                onEdit={(id) => setEditingId(id)}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </div>
    );
}