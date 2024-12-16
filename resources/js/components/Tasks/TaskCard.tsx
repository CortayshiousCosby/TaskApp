import React, { FC } from "react";
import {
    Box,
    Heading,
    Text,
    Stack,
    Button,
    Checkbox,
    Flex,
} from "@chakra-ui/react";
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
    onDelete: (taskId: number) => void;
    isSelected: boolean; // New prop for selection
    onSelect: () => void; // Callback for when the checkbox is toggled
}

const TaskCard: FC<TaskCardProps> = ({
    task,
    onEdit,
    onDelete,
    isSelected,
    onSelect,
}) => {
    const getTaskBgColor = (): string => {
        if (task.completed) return "green.100";
        if (!task.due_date) return "blue.100";
        const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
        if (hoursDiff <= 24) return "red.100";
        if (hoursDiff <= 48) return "orange.100";
        return "yellow.100";
    };

    const getTimeSensitivityLabel = (): string => {
        if (task.completed) return "(Completed)";
        if (!task.due_date) return "(No Due Date)";
        const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
        if (hoursDiff <= 24) return "(Urgent)";
        if (hoursDiff <= 48) return "(Coming Soon)";
        return "(Long Term)";
    };

    return (
        <Box
            bg={getTaskBgColor()}
            borderWidth="1px"
            p="6"
            borderRadius="lg"
            position="relative"
        >
            <Flex justifyContent="space-between" alignItems="center" mb="4">
                <Heading as="h3" size="md">
                    {task.name}{" "}
                    <Text as="span" color="gray.500">
                        {getTimeSensitivityLabel()}
                    </Text>
                </Heading>
                <Checkbox
                    isChecked={isSelected}
                    onChange={onSelect}
                    size="lg"
                    colorScheme="blackAlpha"
                    borderColor="black" // Dark outline
                    _hover={{ borderColor: "gray.700" }} // Darker outline on hover
                    _checked={{
                        bg: "black", // Set fill color when checked
                        borderColor: "black", // Keep outline black
                    }}
                />
            </Flex>
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
