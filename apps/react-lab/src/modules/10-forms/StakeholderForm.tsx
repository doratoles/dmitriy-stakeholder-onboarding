import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { StakeholderFormValues } from "./types";

const initialStakeholderValues: StakeholderFormValues = {
    name: '',
    email: '',
    role: 0,
    influence: 3,
    notes: [],
};

const availableRoles = [
    { id: 1, title: 'Замовник / Клієнт' },
    { id: 2, title: 'Product Manager' },
    { id: 3, title: 'Tech Lead / Розробник' },
    { id: 4, title: 'Інвестор' },
];

export function StakeholderForm() {
    const [formData, setFormData] = useState<StakeholderFormValues>(initialStakeholderValues);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const fieldName = name as keyof StakeholderFormValues;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldName === 'role' || fieldName === 'influence' ? Number(value) : value,
        }));
    };

    const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const lines = e.target.value === '' ? [] : e.target.value.split('\n');
        setFormData((prev) => ({
            ...prev,
            notes: lines,
        }));
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Дані форми:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="stakeholder-name">Ім'я:</label>
                <input
                    id="stakeholder-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="stakeholder-email">Email:</label>
                <input
                    id="stakeholder-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="stakeholder-role">Роль:</label>
                <select
                    id="stakeholder-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value={0} disabled>Оберіть роль...</option>
                    {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="stakeholder-influence">Рівень впливу:</label>
                <select
                    id="stakeholder-influence"
                    name="influence"
                    value={formData.influence}
                    onChange={handleChange}
                >
                    <option value={1}>1 — Дуже низький</option>
                    <option value={2}>2 — Низький</option>
                    <option value={3}>3 — Середній</option>
                    <option value={4}>4 — Високий</option>
                    <option value={5}>5 — Критичний</option>
                </select>
            </div>

            <div>
                <label htmlFor="stakeholder-notes">
                    Нотатки:
                </label>
                <textarea
                    id="stakeholder-notes"
                    name="notes"
                    value={formData.notes.join('\n')}
                    onChange={handleNotesChange}
                    rows={4}
                    placeholder="Введіть кожен запис з нового рядка..."
                />
            </div>

            <button type="submit">Зберегти</button>
        </form>
    );
}