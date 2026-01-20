import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSingleUser, updateUser, deleteUser } from '../Redux/action';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    Container
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { styled } from 'styled-components';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            getSingleUser(id)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: 'Error fetching user',
                        status: 'error',
                        duration: 3000,
                    });
                });
        }
    }, [id, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        setIsLoading(true);
        updateUser(id, user)
            .then(() => {
                toast({
                    title: 'User updated successfully',
                    status: 'success',
                    duration: 3000,
                });
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: 'Error updating user',
                    status: 'error',
                    duration: 3000,
                });
                setIsLoading(false);
            });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setIsLoading(true);
            deleteUser(id)
                .then(() => {
                    toast({
                        title: 'User deleted successfully',
                        status: 'success',
                        duration: 3000,
                    });
                    navigate('/admin/Users');
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: 'Error deleting user',
                        status: 'error',
                        duration: 3000,
                    });
                    setIsLoading(false);
                });
        }
    };

    return (
        <Container maxW="container.md" py={5}>
            <MAINDIV>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link to="/admin/Dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link to="/admin/Users">Users</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            <span>User Details</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </MAINDIV>

            <Box mt={8} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <Heading as="h3" size="lg" mb={6} textAlign="center">
                    User Details
                </Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <Flex width="100%" justify="space-between" mt={4}>
                        <Button colorScheme="red" onClick={handleDelete} isLoading={isLoading}>
                            Delete User
                        </Button>
                        <Button colorScheme="blue" onClick={handleUpdate} isLoading={isLoading}>
                            Update User
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Container>
    );
};

export default UserDetail;

const MAINDIV = styled.div`
  width: 100%;
  margin-bottom: 20px;

  span {
    color: #5c6bc0;
    font-size: 18px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
  }

  span:hover {
    scale: 1.1;
    transition: 500ms;
  }
`;
