export interface Task {
    id: number;
    name: string;
    category: string;
    description?: string;
    completed: boolean;
    due_date: string | null;
}
