import React, { FC } from "react";
import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import dayjs from "dayjs";

interface TaskCardProps {
    task: {
        id: number;
        name: string;
        category: string;
        description?: string;
        completed: boolean;
        due_date: string | null;
    };
    onEdit: (task: any) => void;
    onDelete: (taskId: number) => void; // Expect taskId here
}

const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    const getTaskBgColor = (): string => {
        if (task.completed) return "green.100";
        if (!task.due_date) return "blue.100";
        const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
        if (hoursDiff <= 24) return "red.100";
        if (hoursDiff <= 48) return "orange.100";
        return "yellow.100";
    };

    return (
        <Box bg={getTaskBgColor()} borderWidth="1px" p="6" borderRadius="lg">
            <Heading as="h3" size="md" mb="2">
                {task.name}
            </Heading>
            <Text>
                <strong>Category:</strong> {task.category || "N/A"}
            </Text>
            <Text>
                <strong>Description:</strong>{" "}
                {task.description || "No Description"}
            </Text>
            <Text>
                <strong>Status:</strong>{" "}
                {task.completed ? "Completed" : "Pending"}
            </Text>
            <Text>
                <strong>Due Date:</strong>{" "}
                {task.due_date
                    ? dayjs(task.due_date).format("YYYY-MM-DD HH:mm")
                    : "No Due Date"}
            </Text>
            <Stack direction="row" mt="4" spacing="2">
                <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </Button>
            </Stack>
        </Box>
    );
};

export default TaskCard;
