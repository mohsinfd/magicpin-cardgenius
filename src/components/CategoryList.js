import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2.5rem;
  color: #1a1a1a;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const CategoryCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  background: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  height: 100%;
  min-height: 240px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  width: 72px;
  height: 72px;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0052FF10 0%, #0052FF20 100%);
  border-radius: 50%;
  font-size: 2.5rem;

  @media (min-width: 768px) {
    width: 88px;
    height: 88px;
    font-size: 3rem;
  }
`;

const CategoryName = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const CategoryDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;

  @media (max-width: 480px) {
    display: none;
  }
`;

const CategoryList = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 'shopping',
      name: 'Shopping',
      icon: '🛍️',
      description: 'Maximize cashback on Amazon, Flipkart & other online shopping',
      mobileDescription: 'Best rewards on online shopping'
    },
    {
      id: 'online-food-ordering',
      name: 'Online Food',
      icon: '🍕',
      description: 'Best rewards on Swiggy, Zomato & other food delivery',
      mobileDescription: 'Rewards on food delivery'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: '✈️',
      description: 'Best rewards on flights, hotels and travel bookings',
      mobileDescription: 'Rewards on flights & hotels'
    },
    {
      id: 'dining',
      name: 'Dining',
      icon: '🍽️',
      description: 'Extra rewards on restaurant bills and food delivery',
      mobileDescription: 'Rewards on dining & delivery'
    },
    {
      id: 'grocery',
      name: 'Grocery',
      icon: '🛒',
      description: 'Earn rewards on grocery shopping online & offline',
      mobileDescription: 'Rewards on grocery shopping'
    },
    {
      id: 'bills',
      name: 'Utility Bills',
      icon: '📱',
      description: 'Rewards on electricity, mobile & other bill payments',
      mobileDescription: 'Rewards on bill payments'
    },
    {
      id: 'fuel',
      name: 'Fuel',
      icon: '⛽',
      description: 'Save on fuel purchases at any petrol pump',
      mobileDescription: 'Save on fuel'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    console.log('Category selected:', categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <Container>
      <Title>Choose Your Primary Spending Category</Title>
      <Grid>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            <IconContainer>
              {category.icon}
            </IconContainer>
            <CategoryName>{category.name}</CategoryName>
            <CategoryDescription>
              {window.innerWidth <= 480 ? category.mobileDescription : category.description}
            </CategoryDescription>
          </CategoryCard>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryList; 