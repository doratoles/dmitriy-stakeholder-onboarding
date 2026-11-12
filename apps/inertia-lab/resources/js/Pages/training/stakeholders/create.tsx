import React, { FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import TrainingLayout from '@/Layouts/TrainingLayout';

export interface RoleOption {
    id: number;
    title: string;
}

export interface OrganizationOption {
    id: number;
    name: string;
}

interface CreateProps {
    availableRoles: RoleOption[];
    availableOrganizations: OrganizationOption[];
}

export default function Create({ availableRoles, availableOrganizations }: CreateProps) {
    return (
        <TrainingLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Створення стейкхолдера
                </h2>
            }
        >
            <Head title="Створити стейкхолдера" />
        </TrainingLayout>
    );
}
