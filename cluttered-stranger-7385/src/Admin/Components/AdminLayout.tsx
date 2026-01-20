import React, { ReactNode } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';

import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const bg = useColorModeValue('gray.100', 'gray.900');

    return (
        <Box minH="100vh" bg={bg}>
            <Sidebar />
            <Box ml={{ base: 0, md: 60 }}>
                <AdminNavbar />
                <Box p="4">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;
