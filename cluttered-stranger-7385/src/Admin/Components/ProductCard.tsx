import React from 'react'
import { Productss } from '../Pages/AllProducts';
import { useNavigate, Link } from "react-router-dom"
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

interface Props {
    el: Productss;
    handleDelete: (id: any) => void
}

const ProductCard = ({ el, handleDelete }: Props) => {
    const navigate = useNavigate();

    return (
        <Card
            maxW='sm'
            cursor="pointer"
            onClick={() => navigate(`/admin/edit/${el.id}`)}
            _hover={{ transform: 'translateY(-5px)', shadow: 'xl', transition: '0.2s' }}
            transition="0.2s"
            variant="outline"
        >
            <CardBody p={0}>
                <Image
                    src={el.image}
                    alt={el.title}
                    borderTopRadius="lg"
                    height="200px"
                    width="100%"
                    objectFit="cover"
                />
                <Stack mt='4' spacing='2' p={4}>
                    <Flex justify="space-between" align="center">
                        <Badge borderRadius='full' px='2' colorScheme='teal'>
                            {el.category}
                        </Badge>
                        <Text color='blue.600' fontSize='lg' fontWeight="bold">
                            ₹ {el.price}
                        </Text>
                    </Flex>

                    <Heading size='md' noOfLines={1} title={el.title}>{el.title}</Heading>

                    <Text fontSize='sm' color='gray.500' noOfLines={2}>
                        {el.description}
                    </Text>

                    <Flex justify="space-between" fontSize="sm" color="gray.600">
                        <Text>Gender: {el.gender}</Text>
                        <Text>Color: {el.color}</Text>
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