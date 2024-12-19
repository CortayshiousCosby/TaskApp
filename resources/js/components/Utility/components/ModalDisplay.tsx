import {
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { FC, cloneElement, isValidElement } from "react";

type ModalDisplayProps = {
    children: React.ReactNode;
    triggerButton?: React.ReactElement<any>;
    title?: string;
    modalSize?: string;
    customUseDisclosure?: ReturnType<typeof useDisclosure>;
    customHandler?: () => void;
};

export const ModalDisplay: FC<ModalDisplayProps> = ({
    children,
    triggerButton,
    title,
    modalSize,
    customUseDisclosure,
    customHandler,
}) => {
    const { isOpen, onOpen, onClose } = customUseDisclosure ?? useDisclosure();

    const defaultButton = <Button onClick={onOpen}>Open Modal</Button>;

    const TriggerButton = triggerButton
        ? isValidElement(triggerButton)
            ? cloneElement(triggerButton as React.ReactElement<any>, {
                  onClick: customHandler ?? onOpen,
              })
            : triggerButton
        : defaultButton;

    return (
        <>
            {TriggerButton}
            <Modal isOpen={isOpen} onClose={onClose} size={modalSize ?? "xl"}>
                <ModalOverlay />
                <ModalContent>
                    {title && (
                        <ModalHeader>
                            <Heading size="md">{title}</Heading>
                        </ModalHeader>
                    )}
                    <ModalCloseButton />
                    <ModalBody>{children}</ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
