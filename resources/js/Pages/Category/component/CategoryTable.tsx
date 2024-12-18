import {
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FC } from "react";
import { ModalDisplay } from "../../../components/Utility";
import { useCategories } from "../../../hooks/use-categories";
import CategoryFieldGroup from "./CategoryFieldGroup";

const CategoryTable: FC = () => {
    const { data, isLoading, isSuccess } = useCategories();

    return (
        <TableContainer>
            <Table fontSize="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading && (
                        <Tr>
                            <Td colSpan={3}>
                                <Skeleton h="30px" />
                            </Td>
                        </Tr>
                    )}
                    {isSuccess &&
                        data.map((category) => (
                            <Tr key={category.id}>
                                <Td>{category.id}</Td>
                                <Td>{category.name}</Td>
                                <Td>
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
                                            title="Edit Category"
                                            defaultValues={category}
                                            method="PUT"
                                        />
                                    </ModalDisplay>
                                    <IconButton
                                        aria-label="Delete"
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        ml={2}
                                        onClick={() =>
                                            console.log("Delete", category.id)
                                        }
                                    />
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default CategoryTable;
