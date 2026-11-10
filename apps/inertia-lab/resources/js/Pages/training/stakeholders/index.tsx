import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export interface Stakeholder {
    id: number;
    name: string;
    email: string;
    role: number;
    organization: string;
    influence: number;
}

export interface RoleOption {
    id: number;
    title: string;
}

interface IndexProps {
    stakeholders: Stakeholder[];
    availableRoles: RoleOption[];
}

export default function Index({ stakeholders, availableRoles }: IndexProps) {
    const getRoleTitle = (roleId: number) => {
        return availableRoles.find((r) => r.id === roleId)?.title || `ID: ${roleId}`;
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Каталог стейкхолдерів</h2>}>
            <Head title="Stakeholder Directory" />

            <div className="py-8">
                <div className="stakeholder-directory-root">
                    <header className="stakeholder-page-header">
                        <div className="stakeholder-header-titles">
                            <h1 className="stakeholder-page-title">Stakeholder Directory</h1>
                            <p className="stakeholder-page-subtitle">
                                Загальна кількість записів: <strong>{stakeholders.length}</strong>
                            </p>
                        </div>
                    </header>

                    {stakeholders.length === 0 ? (
                        <div className="stakeholder-empty-state">
                            Стейкхолдерів ще не додано або список порожній.
                        </div>
                    ) : (
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
                                {stakeholders.map((item) => (
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
                                            <Link
                                                href={`/training/stakeholders/${item.id}`}
                                                className="stakeholder-btn stakeholder-btn-edit"
                                            >
                                                Деталі &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
