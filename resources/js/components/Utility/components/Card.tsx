import { Box, Flex, Heading } from "@chakra-ui/react";

export const Card = {
    Root: ({ children, ...props }: any) => (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            {...props}
        >
            {children}
        </Box>
    ),
    Body: ({ children, ...props }: any) => (
        <Box p="4" {...props}>
            {children}
        </Box>
    ),
    Title: ({ children, ...props }: any) => (
        <Heading size="md" {...props}>
            {children}
        </Heading>
    ),
    Footer: ({ children, ...props }: any) => (
        <Flex
            p="4"
            borderTopWidth="1px"
            borderColor="gray.200"
            justifyContent="space-between"
            alignItems="center"
            {...props}
        >
            {children}
        </Flex>
    ),
};
