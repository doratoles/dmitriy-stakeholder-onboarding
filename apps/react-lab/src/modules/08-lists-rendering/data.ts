import type { Stakeholder } from './types';
export const stakeholders: Stakeholder[] = [
    {
        id: 1,
        name: 'Олена Коваль',
        category: 'internal',
        organization: 'Головний офіс',
        influence: 'low'
    },
    {
        id: 2,
        name: 'Іван Шевченко',
        category: 'internal',
        organization: 'IT Департамент',
        influence: 'medium'
    },
    {
        id: 3,
        name: 'Максим Бондаренко',
        category: 'internal',
        influence: 'high'
    },
    {
        id: 4,
        name: 'Анна Ткаченко',
        category: 'external',
        organization: 'Консалтингова група "Альфа"',
        influence: 'low'
    },
    {
        id: 5,
        name: 'Сергій Мельник',
        category: 'external',
        organization: 'Міська рада',
        influence: 'medium'
    },
    {
        id: 6,
        name: 'Вікторія Кравченко',
        category: 'external',
        organization: 'Асоціація партнерів',
        influence: 'high'
    }
];