import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Dispatch } from 'redux';
import { getProducts } from '../Redux/ProductReducer/action';
import { Iproduct, MyObject, RootState } from '../Constraints/Type';
import Cart from './Cart';
import Pagination from './Pegination';
import { Skeleton } from '@chakra-ui/react';

const ProductSections = styled.section`
  /* Mobile-First: Single column */
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  justify-items: center;
  width: 100%;

  /* Tablet: 2 columns */
  @media only screen and (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }

  /* Tablet+: 3 columns */
  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 18px;
  }

  /* Desktop: 4 columns */
  @media only screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }

  /* Large Desktop: 5 columns */
  @media only screen and (min-width: 1440px) {
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
  }
`;

const SearchBar = styled.div`
  /* Mobile-First: Vertical layout */
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;

  input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #283593;
      box-shadow: 0 0 0 3px rgba(40, 53, 147, 0.1);
    }
  }

  button {
    padding: 12px 16px;
    background-color: #283593;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    font-weight: 600;
    transition: background-color 0.2s ease;
    width: 100%;

    &:hover {
      background-color: #1a237e;
    }

    &:active {
      background-color: #283593;
    }
  }

  /* Tablet+: Horizontal layout */
  @media only screen and (min-width: 768px) {
    flex-direction: row;
    gap: 8px;

    input {
      margin-right: 8px;
      width: auto;
      flex: 1;
    }

    button {
      width: auto;
      padding: 10px 20px;
    }
  }
`;

const TotalProducts = styled.div`
  margin: 10px 0 16px 0;
  color: #666;
  font-size: 14px;
`;

// Category mapping for capitalization
const CATEGORY_MAP: Record<string, string> = {
  'shirt': 'Shirts',
  'jeans': 'Jeans',
  'shoes': 'Shoes',
  'kurtas': 'Kurtas',
  'sarees': 'Sarees',
  'dress-material': 'Dress Material'
};

const ProductSection: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const productsData = useSelector((state: RootState) => state.ProductReducer.product);
  const totalPage = useSelector((state: RootState) => state.ProductReducer.totalPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products on filter/page change
  useEffect(() => {
    // Get all filter params from URL
    const categoryList = searchParams.getAll('category').map((cat: string) => CATEGORY_MAP[cat] || cat);
    const genderList = searchParams.getAll('gender');
    const colorList = searchParams.getAll('color');
    const order = searchParams.get('order');
    const query = searchParams.get('q') || '';

    // Update local search query state if it comes from URL
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }

    const obj: MyObject = {
      params: {
        ...(categoryList.length > 0 && { category: categoryList }),
        ...(genderList.length > 0 && { gender: genderList }),
        ...(colorList.length > 0 && { color: colorList }),
        _limit: 16,
        _page: page,
        ...(order && { _sort: 'price', _order: order }),
        ...(query && { q: query }),
      },
    };

    console.log('Fetching products with params:', obj);
    dispatch(getProducts(obj));
  }, [searchParams, page, dispatch]);

  // Memoized event handlers to prevent function recreation
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    // Update search params with the query
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Render products directly from productsData
  const renderedProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return Array.from({ length: 8 }).map((_, i) => <Skeleton key={`skeleton-${i}`} height="200px" />);
    }
    return productsData.map((product: Iproduct) => (
      <Cart key={product.id} offer="new arrival" {...product} />
    ));
  }, [productsData]);

  return (
    <div>
      <SearchBar>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </SearchBar>

      <TotalProducts>
        Showing {productsData?.length || 0} products
      </TotalProducts>

      <ProductSections role="region" aria-label="Products grid">
        {renderedProducts}
      </ProductSections>
      <Pagination currentPage={page} totalPages={totalPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default React.memo(ProductSection);
