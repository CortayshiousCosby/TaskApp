import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
} from "@chakra-ui/react";
import { useForm } from "@inertiajs/react";
import { FC } from "react";
import { LuSave } from "react-icons/lu";

type CategoryFieldGroupProps = {
    title?: string;
    defaultValues?: Record<string, any>;
    method: "POST" | "PUT";
};

const CategoryFieldGroup: FC<CategoryFieldGroupProps> = ({
    title,
    defaultValues = {},
    method = "POST",
}) => {
    const { data, setData, post, put } = useForm(defaultValues);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (method === "POST") {
            post("/categories");
        }

        if (method === "PUT") {
            put(`/categories/${defaultValues.id}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap={4} py={4}>
                {title && <Heading size="md">{title}</Heading>}
                <FormControl>
                    <FormLabel>Category Name</FormLabel>
                    <Input
                        type="text"
                        name="name"
                        value={data.name || ""}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </FormControl>
                <Button colorScheme="green" leftIcon={<LuSave />} type="submit">
                    Save
                </Button>
            </VStack>
        </form>
    );
};

export default CategoryFieldGroup;
