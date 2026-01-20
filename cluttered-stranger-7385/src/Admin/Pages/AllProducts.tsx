import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
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
  Flex
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import halt from "../Images/unrecognized.jpg";
import Pagination from "../Components/Pagination";
import axios from "axios";

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
  let btnArr: any = [];

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        setTotalPage(Math.ceil(res.data.length / 18));
      });
  }, []);

  for (let i = 1; i <= totalpage; i++) {
    btnArr.push(i);
  }

  const searchquery = useSelector((store: any) => store.ProductReducer.search);
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth); // Initial check

  // Also check localStorage for persistence redundantly/safely if redux isn't ready
  // (Though we fixed redux persistance earlier, good fallback for UI logic)
  const isAuthPersistent = isAuth || (localStorage.getItem("admin") && JSON.parse(localStorage.getItem("admin") || "").isAuth);


  const handleDelete = (id: any) => {
    deleteProduct(id).then(() => {
      const newData = alldata.filter((ele: any) => ele.id != id);
      setAllData(newData);
    });
  };

  useEffect(() => {
    const queryObj = {
      params: {
        _limit: 18,
        q: searchquery,
        _page: page
      },
    };

    getProduct(queryObj).then((res: any) => {
      //   console.log(res.data);
      setAllData(res.data);
    });

  }, [searchquery, page]);

  if (!isAuthPersistent) {
    return (
      <Box textAlign="center" mt="150px">
        <Image src={halt} margin="auto" transform="scale(1.2)" />
        <Text fontSize="xl" mt={4}>Authentication Required</Text>
      </Box>
    )
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

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} spacingY={10}>
        {alldata?.map((el, i) => (
          <ProductCard el={el} key={i} handleDelete={handleDelete} />
        ))}
      </SimpleGrid>

      <Flex justify="center" mt={10} mb={5}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {btnArr?.map((el: any) => (
            <Pagination key={el} val={el} setPage={setPage} />
          ))}
        </div>
      </Flex>
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
