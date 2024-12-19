import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { ModalDisplay } from "../../../components/Utility";
import { TaskProps } from "../../../types/Task";
import TaskFieldGroup from "./TaskFieldGroup";

type TaskActionMenuProps = {
    task: TaskProps;
    onDelete: (taskId: number) => void; // Add onDelete prop
};

const TaskActionMenu: FC<TaskActionMenuProps> = ({ task, onDelete }) => {
    return (
        <HStack>
            <ModalDisplay
                triggerButton={
                    <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        colorScheme="blue"
                    />
                }
            >
                <TaskFieldGroup
                    title={`Edit Task ID: ${task.id}`}
                    defaultValues={task}
                    method="PUT"
                />
            </ModalDisplay>
            <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => onDelete(task.id)} // Call onDelete when clicked
            />
        </HStack>
    );
};

export default TaskActionMenu;
