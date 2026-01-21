import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSingleOrder, updateOrderStatus } from '../Redux/action';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Image,
    Select,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Container,
    Card,
    CardBody,
    Stack,
    StackDivider,
    Grid,
    GridItem,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    Button
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getSingleOrder(id)
                .then((res) => {
                    setOrder(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: 'Error Loading Order',
                        description: 'Failed to fetch order details',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, toast]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        updateOrderStatus(id, newStatus)
            .then(() => {
                setOrder((prev: any) => ({ ...prev, status: newStatus }));
                toast({
                    title: 'Status Updated Successfully',
                    description: `Order status changed to ${newStatus}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: 'Update Failed',
                    description: 'Could not update order status',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={5}>
                <Center py={20}>
                    <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" thickness="4px" />
                        <Text>Loading order details...</Text>
                    </VStack>
                </Center>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container maxW="container.xl" py={5}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    Order not found
                </Alert>
                <Button mt={4} leftIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/Orders')}>
                    Back to Orders
                </Button>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={5}>
            <MAINDIV>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/admin/Dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to="/admin/Orders">Orders</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            <span>Order #{order.id}</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </MAINDIV>

            <HStack justify="space-between" my={6}>
                <Heading size="lg">Order Details</Heading>
                <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={() => navigate('/admin/Orders')}>
                    Back to Orders
                </Button>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                <GridItem>
                    <Card variant="outline" bg="white">
                        <CardBody>
                            <Heading size="md" mb={4}>Order Items</Heading>
                            {order.products && order.products.length > 0 ? (
                                <Stack divider={<StackDivider />} spacing={4}>
                                    {order.products.map((prod: any, index: number) => (
                                        <HStack key={index} spacing={4} align="start">
                                            <Image
                                                src={prod.image}
                                                alt={prod.title}
                                                boxSize="100px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                fallbackSrc="https://via.placeholder.com/100"
                                            />
                                            <VStack align="start" spacing={1} flex={1}>
                                                <Heading size="sm">{prod.title}</Heading>
                                                <Text fontSize="sm" color="gray.600">Category: {prod.category}</Text>
                                                <Text fontSize="sm">Quantity: {prod.quantity || 1}</Text>
                                                <Text fontWeight="bold">₹ {prod.price}</Text>
                                            </VStack>
                                        </HStack>
                                    ))}
                                </Stack>
                            ) : (
                                <Text color="gray.500">No product details available</Text>
                            )}
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <VStack spacing={6} align="stretch">
                        <Card variant="outline" bg="white">
                            <CardBody>
                                <Heading size="md" mb={4}>Order Summary</Heading>
                                <Stack spacing={3}>
                                    <HStack justify="space-between">
                                        <Text>Order ID:</Text>
                                        <Text fontWeight="bold">#{order.id}</Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text>Date:</Text>
                                        <Text>{order.date || 'N/A'}</Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text>Total Amount:</Text>
                                        <Text fontWeight="bold" fontSize="lg" color="green.600">
                                            ₹ {order.total_price || order.price}
                                        </Text>
                                    </HStack>
                                    <Box pt={4}>
                                        <Text mb={2} fontWeight="semibold">Status:</Text>
                                        <Select
                                            value={order.status || "Pending"}
                                            onChange={handleStatusChange}
                                            bg={
                                                order.status === 'Delivered' ? 'green.100' :
                                                    order.status === 'Shipped' ? 'blue.100' :
                                                        order.status === 'Cancelled' ? 'red.100' : 'yellow.100'
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </Select>
                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>

                        <Card variant="outline" bg="white">
                            <CardBody>
                                <Heading size="md" mb={4}>Customer Details</Heading>
                                <Stack spacing={3}>
                                    <Text><strong>Name:</strong> {order.username || 'Guest'}</Text>
                                    <Text><strong>Address:</strong> {order.address || 'N/A'}</Text>
                                    {order.mobile && <Text><strong>Mobile:</strong> {order.mobile}</Text>}
                                </Stack>
                            </CardBody>
                        </Card>
                    </VStack>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default OrderDetail;

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
