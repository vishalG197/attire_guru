import React from 'react';
import {
    Box,
    Flex,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Text,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../../Redux/actiontype';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = () => {
        dispatch({ type: LOGOUT });
        localStorage.clear();
        navigate('/Login');
    };

    return (
        <Box
            bg={bg}
            px={4}
            borderBottomWidth="1px"
            borderBottomColor={borderColor}
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex h={16} alignItems="center" justifyContent="flex-end">
                {/* Right side - Notifications and Profile */}
                <Flex alignItems="center" gap={4}>
                    {/* Notification Icon */}
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="Notifications"
                        icon={<FiBell />}
                    />

                    {/* Profile Menu */}
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}
                        >
                            <Flex alignItems="center" gap={2}>
                                <Avatar
                                    size="sm"
                                    name="Admin"
                                    bg="teal.500"
                                />
                                <Box display={{ base: 'none', md: 'flex' }} alignItems="center">
                                    <Text fontSize="sm" fontWeight="medium">
                                        Admin
                                    </Text>
                                    <FiChevronDown />
                                </Box>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => navigate('/admin/Dashboard')}>
                                Dashboard
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/Users')}>
                                Users
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/AllProducts')}>
                                Products
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/Orders')}>
                                Orders
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout} color="red.500">
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Box>
    );
};

export default AdminNavbar;
