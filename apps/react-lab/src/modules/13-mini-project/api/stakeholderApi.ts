import type { Stakeholder, RoleOption, StakeholderInput } from '../types';

export const availableRoles: RoleOption[] = [
    { id: 1, title: 'Замовник / Клієнт' },
    { id: 2, title: 'Product Manager' },
    { id: 3, title: 'Tech Lead / Розробник' },
    { id: 4, title: 'Інвестор' },
];

let stakeholders: Stakeholder[] = [
    {
        id: 1,
        name: 'Олександр Ковальчук',
        email: 'test1@gmail.com',
        role: 1,
        organization: 'Nova Logistics Group',
        influence: 1,
    },
    {
        id: 2,
        name: 'Марія Мельник',
        email: 'test2@gmail.com',
        role: 2,
        organization: 'TechVision Studio',
        influence: 2,
    },
    {
        id: 3,
        name: 'Дмитро Шевченко',
        email: 'test3@gmail.com',
        role: 3,
        organization: 'CoreDev Solutions',
        influence: 3,
    },
    {
        id: 4,
        name: 'Олена Бондаренко',
        email: 'test4@gmail.com',
        role: 4,
        organization: 'Horizon Capital Ventures',
        influence: 4,
    }
];

let nextId = 5;

let failNext = false;

const checkSimulatedError = () => {
    if (failNext) {
        failNext = false;
        throw new Error('Симульована помилка мережі: Не вдалося отримати дані.');
    }
}

const delay = (ms: number = 200, signal?: AbortSignal): Promise<void> =>
    new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(new DOMException('Запит скасовано', 'AbortError'));
        }

        const timer = setTimeout(() => {
            resolve();
        }, ms);

        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                reject(new DOMException('Запит скасовано', 'AbortError'));
            },
            { once: true }
        );
    });

export const stakeholderApi = {
    failNextRequest() {
        failNext = true;
    },

    async getRoles(signal?: AbortSignal): Promise<RoleOption[]> {
        await delay(100, signal);
        checkSimulatedError();
        return [...availableRoles];
    },

    async list(signal?: AbortSignal): Promise<Stakeholder[]> {
        await delay(300, signal);
        checkSimulatedError();
        return [...stakeholders];
    },

    async create(data: StakeholderInput): Promise<Stakeholder> {
        await delay(200);
        checkSimulatedError();

        const newStakeholder: Stakeholder = {
            ...data,
            id: nextId++,
        };

        stakeholders = [newStakeholder, ...stakeholders];
        return newStakeholder;
    },

    async update(id: number, data: Partial<StakeholderInput>): Promise<Stakeholder> {
        await delay(200);
        checkSimulatedError();

        const index = stakeholders.findIndex((s) => s.id === id);
        if (index === -1) {
            throw new Error(`Стейкхолдера з ID ${id} не знайдено.`);
        }

        const updatedStakeholder: Stakeholder = {
            ...stakeholders[index],
            ...data,
        };

        stakeholders[index] = updatedStakeholder;
        return updatedStakeholder;
    },

    async remove(id: number): Promise<void> {
        await delay(150);
        checkSimulatedError();

        const index = stakeholders.findIndex((s) => s.id === id);
        if (index === -1) {
            throw new Error(`Стейкхолдера з ID ${id} не знайдено.`);
        }

        stakeholders = stakeholders.filter((s) => s.id !== id);
    }
}