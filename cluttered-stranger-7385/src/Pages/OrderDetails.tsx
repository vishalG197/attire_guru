import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import {
    Container,
    Heading,
    Text,
    VStack,
    Box,
    Divider,
    Button,
    Badge,
    Image,
    HStack,
    Spinner,
    Center
} from '@chakra-ui/react';

const PageWrapper = styled.div`
  padding-top: 100px;
  min-height: 80vh;
  background-color: #f9f9f9;
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // In a real API, we might filter by ID, but json-server supports /orders/:id directly usually, 
                // or if the ID is custom (like "ORD-..."), we might need to search.
                // However, my saved IDs are like "ORD-..." but the 'id' field in json-server is usually separate.
                // Let's try to find it from the full list or exact match if supported.

                // Strategy: Get all and find, since I assigned custom string IDs which might not work with /orders/:id if json-server expects int or default ids.
                // Actually, json-server allows string IDs. let's try direct first, if fails, search.
                // But wait, my ID generation was "ORD-" + timestamp. 

                const response = await axios.get(API_ENDPOINTS.ORDERS);
                const allOrders = response.data;
                const foundOrder = allOrders.find((o: any) => o.id == id); // Loose equality for potential string/number mix

                setOrder(foundOrder);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <PageWrapper>
                <Center h="50vh">
                    <Spinner size="xl" color="blue.500" />
                </Center>
            </PageWrapper>
        );
    }

    if (!order) {
        return (
            <PageWrapper>
                <Container maxW="container.md" centerContent>
                    <Heading size="md" mb={4}>Order not found.</Heading>
                    <Button onClick={() => navigate('/my-orders')}>Back to Orders</Button>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container maxW="container.md">
                <Button variant="link" mb={4} onClick={() => navigate('/my-orders')}>&larr; Back to Orders</Button>
                <Heading mb={6}>Order Details</Heading>

                <DetailCard>
                    <VStack align="stretch" spacing={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Heading size="md" mb={1}>Order #{order.id}</Heading>
                                <Text color="gray.500">{order.date}</Text>
                            </Box>
                            <Badge
                                colorScheme={
                                    order.status === 'Delivered' ? 'green' :
                                        order.status === 'Processing' ? 'blue' : 'orange'
                                }
                                p={2}
                                borderRadius="md"
                                fontSize="0.9em"
                            >
                                {order.status}
                            </Badge>
                        </Box>

                        <Divider />

                        <Box>
                            <Heading size="sm" mb={3} color="gray.700">Shipping Address</Heading>
                            <Text color="gray.600">{order.shippingAddress}</Text>
                            <Text color="gray.600" fontSize="sm" mt={1}>Method: {order.shippingMethod}</Text>
                        </Box>

                        <Divider />

                        <Box>
                            <Heading size="sm" mb={3} color="gray.700">Items</Heading>
                            <VStack align="stretch" spacing={4}>
                                {order.items && order.items.map((item: any, index: number) => {
                                    // Image Resolution Logic
                                    let imgUrl = 'https://via.placeholder.com/80';
                                    if (item.images && item.images.length > 0) imgUrl = item.images[0];
                                    else if (item.image) imgUrl = item.image;

                                    return (
                                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={2} borderWidth="1px" borderRadius="md">
                                            <HStack spacing={4}>
                                                <Image
                                                    src={imgUrl}
                                                    alt={item.title || item.name}
                                                    boxSize="60px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    fallbackSrc="https://via.placeholder.com/60?text=No+Img"
                                                />
                                                <Box>
                                                    <Text fontWeight="600">{item.title || item.name}</Text>
                                                    <Text fontSize="sm" color="gray.500">Qty: {item.quantity || 1}</Text>
                                                </Box>
                                            </HStack>
                                            <Text fontWeight="600">₹ {item.price}</Text>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Box>

                        <Divider />

                        <Box display="flex" justifyContent="space-between" pt={2} alignItems="center">
                            <Box>
                                <Heading size="sm" color="gray.600">Payment</Heading>
                                <Text fontSize="sm" color="gray.500">
                                    {order.paymentDetails?.method} ending in {order.paymentDetails?.last4 || '****'}
                                </Text>
                            </Box>
                            <Box textAlign="right">
                                <Text fontSize="sm" color="gray.500">Total Amount</Text>
                                <Heading size="md" color="#283593">₹ {order.totalAmount}</Heading>
                            </Box>
                        </Box>
                    </VStack>
                </DetailCard>
            </Container>
        </PageWrapper>
    );
};

export default OrderDetails;
