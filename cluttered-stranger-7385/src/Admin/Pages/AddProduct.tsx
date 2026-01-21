import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Heading,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Image,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  Divider,
  FormHelperText,
  Icon
} from "@chakra-ui/react";
import { ChevronRightIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { addNewProduct } from "../Redux/action";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

const initial = {
  name: "",
  images: [""],
  category: "",
  color: "",
  description: "",
  price: 0,
  gender: "",
  brand: "",
  material: "",
  fit: "",
  pattern: "",
  rating: 0,
  sizes: ""
};

const AddProduct = () => {
  const [formData, setFormData] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);
  const isAuth = useSelector((store: any) => store.AuthReducer.isAuth);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? +value : value
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in Product Name, Category, and Price",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    addNewProduct(formData)
      .then(() => {
        toast({
          title: "Product Added Successfully!",
          description: "Your new product has been added to the inventory",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setFormData(initial); // Reset form
        navigate("/admin/AllProducts");
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Adding Product",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  if (!isAuth) {
    return (
      <Box textAlign="center" mt="150px">
        <Text fontSize="xl">Authentication Required</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <MAINDIV>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/Dashboard">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/admin/AllProducts">
              All Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Add New Product</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </MAINDIV>

      <Heading my={6} size="lg" textAlign="center">
        Add New Product
      </Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} alignItems="start">
        {/* Left Side: Image Preview */}
        <Card variant="outline" bg="white">
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Product Preview</Heading>
              <Box
                width="100%"
                height="300px"
                bg="gray.50"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor="gray.300"
              >
                {formData.images && formData.images[0] ? (
                  <Image
                    src={formData.images[0]}
                    alt="Product Preview"
                    maxH="100%"
                    maxW="100%"
                    objectFit="contain"
                    fallbackSrc="https://via.placeholder.com/300?text=Invalid+Image"
                  />
                ) : (
                  <Text color="gray.400" fontSize="lg">
                    Image preview will appear here
                  </Text>
                )}
              </Box>
              {formData.name && (
                <VStack align="start" width="100%" spacing={2}>
                  <Text fontSize="xl" fontWeight="bold">
                    {formData.name}
                  </Text>
                  {formData.price > 0 && (
                    <Text fontSize="2xl" color="green.600" fontWeight="bold">
                      ₹ {formData.price}
                    </Text>
                  )}
                  {formData.description && (
                    <Text fontSize="sm" color="gray.600">
                      {formData.description}
                    </Text>
                  )}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Right Side: Form */}
        <Card variant="outline" bg="white">
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" mb={2}>Product Information</Heading>

                {/* Basic Info */}
                <FormControl isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    name="image"
                    value={formData.images[0] || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        images: [e.target.value]
                      }));
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <FormHelperText>Enter a valid image URL</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </FormControl>

                <Divider my={2} />

                {/* Category & Pricing */}
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Select category"
                    >
                      <option value="Jeans">Jeans</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Kurtas">Kurtas</option>
                      <option value="Dress Material">Dress Material</option>
                      <option value="Sarees">Sarees</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Sandals">Sandals</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Price (₹)</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.price}
                      onChange={(_, val) => handleNumberChange("price", val)}
                    >
                      <NumberInputField placeholder="0" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Select gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unisex">Unisex</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Color</FormLabel>
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g., Blue, Red"
                    />
                  </FormControl>
                </SimpleGrid>

                <Divider my={2} />

                {/* Product Details */}
                <Heading size="sm" mt={2}>Additional Details</Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Brand name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Material</FormLabel>
                    <Input
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="e.g., Cotton, Silk"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <FormControl>
                    <FormLabel>Fit</FormLabel>
                    <Select
                      name="fit"
                      value={formData.fit}
                      onChange={handleChange}
                      placeholder="Select fit"
                    >
                      <option value="Slim">Slim</option>
                      <option value="Regular">Regular</option>
                      <option value="Loose">Loose</option>
                      <option value="Oversized">Oversized</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Pattern</FormLabel>
                    <Input
                      name="pattern"
                      value={formData.pattern}
                      onChange={handleChange}
                      placeholder="e.g., Solid, Striped"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <FormControl>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="Select rating"
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Size</FormLabel>
                    <Select
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      placeholder="Select size"
                    >
                      <option value="S">Small</option>
                      <option value="M">Medium</option>
                      <option value="L">Large</option>
                      <option value="XL">Extra Large</option>
                      <option value="XXL">XXL</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <Divider my={4} />

                {/* Submit Button */}
                <HStack justify="space-between" pt={4}>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/AllProducts")}
                    isDisabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Adding Product..."
                    leftIcon={<CheckCircleIcon />}
                    size="lg"
                  >
                    Add Product
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default AddProduct;

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
