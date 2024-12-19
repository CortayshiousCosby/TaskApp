import { Box, Container, VStack } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import TitleDisplay from "../components/TitleDisplay";

const Default: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box bg="gray.100" minH="100vh" py={4}>
            <Container
                maxW="1200px"
                bg="white"
                p={4}
                rounded="lg"
                mt={8}
                boxShadow="lg"
            >
                <VStack align="stretch">
                    <TitleDisplay />
                    <Box as="section">{children}</Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Default;
