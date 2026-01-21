import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, getProduct } from "../Redux/action";
import ProductCard from "../Components/ProductCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Container,
  Heading,
  Box,
  Image,
  Text,
  Flex,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import halt from "../Images/unrecognized.jpg";
import Pagination from "../Components/Pagination";
import axios from "axios";
import { styled } from "styled-components";
import { API_ENDPOINTS } from "../../config/api";

export interface Productss {
  id: string;
  category: string;
  color: string;
  description: string;
  gender: string;
  image: string;
  price: number;
  title: string;
}

const AllProducts = () => {
  const [alldata, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  let btnArr: any = [];

  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.PRODUCTS}`)
      .then((res) => {
        setTotalPage(Math.ceil(res.data.length / 18));
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Loading Products",
          description: "Failed to fetch product count",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [toast]);

  for (let i = 1; i <= totalpage; i++) {
    btnArr.push(i);
  }

  const searchquery = useSelector((store: any) => store.ProductReducer.search);
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth);
  const isAuthPersistent = isAuth || (localStorage.getItem("admin") && JSON.parse(localStorage.getItem("admin") || "").isAuth);

  const handleDelete = (id: any) => {
    deleteProduct(id)
      .then(() => {
        const newData = alldata.filter((ele: any) => ele.id != id);
        setAllData(newData);
        toast({
          title: "Product Deleted",
          description: "Product has been successfully removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Delete Failed",
          description: "Could not delete product. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    setIsLoading(true);
    const queryObj = {
      params: {
        _limit: 18,
        q: searchquery,
        _page: page
      },
    };

    getProduct(queryObj)
      .then((res: any) => {
        setAllData(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Loading Products",
          description: "Failed to fetch products from server",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [searchquery, page, toast]);

  if (!isAuthPersistent) {
    return (
      <Box textAlign="center" mt="150px">
        <Image src={halt} margin="auto" transform="scale(1.2)" />
        <Text fontSize="xl" mt={4}>Authentication Required</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <MAINDIV>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/Dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>All Products</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </MAINDIV>

      <Heading my={6} size="lg" textAlign="center">Product Inventory</Heading>

      {isLoading ? (
        <Center py={20}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      ) : alldata.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No products found. Try adjusting your search or add new products.
        </Alert>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} spacingY={10}>
            {alldata?.map((el, i) => (
              <ProductCard el={el} key={i} handleDelete={handleDelete} />
            ))}
          </SimpleGrid>

          {totalpage > 1 && (
            <Flex justify="center" mt={10} mb={5}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {btnArr?.map((el: any) => (
                  <Pagination key={el} val={el} setPage={setPage} />
                ))}
              </div>
            </Flex>
          )}
        </>
      )}
    </Container>
  );
};

export default AllProducts;

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
