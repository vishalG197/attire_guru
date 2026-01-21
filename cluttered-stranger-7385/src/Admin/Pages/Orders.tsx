import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  SimpleGrid,
  Box,
  Image,
  Text,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import halt from "../Images/unrecognized.jpg";
import { reqOrders, deleteOrder, updateOrderStatus } from "../Redux/action";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import OrdersCard from "../Components/OrdersCard";

const Orders = () => {
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth);
  const isAuthPersistent = isAuth || (localStorage.getItem("admin") && JSON.parse(localStorage.getItem("admin") || "").isAuth);

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    reqOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Loading Orders",
          description: "Failed to fetch orders from server",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  const handleDelete = (id: number) => {
    deleteOrder(id)
      .then(() => {
        setOrders(prev => prev.filter(order => order.id !== id));
        toast({
          title: "Order Deleted",
          description: "Order has been successfully removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: "Delete Failed",
          description: "Could not delete order. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateOrderStatus(id, status)
      .then(() => {
        setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
        toast({
          title: "Status Updated",
          description: `Order status changed to ${status}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: "Update Failed",
          description: "Could not update order status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }

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
            <BreadcrumbLink>Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </MAINDIV>

      <Heading my={6} size="lg" textAlign="center">Customer Orders</Heading>

      {isLoading ? (
        <Center py={20}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      ) : orders.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No orders found in the system
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6}>
          {orders.map((el, index) => (
            <OrdersCard
              key={index}
              el={el}
              onDelete={handleDelete}
              onUpdateStatus={handleStatusUpdate}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Orders;

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
