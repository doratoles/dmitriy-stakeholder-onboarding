import { useState, useEffect } from 'react';
import type { Stakeholder, RoleOption, Status, StakeholderInput } from './types';
import { stakeholderApi } from './api/stakeholderApi';
import { StakeholderForm } from './components/StakeholderForm';
import { Toolbar } from './components/Toolbar';
import { StakeholderList } from './components/StakeholderList';

export function MiniProjectPage() {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [status, setStatus] = useState<Status>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);

    const [search, setSearch] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<number | 'All'>('All');
    const [influenceFilter, setInfluenceFilter] = useState<number | 'All'>('All');

    useEffect(() => {
        const controller = new AbortController();

        async function loadInitialData() {
            try {
                const [stakeholderData, roleData] = await Promise.all([
                    stakeholderApi.list(controller.signal),
                    stakeholderApi.getRoles(controller.signal)
                ]);

                setStakeholders(stakeholderData);
                setRoles(roleData);
                setStatus('success');
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }

                const message = err instanceof Error ? err.message : 'Неможливо отримати initial data';
                setErrorMessage(message);
                setStatus('error');
            }
        }

        loadInitialData();

        return () => {
            controller.abort();
        };
    }, []);

    const handleReload = async () => {
        setStatus('loading');
        setErrorMessage(null);

        try {
            const [stakeholderData, roleData] = await Promise.all([
                stakeholderApi.list(),
                stakeholderApi.getRoles(),
            ]);

            setStakeholders(stakeholderData);
            setRoles(roleData);
            setStatus('success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Непередбачена помилка відновлення даних після simulate error або повторної спроби';
            setErrorMessage(message);
            setStatus('error');
        }
    };

    const handleRetry = () => {
        handleReload();
    };

    const handleSimulateError = () => {
        stakeholderApi.failNextRequest();
        handleReload();
    };

    const handleOpenCreate = () => {
        setEditingStakeholder(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (stakeholder: Stakeholder) => {
        setEditingStakeholder(stakeholder);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingStakeholder(null);
    };

    const handleFormSubmit = async (data: StakeholderInput) => {
        if (editingStakeholder) {
            const updated = await stakeholderApi.update(editingStakeholder.id, data);
            setStakeholders((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
            );
        } else {
            const created = await stakeholderApi.create(data);
            setStakeholders((prev) => [created, ...prev]);
        }

        handleCloseForm();
    };

    const handleDelete = async (id: number) => {
        try {
            await stakeholderApi.remove(id);
            setStakeholders((prev) => prev.filter((item) => item.id !== id));
            if (editingStakeholder?.id === id) {
                handleCloseForm();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Не вдалося видалити запис');
        }
    };

    const normalizedQuery = search.trim().toLowerCase();
    const filteredStakeholders = stakeholders.filter((item) => {
        const matchesRole = roleFilter === 'All' || item.role === roleFilter;
        const matchesSearch =
            normalizedQuery === '' ||
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.organization.toLowerCase().includes(normalizedQuery);

        const matchesInfluence = influenceFilter === 'All' || item.influence === influenceFilter;

        return matchesRole && matchesSearch && matchesInfluence;
    });

    return (
        <div className="stakeholder-directory-root">
            <header className="stakeholder-page-header">
                <div className="stakeholder-header-titles">
                    <h1 className="stakeholder-page-title">Stakeholder Directory</h1>
                    <p className="stakeholder-page-subtitle">
                        Статус завантаження: <code>{status}</code>
                    </p>
                </div>

                <div className="stakeholder-header-actions">
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        disabled={status !== 'success' || isFormOpen}
                        className="stakeholder-btn stakeholder-btn-create"
                    >
                        Add Stakeholder
                    </button>

                    <button
                        type="button"
                        onClick={handleSimulateError}
                        disabled={status === 'loading'}
                        className="stakeholder-btn stakeholder-btn-simulate"
                    >
                        Simulate next error
                    </button>
                </div>
            </header>

            {isFormOpen && (
                <StakeholderForm
                    key={editingStakeholder ? `edit-${editingStakeholder.id}` : 'create'}
                    initialData={editingStakeholder}
                    availableRoles={roles}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseForm}
                />
            )}

            {status === 'loading' && (
                <div className="stakeholder-loading-state">
                    Завантаження даних...
                </div>
            )}

            {status === 'error' && (
                <div className="stakeholder-error-card">
                    <h3 className="stakeholder-error-title">Помилка завантаження</h3>
                    <p className="stakeholder-error-message">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="btn-submit"
                        style={{ backgroundColor: '#dc2626' }}
                    >
                        Спробувати знову (Retry)
                    </button>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <Toolbar
                        search={search}
                        onSearchChange={setSearch}
                        roleFilter={roleFilter}
                        onRoleFilterChange={setRoleFilter}
                        influenceFilter={influenceFilter}
                        onInfluenceFilterChange={setInfluenceFilter}
                        availableRoles={roles}
                        totalCount={stakeholders.length}
                        filteredCount={filteredStakeholders.length}
                    />

                    <StakeholderList
                        items={filteredStakeholders}
                        availableRoles={roles}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
}