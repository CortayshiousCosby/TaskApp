export interface Task {
    id: number;
    name: string;
    category_id: number;
    description?: string;
    completed: boolean;
    due_date: string | null;
}
