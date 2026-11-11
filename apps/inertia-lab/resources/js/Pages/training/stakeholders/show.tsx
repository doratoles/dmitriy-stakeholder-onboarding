import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export interface StakeholderDetail {
    id: number;
    name: string;
    email: string;
    role: number;
    organization: string;
    influence: number;
    active?: boolean;
    notes?: string | null;
}

export interface RoleOption {
    id: number;
    title: string;
}

interface ShowProps {
    stakeholder: StakeholderDetail;
    availableRoles: RoleOption[];
}

export default function Show({ stakeholder, availableRoles }: ShowProps) {
    const roleTitle = availableRoles.find((r) => r.id === stakeholder.role)?.title || `ID: ${stakeholder.role}`;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Профіль стейкхолдера</h2>}>
            <Head title={`Стейкхолдер — ${stakeholder.name}`} />

            <div className="py-8">
                <div className="stakeholder-directory-root">
                    <header className="stakeholder-page-header">
                        <div className="stakeholder-header-titles">
                            <h1 className="stakeholder-page-title">{stakeholder.name}</h1>
                            <p className="stakeholder-page-subtitle">{stakeholder.organization}</p>
                        </div>
                        <div className="stakeholder-header-actions">
                            <Link
                                href="/training/stakeholders"
                                className="stakeholder-btn stakeholder-btn-edit"
                            >
                                &larr; До каталогу
                            </Link>
                        </div>
                    </header>

                    <div className="stakeholder-form">
                        <table className="stakeholder-table">
                            <tbody>
                                <tr className="stakeholder-table-row">
                                    <td className="stakeholder-table-cell font-semibold text-gray-600">Email</td>
                                    <td className="stakeholder-table-cell">{stakeholder.email}</td>
                                </tr>
                                <tr className="stakeholder-table-row">
                                    <td className="stakeholder-table-cell font-semibold text-gray-600">Організація</td>
                                    <td className="stakeholder-table-cell">{stakeholder.organization}</td>
                                </tr>
                                <tr className="stakeholder-table-row">
                                    <td className="stakeholder-table-cell font-semibold text-gray-600">Роль</td>
                                    <td className="stakeholder-table-cell stakeholder-table-cell-role">{roleTitle}</td>
                                </tr>
                                <tr className="stakeholder-table-row">
                                    <td className="stakeholder-table-cell font-semibold text-gray-600">Рівень впливу</td>
                                    <td className="stakeholder-table-cell">
                                        <div className="stakeholder-badge-influence">{stakeholder.influence}</div>
                                    </td>
                                </tr>
                                <tr className="stakeholder-table-row">
                                    <td className="stakeholder-table-cell font-semibold text-gray-600">Статус</td>
                                    <td className="stakeholder-table-cell">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${stakeholder.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {stakeholder.active ? 'Активний' : 'Неактивний'}
                                        </span>
                                    </td>
                                </tr>
                                {stakeholder.notes && (
                                    <tr className="stakeholder-table-row">
                                        <td className="stakeholder-table-cell font-semibold text-gray-600">Примітки</td>
                                        <td className="stakeholder-table-cell text-gray-700">{stakeholder.notes}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
