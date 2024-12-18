import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { useForm } from "@inertiajs/react";
import { FC } from "react";
import { LuSave } from "react-icons/lu";
import { useCategories } from "../../../hooks/use-categories";

type TaskFieldGroupProps = {
    title?: string;
    defaultValues?: Record<string, any>;
    method: "POST" | "PUT";
};

const TaskFieldGroup: FC<TaskFieldGroupProps> = ({
    title,
    defaultValues = {},
    method = "POST",
}) => {
    const { data, setData, post, put } = useForm(defaultValues);
    const { data: categoryData, isSuccess } = useCategories();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(data);

        if (method === "POST") {
            post("/tasks");
        }

        if (method === "PUT") {
            put(`/tasks/${defaultValues.id}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap={4} py={4}>
                {title && <Heading size="md">{title}</Heading>}
                <Box>
                    <FormControl>
                        <Checkbox
                            name="completed"
                            defaultChecked={data.completed}
                            onChange={(e) =>
                                setData("completed", e.target.checked)
                            }
                        >
                            Is Completed?
                        </Checkbox>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl>
                        <FormLabel>Task Name</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </FormControl>
                </Box>

                <Box>
                    <FormControl>
                        <FormLabel>Category</FormLabel>
                        <Select
                            name="category_id"
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                        >
                            {isSuccess &&
                                categoryData.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
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

export default TaskFieldGroup;
