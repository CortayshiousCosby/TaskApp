import { CategoryProps } from "./Category";

export interface TaskProps {
    id: number;
    name: string;
    category: CategoryProps | null;
    category_id?: number | string | null;
    description?: string;
    completed: boolean;
    due_date: string | null;
}
