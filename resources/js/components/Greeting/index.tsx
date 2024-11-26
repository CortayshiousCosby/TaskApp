import { Box } from "@chakra-ui/react";
import { usePage } from "@inertiajs/react";
import React, { FC } from "react";

const Greeting: FC = () => {
    const { greeting } = usePage().props;
    return <Box>{`Greeting: ${greeting}`}</Box>;
};

export default Greeting;
