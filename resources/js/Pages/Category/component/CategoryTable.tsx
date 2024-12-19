import {
    Skeleton,
    Table,
    TableContainer,
    Th,
    Thead,
    Tbody,
    Tr,
    Td,
    useToast,
} from "@chakra-ui/react";
import { FC } from "react";
import CategoryActionMenu from "./CategoryActionMenu";
import { useCategories } from "../../../hooks/use-categories";
import axios from "axios";

const CategoryTable: FC = () => {
    const toast = useToast();
    const { data, isLoading, isSuccess, refetch } = useCategories();

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const response = await axios.delete(`/api/category/${categoryId}`);
            if (response.data.message === "Category deleted successfully") {
                toast({
                    title: "Category Deleted",
                    description: "The category was successfully deleted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                refetch(); // Refetch categories to update the table
            }
        } catch (error) {
            toast({
                title: "Error Deleting Category",
                description: "An unexpected error occurred.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <TableContainer>
            <Table fontSize="sm" variant="striped">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th textAlign="right">Actions</Th>
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
                                <Td textAlign="right">
                                    <CategoryActionMenu
                                        category={category}
                                        onDelete={handleDeleteCategory}
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
