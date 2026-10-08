export type Category = 'internal' | 'external';
export type Influence = 'low' | 'medium' | 'high';

export interface Stakeholder {
    id: number;
    name: string;
    category: Category;
    organization?: string;
    influence: Influence;
}