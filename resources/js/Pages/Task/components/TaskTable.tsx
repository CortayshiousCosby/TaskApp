import {
    Skeleton,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import moment from "moment";
import TaskActionMenu from "./TaskActionMenu";
import { useTasks } from "../../../hooks/use-tasks";
import axios from "axios";

const TaskTable: FC = () => {
    const toast = useToast();
    const { data, isSuccess, isLoading, refetch } = useTasks(); // Include refetch to update the table after deletion
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteTask = async (taskId: number) => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(`/tasks/${taskId}`);
            if (response.data.status === "success") {
                toast({
                    title: "Task Deleted",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                refetch(); // Refetch tasks to update the table
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
            setIsDeleting(false);
        }
    };

    return (
        <TableContainer>
            <Table fontSize="sm" variant={"striped"}>
                <Thead>
                    <Tr>
                        <Th>Status</Th>
                        <Th>Name</Th>
                        <Th>Category</Th>
                        <Th>Description</Th>
                        <Th>Due Date</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading && (
                        <Tr>
                            <Td colSpan={6}>
                                <Skeleton h="30px" />
                            </Td>
                        </Tr>
                    )}
                    {isSuccess &&
                        data.map((task) => (
                            <Tr key={task.id}>
                                <Td>
                                    <Tag
                                        colorScheme={
                                            task.completed ? "green" : "red"
                                        }
                                    >
                                        {task.completed
                                            ? "Complete"
                                            : "Incomplete"}
                                    </Tag>
                                </Td>
                                <Td>{task.name}</Td>
                                <Td>
                                    {task.category
                                        ? task.category.name
                                        : "None"}
                                </Td>
                                <Td>{task.description || ""}</Td>
                                <Td>
                                    {task.due_date
                                        ? moment(task.due_date).format(
                                              "MMM D, YYYY"
                                          )
                                        : ""}
                                </Td>
                                <Td>
                                    <TaskActionMenu
                                        task={task}
                                        onDelete={handleDeleteTask}
                                    />
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default TaskTable;
