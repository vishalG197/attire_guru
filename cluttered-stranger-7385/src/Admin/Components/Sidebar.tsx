import React from 'react';
import { Box, VStack, Link, Text, Icon, Flex } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiShoppingBag, FiPackage, FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../Redux/actiontype';
import { useNavigate } from 'react-router-dom';
import logo from '../../Images/logo-new.png';

const Sidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: LOGOUT });
        localStorage.clear();
        navigate('/Login');
    };

    const NavItem = ({ icon, children, to }: { icon: any, children: React.ReactNode, to: string }) => {
        const isActive = location.pathname.includes(to);
        return (
            <Link
                as={RouterLink}
                to={to}
                style={{ textDecoration: 'none' }}
                w="100%"
            >
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    bg={isActive ? 'cyan.400' : 'transparent'}
                    color={isActive ? 'white' : 'gray.600'}
                    _hover={{
                        bg: 'cyan.400',
                        color: 'white',
                    }}
                >
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="16"
                            _groupHover={{
                                color: 'white',
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
            </Link>
        );
    };

    return (
        <Box
            minH="100vh"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            bg="white"
            borderRight="1px"
            borderRightColor="gray.200"
            py={5}
            display={{ base: 'none', md: 'block' }}
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'gray',
                    borderRadius: '24px',
                },
            }}
        >
            <VStack spacing={4} align="stretch" pb={10}>
                <Box px={8} mb={8} display="flex" alignItems="center" justifyContent="center">
                    <img src={logo} alt="Attire Guru" style={{ width: '150px' }} />
                </Box>

                <NavItem icon={FiHome} to="/admin/Dashboard">Dashboard</NavItem>
                <NavItem icon={FiUsers} to="/admin/Users">Users</NavItem>
                <NavItem icon={FiShoppingBag} to="/admin/AllProducts">All Products</NavItem>
                <NavItem icon={FiPackage} to="/admin/Orders">Orders</NavItem>
                <NavItem icon={FiPackage} to="/admin/AddProduct">Add Product</NavItem>

                <Box onClick={handleLogout} cursor="pointer" mt={10}>
                    <Flex
                        align="center"
                        p="4"
                        mx="4"
                        borderRadius="lg"
                        role="group"
                        cursor="pointer"
                        _hover={{
                            bg: 'red.400',
                            color: 'white',
                        }}
                        color="red.500"
                    >
                        <Icon
                            mr="4"
                            fontSize="16"
                            _groupHover={{
                                color: 'white',
                            }}
                            as={FiLogOut}
                        />
                        <Text>Logout</Text>
                    </Flex>
                </Box>
            </VStack>
        </Box>
    );
};

export default Sidebar;
