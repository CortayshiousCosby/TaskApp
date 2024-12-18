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
} from "@chakra-ui/react";
import React, { FC } from "react";
import moment from "moment";
import TaskActionMenu from "./TaskActionMenu";
import { useTasks } from "../../../hooks/use-tasks";

const TaskTable: FC = () => {
    const { data, isSuccess, isLoading } = useTasks();

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
                                    <TaskActionMenu task={task} />
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default TaskTable;
