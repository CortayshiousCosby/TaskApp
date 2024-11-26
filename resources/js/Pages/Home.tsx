import { Box, Button, Container, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import Greeting from "../components/Greeting";

const Index: FC = (props) => {
    console.log("props", props);
    return (
        <Container mt="10">
            <VStack align="stretch" gap="12">
                <Box>
                    <Button colorScheme="green">Add Task</Button>
                </Box>
                <Greeting />
                <Greeting />
                <Greeting />
                <Greeting />
                <Greeting />
                <Greeting />
            </VStack>
        </Container>
    );
};

export default Index;
