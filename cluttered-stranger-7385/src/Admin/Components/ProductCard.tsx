import React from 'react'
import { useNavigate } from "react-router-dom"
import {
    Box,
    Image,
    Badge,
    Text,
    Button,
    Stack,
    Card,
    CardBody,
    CardFooter,
    Heading,
    Divider,
    ButtonGroup,
    Flex,
    IconButton
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface Product {
    id: string;
    name?: string;
    title?: string;
    images?: string[];
    image?: string;
    category?: string;
    price?: number;
    description?: string;
    gender?: string;
    color?: string;
}

interface Props {
    el: Product;
    handleDelete: (id: any) => void
}

const ProductCard = ({ el, handleDelete }: Props) => {
    const navigate = useNavigate();

    // Handle both data structures: name/images (from db.json) and title/image (from old structure)
    const productTitle = el.name || el.title || 'Untitled Product';
    const productImage = (el.images && el.images[0]) || el.image || '';

    return (
        <Card
            maxW='sm'
            cursor="pointer"
            onClick={() => navigate(`/admin/edit/${el.id}`)}
            _hover={{ transform: 'translateY(-5px)', shadow: 'xl', transition: '0.2s' }}
            transition="0.2s"
            variant="outline"
            bg="white"
        >
            <CardBody p={0}>
                <Image
                    src={productImage}
                    alt={productTitle}
                    borderTopRadius="lg"
                    height="200px"
                    width="100%"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/200x200?text=No+Image"
                    loading="lazy"
                />
                <Stack mt='4' spacing='2' p={4}>
                    <Flex justify="space-between" align="center">
                        <Badge borderRadius='full' px='2' colorScheme='teal'>
                            {el.category || 'Uncategorized'}
                        </Badge>
                        <Text color='blue.600' fontSize='lg' fontWeight="bold">
                            ₹ {el.price || 0}
                        </Text>
                    </Flex>

                    <Heading size='md' noOfLines={1} title={productTitle}>{productTitle}</Heading>

                    <Text fontSize='sm' color='gray.500' noOfLines={2}>
                        {el.description || 'No description available'}
                    </Text>

                    <Flex justify="space-between" fontSize="sm" color="gray.600">
                        <Text>Gender: {el.gender || 'N/A'}</Text>
                        <Text>Color: {el.color || 'N/A'}</Text>
                    </Flex>
                </Stack>
            </CardBody>

            <Divider color="gray.200" />

            <CardFooter p={3} justify="flex-end">
                <ButtonGroup spacing='2' onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant='solid'
                        colorScheme='blue'
                        size="sm"
                        leftIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/edit/${el.id}`)}
                    >
                        Edit
                    </Button>
                    <IconButton
                        variant='ghost'
                        colorScheme='red'
                        aria-label='Delete product'
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(el.id)}
                    />
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default ProductCard