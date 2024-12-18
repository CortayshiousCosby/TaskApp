import { ChevronLeftIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { Link } from "@inertiajs/react";
import { FC } from "react";
import { ModalDisplay } from "../../components/Utility";
import CategoryFieldGroup from "./component/CategoryFieldGroup";
import CategoryTable from "./component/CategoryTable";

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
                            Add Category
                        </Button>
                    }
                >
                    <CategoryFieldGroup title="Create Category" method="POST" />
                </ModalDisplay>
            </HStack>
            <CategoryTable />
        </VStack>
    );
};

export default Index;
