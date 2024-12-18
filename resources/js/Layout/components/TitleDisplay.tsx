import { Box, Heading, VStack } from "@chakra-ui/react";
import { usePage } from "@inertiajs/react";
import React, { FC } from "react";

const TitleDisplay: FC = () => {
    const { title, description } = usePage<InertiaProps>().props;
    return (
        <VStack align="stretch" textAlign="center">
            <Heading>{title}</Heading>
            {description && <Box>{description}</Box>}
        </VStack>
    );
};

export default TitleDisplay;
