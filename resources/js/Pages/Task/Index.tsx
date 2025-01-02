import { ChevronLeftIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
    Button,
    HStack,
    Spacer,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Link } from "@inertiajs/react";
import { FC } from "react";
import { ModalDisplay } from "../../components/Utility";
import TaskFieldGroup from "./components/TaskFieldGroup";
import TaskTable from "./components/TaskTable";
import { useQueryClient } from "@tanstack/react-query";

const Index: FC = () => {
    const customUseDisclosure = useDisclosure();
    const toast = useToast();

    const queryClient = useQueryClient();

    function onSubmitSuccess() {
        customUseDisclosure.onClose();
        toast({
            title: "Task Created",
            description: "Task has been created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        queryClient.invalidateQueries({
            queryKey: ["api", "tasks"],
        });
    }
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
                    customUseDisclosure={customUseDisclosure}
                >
                    <TaskFieldGroup
                        title="Create Task"
                        method="POST"
                        defaultValues={{
                            completed: false,
                            name: "",
                            description: "",
                            due_date: "",
                            category_id: "",
                        }}
                        onSuccessCallback={onSubmitSuccess}
                    />
                </ModalDisplay>
            </HStack>
            <TaskTable />
        </VStack>
    );
};

export default Index;
