import type { Stakeholder, RoleOption } from '../types';

interface StakeholderListProps {
    items: Stakeholder[];
    availableRoles: RoleOption[];
    onEdit: (stakeholder: Stakeholder) => void;
    onDelete: (id: number) => void;
}

export function StakeholderList({items, availableRoles, onEdit, onDelete}: StakeholderListProps) {
    if (items.length === 0) {
        return (
            <div className="stakeholder-empty-state">
                Нічого не знайдено за заданими критеріями пошуку та фільтрації.
            </div>
        );
    }

    const getRoleTitle = (roleId: number) => {
        return availableRoles.find((r) => r.id === roleId)?.title || `ID: ${roleId}`;
    };

    const handleDeleteClick = (stakeholder: Stakeholder) => {
        const isConfirmed = window.confirm(
            `Ви справді бажаєте видалити стейкхолдера "${stakeholder.name}"?`
        );
        if (isConfirmed) {
            onDelete(stakeholder.id);
        }
    };

    return (
        <table className="stakeholder-table">
            <thead>
            <tr className="stakeholder-table-head-row">
                <th className="stakeholder-table-th">Ім'я та Email</th>
                <th className="stakeholder-table-th">Роль</th>
                <th className="stakeholder-table-th">Організація</th>
                <th className="stakeholder-table-th">Вплив</th>
                <th className="stakeholder-table-th stakeholder-table-th-actions">Дії</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item) => (
                <tr key={item.id} className="stakeholder-table-row">
                    <td className="stakeholder-table-cell">
                        <div className="stakeholder-cell-name">{item.name}</div>
                        <div className="stakeholder-cell-email">{item.email}</div>
                    </td>
                    <td className="stakeholder-table-cell stakeholder-table-cell-role">
                        {getRoleTitle(item.role)}
                    </td>
                    <td className="stakeholder-table-cell">{item.organization}</td>
                    <td className="stakeholder-table-cell">
                        <div className="stakeholder-badge-influence">{item.influence}</div>
                    </td>
                    <td className="stakeholder-table-cell stakeholder-table-cell-actions">
                        <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="stakeholder-btn stakeholder-btn-edit"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(item)}
                            className="stakeholder-btn stakeholder-btn-delete"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}