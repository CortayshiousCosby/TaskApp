import React from "react";
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    Checkbox,
    Button,
    Select,
} from "@chakra-ui/react";
import { Task } from "../types/types";

interface TaskFormProps {
    task: Partial<Task>;
    categories: { id: number; name: string }[];
    onInputChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    onSave: () => void;
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
    task,
    categories,
    onInputChange,
    onSave,
    onCancel,
}) => {
    return (
        <Box borderWidth="1px" p="6" borderRadius="lg">
            <Heading as="h2" size="lg" mb="4">
                {task?.id ? "Edit Task" : "Add New Task"}
            </Heading>
            <Stack spacing="4">
                <Input
                    name="name"
                    placeholder="Task Name"
                    value={task.name || ""}
                    onChange={onInputChange}
                />
                <Select
                    name="category_id"
                    placeholder="Select Category"
                    value={task.category_id || ""}
                    onChange={onInputChange}
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>
                <Textarea
                    name="description"
                    placeholder="Description"
                    value={task.description || ""}
                    onChange={onInputChange}
                />
                <Input
                    name="due_date"
                    type="datetime-local"
                    value={task.due_date || ""}
                    onChange={onInputChange}
                />
                <Checkbox
                    name="completed"
                    isChecked={task.completed || false}
                    onChange={onInputChange}
                >
                    Completed
                </Checkbox>
                <Button colorScheme="green" onClick={onSave}>
                    {task?.id ? "Save Changes" : "Add Task"}
                </Button>
                {onCancel && (
                    <Button colorScheme="gray" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default TaskForm;
