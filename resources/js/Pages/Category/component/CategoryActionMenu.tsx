import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { ModalDisplay } from "../../../components/Utility";
import CategoryFieldGroup from "./CategoryFieldGroup";

type CategoryActionMenuProps = {
    category: { id: number; name: string };
};

const CategoryActionMenu: FC<CategoryActionMenuProps> = ({ category }) => {
    return (
        <HStack justify="flex-end">
            <ModalDisplay
                triggerButton={
                    <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        colorScheme="blue"
                    />
                }
            >
                <CategoryFieldGroup
                    title={`Edit Category ID: ${category.id}`}
                    defaultValues={category}
                    method="PUT"
                />
            </ModalDisplay>
            <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => {
                    fetch(`/category/${category.id}`, {
                        method: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": document.head
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content")!,
                        },
                    }).then(() => window.location.reload());
                }}
            />
        </HStack>
    );
};

export default CategoryActionMenu;
