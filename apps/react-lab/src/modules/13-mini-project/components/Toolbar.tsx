import type { RoleOption } from '../types';

interface ToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    roleFilter: number | 'All';
    onRoleFilterChange: (value: number | 'All') => void;
    influenceFilter: number | 'All';
    onInfluenceFilterChange: (value: number | 'All') => void;
    availableRoles: RoleOption[];
    totalCount: number;
    filteredCount: number;
}

export function Toolbar({search, onSearchChange, roleFilter, onRoleFilterChange, influenceFilter,
onInfluenceFilterChange, availableRoles, totalCount, filteredCount}: ToolbarProps) {
    return (
        <div className="stakeholder-toolbar">
            <div className="stakeholder-filters">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="stakeholder-filters-search"
                />

                <select
                    value={roleFilter}
                    onChange={(e) =>
                        onRoleFilterChange(e.target.value === 'All' ? 'All' : Number(e.target.value))
                    }
                    className="stakeholder-filters-select"
                >
                    <option value="All">Усі ролі</option>
                    {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.title}
                        </option>
                    ))}
                </select>

                <select
                    value={influenceFilter}
                    onChange={(e) =>
                        onInfluenceFilterChange(e.target.value === 'All' ? 'All' : Number(e.target.value))
                    }
                    className="stakeholder-filters-select"
                >
                    <option value="All">Всі впливи</option>
                    <option value={1}>1 — Дуже низький</option>
                    <option value={2}>2 — Низький</option>
                    <option value={3}>3 — Середній</option>
                    <option value={4}>4 — Високий</option>
                    <option value={5}>5 — Критичний</option>
                </select>
            </div>

            <div className="stakeholder-page-counter">
                Показано: <strong>{filteredCount}</strong> із <strong>{totalCount}</strong>
            </div>
        </div>
    );
}