import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import TrainingLayout, { SharedPageProps } from '@/Layouts/TrainingLayout';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface Stakeholder {
    id: number;
    name: string;
    email: string;
    role: number;
    organization: string;
    organization_id?: number;
    influence: number;
    can?: {
        delete?: boolean;
    };
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<S> {
    data: S[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
}

export interface RoleOption {
    id: number;
    title: string;
}

export interface OrganizationOption {
    id: number;
    name: string;
}

export interface IndexFilters {
    search?: string;
    role?: string | number;
    organization_id?: string | number;
    influence?: string | number;
}

interface IndexProps {
    stakeholders: PaginatedData<Stakeholder> | Stakeholder[];
    filters?: IndexFilters;
    availableRoles: RoleOption[];
    availableOrganizations?: OrganizationOption[];
}

export default function Index({ stakeholders, filters = {}, availableRoles, availableOrganizations = [] }: IndexProps) {
    const stakeholderList: Stakeholder[] = Array.isArray(stakeholders) ? stakeholders : stakeholders.data;
    const paginationLinks: PaginationLink[] = Array.isArray(stakeholders) ? [] : stakeholders.links;
    const totalCount: number = Array.isArray(stakeholders) ? stakeholders.length : stakeholders.total;

    const [status, setStatus] = useState<Status>('idle');
    const [search, setSearch] = useState<string>(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState<number | 'All'>(
        filters?.role !== undefined && filters?.role !== '' ? Number(filters.role) : 'All'
    );
    const [influenceFilter, setInfluenceFilter] = useState<number | 'All'>(
        filters?.influence !== undefined && filters?.influence !== '' ? Number(filters.influence) : 'All'
    );
    const [organizationFilter, setOrganizationFilter] = useState<number | 'All'>(
        filters?.organization_id !== undefined && filters?.organization_id !== '' ? Number(filters.organization_id) : 'All'
    );

    const { flash } = usePage<SharedPageProps>().props;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Stakeholder | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDeletingRef = useRef(false);

    useEffect(() => {
        setSearch(filters?.search || '');
        setRoleFilter(
            filters?.role !== undefined && filters?.role !== '' ? Number(filters.role) : 'All'
        );
        setInfluenceFilter(
            filters?.influence !== undefined && filters?.influence !== '' ? Number(filters.influence) : 'All'
        );
        setOrganizationFilter(
            filters?.organization_id !== undefined && filters?.organization_id !== '' ? Number(filters.organization_id) : 'All'
        );
    }, [filters]);

    useEffect(() => {
        if (flash?.error) {
            setStatus('error');
            setErrorMessage(flash.error);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const errorParam = urlParams.get('error');
            if (errorParam) {
                setStatus('error');
                setErrorMessage(errorParam);
            }
        }

        const removeStart = router.on('start', () => {
            setStatus('loading');
            setErrorMessage(null);
        });

        const removeFinish = router.on('finish', () => setStatus('idle'));

        const removeInvalid = router.on('invalid', (event: any) => {
            if (event.detail.response.status === 403) {
                event.preventDefault();
                setStatus('error');

                if (isDeletingRef.current) {
                    setErrorMessage('Помилка 403: у вас недостатньо прав для видалення цього стейкхолдера.');
                } else {
                    setErrorMessage('Помилка 403: Доступ заборонено політикою безпеки сервера.');
                }

                setIsDeleting(false);
                setItemToDelete(null);
                isDeletingRef.current = false;
            }
        });

        return () => {
            removeStart();
            removeFinish();
            removeInvalid();
        };
    }, [flash?.error]);

    const applyFilters = (params: { search?: string; role?: number | 'All'; organization_id?: number | 'All'; influence?: number | 'All' }) => {
        const query: Record<string, string> = {};
        if (params.search && params.search.trim() !== '') {
            query.search = params.search.trim();
        }
        if (params.role !== undefined && params.role !== 'All') {
            query.role = String(params.role);
        }
        if (params.organization_id !== undefined && params.organization_id !== 'All') {
            query.organization_id = String(params.organization_id);
        }
        if (params.influence !== undefined && params.influence !== 'All') {
            query.influence = String(params.influence);
        }

        router.get('/training/stakeholders', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({
            search,
            role: roleFilter,
            organization_id: organizationFilter,
            influence: influenceFilter
        });
    };

    const onInfluenceFilterChange = (val: number | 'All') => {
        setInfluenceFilter(val);
        applyFilters({
            search,
            role: roleFilter,
            organization_id: organizationFilter,
            influence: val
        });
    };

    const onRoleFilterChange = (val: number | 'All') => {
        setRoleFilter(val);
        applyFilters({
            search,
            role: val,
            organization_id: organizationFilter,
            influence: influenceFilter
        });
    };

    const onOrgFilterChange = (val: number | 'All') => {
        setOrganizationFilter(val);
        applyFilters({
            search,
            role: roleFilter,
            organization_id: val,
            influence: influenceFilter
        });
    };

    const handleReset = () => {
        setSearch('');
        setRoleFilter('All');
        setOrganizationFilter('All');
        setInfluenceFilter('All');
        router.get('/training/stakeholders', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        isDeletingRef.current = true;
        setErrorMessage(null);

        router.delete(`/training/stakeholders/${itemToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setItemToDelete(null);
                setStatus('success');
                isDeletingRef.current = false;
            },
            onError: () => {
                setStatus('error');
                setErrorMessage('Не вдалося виконати запит. Перевірте коректність даних.');
                isDeletingRef.current = false;
            },
            onFinish: () => {
                setIsDeleting(false);
                isDeletingRef.current = false;
            },
        });
    };

    const getRoleTitle = (roleId: number) => {
        return availableRoles.find((r) => r.id === roleId)?.title || `ID: ${roleId}`;
    };

    return (
        <TrainingLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Каталог стейкхолдерів</h2>}>
            <Head title="Stakeholder Directory" />

            <div className="py-8">
                <div className="stakeholder-directory-root">
                    <header className="stakeholder-page-header">
                        <div className="stakeholder-header-titles">
                            <h1 className="stakeholder-page-title">Stakeholder Directory</h1>
                            <p className="stakeholder-page-subtitle">
                                Загальна кількість записів: <strong>{totalCount}</strong>
                            </p>
                        </div>
                    </header>

                    {errorMessage && (
                        <div className="stakeholder-error-card">
                            <h3 className="stakeholder-error-title">Помилка виконання</h3>
                            <p className="stakeholder-error-message">{errorMessage}</p>
                            <button
                                type="button"
                                onClick={() => setErrorMessage(null)}
                                className="btn-submit"
                                style={{ backgroundColor: '#dc2626' }}
                            >
                                Закрити
                            </button>
                        </div>
                    )}

                    <div className="stakeholder-toolbar">
                        <form className="stakeholder-filters" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                className="stakeholder-filters-search"
                                placeholder="Пошук за ім'ям або email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                className="stakeholder-filters-select"
                                value={roleFilter}
                                onChange={(e) =>
                                    onRoleFilterChange(
                                        e.target.value === 'All' ? 'All' : Number(e.target.value)
                                    )
                                }
                                aria-label="Фільтр за роллю"
                            >
                                <option value="All">Усі ролі</option>
                                {availableRoles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.title}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="stakeholder-filters-select"
                                value={organizationFilter}
                                onChange={(e) =>
                                    onOrgFilterChange(
                                        e.target.value === 'All' ? 'All' : Number(e.target.value)
                                    )
                                }
                                aria-label="Фільтр за організацією"
                            >
                                <option value="All">Усі організації</option>
                                {availableOrganizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="stakeholder-filters-select"
                                value={influenceFilter}
                                onChange={(e) =>
                                    onInfluenceFilterChange(
                                        e.target.value === 'All' ? 'All' : Number(e.target.value)
                                    )
                                }
                                aria-label="Фільтр за рівнем впливу"
                            >
                                <option value="All">Всі впливи</option>
                                <option value={1}>1 — Дуже низький</option>
                                <option value={2}>2 — Низький</option>
                                <option value={3}>3 — Середній</option>
                                <option value={4}>4 — Високий</option>
                                <option value={5}>5 — Критичний</option>
                            </select>

                            <button
                                type="submit"
                                className="stakeholder-btn stakeholder-btn-create"
                            >
                                Знайти
                            </button>

                            {(search || roleFilter !== 'All' || organizationFilter !== 'All' || influenceFilter !== 'All') && (
                                <button
                                    type="button"
                                    className="stakeholder-btn stakeholder-btn-edit"
                                    onClick={handleReset}
                                >
                                    Скинути
                                </button>
                            )}
                        </form>
                    </div>

                    {status === 'loading' && (
                        <div className="stakeholder-loading-state">
                            Завантаження даних...
                        </div>
                    )}

                    {stakeholderList.length === 0 ? (
                        <div className="stakeholder-empty-state">
                            Нічого не знайдено за заданими критеріями пошуку та фільтрації.
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
                            {stakeholderList.map((item) => (
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
                                        {item.can?.delete !== false ? (
                                            <button
                                                type="button"
                                                className="stakeholder-btn"
                                                style={{
                                                    borderColor: '#113520',
                                                    color: '#336847'
                                                }}
                                                onClick={() => setItemToDelete(item)}
                                            >
                                                Видалити
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="stakeholder-btn stakeholder-btn-delete"
                                                onClick={() => setItemToDelete(item)}
                                            >
                                                Видалити
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                    {paginationLinks.length > 0 && (
                        <nav className="stakeholder-pagination" aria-label="Пагінація">
                            <div className="stakeholder-pagination-info">
                                <div className="stakeholder-pagination-count">
                                    Показано: {Array.isArray(stakeholders) ? 1 : stakeholders.from ?? 0}{'-'}
                                    {Array.isArray(stakeholders) ? stakeholders.length : stakeholders.to ?? 0}{' '}
                                    із {totalCount} записів
                                </div>
                            </div>

                            <div className="stakeholder-pagination-links">
                                {paginationLinks.map((link, i) => {
                                    if (!link.url) {
                                        return (
                                            <div
                                                key={i}
                                                className="stakeholder-pagination-link is-disabled"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            className={`stakeholder-pagination-link ${link.active ? 'is-active' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </nav>
                    )}

                    {itemToDelete && (
                        <div
                            className="stakeholder-modal-overlay"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-title"
                        >
                            <div className="stakeholder-modal-card">
                                <h3 id="modal-title" className="stakeholder-modal-title">
                                    Підтвердження видалення
                                </h3>
                                <p className="stakeholder-modal-desc">
                                    Ви справді бажаєте видалити стейкхолдера{' '} {itemToDelete.name}?
                                </p>
                                <div className="stakeholder-modal-actions">
                                    <button
                                        type="button"
                                        className="stakeholder-btn stakeholder-btn-edit"
                                        onClick={() => setItemToDelete(null)}
                                        disabled={isDeleting}
                                    >
                                        Скасувати
                                    </button>
                                    <button
                                        type="button"
                                        className="stakeholder-btn stakeholder-btn-delete"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Видалення...' : 'Підтвердити видалення'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TrainingLayout>
    );
}
