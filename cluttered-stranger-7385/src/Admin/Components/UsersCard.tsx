import React from 'react'
import { useNavigate } from 'react-router-dom';
import users from "../Images/user.png";
import {
    Button,
    Card,
    CardBody,
    Image,
    Stack,
    Heading,
    Text,
    Flex,
    Avatar,
    IconButton
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

interface Users {
    el: any;
    onDelete: (id: any) => void;
}

const UsersCard = ({ el, onDelete }: Users) => {
    const navigate = useNavigate();

    return (
        <Card
            maxW='sm'
            cursor="pointer"
            onClick={() => navigate(`/admin/user/${el.id}`)}
            _hover={{ transform: 'translateY(-5px)', shadow: 'xl', transition: '0.2s' }}
            transition="0.2s"
            variant="outline"
            align="center"
            py={4}
        >
            <CardBody textAlign="center">
                <Avatar
                    size="2xl"
                    name={el.username}
                    src={users}
                    mb={4}
                    bg="teal.500"
                />
                <Stack mt='2' spacing='3'>
                    <Heading size='md' color="blue.600">{el.username}</Heading>
                    {/* Password hidden for security */}
                    <Text fontSize='sm' color='gray.500'>
                        ID: {el.id}
                    </Text>
                </Stack>

                <Flex justify="center" mt={4} onClick={(e) => e.stopPropagation()}>
                    <Button
                        colorScheme='red'
                        variant='outline'
                        size="sm"
                        leftIcon={<DeleteIcon />}
                        onClick={() => onDelete(el.id)}
                    >
                        Delete User
                    </Button>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default UsersCard