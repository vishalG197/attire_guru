import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import {
    Container,
    Heading,
    VStack,
    Text,
    Box,
    Badge,
    Button,
    HStack,
    Stack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  padding-top: 100px;
  min-height: 80vh;
  background-color: #f9f9f9;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const MyOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch orders from API
                const response = await axios.get(API_ENDPOINTS.ORDERS);
                const allOrders = response.data;

                // Filter by logged-in user if available in localStorage
                const user = JSON.parse(localStorage.getItem("user") || "{}");

                let userOrders = allOrders;
                if (user && user.id) {
                    userOrders = allOrders.filter((o: any) => o.userId === user.id); // Assuming userId is stored in order
                } else if (user && user.email) {
                    userOrders = allOrders.filter((o: any) => o.userEmail === user.email);
                }

                // Sort by date descending
                userOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setOrders(userOrders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <PageWrapper>
            <Container maxW="container.lg">
                <Heading mb={8}>My Orders</Heading>

                {orders.length === 0 ? (
                    <Text>No orders found.</Text>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {orders.map((order) => (
                            <OrderCard key={order.id}>
                                <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
                                    <VStack align="start" spacing={1}>
                                        <Heading size="sm">Order #{order.id}</Heading>
                                        <Text fontSize="sm" color="gray.500">Placed on {order.date}</Text>
                                    </VStack>

                                    <Box>
                                        <Text fontWeight="bold">₹ {order.totalAmount}</Text>
                                        <Text fontSize="sm" color="gray.500">{order.items?.length || 0} Items</Text>
                                    </Box>

                                    <Badge
                                        colorScheme={
                                            order.status === 'Delivered' ? 'green' :
                                                order.status === 'Processing' ? 'blue' : 'orange'
                                        }
                                        p={2}
                                        borderRadius="md"
                                    >
                                        {order.status}
                                    </Badge>

                                    <Button size="sm" colorScheme="blue" variant="outline" onClick={() => navigate(`/order-details/${order.id}`)}>
                                        View Details
                                    </Button>
                                </Stack>
                            </OrderCard>
                        ))}
                    </VStack>
                )}
            </Container>
        </PageWrapper>
    );
};



export default MyOrders;
