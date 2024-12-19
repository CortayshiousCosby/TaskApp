import { Container, SimpleGrid, Square, Text } from "@chakra-ui/react";
import { Link, usePage } from "@inertiajs/react";
import { ContentProps } from "../../types/Page";
import { CollectionIcon } from "./components/CollectionIcon";
import { Card } from "../Utility";

export const Block = () => {
    const { content } = usePage<InertiaProps>().props;
    return (
        <Container maxW="6xl" py="16">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="8">
                {content.map((collection: ContentProps, index: number) => (
                    <Link
                        key={index}
                        href={collection.url ? collection.url : ""}
                    >
                        <Card.Root key={index}>
                            <Card.Body gap="1">
                                <Square
                                    size="10"
                                    layerStyle="fill.solid"
                                    rounded="l2"
                                >
                                    <CollectionIcon value={collection.icon} />
                                </Square>
                                <Card.Title mt="3">
                                    {collection.title}
                                </Card.Title>
                                <Text color="fg.muted" textStyle="sm">
                                    {collection.description}
                                </Text>
                            </Card.Body>
                        </Card.Root>
                    </Link>
                ))}
            </SimpleGrid>
        </Container>
    );
};
