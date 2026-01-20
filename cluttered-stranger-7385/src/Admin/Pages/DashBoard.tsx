import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from "react-icons/fi";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api"; // Assuming this exists, otherwise hardcode or use relative
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashBoard = () => {
  const bg = useColorModeValue('gray.100', 'gray.900');
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth) || localStorage.getItem("admin");
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // For safety, defaulting to relative paths if API_ENDPOINTS not readily available or complex
      try {
        // Fetch Users
        const usersRes = await axios.get("http://localhost:8080/users");
        const usersCount = usersRes.data.length;

        // Fetch Products
        const productsRes = await axios.get("http://localhost:8080/products");
        const products = productsRes.data;
        const productsCount = products.length;

        // Process Categories
        const categories = products.reduce((acc: any, curr: any) => {
          const cat = curr.category || 'Uncategorized';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});
        const catData = Object.keys(categories).map(key => ({
          name: key,
          value: categories[key],
        }));
        setCategoryData(catData);


        // Fetch Orders
        // Note: db.json might not have orders initially populated well, handling graceful failure
        let ordersCount = 0;
        let revenue = 0;
        let orders = [];
        try {
          const ordersRes = await axios.get("http://localhost:8080/orders");
          orders = ordersRes.data;
          ordersCount = orders.length;

          const salesByDate: any = {};

          orders.forEach((order: any) => {
            const amt = order.totalAmount || order.total || order.price || 0;
            const date = order.date || order.order_date || "Unknown";

            revenue += amt;

            if (salesByDate[date]) {
              salesByDate[date] += amt;
            } else {
              salesByDate[date] = amt;
            }
          });

          const salesChartData = Object.keys(salesByDate).map(date => ({
            name: date,
            sales: Math.round(salesByDate[date])
          })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

          setSalesData(salesChartData);
          setRecentOrders(orders.slice(-5).reverse());
        } catch (e) {
          console.log("No orders found or error fetching orders");
        }


        setStats({
          users: usersCount,
          products: productsCount,
          orders: ordersCount,
          revenue: Math.round(revenue), // Round to integer
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!isAuth) {
    return <Box p={5}><Heading>Please Log In</Heading></Box>;
  }

  return (
    <Box>
      <Heading mb={6} size="lg">Dashboard Overview</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatsCard title="Total Users" stat={stats.users} icon={FiUsers} color="blue.500" />
        <StatsCard title="Total Products" stat={stats.products} icon={FiShoppingBag} color="green.500" />
        <StatsCard title="Total Orders" stat={stats.orders} icon={FiPackage} color="orange.500" />
        <StatsCard title="Total Revenue" stat={`$${stats.revenue}`} icon={FiDollarSign} color="purple.500" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Box bg="white" p={5} shadow="md" borderRadius="lg">
          <Heading size="md" mb={4}>Product Categories</Heading>
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore */}
            <PieChart>
              {/* @ts-ignore */}
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {/* @ts-ignore */}
                {/* @ts-ignore */}
                {categoryData.map((entry, index) => {
                  // @ts-ignore
                  return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                })}
              </Pie>
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box bg="white" p={5} shadow="md" borderRadius="lg">
          <Heading size="md" mb={4}>Sales Analytics</Heading>
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore */}
            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="name" />
              {/* @ts-ignore */}
              <YAxis />
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Legend />
              {/* @ts-ignore */}
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      <Box bg="white" p={5} shadow="md" borderRadius="lg">
        <Heading size="md" mb={4}>Recent Orders</Heading>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.username || "Guest"}</Td>
                  <Td>${order.total || order.price || "-"}</Td>
                  <Td color="green.500" fontWeight="bold">Completed</Td>
                </Tr>
              )) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">No recent orders found</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
  );
};

interface StatsCardProps {
  title: string;
  stat: any;
  icon: any;
  color: string;
}

const StatsCard = ({ title, stat, icon, color }: StatsCardProps) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
      bg="white"
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          <Icon as={icon} w={8} h={8} color={color} />
        </Box>
      </Flex>
    </Stat>
  );
}

export default DashBoard;

