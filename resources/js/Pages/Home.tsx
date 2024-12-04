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
    Select,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Grid,
} from "@chakra-ui/react";
import PageMessage from "../components/Common/PageMessage";
import React, { FC, useState, useEffect, useRef } from "react";
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

const Index: FC = () => {
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
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get<Task[]>("/api/tasks");
            setTasks(response.data);
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
            } else {
                console.error("Error adding task:", response.data.message);
            }
        } catch (error) {
            console.error("Error adding task:", error);
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
            } else {
                console.error("Error updating task:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            const response = await axios.delete(`/tasks/${taskToDelete}`);
            if (response.data.status === "success") {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskToDelete)
                );
            } else {
                console.error("Delete error:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setTaskToDelete(null);
            onClose();
        }
    };

    const handleEditButtonClick = (task: Task) => {
        setEditingTask(task);
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const openDeleteModal = (id: number) => {
        setTaskToDelete(id);
        onOpen();
    };

    const filteredTasks = tasks.filter((task) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                task.name.toLowerCase().includes(query) ||
                (task.category &&
                    task.category.toLowerCase().includes(query)) ||
                (task.description &&
                    task.description.toLowerCase().includes(query));
            if (!matchesSearch) return false;
        }

        // Handle filtering based on status
        if (filterStatus === "completed") return task.completed;
        if (filterStatus === "pending") return !task.completed;
        if (filterStatus === "urgent")
            return (
                !task.completed &&
                dayjs(task.due_date).diff(dayjs(), "hours") <= 24
            );
        if (filterStatus === "coming_soon")
            return (
                !task.completed &&
                dayjs(task.due_date).diff(dayjs(), "hours") > 24 &&
                dayjs(task.due_date).diff(dayjs(), "hours") <= 48
            );
        if (filterStatus === "long_term")
            return (
                !task.completed &&
                dayjs(task.due_date).diff(dayjs(), "hours") > 48
            );
        if (filterStatus === "no_due_date")
            return !task.completed && !task.due_date;

        // Default case for "all" filter
        return true;
    });

    const groupedTasks = filteredTasks.sort((a, b) => {
        const getPriority = (task: Task): number => {
            if (task.completed) return 4; // Completed tasks have lowest priority
            if (!task.due_date) return 3; // No due date tasks come after upcoming
            const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
            if (hoursDiff <= 24) return 1; // Urgent tasks come first
            if (hoursDiff <= 48) return 2; // Coming soon tasks come next
            return 3; // Long-term tasks
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) return priorityA - priorityB;

        // Secondary sorting by due date (ascending)
        if (a.due_date && b.due_date) {
            return dayjs(a.due_date).isAfter(dayjs(b.due_date)) ? 1 : -1;
        }

        // No due date tasks are pushed further down
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;

        return 0; // Default fallback
    });

    const paginatedTasks = groupedTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    );

    const getTaskBgColor = (task: Task): string => {
        if (task.completed) return "green.100";
        if (!task.due_date) return "blue.100";
        const hoursDiff = dayjs(task.due_date).diff(dayjs(), "hours");
        if (hoursDiff <= 24) return "red.100";
        if (hoursDiff <= 48) return "orange.100";
        return "yellow.100";
    };

    return (
        <Container mt="10" maxW="container.xl">
            {/* Page Message */}
            <PageMessage />

            {/* Header */}
            <Box textAlign="center" mb="10">
                <Heading as="h1" size="2xl">
                    Welcome to Task Master Pro!
                </Heading>
                <Text fontSize="lg" color="gray.600" mt="2">
                    The ultimate task management app to keep you on track and
                    productive.
                </Text>
            </Box>

            {/* Grid Layout */}
            <Grid templateColumns={["1fr", null, "1fr 2fr"]} gap="6">
                {/* Left: Form & Filters */}
                <VStack spacing="6">
                    <Box
                        ref={formRef}
                        borderWidth="1px"
                        p="6"
                        borderRadius="lg"
                    >
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

                    <Box>
                        <Heading as="h2" size="lg" mb="4">
                            Search & Filter
                        </Heading>
                        <Stack spacing="4">
                            <Input
                                placeholder="Search (name, category, description)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select
                                placeholder="Filter tasks"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
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
                    </Box>
                </VStack>

                {/* Right: Task List */}
                <Box>
                    <Heading as="h2" size="lg" mb="4">
                        Task List
                    </Heading>
                    <SimpleGrid columns={[1, null, 2]} spacing="6">
                        {paginatedTasks.map((task) => (
                            <Box
                                key={task.id}
                                bg={getTaskBgColor(task)}
                                borderWidth="1px"
                                p="6"
                                borderRadius="lg"
                            >
                                <Heading as="h3" size="md" mb="2">
                                    {task.name}
                                </Heading>
                                <Text>
                                    <strong>Category:</strong>{" "}
                                    {task.category || "N/A"}
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
                                        ? dayjs(task.due_date).format(
                                              "YYYY-MM-DD HH:mm"
                                          )
                                        : "No Due Date"}
                                </Text>
                                <Stack direction="row" mt="4" spacing="2">
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() =>
                                            handleEditButtonClick(task)
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => openDeleteModal(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                    </SimpleGrid>

                    {/* Pagination */}
                    <Stack direction="row" justify="center" mt="6">
                        <Button
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>
                        <Text>
                            Page {currentPage} of{" "}
                            {Math.ceil(groupedTasks.length / tasksPerPage)}
                        </Text>
                        <Button
                            size="sm"
                            disabled={
                                currentPage ===
                                Math.ceil(groupedTasks.length / tasksPerPage)
                            }
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Grid>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this task? This action
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

export default Index;
