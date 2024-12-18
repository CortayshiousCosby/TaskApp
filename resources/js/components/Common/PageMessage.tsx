import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    CloseButton,
    Fade,
    Spacer,
} from "@chakra-ui/react";
import { usePage } from "@inertiajs/react";
import React, { FC, useEffect, useState } from "react";

interface PageMessageProps {
    status: "success" | "error" | "info" | "warning";
    message: string;
}

const PageMessage: FC = () => {
    const { pageMessage } = usePage<{ pageMessage?: PageMessageProps | null }>()
        .props;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log("pageMessage from server:", pageMessage);
        if (pageMessage) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000); // Show for 5 seconds
            return () => clearTimeout(timer); // Cleanup
        }
    }, [pageMessage]);

    if (!isVisible || !pageMessage) {
        return null;
    }

    return (
        <Fade in={isVisible}>
            <Alert status={pageMessage.status} mb={4}>
                <AlertIcon />
                <Box>
                    <AlertDescription>{pageMessage.message}</AlertDescription>
                </Box>
                <Spacer />
                <CloseButton
                    alignSelf="flex-start"
                    position="relative"
                    right={-1}
                    top={-1}
                    onClick={() => setIsVisible(false)}
                />
            </Alert>
        </Fade>
    );
};

export default PageMessage;
