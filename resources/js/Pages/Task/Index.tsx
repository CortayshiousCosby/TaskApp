import { ChevronLeftIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { Link } from "@inertiajs/react";
import { FC } from "react";
import { ModalDisplay } from "../../components/Utility";
import TaskFieldGroup from "./components/TaskFieldGroup";
import TaskTable from "./components/TaskTable";

const Index: FC = () => {
    return (
        <VStack align="stretch">
            <HStack>
                <Button leftIcon={<ChevronLeftIcon />} as={Link} href="/">
                    Back
                </Button>
                <Spacer />
                <ModalDisplay
                    triggerButton={
                        <Button colorScheme="green" leftIcon={<SmallAddIcon />}>
                            Add Task
                        </Button>
                    }
                >
                    <TaskFieldGroup title="Create Task" method="POST" />
                </ModalDisplay>
            </HStack>
            <TaskTable />
        </VStack>
    );
};

export default Index;
