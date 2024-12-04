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

interface PageMessageComponentProps {
    duration?: number; // Allow customization of message visibility duration
}

const PageMessage: FC<PageMessageComponentProps> = ({ duration = 5000 }) => {
    const { pageMessage } = usePage<{ pageMessage?: PageMessageProps }>().props;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (pageMessage) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [pageMessage, duration]);

    if (!isVisible || !pageMessage) {
        return null;
    }

    return (
        <Fade in={isVisible}>
            <Alert
                status={pageMessage.status}
                mb={4}
                role="alert"
                aria-live="polite"
            >
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
