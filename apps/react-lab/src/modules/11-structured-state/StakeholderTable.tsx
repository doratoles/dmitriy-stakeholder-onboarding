import type { Stakeholder } from './types';
import { StakeholderEditor } from './StakeholderEditor';

interface StakeholderTableProps {
    items: Stakeholder[];
    editingId: string | number | null;
    onEdit: (id: string | number) => void;
    onSave: (updated: Stakeholder) => void;
    onCancel: () => void;
    onDelete: (id: string | number) => void;
}

export function StakeholderTable({ items, editingId, onEdit, onSave, onCancel, onDelete }: StakeholderTableProps) {
    if (items.length === 0) {
        return (
            <div className="stakeholder-empty-state">
                Нічого не знайдено за заданими критеріями пошуку та фільтрації.
            </div>
        );
    }

    return (
        <table className="stakeholder-table">
            <thead>
            <tr className="stakeholder-table-head-row">
                <th className="stakeholder-table-th">Ім'я</th>
                <th className="stakeholder-table-th">Роль</th>
                <th className="stakeholder-table-th">Організація</th>
                <th className="stakeholder-table-th stakeholder-table-th-actions">Дії</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item) =>
                editingId === item.id ? (
                    <StakeholderEditor
                        key={item.id}
                        stakeholder={item}
                        onSave={onSave}
                        onCancel={onCancel}
                    />
                ) : (
                    <tr key={item.id} className="stakeholder-table-row">
                        <td className="stakeholder-table-cell">{item.name}</td>
                        <td className="stakeholder-table-cell stakeholder-table-cell-role">
                            {item.role}
                        </td>
                        <td className="stakeholder-table-cell">{item.organization}</td>
                        <td className="stakeholder-table-cell stakeholder-table-cell-actions">
                            <button
                                onClick={() => onEdit(item.id)}
                                className="stakeholder-btn stakeholder-btn-edit"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="stakeholder-btn stakeholder-btn-delete"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
}