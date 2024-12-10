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
import dayjs from "dayjs";

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

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>("/api/tasks");
            const formattedTasks = response.data.map((task) => ({
                ...task,
                due_date: task.due_date
                    ? dayjs(task.due_date).format("YYYY-MM-DDTHH:mm")
                    : "",
            }));
            setTasks(formattedTasks);
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

        const formattedValue =
            name === "due_date" && type === "datetime-local" ? value : value;

        if (editingTask) {
            setEditingTask({
                ...editingTask,
                [name]: type === "checkbox" ? checked : formattedValue,
            });
        } else {
            setNewTask({
                ...newTask,
                [name]: type === "checkbox" ? checked : formattedValue,
            });
        }
    };

    const handleAddTask = async () => {
        try {
            const taskToSave = {
                ...newTask,
                due_date: newTask.due_date
                    ? dayjs(newTask.due_date).toISOString()
                    : null,
            };

            const response = await axios.post("/tasks", taskToSave);
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
            const taskToSave = {
                ...editingTask,
                due_date: editingTask.due_date
                    ? dayjs(editingTask.due_date).toISOString()
                    : null,
            };

            const response = await axios.put(
                `/tasks/${editingTask.id}`,
                taskToSave
            );
            if (response.data.status === "success") {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === response.data.task.id
                            ? {
                                  ...response.data.task,
                                  due_date: taskToSave.due_date,
                              }
                            : task
                    )
                );
                setEditingTask(null);
                onEditClose(); // Close the edit modal
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

    const handleEditButtonClick = (task: Task) => {
        const formattedTask = {
            ...task,
            due_date: task.due_date
                ? dayjs(task.due_date).format("YYYY-MM-DDTHH:mm")
                : "",
        };
        setEditingTask(formattedTask);
        onEditOpen(); // Open the edit modal
    };

    const confirmDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        onDeleteOpen();
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
            onDeleteClose();
        }
    };

    const filteredTasks = tasks
        .filter((task) => {
            const query = searchQuery.toLowerCase();

            // Combine Search Logic
            if (searchQuery) {
                const matchesName = task.name.toLowerCase().includes(query);
                const matchesCategory = task.category
                    ?.toLowerCase()
                    .includes(query);
                const matchesDescription = task.description
                    ?.toLowerCase()
                    .includes(query);

                // Add search for time sensitivity states
                const matchesState =
                    (query === "urgent" &&
                        !task.completed &&
                        dayjs(task.due_date).diff(dayjs(), "hours") <= 24) ||
                    (query === "coming soon" &&
                        !task.completed &&
                        dayjs(task.due_date).diff(dayjs(), "hours") > 24 &&
                        dayjs(task.due_date).diff(dayjs(), "hours") <= 48) ||
                    (query === "long term" &&
                        !task.completed &&
                        dayjs(task.due_date).diff(dayjs(), "hours") > 48) ||
                    (query === "no due date" &&
                        !task.completed &&
                        !task.due_date) ||
                    (query === "completed" && task.completed);

                if (
                    !(
                        matchesName ||
                        matchesCategory ||
                        matchesDescription ||
                        matchesState
                    )
                ) {
                    return false;
                }
            }

            // Dropdown Filter Logic
            if (filterStatus === "completed") return task.completed;
            if (filterStatus === "all") return true; // All tasks include everything
            if (filterStatus === "pending") return !task.completed;
            if (filterStatus === "urgent") {
                const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
                return !task.completed && task.due_date && hoursDiff <= 24;
            }
            if (filterStatus === "coming_soon") {
                const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
                return (
                    !task.completed &&
                    task.due_date &&
                    hoursDiff > 24 &&
                    hoursDiff <= 48
                );
            }
            if (filterStatus === "long_term") {
                const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
                return !task.completed && task.due_date && hoursDiff > 48;
            }
            if (filterStatus === "no_due_date")
                return !task.completed && !task.due_date;

            // Default: Show all tasks
            return true;
        })
        .sort((a, b) => {
            const getPriority = (task: Task): number => {
                if (task.completed) return 5; // Completed tasks have the lowest priority
                if (!task.due_date) return 4; // Tasks with no due date
                const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
                if (hoursDiff <= 24) return 1; // Urgent tasks
                if (hoursDiff <= 48) return 2; // Coming soon tasks
                return 3; // Long-term tasks
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) return priorityA - priorityB;

            // Secondary sorting by due date (earlier due dates first)
            if (a.due_date && b.due_date) {
                return dayjs(a.due_date).isAfter(dayjs(b.due_date)) ? 1 : -1;
            }

            return 0; // Fallback for equal priorities
        });
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    );

    return (
        <Box transform="scale(0.95)" transformOrigin="top" w="100%">
            <Container maxW="container.xl" py={10}>
                <Box textAlign="center" mb={8}>
                    <Heading>Task Manager</Heading>
                    <Text>A better way to organize.</Text>
                </Box>
                <Grid templateColumns={["1fr", null, "1fr 2fr"]} gap={8}>
                    <VStack spacing={6}>
                        <TaskForm
                            task={newTask}
                            onInputChange={handleInputChange}
                            onSave={handleAddTask}
                        />
                        <TaskFilter
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                        />
                    </VStack>
                    <Box>
                        <SimpleGrid columns={[1, null, 2]} spacing={6}>
                            {paginatedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEditButtonClick}
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
                {/* Edit Task Modal */}
                <Modal isOpen={isEditOpen} onClose={onEditClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Task</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <TaskForm
                                task={editingTask || newTask}
                                onInputChange={handleInputChange}
                                onSave={handleEditTask}
                                onCancel={onEditClose}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
                {/* Delete Task Modal */}
                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
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
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteTask}
                            >
                                Delete
                            </Button>
                            <Button variant="ghost" onClick={onDeleteClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Container>
        </Box>
    );
};

export default Home;
