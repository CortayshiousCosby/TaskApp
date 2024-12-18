import { create } from "zustand";

interface TaskFilterState {
    searchQuery: string;
    filterStatus: string;
    currentPage: number;
    setSearchQuery: (query: string) => void;
    setFilterStatus: (status: string) => void;
    setCurrentPage: (page: number) => void;
}

export const useTaskStore = create<TaskFilterState>((set) => ({
    searchQuery: "",
    filterStatus: "all",
    currentPage: 1,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setCurrentPage: (page) => set({ currentPage: page }),
}));
