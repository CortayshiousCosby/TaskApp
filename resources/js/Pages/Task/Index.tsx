import { Box, Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { FC } from "react";
import TaskTable from "./components/TaskTable";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "@inertiajs/react";

const Index: FC = () => {
    return (
        <VStack align="stretch">
            <HStack>
                <Box>
                    <Button leftIcon={<ChevronLeftIcon />} as={Link} href="/">
                        Back
                    </Button>
                    <Spacer />
                </Box>
            </HStack>
            <TaskTable />
        </VStack>
    );
};

export default Index;
