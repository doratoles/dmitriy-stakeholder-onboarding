import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import {
    type Stakeholder,
    type RoleOption,
    type StakeholderInput,
    type StakeholderFormValues,
    type FormErrors,
} from '../types';

interface StakeholderFormProps {
    initialData?: Stakeholder | null;
    availableRoles: RoleOption[];
    onSubmit: (data: StakeholderInput) => Promise<void>;
    onCancel: () => void;
}

const initialStakeholderValues: StakeholderFormValues = {
    name: '',
    email: '',
    role: 0,
    organization: '',
    influence: 0,
};

export function StakeholderForm({initialData, availableRoles, onSubmit, onCancel}: StakeholderFormProps) {
    const isEditing = Boolean(initialData?.id);

    const [formData, setFormData] = useState<StakeholderFormValues>(() => {
        if (initialData) {
            return {
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
                organization: initialData.organization,
                influence: initialData.influence,
            };
        }
        return initialStakeholderValues;
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const fieldName = name as keyof StakeholderFormValues;

        setFormData((prev) => ({
            ...prev,
            [fieldName]:
                fieldName === 'role' || fieldName === 'influence' ? Number(value) : value,
        }));

        if (errors[fieldName]) {
            setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
    };

    const handleClear = () => {
        setFormData(initialStakeholderValues);
        setErrors({});
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

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
            currentErrors.role = 'Оберіть роль';
        }

        if (!formData.organization.trim()) {
            currentErrors.organization = "Організація є обов'язковим полем";
        }

        if (!formData.influence || formData.influence === 0) {
            currentErrors.influence = 'Оберіть рівень впливу';
        }

        setErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit({
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                organization: formData.organization.trim(),
                influence: formData.influence,
            });

            setFormData(initialStakeholderValues);
            setErrors({});
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : 'Не вдалося зберегти запис'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="stakeholder-form-wrapper">
            <form className="stakeholder-form" onSubmit={handleSubmit}>
                <h3 className="stakeholder-page-title" style={{fontSize: '18px'}}>
                    {isEditing ? `Редагування: ${initialData?.name}` : 'Створити нового стейкхолдера'}
                </h3>

                {submitError && (
                    <div className="form-error-alert" role="alert">
                        {submitError}
                    </div>
                )}

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
                        <label className="form-label" htmlFor="stakeholder-organization">Організація:</label>
                        {errors.organization && (
                            <div role="alert" className="form-error-alert">
                                {errors.organization}
                            </div>
                        )}
                    </div>
                    <input
                        id="stakeholder-organization"
                        name="organization"
                        type="text"
                        className={`form-control-input ${errors.organization ? 'input-has-error' : ''}`}
                        value={formData.organization}
                        onChange={handleChange}
                    />
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

                <div className="form-actions" style={{justifyContent: 'flex-end'}}>
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Збереження...' : isEditing ? 'Зберегти' : 'Створити'}
                    </button>
                    <button type="button" className="btn-clear" onClick={handleClear} disabled={isSubmitting}>
                        Очистити
                    </button>
                    <button type="button" className="btn-clear" onClick={onCancel} disabled={isSubmitting}>
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}