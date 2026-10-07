import type { TeamMember } from './types';

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'Дмитро',
        role: 'fullstack',
        bio: 'Універсальний розробник із досвідом запуску продуктів з нуля. ' +
            'Легко перемикаюся між проектуванням архітектури бази даних та версткою інтерактивних інтерфейсів. ' +
            'Фокусуюся на бізнес-цінності кожної фічі.',
        skills: ['Git', 'Vue.js', 'Node.js',  'Laravel', 'SQL'],
        availability: 'available',
        avatarUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
        id: 2,
        name: 'Катерина',
        role: 'fullstack',
        bio: 'Універсальний розробник із досвідом запуску продуктів з нуля. ' +
            'Легко перемикаюся між проектуванням архітектури бази даних та версткою інтерактивних інтерфейсів. ' +
            'Фокусуюся на бізнес-цінності кожної фічі.',
        skills: ['TypeScript', 'React', 'Laravel', 'Inertia'],
        availability: 'busy'
    },
    {
        id: 3,
        name: 'Ігор',
        role: 'backend',
        bio: 'Експерт у проєктуванні масштабованих мікросервісів та оптимізації важких баз даних. ' +
            'Знаю, як змусити API працювати з мінімальною затримкою. Вірю, що найкращий backend — це той, ' +
            'про існування якого користувач навіть не здогадується.',
        skills: ['Go', 'Redis', 'Kubernetes'],
        availability: 'available',
        avatarUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    {
        id: 4,
        name: 'Олена',
        role: 'frontend',
        bio: 'Закохана у чистий код та бездоганний користувацький досвід. Спеціалізуюся на створенні доступних (accessibility) ' +
            'та високопродуктивних веб-додатків на React. Завжди дбаю про те, щоб дизайн виглядав ' +
            'ідеально на будь-якому пристрої.',
        skills: ['TypeScript', 'React', 'Tailwind CSS'],
        availability: 'available',
        avatarUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }
];