import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { editProduct, getSingleProduct, deleteProduct } from "../Redux/action";
import { styled } from "styled-components";
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
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea
} from "@chakra-ui/react";
import { ChevronRightIcon, ArrowBackIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";

const EditProduct = () => {
  const [singleProd, setSingleProd] = useState<any>({});
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getSingleProduct(id)
      .then((res) => {
        setSingleProd(res.data);
      })
      .catch(err => {
        console.error(err);
        toast({
          title: "Error Loading Product",
          description: "Failed to fetch product details",
          status: "error",
          duration: 4000,
          isClosable: true
        });
      })
      .finally(() => setIsLoading(false));
  }, [id, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const val = name === "price" ? +value : value;
    setSingleProd((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    // Update both image formats for compatibility
    setSingleProd((prev: any) => ({
      ...prev,
      image: imageUrl,
      images: [imageUrl]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    editProduct(id, singleProd)
      .then(() => {
        toast({
          title: "Product Updated Successfully!",
          description: "Your changes have been saved",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        navigate(`/admin/AllProducts`);
      })
      .catch(() => {
        toast({
          title: "Update Failed",
          description: "Could not save changes. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      })
      .finally(() => setIsSaving(false));
  };

  const handleDelete = () => {
    setIsSaving(true);
    deleteProduct(id)
      .then(() => {
        toast({
          title: "Product Deleted Successfully!",
          description: "Product has been removed from inventory",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        navigate('/admin/AllProducts');
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Delete Failed",
          description: "Could not delete product. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        setIsSaving(false);
      });
    onClose();
  };

  // Handle both data structures
  const productTitle = singleProd.name || singleProd.title || '';
  const productImage = (singleProd.images && singleProd.images[0]) || singleProd.image || '';

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={5}>
        <Center py={20}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text>Loading product details...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (!productTitle) {
    return (
      <Container maxW="container.xl" py={5}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Product not found
        </Alert>
        <Button mt={4} leftIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/AllProducts')}>
          Back to Products
        </Button>
      </Container>
    );
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

      <HStack justify="space-between" my={6}>
        <Heading size="lg">Product Details</Heading>
        <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={() => navigate('/admin/AllProducts')}>
          Back to Products
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} alignItems="start">
        {/* Left Side: Image Preview */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <VStack spacing={5}>
            <Box
              width="100%"
              height="400px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.50"
              borderRadius="md"
              overflow="hidden"
            >
              <Image
                src={productImage}
                alt={productTitle}
                maxH="100%"
                maxW="100%"
                objectFit="contain"
                fallbackSrc="https://via.placeholder.com/400?text=No+Image+Available"
              />
            </Box>
            <Text fontSize="xl" fontWeight="bold">{productTitle}</Text>
            <Text fontSize="lg" color="green.600">₹ {singleProd.price}</Text>
            <Text color="gray.500" textAlign="center">{singleProd.description}</Text>
          </VStack>
        </Box>

        {/* Right Side: Edit Form */}
        <Box p={8} shadow="lg" borderWidth="1px" borderRadius="lg" bg="white">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  name="name"
                  value={singleProd.name || singleProd.title || ""}
                  onChange={(e) => {
                    setSingleProd((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                      title: e.target.value
                    }));
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={productImage}
                  onChange={handleImageChange}
                  placeholder="https://example.com/image.jpg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={singleProd.description || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </FormControl>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select name="category" value={singleProd.category || ""} onChange={handleChange} placeholder="Select Category">
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Kurtas">Kurtas</option>
                    <option value="Dress Material">Dress Material</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Sandals">Sandals</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input name="color" value={singleProd.color || ""} onChange={handleChange} />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Price (₹)</FormLabel>
                  <Input type="number" name="price" value={singleProd.price || 0} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" value={singleProd.gender || ""} onChange={handleChange} placeholder="Select Gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input name="brand" value={singleProd.brand || ""} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Material</FormLabel>
                  <Input name="material" value={singleProd.material || singleProd.fabric || ""} onChange={handleChange} />
                </FormControl>
              </HStack>

              <HStack width="100%">
                <FormControl>
                  <FormLabel>Fit</FormLabel>
                  <Select name="fit" value={singleProd.fit || ""} onChange={handleChange} placeholder="Select Fit">
                    <option value="Slim">Slim</option>
                    <option value="Regular">Regular</option>
                    <option value="Loose">Loose</option>
                    <option value="Oversized">Oversized</option>
                  </Select>
                </FormControl>
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
              </HStack>

              <Flex width="100%" justify="space-between" mt={4} pt={4} borderTopWidth="1px">
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<DeleteIcon />}
                  onClick={onOpen}
                  isDisabled={isSaving}
                >
                  Delete Product
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  leftIcon={<CheckIcon />}
                  isLoading={isSaving}
                  loadingText="Saving..."
                >
                  Update Product
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isSaving}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
