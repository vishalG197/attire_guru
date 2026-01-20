import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterOptions } from '../Redux/ProductReducer/action';
import { RootState } from '../Constraints/Type';
import { Dispatch } from 'redux';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Checkbox,
    Stack,
    Radio,
    RadioGroup
} from '@chakra-ui/react';

// ===== styled-components =====
const SidebarContainer = styled.aside`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 4px;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearButton = styled.button`
  font-size: 12px;
  color: #d32f2f;
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;

  &:hover {
    color: #b71c1c;
  }
`;

const SectionTitle = styled.h4`
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #444;
`;

// Define props based on usage
interface SidebarProps {
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const dispatch: Dispatch<any> = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get filter options from Redux
    const filterOptions = useSelector((state: RootState) => state.ProductReducer.filterOptions);

    // Local state for initial load loading?
    // We can just rely on the data being present or not.

    useEffect(() => {
        // Load filter options if empty
        if (!filterOptions?.categories?.length) {
            dispatch(getFilterOptions());
        }
    }, [dispatch, filterOptions?.categories?.length]);

    // Handle Checkbox Change
    const handleCheckboxChange = (key: string, value: string) => {
        const currentValues = searchParams.getAll(key);
        let newValues;

        if (currentValues.includes(value)) {
            newValues = currentValues.filter((v) => v !== value);
        } else {
            newValues = [...currentValues, value];
        }

        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        newValues.forEach((v) => newParams.append(key, v));

        // Reset page on filter change
        // Since ProductSection handles page reset on param change logic internally based on props/params? 
        // We just update params here.

        setSearchParams(newParams);
    };

    // Handle Sort Change (Radio)
    const handleSortChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('order', value);
        } else {
            newParams.delete('order');
        }
        setSearchParams(newParams);
    };

    // Check if a value is checked
    const isChecked = (key: string, value: string) => {
        return searchParams.getAll(key).includes(value);
    };

    const currentSort = searchParams.get('order') || '';

    const handleClearAll = () => {
        setSearchParams({});
    };

    return (
        <SidebarContainer>
            <SidebarTitle>
                Filters
                {Array.from(searchParams).length > 0 && (
                    <ClearButton onClick={handleClearAll}>Clear All</ClearButton>
                )}
            </SidebarTitle>

            <Accordion defaultIndex={[0, 1, 2, 3]} allowMultiple allowToggle>

                {/* SORTING */}
                <AccordionItem border="none" mb={4}>
                    <h2>
                        <AccordionButton px={0} _hover={{ bg: 'none' }}>
                            <Box flex="1" textAlign="left">
                                <SectionTitle>Sort By Price</SectionTitle>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} px={0}>
                        <RadioGroup onChange={handleSortChange} value={currentSort}>
                            <Stack direction="column">
                                <Radio value="asc" colorScheme="blue">Price: Low to High</Radio>
                                <Radio value="desc" colorScheme="blue">Price: High to Low</Radio>
                            </Stack>
                        </RadioGroup>
                    </AccordionPanel>
                </AccordionItem>

                {/* CATEGORY */}
                <AccordionItem border="none" mb={4}>
                    <h2>
                        <AccordionButton px={0} _hover={{ bg: 'none' }}>
                            <Box flex="1" textAlign="left">
                                <SectionTitle>Category</SectionTitle>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} px={0}>
                        <Stack spacing={2} maxH="200px" overflowY="auto">
                            {filterOptions?.categories?.length ? (
                                filterOptions.categories.map((cat: string) => (
                                    <Checkbox
                                        key={cat}
                                        isChecked={isChecked('category', cat)}
                                        onChange={() => handleCheckboxChange('category', cat)}
                                        colorScheme="blue"
                                    >
                                        {cat}
                                    </Checkbox>
                                ))
                            ) : (
                                // Fallback/Loading
                                ['shirt', 'jeans', 'shoes', 'kurtas', 'sarees'].map((cat) => (
                                    <Checkbox
                                        key={cat}
                                        isChecked={isChecked('category', cat)}
                                        onChange={() => handleCheckboxChange('category', cat)}
                                        colorScheme="blue"
                                        textTransform="capitalize"
                                    >
                                        {cat}
                                    </Checkbox>
                                ))
                            )}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                {/* GENDER */}
                <AccordionItem border="none" mb={4}>
                    <h2>
                        <AccordionButton px={0} _hover={{ bg: 'none' }}>
                            <Box flex="1" textAlign="left">
                                <SectionTitle>Gender</SectionTitle>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} px={0}>
                        <Stack spacing={2}>
                            {(filterOptions?.genders?.length ? filterOptions.genders : ['Men', 'Women']).map((g: string) => (
                                <Checkbox
                                    key={g}
                                    isChecked={isChecked('gender', g)}
                                    onChange={() => handleCheckboxChange('gender', g)}
                                    colorScheme="blue"
                                >
                                    {g}
                                </Checkbox>
                            ))}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

                {/* COLORS */}
                <AccordionItem border="none" mb={4}>
                    <h2>
                        <AccordionButton px={0} _hover={{ bg: 'none' }}>
                            <Box flex="1" textAlign="left">
                                <SectionTitle>Color</SectionTitle>
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} px={0}>
                        <Stack spacing={2} maxH="200px" overflowY="auto">
                            {filterOptions?.colors?.length ? (
                                filterOptions.colors.map((c: string) => (
                                    <Checkbox
                                        key={c}
                                        isChecked={isChecked('color', c)}
                                        onChange={() => handleCheckboxChange('color', c)}
                                        colorScheme="blue"
                                    >
                                        {c}
                                    </Checkbox>
                                ))
                            ) : (
                                ['Red', 'Blue', 'Green', 'Black', 'White'].map((c) => (
                                    <Checkbox
                                        key={c}
                                        isChecked={isChecked('color', c)}
                                        onChange={() => handleCheckboxChange('color', c)}
                                        colorScheme="blue"
                                    >
                                        {c}
                                    </Checkbox>
                                ))
                            )}
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>

            </Accordion>
        </SidebarContainer>
    );
};

export default Sidebar;
