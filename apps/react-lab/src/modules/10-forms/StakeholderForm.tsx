import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { StakeholderFormValues, RoleOption } from "./types";

const initialStakeholderValues: StakeholderFormValues = {
    name: '',
    email: '',
    role: 0,
    influence: 0,
    notes: [],
};

const availableRoles: RoleOption[] = [
    { id: 1, title: 'Замовник / Клієнт' },
    { id: 2, title: 'Product Manager' },
    { id: 3, title: 'Tech Lead / Розробник' },
    { id: 4, title: 'Інвестор' },
];

type FormErrors = Partial<Record<keyof StakeholderFormValues, string>>;

export function StakeholderForm() {
    const [formData, setFormData] = useState<StakeholderFormValues>(initialStakeholderValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submittedData, setSubmittedData] = useState<StakeholderFormValues | null>(null);

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

    const handleClear = () => {
        setFormData(initialStakeholderValues);
        setErrors({});
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const currentErrors: FormErrors = {};

        if (!formData.name.trim()) {
            currentErrors.name = "Ім'я є обов'язковим полем";
        }

        if (!formData.email.trim()) {
            currentErrors.email = "Email є обов'язковим полем";
        } else if (!formData.email.includes('@')) {
            currentErrors.email = "Email повинен містити символ '@'";
        }

        if (!formData.role || formData.role === 0) {
            currentErrors.role = "Оберіть роль";
        }

        if (!formData.influence || formData.influence === 0) {
            currentErrors.influence = "Оберіть рівень впливу";
        }

        setErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            return;
        }

        setSubmittedData({ ...formData });

        setFormData(initialStakeholderValues);

        setErrors({});
    };

    const getRoleTitle = (roleId: number) => {
        return availableRoles.find((r) => r.id === roleId)?.title || `ID: ${roleId}`;
    };

    return (
        <div className="stakeholder-form-wrapper">
            <form className="stakeholder-form" onSubmit={handleSubmit}>
                <div className="form-field-group">
                    <div className="form-label-wrapper">
                        <label className="form-label" htmlFor="stakeholder-name">Ім'я:</label>
                        {errors.name && (
                            <div role="alert" className="form-error-alert">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <input
                        id="stakeholder-name"
                        name="name"
                        type="text"
                        className={`form-control-input ${errors.name ? 'input-has-error' : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field-group">
                    <div className="form-label-wrapper">
                        <label className="form-label" htmlFor="stakeholder-email">Email:</label>
                        {errors.email && (
                            <div role="alert" className="form-error-alert">
                                {errors.email}
                            </div>
                        )}
                    </div>
                    <input
                        id="stakeholder-email"
                        name="email"
                        type="email"
                        className={`form-control-input ${errors.email ? 'input-has-error' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field-group">
                    <div className="form-label-wrapper">
                        <label className="form-label" htmlFor="stakeholder-role">Роль:</label>
                        {errors.role && (
                            <div role="alert" className="form-error-alert">
                                {errors.role}
                            </div>
                        )}
                    </div>
                    <select
                        id="stakeholder-role"
                        name="role"
                        className={`form-control-select ${errors.role ? 'input-has-error' : ''}`}
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

                <div className="form-field-group">
                    <div className="form-label-wrapper">
                        <label className="form-label" htmlFor="stakeholder-influence">Рівень впливу:</label>
                        {errors.influence && (
                            <div role="alert" className="form-error-alert">
                                {errors.influence}
                            </div>
                        )}
                    </div>
                    <select
                        id="stakeholder-influence"
                        name="influence"
                        className={`form-control-select ${errors.influence ? 'input-has-error' : ''}`}
                        value={formData.influence}
                        onChange={handleChange}
                    >
                        <option value={0} disabled>Оберіть рівень впливу...</option>
                        <option value={1}>1 — Дуже низький</option>
                        <option value={2}>2 — Низький</option>
                        <option value={3}>3 — Середній</option>
                        <option value={4}>4 — Високий</option>
                        <option value={5}>5 — Критичний</option>
                    </select>
                </div>

                <div className="form-field-group">
                    <div className="form-label-wrapper">
                        <label className="form-label" htmlFor="stakeholder-notes">Нотатки:</label>
                    </div>
                    <textarea
                        id="stakeholder-notes"
                        name="notes"
                        className="form-control-textarea"
                        value={formData.notes.join('\n')}
                        onChange={handleNotesChange}
                        rows={4}
                        placeholder="Введіть кожен запис з нового рядка..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">Зберегти</button>
                    <button type="button" className="btn-clear" onClick={handleClear}>
                        Очистити
                    </button>
                </div>
            </form>

            {submittedData && (
                <section className="form-summary-card" aria-label="summary submitted values">
                    <h3 className="form-summary-title">Збережені дані</h3>
                    <ul className="form-summary-list">
                        <li><strong>Ім'я:</strong> {submittedData.name}</li>
                        <li><strong>Email:</strong> {submittedData.email}</li>
                        <li><strong>Роль:</strong> {getRoleTitle(submittedData.role)}</li>
                        <li><strong>Рівень впливу:</strong> {submittedData.influence}</li>
                        <li>
                            <strong>Нотатки ({submittedData.notes.length}):</strong>
                            {submittedData.notes.length > 0 ? (
                                <ul className="form-summary-notes-nested">
                                    {submittedData.notes.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            ) : (
                                <em> відсутні</em>
                            )}
                        </li>
                    </ul>
                </section>
            )}
        </div>
    );
}