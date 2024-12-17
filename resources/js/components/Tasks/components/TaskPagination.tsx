import React from "react";
import { Stack, Button, Text } from "@chakra-ui/react";

interface TaskPaginationProps {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

const TaskPagination: React.FC<TaskPaginationProps> = ({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
}) => {
    return (
        <Stack direction="row" justify="center" mt="6">
            <Button size="sm" disabled={currentPage === 1} onClick={onPrevious}>
                Previous
            </Button>
            <Text>
                Page {currentPage} of {totalPages}
            </Text>
            <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={onNext}
            >
                Next
            </Button>
        </Stack>
    );
};

export default TaskPagination;
