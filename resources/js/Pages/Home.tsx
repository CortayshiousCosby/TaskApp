import {
    Box,
    Button,
    Container,
    VStack,
    Heading,
    Text,
    Input,
    Textarea,
    Checkbox,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";

interface Task {
    id: number;
    name: string;
    category: string;
    description?: string;
    completed: boolean;
    due_date: string | null;
}

interface CustomPageProps {
    greeting: string;
}

const Index: FC = () => {
    const { greeting } = usePage<{ props: CustomPageProps }>().props;
    const safeGreeting = (greeting ?? "Welcome to the Task App!") as string;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        name: "",
        category: "",
        description: "",
        completed: false,
        due_date: "",
    });
    const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>("/api/tasks");
            const sortedTasks = response.data.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1; // Completed tasks go to the bottom
                if (!a.due_date) return 1; // No due date tasks go to the bottom
                if (!b.due_date) return -1;
                return dayjs(a.due_date).diff(dayjs(b.due_date)); // Sort by due date
            });
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        if (editingTask) {
            setEditingTask({
                ...editingTask,
                [name]: type === "checkbox" ? checked : value,
            });
        } else {
            setNewTask({
                ...newTask,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.post<Task>("/tasks", newTask);
            setTasks(
                [...tasks, response.data].sort((a, b) => {
                    if (a.completed !== b.completed)
                        return a.completed ? 1 : -1;
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;
                    return dayjs(a.due_date).diff(dayjs(b.due_date));
                })
            );
            setNewTask({
                name: "",
                category: "",
                description: "",
                completed: false,
                due_date: "",
            });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = async () => {
        if (!editingTask || !editingTask.id) return;

        try {
            const response = await axios.put<Task>(
                `/tasks/${editingTask.id}`,
                editingTask
            );
            setTasks((prevTasks) =>
                prevTasks
                    .map((task) =>
                        task.id === response.data.id ? response.data : task
                    )
                    .sort((a, b) => {
                        if (a.completed !== b.completed)
                            return a.completed ? 1 : -1;
                        if (!a.due_date) return 1;
                        if (!b.due_date) return -1;
                        return dayjs(a.due_date).diff(dayjs(b.due_date));
                    })
            );
            setEditingTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            await axios.delete(`/tasks/${taskToDelete}`);
            setTasks((prevTasks) =>
                prevTasks
                    .filter((task) => task.id !== taskToDelete)
                    .sort((a, b) => {
                        if (a.completed !== b.completed)
                            return a.completed ? 1 : -1;
                        if (!a.due_date) return 1;
                        if (!b.due_date) return -1;
                        return dayjs(a.due_date).diff(dayjs(b.due_date));
                    })
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setTaskToDelete(null);
            onClose();
        }
    };

    const handleEditButtonClick = (task: Task) => {
        setEditingTask({
            ...task,
            due_date: task.due_date
                ? dayjs(task.due_date).format("YYYY-MM-DDTHH:mm")
                : "", // Format for `datetime-local` input
        });
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const openDeleteModal = (id: number) => {
        setTaskToDelete(id);
        onOpen();
    };

    const getTaskBgColor = (task: Task): string => {
        if (task.completed) return "green.100"; // Completed tasks
        if (!task.due_date) return "blue.100"; // No due date
        const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hour");
        if (hoursDiff <= 24) return "red.100"; // Less than 24 hours
        if (hoursDiff <= 48) return "orange.100"; // 24-48 hours
        return "yellow.100"; // More than 48 hours
    };

    const formatDueDate = (dueDate: string | null): string => {
        if (!dueDate) return "No Due Date";
        return dayjs(dueDate).format("YYYY-MM-DD HH:mm");
    };

    return (
        <Container mt="10">
            <VStack align="stretch" gap="12">
                <Box>
                    <Heading as="h1" size="xl" textAlign="center">
                        {safeGreeting}
                    </Heading>
                    <Text
                        mt="2"
                        fontSize="lg"
                        color="gray.600"
                        textAlign="center"
                    >
                        Start organizing your tasks and achieve your goals!
                    </Text>
                </Box>

                <Box borderWidth="1px" borderRadius="lg" p="5" ref={formRef}>
                    <Heading as="h2" size="lg" mb="4">
                        {editingTask ? "Edit Task" : "Add New Task"}
                    </Heading>
                    <Stack spacing="4">
                        <Input
                            name="name"
                            placeholder="Task Name"
                            value={
                                editingTask
                                    ? editingTask.name || ""
                                    : newTask.name || ""
                            }
                            onChange={handleInputChange}
                        />
                        <Input
                            name="category"
                            placeholder="Category"
                            value={
                                editingTask
                                    ? editingTask.category || ""
                                    : newTask.category || ""
                            }
                            onChange={handleInputChange}
                        />
                        <Textarea
                            name="description"
                            placeholder="Description"
                            value={
                                editingTask
                                    ? editingTask.description || ""
                                    : newTask.description || ""
                            }
                            onChange={handleInputChange}
                        />
                        <Input
                            name="due_date"
                            type="datetime-local"
                            value={
                                editingTask
                                    ? editingTask.due_date || ""
                                    : newTask.due_date || ""
                            }
                            onChange={handleInputChange}
                        />
                        <Checkbox
                            name="completed"
                            isChecked={
                                editingTask
                                    ? editingTask.completed || false
                                    : newTask.completed || false
                            }
                            onChange={handleInputChange}
                        >
                            Completed
                        </Checkbox>
                        <Button
                            colorScheme="green"
                            onClick={
                                editingTask ? handleEditTask : handleAddTask
                            }
                        >
                            {editingTask ? "Save Changes" : "Add Task"}
                        </Button>
                        {editingTask && (
                            <Button
                                colorScheme="gray"
                                onClick={() => setEditingTask(null)}
                            >
                                Cancel
                            </Button>
                        )}
                    </Stack>
                </Box>

                {tasks.map((task) => (
                    <Box
                        key={task.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        p="5"
                        bg={getTaskBgColor(task)}
                        display="flex"
                        flexDirection="column"
                        gap="2"
                    >
                        <Heading as="h3" size="md">
                            {task.name}
                        </Heading>
                        <Box>
                            <strong>Category:</strong> {task.category || "None"}
                        </Box>
                        <Box>
                            <strong>Description:</strong>{" "}
                            {task.description || "No description"}
                        </Box>
                        <Box>
                            <strong>Status:</strong>{" "}
                            {task.completed ? "Completed" : "Pending"}
                        </Box>
                        <Box>
                            <strong>Due Date:</strong>{" "}
                            {formatDueDate(task.due_date)}
                        </Box>
                        <Stack direction="row" spacing={4} mt={4}>
                            <Button
                                colorScheme="blue"
                                onClick={() => handleEditButtonClick(task)}
                            >
                                Edit
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => openDeleteModal(task.id)}
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Box>
                ))}

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Deletion</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteTask}
                            >
                                Delete
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    );
};

export default Index;
