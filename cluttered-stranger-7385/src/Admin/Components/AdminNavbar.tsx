import React from 'react';
import {
    Flex,
    Text,
    IconButton,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Box,
    Image
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from '../../Redux/actiontype';
import { useNavigate } from 'react-router-dom';

// You can import the logo image if you want to use it alongside text
// import logo from "../Images/Icons/logo-new.png"; 

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector((store: any) => store.AuthReducer.username) || "Admin";

    const handleLogout = () => {
        dispatch({ type: LOGOUT });
        localStorage.clear();
        navigate('/Login');
    };

    return (
        <Flex
            ml={{ base: 0, md: 0 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'space-between' }}
            position="sticky"
            top="0"
            zIndex="sticky"
        >
            {/* Logo Section */}
            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold"
            >
                Attire Guru
            </Text>

            {/* Logo moved to Sidebar for Desktop */}


            <Flex alignItems={'center'}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                    android-aria-label="notifications"
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}
                        >
                            <Flex alignItems={'center'}>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <Box display={{ base: 'none', md: 'flex' }} alignItems="center">
                                    <Text fontSize="sm" fontWeight="600" ml="2">
                                        {username}
                                    </Text>
                                    <Box ml="2">
                                        <FiChevronDown />
                                    </Box>
                                </Box>
                            </Flex>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AdminNavbar;
