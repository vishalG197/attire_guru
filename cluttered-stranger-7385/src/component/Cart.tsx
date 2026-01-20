import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Iproduct, RootState } from '../Constraints/Type';
import { useSelector } from 'react-redux';
import { Skeleton } from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';


import Tshirt from "../Images/Tshirt.png";

const ItemImage = styled.img`
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  height: 200px;
`;

const ItemTitle = styled.h4`
  margin: 10px 0;
  font-size: 16px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ItemPrice = styled.p`
  margin-bottom: 10px;
  color: orange;
  font-weight: 600;
`;

const OfferText = styled.span`
  position: absolute;
  border-radius: 10px;
  top: 5px;
  left: 5px;
  color: gold;
  background-color: #283593;
  padding: 5px;
  font-size: 10px;
  font-weight: bold;
`;


const CartContainer = styled.div`
  position: relative;
  width: 200px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  background-color: white;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.5s ease-in-out;
  gap: 8px;
`;

const Button = styled.button`
  border: 1px solid orange;
  background-color: transparent;
  padding: 8px 12px;
  font-size: 11px;
  cursor: pointer;
  color: orange;
  border-radius: 10px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: orange;
    color: white;
    border-color: orange;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  ${CartContainer}:hover & {
    opacity: 1;
  }
`;

interface CartProps extends Iproduct {
  offer?: string;
}

const Cart: React.FC<CartProps> = (props) => {
  const { image, title, name, price, offer = "new arrival", id, images } = props;
  const [showButtons, setShowButtons] = useState(false);

  // Memoized product image URL
  const imageUrl = useMemo(() => {
    return (images && images.length > 0 ? images[0] : '') || image;
  }, [image, images]);

  // Memoized product name
  const productName = useMemo(() => {
    return name || title;
  }, [name, title]);

  // Memoized handlers to prevent function recreation
  const handleMouseEnter = useCallback(() => {
    setShowButtons(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowButtons(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    const cartItems = JSON.parse(localStorage.getItem('AddedToCart') || '[]');
    const alreadyPresent = cartItems.find((item: Iproduct) => item.id === props.id);

    if (alreadyPresent) {
      toast.warn("Already present in the cart");
    } else {
      cartItems.push({ ...props, quantity: 1 });
      localStorage.setItem('AddedToCart', JSON.stringify(cartItems));
      toast.success(`${cartItems.length} Item added to cart`);
    }
  }, [props]);

  return (
    <CartContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`Product: ${productName}`}
    >
      <Overlay />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ItemImage
        src={imageUrl}
        alt={productName}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite loop
          target.src = Tshirt;
        }}
      />
      <ItemTitle>{productName}</ItemTitle>
      <ItemPrice>₹ {price}</ItemPrice>
      <OfferText>{offer}</OfferText>
      {showButtons && (
        <ButtonContainer>
          <Button onClick={handleAddToCart}>ADD TO CART</Button>
          <Button as={Link} to={`/product/${id}`}>
            SEE DETAILS
          </Button>
        </ButtonContainer>
      )}
    </CartContainer>
  );
};

export default React.memo(Cart, (prevProps, nextProps) => {
  // Custom comparison for optimal memo performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.image === nextProps.image &&
    prevProps.price === nextProps.price &&
    prevProps.title === nextProps.title &&
    prevProps.name === nextProps.name
  );
});
