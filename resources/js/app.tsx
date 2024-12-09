import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";
import { ToastProvider } from "./contexts/ToastContext";

const theme = extendTheme({
    colors: {
        primary: {
            500: "#1a202c", // Example customization
        },
    },
});

createInertiaApp({
    resolve: async (name) => {
        const page = await import(`./Pages/${name}.tsx`);
        return page.default;
    },
    setup({ el, App, props }) {
        ReactDOM.createRoot(el).render(
            <ChakraProvider theme={theme}>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            </ChakraProvider>
        );
    },
});
