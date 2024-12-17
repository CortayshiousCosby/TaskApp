import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
} from "@chakra-ui/react";
import TaskForm from "./components/TaskForm"; // Import your TaskForm component
import { Task } from "./types";

interface TaskModalsProps {
    editingTask: Partial<Task> | null; // Updated to accept Partial<Task>
    setEditingTask: (task: Partial<Task> | null) => void; // Updated to accept Partial<Task>
    onEditSave: (task: Partial<Task>) => void;
    isEditOpen: boolean;
    onEditClose: () => void;

    taskToDelete: Task | null;
    onDelete: () => void;
    isDeleteOpen: boolean;
    onDeleteClose: () => void;

    onDeleteSelected: () => void;
    isDeleteSelectedOpen: boolean;
    onDeleteSelectedClose: () => void;
}

const TaskModals: React.FC<TaskModalsProps> = ({
    editingTask,
    setEditingTask,
    onEditSave,
    isEditOpen,
    onEditClose,
    taskToDelete,
    onDelete,
    isDeleteOpen,
    onDeleteClose,
    onDeleteSelected,
    isDeleteSelectedOpen,
    onDeleteSelectedClose,
}) => {
    return (
        <>
            {/* Edit Task Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TaskForm
                            task={editingTask || {}}
                            onInputChange={(e) =>
                                setEditingTask({
                                    ...editingTask!,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            onSave={() => {
                                onEditSave(editingTask!);
                                onEditClose();
                            }}
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
                        <Text>
                            Are you sure you want to delete the task{" "}
                            <strong>{taskToDelete?.name}</strong>? This action
                            cannot be undone.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={onDelete}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Selected Tasks Modal */}
            <Modal
                isOpen={isDeleteSelectedOpen}
                onClose={onDeleteSelectedClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Delete Selected</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Are you sure you want to delete the selected tasks?
                            This action cannot be undone.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={onDeleteSelected}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteSelectedClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TaskModals;
