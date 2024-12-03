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
} from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface Task {
    id: number;
    name: string;
    category: string;
    description?: string;
    completed: boolean;
    due_date: string;
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

    useEffect(() => {
        axios.get<Task[]>("/api/tasks").then((response) => {
            setTasks(response.data);
        });
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        setNewTask({
            ...newTask,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.post<Task>("/tasks", newTask);
            setTasks([...tasks, response.data]);
            setNewTask({
                name: "",
                category: "",
                description: "",
                completed: false,
            });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <Container mt="10">
            <VStack align="stretch" gap="12">
                {/* Greeting Section */}
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

                {/* New Task Form */}
                <Box borderWidth="1px" borderRadius="lg" p="5">
                    <Heading as="h2" size="lg" mb="4">
                        Add New Task
                    </Heading>
                    <Stack spacing="4">
                        <Input
                            name="name"
                            placeholder="Task Name"
                            value={newTask.name || ""}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="category"
                            placeholder="Category"
                            value={newTask.category || ""}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            name="description"
                            placeholder="Description"
                            value={newTask.description || ""}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="due_date"
                            type="datetime-local"
                            value={newTask.due_date || ""}
                            onChange={handleInputChange}
                        />
                        <Checkbox
                            name="completed"
                            isChecked={newTask.completed || false}
                            onChange={handleInputChange}
                        >
                            Completed
                        </Checkbox>
                        <Button colorScheme="green" onClick={handleAddTask}>
                            Add Task
                        </Button>
                    </Stack>
                </Box>

                {/* Task List */}
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Box
                            key={task.id}
                            borderWidth="1px"
                            borderRadius="lg"
                            p="5"
                            display="flex"
                            flexDirection="column"
                            gap="2"
                        >
                            <Heading as="h3" size="md">
                                {task.name}
                            </Heading>
                            <Box>
                                <strong>Category:</strong>{" "}
                                {task.category || "None"}
                            </Box>
                            <Box>
                                <strong>Description:</strong>{" "}
                                {task.description || "No description"}
                            </Box>
                            <Box>
                                <strong>Status:</strong>{" "}
                                {task.completed ? "Completed" : "Pending"}
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box>No tasks available.</Box>
                )}
            </VStack>
        </Container>
    );
};

export default Index;
