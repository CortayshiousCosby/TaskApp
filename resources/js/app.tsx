import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";

// Define a custom theme if necessary
const theme = extendTheme({
    colors: {
        primary: {
            500: "#1a202c", // Example customization
        },
    },
});

createInertiaApp({
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        ReactDOM.createRoot(el).render(
            <ChakraProvider theme={theme}>
                <App {...props} />
            </ChakraProvider>
        );
    },
});
