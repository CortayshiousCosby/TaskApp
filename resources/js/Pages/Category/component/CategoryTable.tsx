import {
    Skeleton,
    Table,
    TableContainer,
    Th,
    Thead,
    Tbody,
    Tr,
    Td,
} from "@chakra-ui/react";
import { FC } from "react";
import CategoryActionMenu from "./CategoryActionMenu";
import { useCategories } from "../../../hooks/use-categories";

const CategoryTable: FC = () => {
    const { data, isLoading, isSuccess } = useCategories();

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
                                    <CategoryActionMenu category={category} />
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default CategoryTable;
