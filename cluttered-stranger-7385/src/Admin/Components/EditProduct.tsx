import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { editProduct, getSingleProduct, deleteProduct } from "../Redux/action"; // Added deleteProduct
import { styled } from "styled-components";
// import ProductCardSingle from "./ProductCardSingle"; // Removing custom component to standardize
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  useToast,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
  Image,
  Text,
  SimpleGrid,
  Container,
  Flex
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const EditProduct = () => {
  const [singleProd, setSingleProd] = useState<any>({});
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSingleProduct(id).then((res) => {
      setSingleProd(res.data);
    }).catch(err => {
      console.error(err);
      toast({ title: "Error fetching product", status: "error", duration: 3000 });
    });
  }, [id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Handle price as number
    const val = name === "price" ? +value : value;
    setSingleProd((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    editProduct(id, singleProd).then(() => {
      toast({ title: "Product Updated Successfully!", status: "success", duration: 3000 });
      setIsLoading(false);
      navigate(`/admin/AllProducts`);
    }).catch(() => {
      toast({ title: "Update Failed", status: "error", duration: 3000 });
      setIsLoading(false);
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      deleteProduct(id).then(() => {
        toast({ title: "Product Deleted Successfully!", status: "success", duration: 3000 });
        navigate('/admin/AllProducts');
      }).catch((err) => {
        console.log(err);
        toast({ title: "Delete Failed", status: "error", duration: 3000 });
        setIsLoading(false);
      });
    }
  }

  return (
    <Container maxW="container.xl" py={5}>
      <MAINDIV>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/Dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/AllProducts">All Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Edit Product</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </MAINDIV>

      <Heading my={6} size="lg" textAlign="center">Product Details</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="start">
        {/* Left Side: Image Preview */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <VStack spacing={5}>
            <Image
              src={singleProd.image}
              alt={singleProd.title}
              maxH="400px"
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/400"
            />
            <Text fontSize="xl" fontWeight="bold">{singleProd.title}</Text>
            <Text fontSize="lg" color="green.600">₹ {singleProd.price}</Text>
            <Text color="gray.500">{singleProd.description}</Text>
          </VStack>
        </Box>

        {/* Right Side: Edit Form */}
        <Box p={8} shadow="lg" borderWidth="1px" borderRadius="lg" bg="white">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={singleProd.title || ""} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input name="image" value={singleProd.image || ""} onChange={handleChange} />
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Input name="category" value={singleProd.category || ""} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input name="color" value={singleProd.color || ""} onChange={handleChange} />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input name="description" value={singleProd.description || ""} onChange={handleChange} />
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input type="number" name="price" value={singleProd.price || 0} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" value={singleProd.gender || ""} onChange={handleChange} placeholder="Select Gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input name="brand" value={singleProd.brand || ""} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Fabric</FormLabel>
                  <Input name="fabric" value={singleProd.fabric || ""} onChange={handleChange} />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Fit</FormLabel>
                  <Input name="fit" value={singleProd.fit || ""} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Pattern</FormLabel>
                  <Input name="pattern" value={singleProd.pattern || ""} onChange={handleChange} />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <Select name="rating" value={singleProd.rating || ""} onChange={handleChange} placeholder="Select Rating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Size</FormLabel>
                  <Select name="sizes" onChange={handleChange} placeholder="Select Size">
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Xtra-Large</option>
                  </Select>
                </FormControl>
              </HStack>

              <Flex width="100%" justify="space-between" mt={4} pt={4} borderTopWidth="1px">
                <Button colorScheme="red" variant="outline" onClick={handleDelete} isLoading={isLoading}>
                  Delete Product
                </Button>
                <Button type="submit" colorScheme="blue" isLoading={isLoading} loadingText="Updating">
                  Update Product
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default EditProduct;

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
