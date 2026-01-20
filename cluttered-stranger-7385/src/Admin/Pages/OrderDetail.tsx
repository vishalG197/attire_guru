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
    GridItem
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { styled } from 'styled-components';

const OrderDetail = () => {
    const { id } = useParams();
    const toast = useToast();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getSingleOrder(id)
                .then((res) => {
                    setOrder(res.data);
                })
                .catch((err) => {
                    console.error(err);
                    toast({
                        title: 'Error fetching order',
                        status: 'error',
                        duration: 3000,
                    });
                });
        }
    }, [id, toast]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        updateOrderStatus(id, newStatus)
            .then(() => {
                setOrder((prev: any) => ({ ...prev, status: newStatus }));
                toast({
                    title: 'Order status updated',
                    status: 'success',
                    duration: 3000,
                });
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: 'Error updating status',
                    status: 'error',
                    duration: 3000,
                });
            });
    };

    if (!order) {
        return <Container>Loading...</Container>;
    }

    return (
        <Container maxW="container.xl" py={5}>
            <MAINDIV>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link to="/admin/Dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link to="/admin/Orders">Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>
                            <span>Order #{order.id}</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </MAINDIV>

            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} mt={8}>
                <GridItem>
                    <Card variant="outline">
                        <CardBody>
                            <Heading size="md" mb={4}>Order Items</Heading>
                            <Stack divider={<StackDivider />} spacing={4}>
                                {order.products?.map((prod: any, index: number) => (
                                    <HStack key={index} spacing={4} align="start">
                                        <Image
                                            src={prod.image}
                                            alt={prod.title}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="md"
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
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <VStack spacing={6} align="stretch">
                        <Card variant="outline">
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
                                        <Text fontWeight="bold" fontSize="lg" color="green.600">₹ {order.total_price || order.price}</Text>
                                    </HStack>
                                    <Box pt={4}>
                                        <Text mb={2}>Status:</Text>
                                        <Select
                                            value={order.status}
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

                        <Card variant="outline">
                            <CardBody>
                                <Heading size="md" mb={4}>Customer Details</Heading>
                                <Stack spacing={3}>
                                    <Text><strong>Name:</strong> {order.username || 'Guest'}</Text>
                                    <Text><strong>Address:</strong> {order.address || 'N/A'}</Text>
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
