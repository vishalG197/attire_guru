import { ReactElement, useState, useCallback } from "react";
import styled from "styled-components";
import Sidebar from "../component/Sidebar";
import ProductSection from "../component/productSection";

// Props interfaces for styled components
interface HamburgerButtonProps {
  isOpen: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
}

const PageContainer = styled.main`
  /* CSS Variables for responsive design */
  --padding-mobile: 16px;
  --padding-tablet: 24px;
  --padding-desktop: 40px;
  --gap-mobile: 16px;
  --gap-tablet: 24px;
  --gap-desktop: 32px;
  --sidebar-width-desktop: 200px;

  /* Mobile-First Base Styles */
  display: flex;
  flex-direction: column;
  gap: var(--gap-mobile);
  margin: auto;
  padding: var(--padding-mobile);
  padding-top: 80px;
  max-width: 100%;
  min-height: calc(100vh - 80px);

  /* ===== TABLET STYLES (min-width: 768px) ===== */
  @media only screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    gap: var(--gap-tablet);
    padding: var(--padding-tablet);
    padding-top: 100px;
  }

  /* ===== DESKTOP STYLES (min-width: 1024px) ===== */
  @media only screen and (min-width: 1024px) {
    gap: var(--gap-desktop);
    padding: var(--padding-desktop);
    padding-top: 100px;
  }
`;

const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  /* Hide on tablet and desktop */
  @media only screen and (min-width: 768px) {
    display: none;
  }
`;

const HamburgerButton = styled.button<HamburgerButtonProps>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #283593;
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1a237e;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  /* Hamburger lines */
  span {
    display: block;
    width: 24px;
    height: 3px;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;

    &:first-child {
      transform: ${(props) => (props.isOpen ? "rotate(45deg) translate(10px, 10px)" : "none")};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.isOpen ? "0" : "1")};
      transition: opacity 0.3s ease;
    }

    &:last-child {
      transform: ${(props) => (props.isOpen ? "rotate(-45deg) translate(7px, -7px)" : "none")};
    }
  }
`;

const FilterDrawerOverlay = styled.div<FilterDrawerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 998;

  @media only screen and (min-width: 768px) {
    display: none;
  }
`;

const FilterDrawer = styled.div<FilterDrawerProps>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 85%;
  max-width: 300px;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease;
  z-index: 999;
  padding-top: 60px;
  padding-bottom: 20px;

  @media only screen and (min-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #333;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:focus {
    outline: 2px solid #283593;
    outline-offset: 2px;
  }
`;

const SidebarWrapper = styled.aside`
  /* Mobile: sidebar below products - hide initially, show in drawer */
  width: 100%;
  max-width: 100%;
  display: none;

  /* Tablet+: sidebar beside products */
  @media only screen and (min-width: 768px) {
    width: auto;
    flex-shrink: 0;
    display: block;
  }

  @media only screen and (min-width: 1024px) {
    width: var(--sidebar-width-desktop);
  }
`;

const ProductsWrapper = styled.div`
  /* Mobile: full width */
  width: 100%;
  flex: 1;

  /* Tablet+: flexible width */
  @media only screen and (min-width: 768px) {
    flex: 1;
    min-width: 0;
  }
`;

const ProductPage = (): ReactElement => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleToggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseFilter();
    }
  }, [handleCloseFilter]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseFilter();
      }
    },
    [handleCloseFilter]
  );

  return (
    <PageContainer role="main" aria-label="Products page" onKeyDown={handleKeyDown}>
      {/* Mobile Filter Hamburger Button */}
      <FilterButtonWrapper>
        <HamburgerButton
          isOpen={isFilterOpen}
          onClick={handleToggleFilter}
          aria-label={isFilterOpen ? "Close filters" : "Open filters"}
          aria-expanded={isFilterOpen}
          aria-controls="filter-drawer"
        >
          <span></span>
          <span></span>
          <span></span>
        </HamburgerButton>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Filters</span>
      </FilterButtonWrapper>

      {/* Mobile Filter Drawer */}
      <FilterDrawerOverlay
        isOpen={isFilterOpen}
        onClick={handleOverlayClick}
        aria-hidden={!isFilterOpen}
      />
      <FilterDrawer
        id="filter-drawer"
        isOpen={isFilterOpen}
        role="complementary"
        aria-label="Product filters"
      >
        <CloseButton
          onClick={handleCloseFilter}
          aria-label="Close filters"
          title="Close (ESC)"
        >
          ✕
        </CloseButton>
        <Sidebar onClose={handleCloseFilter} />
      </FilterDrawer>

      {/* Desktop Sidebar */}
      <SidebarWrapper role="complementary" aria-label="Product filters">
        <Sidebar onClose={handleCloseFilter} />
      </SidebarWrapper>

      <ProductsWrapper>
        <ProductSection />
      </ProductsWrapper>
    </PageContainer>
  );
};

export default ProductPage;