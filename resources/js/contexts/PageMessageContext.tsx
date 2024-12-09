import React, { createContext, useContext, useState, ReactNode } from "react";

interface PageMessage {
    status: "success" | "error" | "info" | "warning";
    message: string;
}

interface PageMessageContextProps {
    pageMessage: PageMessage | null;
    setPageMessage: (message: PageMessage | null) => void;
}

const PageMessageContext = createContext<PageMessageContextProps | undefined>(
    undefined
);

export const PageMessageProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [pageMessage, setPageMessage] = useState<PageMessage | null>(null);

    return (
        <PageMessageContext.Provider value={{ pageMessage, setPageMessage }}>
            {children}
        </PageMessageContext.Provider>
    );
};

export const usePageMessage = () => {
    const context = useContext(PageMessageContext);
    if (!context) {
        throw new Error(
            "usePageMessage must be used within a PageMessageProvider"
        );
    }
    return context;
};
