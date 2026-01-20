import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Avatar,
    Divider,
    Button,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ProfileWrapper = styled.div`
  padding-top: 100px;
  min-height: 80vh;
  background-color: #f7f7f7;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  max-width: 600px;
  margin: 0 auto;
`;

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Fetch stats
            fetchUserStats(parsedUser);
        } else {
            // Fallback or redirect if no user info
            // setUser({ name: "Guest User", email: "guest@example.com" });
        }
    }, []);

    const fetchUserStats = async (currentUser: any) => {
        try {
            const response = await axios.get(API_ENDPOINTS.ORDERS);
            const allOrders = response.data;

            // Filter detailed logic matches MyOrders
            let userOrders = [];
            if (currentUser.id) {
                userOrders = allOrders.filter((o: any) => o.userId === currentUser.id);
            } else if (currentUser.email) {
                userOrders = allOrders.filter((o: any) => o.userEmail === currentUser.email);
            }

            const totalSpent = userOrders.reduce((acc: number, curr: any) => acc + (Number(curr.totalAmount) || 0), 0);

            setStats({
                totalOrders: userOrders.length,
                totalSpent: totalSpent
            });

        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    if (!user) {
        return (
            <ProfileWrapper>
                <Container maxW="container.md" centerContent>
                    <Heading size="md" mb={4}>Please log in to view your profile.</Heading>
                    <Button colorScheme="blue" onClick={() => navigate('/login')}>Login</Button>
                </Container>
            </ProfileWrapper>
        );
    }

    return (
        <ProfileWrapper>
            <Container maxW="container.lg">
                <Heading mb={8} textAlign="center" color="#333">My Profile</Heading>

                <Card>
                    <VStack spacing={6} align="start">
                        <HStack spacing={6} w="full" justify="start">
                            <Avatar size="2xl" name={user.name || user.email} src={user.avatar} bg="#283593" color="white" />
                            <VStack align="start" spacing={1}>
                                <Heading size="lg">{user.name || "User"}</Heading>
                                <Text color="gray.500" fontSize="lg">{user.email}</Text>
                            </VStack>
                        </HStack>

                        <Divider />

                        <VStack align="start" spacing={5} w="full">
                            <Box w="full">
                                <Text fontSize="sm" color="gray.500" mb={1}>Full Name</Text>
                                <Text fontSize="md" fontWeight="500">{user.name || "N/A"}</Text>
                            </Box>

                            <Box w="full">
                                <Text fontSize="sm" color="gray.500" mb={1}>Email Address</Text>
                                <Text fontSize="md" fontWeight="500">{user.email}</Text>
                            </Box>

                            <Box w="full">
                                <Text fontSize="sm" color="gray.500" mb={1}>Mobile Number</Text>
                                <Text fontSize="md" fontWeight="500">{user.mobile || "N/A"}</Text>
                            </Box>
                        </VStack>

                        <Divider />

                        <SimpleGrid columns={2} spacing={5} w="full">
                            <Stat p={3} border="1px solid #eee" borderRadius="md">
                                <StatLabel>Total Orders</StatLabel>
                                <StatNumber>{stats.totalOrders}</StatNumber>
                                <StatHelpText>Placed</StatHelpText>
                            </Stat>
                            <Stat p={3} border="1px solid #eee" borderRadius="md">
                                <StatLabel>Total Spent</StatLabel>
                                <StatNumber>₹ {stats.totalSpent}</StatNumber>
                                <StatHelpText>Lifetime</StatHelpText>
                            </Stat>
                        </SimpleGrid>

                        <Button
                            mt={4}
                            w="full"
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate('/my-orders')}
                        >
                            View My Orders
                        </Button>
                    </VStack>
                </Card>
            </Container>
        </ProfileWrapper>
    );
};

export default Profile;
