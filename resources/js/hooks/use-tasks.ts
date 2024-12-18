import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { TaskProps } from "../types/Task";

export function useTasks(): UseQueryResult<TaskProps[]> {
    return useQuery({
        queryKey: ["api", "tasks"],
        queryFn: async () => {
            const response = await axios.get("/api/tasks");

            return response.data;
        },
    });
}

export function useSingleTask(id: number): TaskProps | undefined {
    const { data, isSuccess } = useTasks();

    if (isSuccess) {
        return data.find((task) => task.id === id);
    }

    return undefined;
}
