import React, { FC, useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    SimpleGrid,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import TaskForm from "../components/Tasks/components/TaskForm";
import TaskCard from "../components/Tasks/components/TaskCard";
import TaskFilter from "../components/Tasks/components/TaskFilter";
import TaskPagination from "../components/Tasks/components/TaskPagination";
import axios from "axios";
import dayjs from "dayjs";

interface Task {
    id: number;
    name: string;
    category: { id: number; name: string } | null;
    category_id?: number | null;
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
        category_id: null, // Use category_id for task creation
        description: "",
        completed: false,
        due_date: "",
    });
    const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);

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
    const {
        isOpen: isDeleteSelectedOpen,
        onOpen: onDeleteSelectedOpen,
        onClose: onDeleteSelectedClose,
    } = useDisclosure();

    useEffect(() => {
        fetchCategories(); // Fetch categories first
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            fetchTasks();
        }
    }, [categories]); // Fetch tasks only after categories are available

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            setCategories(response.data); // Assuming the API returns [{ id: 1, name: "Work" }, ...]
        } catch (error) {
            toast({
                title: "Error Fetching Categories",
                description: "Could not load categories. Try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>("/api/tasks");

            const formattedTasks = response.data.map((task) => {
                const categoryObject = categories.find(
                    (cat) => cat.id === (task as any).category_id // Temporary cast for category_id
                );

                return {
                    ...task,
                    category: categoryObject || null, // Map to { id, name }
                    due_date: task.due_date
                        ? dayjs(task.due_date).toISOString()
                        : null,
                };
            });

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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        let formattedValue;

        if (name === "due_date" && type === "datetime-local") {
            formattedValue = value;
        } else if (name === "category_id") {
            formattedValue = value ? Number(value) : null; // Convert to number or null
        } else {
            formattedValue = type === "checkbox" ? checked : value;
        }

        if (editingTask) {
            setEditingTask({
                ...editingTask,
                [name]: formattedValue,
            });
        } else {
            setNewTask({
                ...newTask,
                [name]: formattedValue,
            });
        }
    };

    const toggleTaskSelection = (taskId: number) => {
        setSelectedTasks((prevSelected) => {
            const updated = new Set(prevSelected);
            if (updated.has(taskId)) {
                updated.delete(taskId);
            } else {
                updated.add(taskId);
            }
            return updated;
        });
    };

    const handleSelectAll = () => {
        const allTaskIds = tasks.map((task) => task.id);
        setSelectedTasks(new Set(allTaskIds));
        toast({
            title: "All Tasks Selected",
            description: "All tasks have been selected.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleUnselectAll = () => {
        setSelectedTasks(new Set());
        toast({
            title: "Selections Cleared",
            description: "All selected tasks have been unselected.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleDeleteSelectedTasks = async () => {
        const taskIds = Array.from(selectedTasks);
        try {
            const response = await axios.delete("/api/tasks/delete-multiple", {
                params: { ids: taskIds },
            });
            if (response.data.status === "success") {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => !selectedTasks.has(task.id))
                );
                setSelectedTasks(new Set());
                toast({
                    title: "Tasks Deleted",
                    description: "Selected tasks have been deleted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error Deleting Tasks",
                description:
                    "Could not delete selected tasks. Try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            onDeleteSelectedClose();
        }
    };

    const handleAddTask = async () => {
        try {
            const taskToSave = {
                name: newTask.name,
                category_id: newTask.category_id, // Ensure category_id is sent
                description: newTask.description,
                completed: newTask.completed,
                due_date: newTask.due_date
                    ? dayjs(newTask.due_date).toISOString()
                    : null,
            };

            const response = await axios.post("/tasks", taskToSave);

            if (response.data.status === "success") {
                const newTaskWithCategory = {
                    ...response.data.task,
                    category:
                        categories.find(
                            (cat) => cat.id === response.data.task.category_id
                        ) || null,
                };

                setTasks((prevTasks) => [...prevTasks, newTaskWithCategory]);

                setNewTask({
                    name: "",
                    category_id: null, // Reset to null
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
            }
        } catch (error) {
            console.error("Error adding task:", error);
            toast({
                title: "Error Adding Task",
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
        onEditOpen();
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
                const updatedTask = response.data.task;

                // Find the category object for the updated task using category_id
                const categoryObject = categories.find(
                    (cat) => cat.id === Number(updatedTask.category_id)
                );

                // Update tasks state with the updated task and the correct category
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === updatedTask.id
                            ? {
                                  ...updatedTask,
                                  category: categoryObject || null,
                              }
                            : task
                    )
                );

                setEditingTask(null);
                onEditClose();

                toast({
                    title: "Task Updated",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error(error);
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

    const filteredTasks = tasks.filter((task) => {
        const now = dayjs();
        const query = searchQuery.toLowerCase();

        if (searchQuery) {
            const matchesName = task.name.toLowerCase().includes(query);
            const matchesCategory = task.category?.name
                .toLowerCase()
                .includes(query);
            const matchesDescription = task.description
                ?.toLowerCase()
                .includes(query);
            if (!(matchesName || matchesCategory || matchesDescription)) {
                return false;
            }
        }

        if (filterStatus === "completed") return task.completed;
        if (filterStatus === "pending") return !task.completed;
        if (filterStatus === "urgent") {
            return (
                !task.completed &&
                task.due_date &&
                dayjs(task.due_date).isBefore(now.add(24, "hour"))
            );
        }
        if (filterStatus === "coming_soon") {
            return (
                !task.completed &&
                task.due_date &&
                dayjs(task.due_date).isAfter(now.add(24, "hour")) &&
                dayjs(task.due_date).isBefore(now.add(48, "hour"))
            );
        }
        if (filterStatus === "long_term") {
            return (
                !task.completed &&
                task.due_date &&
                dayjs(task.due_date).isAfter(now.add(48, "hour"))
            );
        }
        if (filterStatus === "no_due_date") {
            return (
                !task.completed &&
                (!task.due_date || !dayjs(task.due_date).isValid())
            );
        }

        return true;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        const now = dayjs();

        const getPriority = (task: Task): number => {
            if (task.completed) return 5;
            if (!task.due_date) return 4;
            const dueDate = dayjs(task.due_date);
            if (dueDate.isBefore(now.add(24, "hour"))) return 1;
            if (dueDate.isBefore(now.add(48, "hour"))) return 2;
            return 3;
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        if (a.due_date && b.due_date) {
            return dayjs(a.due_date).isAfter(dayjs(b.due_date)) ? 1 : -1;
        }

        return 0;
    });

    const paginatedTasks = sortedTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    );

    return (
        <Container maxW="container.xl" py={10}>
            <Box textAlign="center" mb={8}>
                <Heading>Task Manager</Heading>
                <Text>A better way to organize.</Text>
            </Box>
            <Grid templateColumns={["1fr", null, "1fr 2fr"]} gap={8}>
                <VStack spacing={6}>
                    <TaskForm
                        task={newTask}
                        categories={categories} // Pass categories here
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
                    <Button
                        colorScheme="teal"
                        onClick={handleSelectAll}
                        mb={2}
                        isDisabled={tasks.length === 0}
                    >
                        Select All
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={onDeleteSelectedOpen}
                        isDisabled={selectedTasks.size === 0}
                        mb={2}
                    >
                        Delete Selected
                    </Button>
                    <Button
                        colorScheme="gray"
                        onClick={handleUnselectAll}
                        isDisabled={selectedTasks.size === 0}
                        mb={4}
                    >
                        Unselect All
                    </Button>
                    <SimpleGrid columns={[1, null, 2]} spacing={6}>
                        {paginatedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditButtonClick}
                                onDelete={() => confirmDeleteTask(task)}
                                isSelected={selectedTasks.has(task.id)}
                                onSelect={() => toggleTaskSelection(task.id)}
                            />
                        ))}
                    </SimpleGrid>
                    <TaskPagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                            sortedTasks.length / tasksPerPage
                        )}
                        onPrevious={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        onNext={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    Math.ceil(
                                        sortedTasks.length / tasksPerPage
                                    ),
                                    prev + 1
                                )
                            )
                        }
                    />
                </Box>
            </Grid>
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TaskForm
                            task={editingTask || newTask}
                            categories={categories} // Pass categories here
                            onInputChange={handleInputChange}
                            onSave={handleEditTask}
                            onCancel={onEditClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
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
                        <Button colorScheme="red" onClick={handleDeleteTask}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isDeleteSelectedOpen}
                onClose={onDeleteSelectedClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Delete Selected</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete the selected tasks? This
                        action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            onClick={handleDeleteSelectedTasks}
                        >
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteSelectedClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Home;
