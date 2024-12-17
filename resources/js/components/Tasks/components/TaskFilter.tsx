import React from "react";
import { Stack, Input, Select } from "@chakra-ui/react";

interface TaskFilterProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
}) => {
    return (
        <Stack spacing="4">
            <Input
                placeholder="Search (name, category, description)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
                placeholder="Filter tasks"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="urgent">Urgent</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="long_term">Long Term</option>
                <option value="no_due_date">No Due Date</option>
            </Select>
        </Stack>
    );
};

export default TaskFilter;
