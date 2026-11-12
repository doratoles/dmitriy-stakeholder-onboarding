import React, { FormEvent } from 'react';
import { Head } from '@inertiajs/react';
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
    return (
        <TrainingLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Редагування стейкхолдера
                </h2>
            }
        >
            <Head title="Редагувати стейкхолдера" />
        </TrainingLayout>
    );
}
