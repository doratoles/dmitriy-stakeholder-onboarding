import React, { ReactNode } from 'react';
import type { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';

interface SharedUser {
    id: number;
    name: string;
    email: string;
}

type SharedPageProps = PageProps & {
    auth: {
        user: SharedUser | null;
    };
    flash?: {
        success?: string | null;
    };
};

interface TrainingLayoutProps {
    children: ReactNode;
    header?: ReactNode;
}

export default function TrainingLayout({ children, header }: TrainingLayoutProps) {
    const { auth, flash } = usePage<SharedPageProps>().props;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/training/stakeholders"
                            className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-600"
                        >
                            Stakeholder Directory
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/training/stakeholders/create"
                                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Створити нового стейкхолдера
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <div className="text-sm text-gray-700">
                                Користувач: <span className="font-semibold">{auth.user.name}</span>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                                Увійти
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {flash?.success && (
                <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                    <div
                        role="status"
                        className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
