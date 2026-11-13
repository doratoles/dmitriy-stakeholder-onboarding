import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import TrainingLayout from '@/Layouts/TrainingLayout';

export interface StakeholderEditData {
    id: number;
    name: string;
    email: string;
    role: number;
    organization_id: number;
    influence: number;
    notes?: string | null;
}

export interface RoleOption {
    id: number;
    title: string;
}

export interface OrganizationOption {
    id: number;
    name: string;
}

interface EditProps {
    stakeholder: StakeholderEditData;
    availableRoles: RoleOption[];
    availableOrganizations: OrganizationOption[];
}

export default function Edit({ stakeholder, availableRoles, availableOrganizations }: EditProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: stakeholder.name || '',
        email: stakeholder.email || '',
        role: stakeholder.role || ('' as unknown as number),
        organization_id: stakeholder.organization_id || ('' as unknown as number),
        influence: stakeholder.influence || ('' as unknown as number),
        notes: stakeholder.notes || '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/training/stakeholders/${stakeholder.id}`);
    };

    return (
        <TrainingLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Редагування стейкхолдера: {stakeholder.name}
                </h2>
            }
        >
            <Head title={`Редагувати — ${stakeholder.name}`} />

            <div className="py-8">
                <div className="stakeholder-directory-root">
                    <header className="stakeholder-page-header">
                        <div className="stakeholder-header-titles">
                            <h1 className="stakeholder-page-title">Редагування стейкхолдера</h1>
                            <p className="stakeholder-page-subtitle">ID запису: #{stakeholder.id}</p>
                        </div>
                        <div className="stakeholder-header-actions">
                            <Link
                                href={`/training/stakeholders/${stakeholder.id}`}
                                className="stakeholder-btn stakeholder-btn-edit"
                            >
                                &larr; Повернутися до профілю стейкхолдера
                            </Link>
                        </div>
                    </header>

                    <form className="stakeholder-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-name">
                                    Ім'я:
                                </label>
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
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>

                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-email">
                                    Email:
                                </label>
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
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-role">
                                    Роль:
                                </label>
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
                                value={data.role}
                                onChange={(e) => setData('role', Number(e.target.value))}
                            >
                                <option value="" disabled>Оберіть роль...</option>
                                {availableRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-organization">
                                    Організація:
                                </label>
                                {errors.organization_id && (
                                    <div role="alert" className="form-error-alert">
                                        {errors.organization_id}
                                    </div>
                                )}
                            </div>
                            <select
                                id="stakeholder-organization"
                                name="organization_id"
                                className={`form-control-select ${errors.organization_id ? 'input-has-error' : ''}`}
                                value={data.organization_id}
                                onChange={(e) => setData('organization_id', Number(e.target.value))}
                            >
                                <option value="" disabled>Оберіть організацію...</option>
                                {availableOrganizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-influence">
                                    Рівень впливу:
                                </label>
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
                                value={data.influence}
                                onChange={(e) => setData('influence', Number(e.target.value))}
                            >
                                <option value="" disabled>Оберіть рівень впливу...</option>
                                <option value={1}>1 — Дуже низький</option>
                                <option value={2}>2 — Низький</option>
                                <option value={3}>3 — Середній</option>
                                <option value={4}>4 — Високий</option>
                                <option value={5}>5 — Критичний</option>
                            </select>
                        </div>

                        <div className="form-field-group">
                            <div className="form-label-wrapper">
                                <label className="form-label" htmlFor="stakeholder-notes">
                                    Примітки:
                                </label>
                                {errors.notes && (
                                    <div role="alert" className="form-error-alert">
                                        {errors.notes}
                                    </div>
                                )}
                            </div>
                            <textarea
                                id="stakeholder-notes"
                                name="notes"
                                rows={3}
                                className={`form-control-input ${errors.notes ? 'input-has-error' : ''}`}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>

                        <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={processing}
                            >
                                {processing ? 'Збереження...' : 'Зберегти зміни'}
                            </button>
                            <button
                                type="button"
                                className="btn-clear"
                                onClick={() => reset()}
                                disabled={processing}
                            >
                                Повернути початкові дані з профілю стейкхолдера
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TrainingLayout>
    );
}
