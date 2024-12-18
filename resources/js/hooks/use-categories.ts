import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { TaskProps } from "../types/Task";
import { CategoryProps } from "../types/Category";

export function useCategories(): UseQueryResult<CategoryProps[]> {
    return useQuery({
        queryKey: ["api", "categories"],
        queryFn: async () => {
            const response = await axios.get("/api/categories");

            return response.data;
        },
    });
}
