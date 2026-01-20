import React, { useEffect, useState, useCallback, useMemo, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Iproduct } from '../Constraints/Type';
import { getProducts } from '../Redux/ProductReducer/action';
import { Dispatch } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IParams {
  [key: string]: string | undefined;
  id: string;
}

// ===== STYLED COMPONENTS =====
const Container = styled.main`
  /* CSS Variables for responsive breakpoints */
  --padding-mobile: 16px;
  --padding-tablet: 24px;
  --padding-desktop: 40px;
  --gap-mobile: 16px;
  --gap-tablet: 24px;
  --gap-desktop: 32px;

  /* Mobile-First Base Styles */
  padding: var(--padding-mobile);
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f9f9f9;

  /* Tablet Styles */
  @media only screen and (min-width: 768px) {
    padding: var(--padding-tablet);
    padding-top: 100px;
  }

  /* Desktop Styles */
  @media only screen and (min-width: 1024px) {
    padding: var(--padding-desktop);
    padding-top: 100px;
  }
`;

const ProductContainer = styled.div`
  /* Mobile-First: Column Layout */
  display: flex;
  flex-direction: column;
  gap: var(--gap-mobile);
  max-width: 100%;
  margin: 0 auto;

  /* Tablet+: Row Layout */
  @media only screen and (min-width: 768px) {
    flex-direction: row;
    gap: var(--gap-tablet);
    max-width: 1200px;
    align-items: flex-start;
  }

  @media only screen and (min-width: 1024px) {
    gap: var(--gap-desktop);
  }
`;

const ImageSection = styled.div`
  /* Mobile: Full width */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: var(--padding-mobile);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Tablet+: Flexible width */
  @media only screen and (min-width: 768px) {
    width: 45%;
    flex-shrink: 0;
    padding: var(--padding-tablet);
    border-radius: 16px;
  }

  @media only screen and (min-width: 1024px) {
    width: 50%;
    padding: var(--padding-desktop);
  }
`;

const ProductImage = styled.img`
  /* Mobile-First Responsive Image */
  width: 100%;
  height: auto;
  max-width: 400px;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  /* Ensure good performance on mobile */
  @media only screen and (min-width: 768px) {
    border-radius: 16px;
  }
`;

const ProductInfoSection = styled.div`
  /* Mobile: Full width */
  width: 100%;
  padding: var(--padding-mobile);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: start;

  /* Tablet+: Flexible width */
  @media only screen and (min-width: 768px) {
    width: 55%;
    padding: var(--padding-tablet);
    border-radius: 16px;
  }

  @media only screen and (min-width: 1024px) {
    width: 50%;
    padding: var(--padding-desktop);
  }
`;

const ProductName = styled.h1`
  /* Mobile-First Typography */
  font-size: 20px;
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 700;
  line-height: 1.3;
  word-break: break-word;

  /* Tablet+ */
  @media only screen and (min-width: 768px) {
    font-size: 24px;
    margin-bottom: 16px;
  }

  @media only screen and (min-width: 1024px) {
    font-size: 28px;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const CurrentPrice = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #283593;

  @media only screen and (min-width: 768px) {
    font-size: 26px;
  }
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;

  @media only screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const DiscountLabel = styled.span`
  background-color: #ff4081;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;

  @media only screen and (min-width: 768px) {
    font-size: 14px;
    padding: 8px 14px;
  }
`;

const ProductDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 16px 0;
  text-align: start;

  @media only screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
  flex-wrap: wrap;
`;

const RatingLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;

  @media only screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const RatingStars = styled.div`
  display: flex;
  gap: 4px;
  font-size: 18px;

  @media only screen and (min-width: 768px) {
    font-size: 20px;
  }
`;

const SizeSection = styled.div`
  margin: 24px 0;
`;

const SizeLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  font-size: 14px;

  @media only screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const SizeButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SizeButton = styled.button<{ isSelected?: boolean }>`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => (props.isSelected ? 'white' : '#333')};
  background-color: ${(props) => (props.isSelected ? '#283593' : '#f0f0f0')};
  border: 2px solid ${(props) => (props.isSelected ? '#283593' : '#ddd')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#1a237e' : '#e0e0e0')};
    border-color: #283593;
  }

  &:active {
    transform: scale(0.98);
  }

  @media only screen and (min-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #283593;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #1a237e;
    box-shadow: 0 4px 12px rgba(40, 53, 147, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media only screen and (min-width: 768px) {
    padding: 16px 24px;
    font-size: 17px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 16px;
  color: #666;
`;

const SkeletonLoader = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// ===== COMPONENT =====
export default function SingleProduct(): ReactElement {
  const param = useParams<IParams>();
  const { id } = param;
  const products = useSelector((store: any) => store.ProductReducer.product);
  const dispatch: Dispatch<any> = useDispatch();
  const [singleProduct, setSingleProduct] = useState<Iproduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Effect 1: Fetch product on id change
  useEffect(() => {
    const found = products.find((item: Iproduct) => item.id === id);
    if (found) {
      setSingleProduct(found);
      setLoading(false);
    } else {
      dispatch(getProducts({ params: { id } }));
    }
  }, [id, dispatch]);

  // Effect 2: Update product when products change
  useEffect(() => {
    const found = products.find((item: Iproduct) => item.id === id);
    if (found) {
      setSingleProduct(found);
      setLoading(false);
    }
  }, [products, id]);

  const product = singleProduct;

  // Memoize original price calculation
  const originalPrice = useMemo(() => {
    if (!product?.discount) return null;
    return (product.price * (100 + product.discount) / 100).toFixed(2);
  }, [product?.discount, product?.price]);

  // Memoize size buttons rendering
  const sizesOptions = useMemo(() => {
    if (!product?.sizes || product.sizes.length === 0) {
      return null;
    }
    return product.sizes;
  }, [product?.sizes]);

  // Memoize rating stars
  const renderStars = useCallback((): ReactElement[] => {
    if (!product?.rating) return [];
    const starCount = Math.floor(product.rating);
    const stars: ReactElement[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(<span key={i}>⭐</span>);
    }
    return stars;
  }, [product?.rating]);

  // Handle add to cart with useCallback
  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const cartItem = product;
    const cartItems = JSON.parse(localStorage.getItem('AddedToCart') || '[]');
    const alreadyPresent = cartItems.find((item: Iproduct) => item.id === cartItem.id);

    if (alreadyPresent) {
      toast.warn('Already present in the cart');
    } else {
      const newItem = { ...cartItem, quantity: 1, selectedSize: selectedSize || null };
      cartItems.push(newItem);
      localStorage.setItem('AddedToCart', JSON.stringify(cartItems));
      toast.success(`Added to cart! Total items: ${cartItems.length}`);
    }
  }, [product, selectedSize]);

  // Handle size selection
  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  }, [selectedSize]);

  if (loading || !product) {
    return (
      <LoadingContainer>
        <SkeletonLoader>Loading product details...</SkeletonLoader>
      </LoadingContainer>
    );
  }

  const imageUrl = product.images ? product.images[0] : product.image;

  return (
    <Container role="main" aria-label="Product details page">
      <ProductContainer>
        {/* Image Section */}
        <ImageSection>
          <ProductImage
            src={imageUrl}
            alt={product.name || product.title}
            loading="lazy"
            decoding="async"
          />
        </ImageSection>

        {/* Info Section */}
        <ProductInfoSection>
          <ProductName>{product.name || product.title}</ProductName>

          {/* Price Section */}
          <PriceSection>
            <CurrentPrice>₹ {product.price}</CurrentPrice>
            {product.discount && (
              <>
                <OriginalPrice>₹ {originalPrice}</OriginalPrice>
                <DiscountLabel>{product.discount}% OFF</DiscountLabel>
              </>
            )}
          </PriceSection>

          {/* Description */}
          {product.description && (
            <ProductDescription>{product.description}</ProductDescription>
          )}

          {/* Rating */}
          {product.rating && (
            <RatingContainer>
              <RatingLabel>Rating:</RatingLabel>
              <RatingStars>{renderStars()}</RatingStars>
            </RatingContainer>
          )}

          {/* Size Selection */}
          {sizesOptions && sizesOptions.length > 0 && (
            <SizeSection>
              <SizeLabel>Select Size:</SizeLabel>
              <SizeButtonContainer>
                {sizesOptions.map((size: string) => (
                  <SizeButton
                    key={size}
                    isSelected={selectedSize === size}
                    onClick={() => handleSizeSelect(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </SizeButton>
                ))}
              </SizeButtonContainer>
            </SizeSection>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton
            onClick={handleAddToCart}
            aria-label="Add product to cart"
          >
            Add to Cart
          </AddToCartButton>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
          />
        </ProductInfoSection>
      </ProductContainer>
    </Container>
  );
}
