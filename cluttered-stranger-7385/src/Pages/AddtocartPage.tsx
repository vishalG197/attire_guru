import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Iproduct } from '../Constraints/Type';
import { useNavigate } from 'react-router-dom';

// ===== INTERFACES =====
interface CartItemProps {
  item: Iproduct;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

interface OrderSummaryProps {
  totalAmount: number;
  itemCount: number;
  onBuy: () => void;
}

// ===== STYLED COMPONENTS =====
const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 40px;
  min-height: 80vh;
  gap: 30px;
`;

const PageTitle = styled.h1`
  font-size: 32px;

  font-weight: 800;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  width: 100%;

  @media (min-width: 900px) {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
`;

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItemContainer = styled.article`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  }

  @media (min-width: 600px) {
    flex-direction: row;
    height: 180px;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f8f8f8;
  padding: 10px;

  @media (min-width: 600px) {
    width: 180px;
    height: 100%;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
  line-height: 1.4;
`;

const ItemPrice = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #283593;
  margin: 0;
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
`;

const MetaTag = styled.span`
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 6px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f5f5f5;
  padding: 6px 12px;
  border-radius: 8px;
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  color: #333;

  &:hover {
    background-color: #283593;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QtyValue = styled.span`
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffebee;
  }
`;

const SummaryCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  color: #555;

  &.total {
    font-size: 20px;
    font-weight: 700;
    color: #222;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-bottom: 24px;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #283593;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #1a237e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 53, 147, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const EmptyStateImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin-bottom: 30px;
  object-fit: contain;
`;

const EmptyStateText = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
`;

const ContinueShoppingLink = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: #283593;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #1a237e;
  }
`;

// ===== CUSTOM HOOK =====
const useCart = () => {
  const [items, setItems] = useState<Iproduct[]>([]);
  const navigate = useNavigate();

  // Initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('AddedToCart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to parse cart items", error);
    }
  }, []);

  // Persistence
  const updateCart = useCallback((newItems: Iproduct[]) => {
    setItems(newItems);
    localStorage.setItem('AddedToCart', JSON.stringify(newItems));
  }, []);

  const increaseItem = useCallback((id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    updateCart(updated);
  }, [items, updateCart]);

  const decreaseItem = useCallback((id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newQty = (item.quantity || 1) - 1;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    updateCart(updated);
  }, [items, updateCart]);

  const removeItem = useCallback((id: string) => {
    const updated = items.filter(item => item.id !== id);
    updateCart(updated);
  }, [items, updateCart]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }, [items]);

  const placeOrder = () => {
    const orderDetails = {
      totalProduct: items.length,
      totalAmount: totalAmount
    };
    localStorage.setItem("order", JSON.stringify(orderDetails));
    navigate('/payment');
  };

  return { items, increaseItem, decreaseItem, removeItem, totalAmount, placeOrder };
};

// ===== SUB-COMPONENTS =====

const CartItem: React.FC<CartItemProps> = React.memo(({ item, onIncrease, onDecrease, onRemove }) => {
  // Logic to handle different image sources safely
  const imageUrl = useMemo(() => {
    if (item.images && item.images.length > 0) return item.images[0];
    if (item.image) return item.image;
    return 'https://via.placeholder.com/200?text=No+Image';
  }, [item.image, item.images]);

  const displayName = item.title || item.name || "Unknown Product";

  return (
    <CartItemContainer>
      <ItemImage src={imageUrl} alt={displayName} loading="lazy" />
      <ItemDetails>
        <div>
          <ItemHeader>
            <ItemTitle title={displayName}>{displayName}</ItemTitle>
            <ItemPrice>₹ {item.price}</ItemPrice>
          </ItemHeader>

          <ItemMeta>
            {item.color && <MetaTag>Color: {item.color}</MetaTag>}
            {item.brand && <MetaTag>Brand: {item.brand}</MetaTag>}
            {item.description && <span>{item.description.substring(0, 60)}...</span>}
          </ItemMeta>
        </div>

        <ControlsContainer>
          <QuantityControls>
            <QtyButton
              onClick={() => onDecrease(item.id)}
              disabled={item.quantity === 1}
              aria-label="Decrease quantity"
            >
              -
            </QtyButton>
            <QtyValue>{item.quantity || 1}</QtyValue>
            <QtyButton
              onClick={() => onIncrease(item.id)}
              aria-label="Increase quantity"
            >
              +
            </QtyButton>
          </QuantityControls>
          <RemoveButton onClick={() => onRemove(item.id)}>Remove</RemoveButton>
        </ControlsContainer>
      </ItemDetails>
    </CartItemContainer>
  );
});

const EmptyCart: React.FC = () => (
  <EmptyStateContainer>
    <EmptyStateImage
      src="https://img.freepik.com/free-vector/shopping-cart-with-bags-boxes-concept-illustration_114360-18775.jpg?w=740"
      alt="Empty Shopping Cart"
    />
    <PageTitle>Your Cart is Empty</PageTitle>
    <EmptyStateText>Looks like you haven't added anything to your cart yet.</EmptyStateText>
    <ContinueShoppingLink href="/">Start Shopping</ContinueShoppingLink>
  </EmptyStateContainer>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalAmount, itemCount, onBuy }) => (
  <SummaryCard>
    <h3>Order Summary</h3>
    <br />
    <SummaryRow>
      <span>Items</span>
      <span>{itemCount}</span>
    </SummaryRow>
    <SummaryRow>
      <span>Subtotal</span>
      <span>₹ {totalAmount}</span>
    </SummaryRow>
    <SummaryRow>
      <span>Shipping</span>
      <span style={{ color: '#4caf50' }}>Free</span>
    </SummaryRow>
    <SummaryRow className="total">
      <span>Total</span>
      <span>₹ {totalAmount}</span>
    </SummaryRow>
    <CheckoutButton onClick={onBuy}>Proceed to Checkout</CheckoutButton>
  </SummaryCard>
);

// ===== MAIN PAGE COMPONENT =====
const AddtocartPage = () => {
  const { items, increaseItem, decreaseItem, removeItem, totalAmount, placeOrder } = useCart();

  if (items.length === 0) {
    return (
      <PageContainer>
        <EmptyCart />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Shopping Cart</PageTitle>

      <ContentGrid>
        <CartList>
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={increaseItem}
              onDecrease={decreaseItem}
              onRemove={removeItem}
            />
          ))}
        </CartList>

        <OrderSummary
          totalAmount={totalAmount}
          itemCount={items.length}
          onBuy={placeOrder}
        />
      </ContentGrid>
    </PageContainer>
  );
};

export default AddtocartPage;
