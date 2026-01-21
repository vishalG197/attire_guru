import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { reqUsers, deleteUser } from '../Redux/action';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Container,
  Heading,
  Box,
  Image,
  Text,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import UsersCard from '../Components/UsersCard';
import halt from "../Images/unrecognized.jpg";
import { styled } from "styled-components";

const Users = () => {
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth);
  const isAuthPersistent = isAuth || (localStorage.getItem("admin") && JSON.parse(localStorage.getItem("admin") || "").isAuth);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    reqUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Loading Users",
          description: "Failed to fetch users from server",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [toast])

  const handleDelete = (id: number) => {
    deleteUser(id)
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast({
          title: "User Deleted",
          description: "User has been successfully removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: "Delete Failed",
          description: "Could not delete user. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (!isAuthPersistent) {
    return (
      <Box textAlign="center" mt="150px">
        <Image src={halt} margin="auto" transform="scale(1.2)" />
        <Text fontSize="xl" mt={4}>Authentication Required</Text>
      </Box>
    )
  }

  return (
    <Container maxW="container.xl" py={5}>
      <MAINDIV>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/Dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Users</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </MAINDIV>

      <Heading my={6} size="lg" textAlign="center">Registered Users</Heading>

      {isLoading ? (
        <Center py={20}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      ) : users.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No users found in the system
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
          {users.map((el, index) => (
            <UsersCard key={index} el={el} onDelete={handleDelete} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  )
}

export default Users

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