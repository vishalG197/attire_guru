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
    Container,
    Card,
    CardBody,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    HStack,
    Avatar,
    Text,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { styled } from 'styled-components';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getSingleUser(id)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: 'Error Loading User',
                        description: 'Failed to fetch user details',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        if (!user.username || !user.password) {
            toast({
                title: 'Validation Error',
                description: 'Username and password are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSaving(true);
        updateUser(id, user)
            .then(() => {
                toast({
                    title: 'User Updated Successfully',
                    description: 'User information has been saved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: 'Update Failed',
                    description: 'Could not update user. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .finally(() => setIsSaving(false));
    };

    const handleDelete = () => {
        setIsSaving(true);
        deleteUser(id)
            .then(() => {
                toast({
                    title: 'User Deleted Successfully',
                    description: 'User has been removed from the system',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/admin/Users');
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: 'Delete Failed',
                    description: 'Could not delete user. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setIsSaving(false);
            });
        onClose();
    };

    if (isLoading) {
        return (
            <Container maxW="container.md" py={5}>
                <Center py={20}>
                    <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" thickness="4px" />
                        <Text>Loading user details...</Text>
                    </VStack>
                </Center>
            </Container>
        );
    }

    if (!user.username) {
        return (
            <Container maxW="container.md" py={5}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    User not found
                </Alert>
                <Button mt={4} leftIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/Users')}>
                    Back to Users
                </Button>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={5}>
            <MAINDIV>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/admin/Dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/admin/Users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            <span>User Details</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </MAINDIV>

            <HStack justify="space-between" my={6}>
                <Heading size="lg">User Profile</Heading>
                <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={() => navigate('/admin/Users')}>
                    Back to Users
                </Button>
            </HStack>

            <Card variant="outline" bg="white">
                <CardBody>
                    <VStack spacing={6}>
                        <Avatar size="2xl" name={user.username} bg="teal.500" color="white" />

                        <VStack spacing={4} width="100%">
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                            </FormControl>

                            <Flex width="100%" justify="space-between" mt={6} pt={4} borderTopWidth="1px">
                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    leftIcon={<DeleteIcon />}
                                    onClick={onOpen}
                                    isDisabled={isSaving}
                                >
                                    Delete User
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<CheckIcon />}
                                    onClick={handleUpdate}
                                    isLoading={isSaving}
                                    loadingText="Saving..."
                                >
                                    Update User
                                </Button>
                            </Flex>
                        </VStack>
                    </VStack>
                </CardBody>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isSaving}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
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
