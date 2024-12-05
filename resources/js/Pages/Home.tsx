import React, { FC, useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    VStack,
    Heading,
    Text,
    useDisclosure,
    useToast,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
} from "@chakra-ui/react";
import TaskForm from "../components/Tasks/TaskForm";
import TaskCard from "../components/Tasks/TaskCard";
import TaskFilter from "../components/Tasks/TaskFilter";
import TaskPagination from "../components/Tasks/TaskPagination";
import axios from "axios";

interface Task {
    id: number;
    name: string;
    category: string;
    description?: string;
    completed: boolean;
    due_date: string | null;
}

const tasksPerPage = 6;

const Home: FC = () => {
    const toast = useToast();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        name: "",
        category: "",
        description: "",
        completed: false,
        due_date: "",
    });
    const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>("/api/tasks");
            setTasks(response.data);
        } catch (error) {
            toast({
                title: "Error Fetching Tasks",
                description: "Could not load tasks. Try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
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
            const response = await axios.post("/tasks", newTask);
            if (response.data.status === "success") {
                setTasks([...tasks, response.data.task]);
                setNewTask({
                    name: "",
                    category: "",
                    description: "",
                    completed: false,
                    due_date: "",
                });
                toast({
                    title: "Task Added",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error Adding Task",
                    description: response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error Adding Task",
                description: "Ensure task details are correct.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleEditTask = async () => {
        if (!editingTask || !editingTask.id) return;

        try {
            const response = await axios.put(
                `/tasks/${editingTask.id}`,
                editingTask
            );
            if (response.data.status === "success") {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === response.data.task.id
                            ? response.data.task
                            : task
                    )
                );
                setEditingTask(null);
                toast({
                    title: "Task Updated",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error Updating Task",
                    description: response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error Updating Task",
                description: "Ensure task details are correct.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const confirmDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        onOpen();
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            const response = await axios.delete(`/tasks/${taskToDelete.id}`);
            if (response.data.status === "success") {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskToDelete.id)
                );
                toast({
                    title: "Task Deleted",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error Deleting Task",
                    description: response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error Deleting Task",
                description: "An unexpected error occurred.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setTaskToDelete(null);
            onClose();
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                task.name.toLowerCase().includes(query) ||
                (task.category &&
                    task.category.toLowerCase().includes(query)) ||
                (task.description &&
                    task.description.toLowerCase().includes(query))
            );
        }
        return true;
    });

    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    );

    return (
        <Container mt="10" maxW="container.xl">
            {/* Header */}
            <Box textAlign="center" mb="10">
                <Heading as="h1" size="2xl">
                    Welcome to Task Master Pro!
                </Heading>
                <Text fontSize="lg" color="gray.600" mt="2">
                    The ultimate task management app to keep you productive.
                </Text>
            </Box>

            {/* Grid Layout */}
            <Grid templateColumns={["1fr", null, "1fr 2fr"]} gap="6">
                {/* Left Column: Form and Filters */}
                <VStack spacing="6">
                    <TaskForm
                        task={editingTask || newTask}
                        onInputChange={handleInputChange}
                        onSave={editingTask ? handleEditTask : handleAddTask}
                        onCancel={() => setEditingTask(null)}
                    />
                    <TaskFilter
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />
                </VStack>

                {/* Right Column: Task List */}
                <Box>
                    <Heading as="h2" size="lg" mb="4">
                        Task List
                    </Heading>
                    <SimpleGrid columns={[1, null, 2]} spacing="6">
                        {paginatedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={setEditingTask}
                                onDelete={() => confirmDeleteTask(task)}
                            />
                        ))}
                    </SimpleGrid>
                    <TaskPagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                            filteredTasks.length / tasksPerPage
                        )}
                        onPrevious={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        onNext={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    Math.ceil(
                                        filteredTasks.length / tasksPerPage
                                    ),
                                    prev + 1
                                )
                            )
                        }
                    />
                </Box>
            </Grid>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete the task{" "}
                        <strong>{taskToDelete?.name}</strong>? This action
                        cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleDeleteTask}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Home;
