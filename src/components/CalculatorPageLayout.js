import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SpendingForm from './SpendingForm';
import Hero from './Hero';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column; /* For Hero + Content */
  min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
  background-color: var(--light-gray);
`;

const MainLayout = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 1.5rem;
  gap: 1.5rem;

  @media (max-width: 992px) { /* Stack panels on smaller screens */
    flex-direction: column;
  }
`;

const LeftPanel = styled.aside`
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 320px; 
  flex-shrink: 0;
  overflow-y: auto;
  max-height: calc(100vh - 180px); /* Adjust if needed */

  @media (max-width: 992px) {
    width: 100%;
    max-height: none; /* Allow full height when stacked */
    margin-bottom: 1.5rem;
  }
`;

const RightPanel = styled.main`
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100vh - 180px); /* Adjust if needed */

   @media (max-width: 992px) {
    max-height: none;
  }
`;

const CategoryListTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--medium-gray);
  padding-bottom: 0.75rem;
`;

const CategoryListItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.$isActive ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => props.$isActive ? 'var(--text-on-dark-bg)' : 'var(--text-color)'};
  border: 1px solid ${props => props.$isActive ? 'var(--secondary-color)' : 'var(--medium-gray)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  text-align: left;
  transition: var(--transition);
  font-weight: ${props => props.$isActive ? '600' : '500'};

  &:hover {
    background-color: ${props => props.$isActive ? 'var(--secondary-color)' : 'var(--light-gray)'};
    border-color: var(--secondary-color);
    color: ${props => props.$isActive ? 'var(--text-on-dark-bg)' : 'var(--primary-color)'};
  }

  span:first-child { /* Icon */
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
`;

const NoCategorySelected = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: var(--text-secondary-color);
  font-size: 1.1rem;

  p {
    max-width: 300px;
  }
`;

// Define new granular categories here (ensure this is consistent with SpendingForm keys)
export const granularCategoriesData = [
  { id: 'amazon_spends_cat', name: 'Amazon Shopping', icon: '🛍️', formCategoryKey: 'shopping_amazon', masterCategory: 'shopping' },
  { id: 'flipkart_spends_cat', name: 'Flipkart Shopping', icon: '🛒', formCategoryKey: 'shopping_flipkart', masterCategory: 'shopping' },
  { id: 'other_online_spends_cat', name: 'Other Online Shopping', icon: '💻', formCategoryKey: 'shopping_other', masterCategory: 'shopping' },
  { id: 'flights_annual_cat', name: 'Flights', icon: '✈️', formCategoryKey: 'travel_flights', masterCategory: 'travel' },
  { id: 'hotels_annual_cat', name: 'Hotels', icon: '🏨', formCategoryKey: 'travel_hotels', masterCategory: 'travel' },
  { id: 'online_food_ordering_cat', name: 'Online Food Delivery', icon: '🍕', formCategoryKey: 'online-food-ordering', masterCategory: 'online-food-ordering' },
  { id: 'dining_cat', name: 'Dining & Restaurants', icon: '🍽️', formCategoryKey: 'dining', masterCategory: 'dining' },
  { id: 'grocery_cat', name: 'Groceries', icon: '🧺', formCategoryKey: 'grocery', masterCategory: 'grocery' },
  { id: 'bills_cat', name: 'Utility Bills', icon: '💡', formCategoryKey: 'bills', masterCategory: 'bills' },
  { id: 'fuel_cat', name: 'Fuel', icon: '⛽', formCategoryKey: 'fuel_spends_monthly', masterCategory: 'fuel' }
];

const CalculatorPageLayout = ({ onFormSubmit, initialSelectedCategoryKey }) => {
  const [selectedGranularCat, setSelectedGranularCat] = useState(null);
  const navigate = useNavigate(); // For potential back navigation if needed

  useEffect(() => {
    // When initialSelectedCategoryKey (granular key from URL) changes, update the selected category.
    if (initialSelectedCategoryKey) {
      const foundCat = granularCategoriesData.find(cat => cat.formCategoryKey === initialSelectedCategoryKey);
      if (foundCat) {
        if (!selectedGranularCat || selectedGranularCat.id !== foundCat.id) {
          setSelectedGranularCat(foundCat);
        }
      } else {
        // If the granular key from URL is not found, clear selection (or handle error)
        setSelectedGranularCat(null); 
        // console.warn("Granular category from URL not found:", initialSelectedCategoryKey);
      }
    } else {
      // No initial granular key, so clear any existing selection.
      // This happens when user navigates to /calculator directly without a ?category query.
      setSelectedGranularCat(null);
    }
  }, [initialSelectedCategoryKey]); // React only to changes in the granular key from URL

  const handleCategoryClick = (category) => {
    setSelectedGranularCat(category);
    // Update the URL to reflect the newly selected granular category
    navigate(`/calculator?category=${category.formCategoryKey}`, { replace: true });
    // The useEffect above will handle the state update based on this URL change if needed,
    // or direct state update is fine as App.js re-renders on URL change.
  };

  return (
    <PageContainer>
        <Hero 
            isVisible={true} 
            title="Tide Credit Card Calculator"
            subtitle="Select a spending category on the left, then enter your spends to find the best Tide card."
        />
        <MainLayout>
            <LeftPanel>
                <CategoryListTitle>Select Spending Category</CategoryListTitle>
                {granularCategoriesData.map(cat => (
                <CategoryListItem 
                    key={cat.id} 
                    onClick={() => handleCategoryClick(cat)}
                    $isActive={selectedGranularCat?.id === cat.id}
                >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                </CategoryListItem>
                ))}
            </LeftPanel>
            <RightPanel>
                {selectedGranularCat ? (
                <SpendingForm 
                    category={selectedGranularCat.formCategoryKey} 
                    onSubmit={onFormSubmit} 
                    onBack={() => setSelectedGranularCat(null)} // Simple back, just clears form
                />
                ) : (
                <NoCategorySelected>
                    <p>Please select a category from the left to enter your spending details.</p>
                </NoCategorySelected>
                )}
            </RightPanel>
        </MainLayout>
    </PageContainer>
  );
};

export default CalculatorPageLayout; 