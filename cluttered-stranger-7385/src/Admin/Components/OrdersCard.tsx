import React from 'react'
import { useNavigate } from 'react-router-dom';
import users from "../Images/user.png";
import {
    Button,
    Select,
    Card,
    CardBody,
    Image,
    Text,
    Stack,
    Flex,
    Heading,
    Badge,
    Divider
} from '@chakra-ui/react';
import { DeleteIcon, CalendarIcon } from '@chakra-ui/icons';

interface Users {
    el: any;
    onDelete: (id: any) => void;
    onUpdateStatus: (id: any, status: string) => void;
}

const OrdersCard = ({ el, onDelete, onUpdateStatus }: Users) => {
    const navigate = useNavigate();

    return (
        <Card
            cursor="pointer"
            onClick={() => navigate(`/admin/order/${el.id}`)}
            _hover={{ transform: 'translateY(-5px)', shadow: 'xl', transition: '0.2s' }}
            transition="0.2s"
            variant="outline"
            width="100%"
        >
            <CardBody>
                <Flex gap={4} align="flex-start">
                    <Image
                        src={el.image || users}
                        alt="Order Item"
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                    />
                    <Stack spacing={1} flex={1}>
                        <Flex justify="space-between" align="center">
                            <Heading size="sm">Order #{el.id}</Heading>
                            <Badge colorScheme={
                                el.status === 'Delivered' ? 'green' :
                                    el.status === 'Shipped' ? 'blue' :
                                        el.status === 'Cancelled' ? 'red' : 'yellow'
                            }>
                                {el.status || 'Pending'}
                            </Badge>
                        </Flex>

                        <Text fontSize="sm" fontWeight="bold" color="blue.600">
                            {el.title || "Product Item"}
                        </Text>

                        <Flex fontSize="xs" color="gray.500" align="center" gap={2}>
                            <CalendarIcon />
                            <Text>{el.date}</Text>
                        </Flex>

                        <Text fontSize="xs">
                            <strong>User:</strong> {el.username}
                        </Text>
                        <Text fontSize="xs" noOfLines={1}>
                            <strong>Address:</strong> {el.address}
                        </Text>
                        <Text fontWeight="bold" mt={1}>
                            ₹ {el.price}
                        </Text>
                    </Stack>
                </Flex>

                <Divider my={4} />

                <Flex justify="space-between" align="center" gap={2} onClick={(e) => e.stopPropagation()}>
                    <Select
                        size="sm"
                        value={el.status || "Pending"}
                        onChange={(e) => onUpdateStatus(el.id, e.target.value)}
                        width="140px"
                        borderRadius="md"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </Select>

                    <Button
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        leftIcon={<DeleteIcon />}
                        onClick={() => onDelete(el.id)}
                    >
                        Delete
                    </Button>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default OrdersCard