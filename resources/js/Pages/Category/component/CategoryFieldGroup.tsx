import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
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
        console.log("Form Data:", data);

        if (method === "POST") {
            post("/category");
        }

        if (method === "PUT" && defaultValues.id) {
            put(`/category/${defaultValues.id}`);
        } else {
            console.error("Category ID is missing for the PUT request");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap={4} py={4}>
                {title && <Heading size="md">{title}</Heading>}
                <Box>
                    <FormControl>
                        <FormLabel>Category Name</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </FormControl>
                </Box>
                <Box>
                    <Button
                        colorScheme="green"
                        leftIcon={<LuSave />}
                        type="submit"
                    >
                        Save
                    </Button>
                </Box>
            </VStack>
        </form>
    );
};

export default CategoryFieldGroup;
