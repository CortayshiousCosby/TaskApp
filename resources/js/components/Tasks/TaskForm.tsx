import React from "react";
import {
    Box,
    Heading,
    Stack,
    Input,
    Textarea,
    Checkbox,
    Button,
} from "@chakra-ui/react";

interface TaskFormProps {
    task: any;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onSave: () => void;
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
    task,
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
                <Input
                    name="category"
                    placeholder="Category"
                    value={task.category || ""}
                    onChange={onInputChange}
                />
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
