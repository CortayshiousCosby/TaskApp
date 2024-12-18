import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";
import { ToastProvider } from "./contexts/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
                <QueryClientProvider client={queryClient}>
                    <ToastProvider>
                        <App {...props} />
                    </ToastProvider>
                </QueryClientProvider>
            </ChakraProvider>
        );
    },
});
