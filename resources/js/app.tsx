import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React, { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Default from "./Layout/Default";

type PageComponent = React.ComponentType<any> & {
    layout?: (page: ReactNode) => ReactNode;
};

const theme = extendTheme({
    colors: {
        primary: {
            500: "#1a202c", // Example customization
        },
    },
});

const queryClient = new QueryClient();

createInertiaApp({
    resolve: (name) => {
        const pages: Record<string, { default: PageComponent }> =
            import.meta.glob("./Pages/**/*.tsx", { eager: true });

        const pageModule = pages[`./Pages/${name}.tsx`];

        if (!pageModule) {
            throw new Error(`Page not found: ./Pages/${name}.tsx`);
        }

        const PageComponent = pageModule.default;

        PageComponent.layout =
            PageComponent.layout || ((page) => <Default>{page}</Default>);

        return PageComponent;
    },
    setup({ el, App, props }) {
        console.log("App Props", props.initialPage.props);
        createRoot(el).render(
            <StrictMode>
                <QueryClientProvider client={queryClient}>
                    <ChakraProvider theme={theme}>
                        <App {...props} />
                    </ChakraProvider>
                </QueryClientProvider>
            </StrictMode>
        );
    },
});
