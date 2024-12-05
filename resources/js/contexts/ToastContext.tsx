import React, { createContext, useContext } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";

interface ToastContextProps {
    showToast: (options: UseToastOptions) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const toast = useToast();

    const showToast = (options: UseToastOptions) => {
        toast({
            ...options,
            position: "top-right", // Default position
            duration: 5000, // Default duration
            isClosable: true,
        });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToastContext = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToastContext must be used within a ToastProvider");
    }
    return context;
};
