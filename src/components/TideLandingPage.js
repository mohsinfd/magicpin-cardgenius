import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  background-color: var(--light-gray);
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background-color: var(--primary-color);
  color: var(--text-on-dark-bg);
  padding: 5rem 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem auto;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled.button`
  background-color: var(--accent-orange);
  color: var(--text-on-dark-bg);
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #FDBA74; /* Lighter orange for hover */
  }
`;

const ContentSection = styled.section`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const WelcomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ServiceCard = styled.div`
  background-color: white;
  padding: 2rem 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
  &.special-icon img {
    filter: brightness(0) invert(1);
  }
  &.special-icon span {
    color: var(--text-on-dark-bg);
  }
`;

const ServiceName = styled.h3`
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  line-height: 1.5;
  flex-grow: 1;
`;

const ServiceButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-on-dark-bg);
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;

  &:hover {
    background-color: var(--primary-light);
  }
`;

const QuickCalculatorTilesSection = styled(ContentSection)`
  padding-top: 1rem;
`;

const TilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const CalculatorTile = styled.button`
  background-color: white;
  padding: 1.5rem 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  border: 1px solid var(--medium-gray);
  cursor: pointer;
  height: 120px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
    border-color: var(--secondary-color);
  }
`;

const TileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const TileName = styled.h4`
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
  margin: 0;
`;

const TideLandingPage = ({ onExploreAllCardsClick }) => {
  const navigate = useNavigate();

  const handleQuickCalculatorClick = (granularCategoryKey) => {
    navigate(`/calculator?category=${granularCategoryKey}`); 
  };
  
  const services = [
    { icon: '💳', name: 'Accept Payments', description: 'Get QR, POS, Payment Gateway solutions for your growing business.' },
    { icon: '💸', name: 'Business Loans', description: 'Fuel your business growth with loans up to ₹35,00,000.' },
    { 
      icon: '🧾', 
      name: 'Bill Payments & Utilities', 
      description: 'Pay all your utility bills seamlessly using Tide.',
    },
    { icon: '🏦', name: 'Fixed Deposits', description: 'Grow your savings with competitive interest rates on Fixed Deposits.' },
    { icon: '🚀', name: 'Business Registration', description: 'Easily register your business under GST & Udyam schemes.' },
    { 
      icon: '/credit-card-icon.svg',
      isImageIcon: true,
      name: 'Credit Cards', 
      description: 'Find a Credit Card that best suits your needs.',
      isSpecialTile: true, 
      action: onExploreAllCardsClick 
    }
  ];

  const quickCalculatorCategories = [
    { id: 'q_amazon', name: 'Amazon Shopping', icon: '🛍️', categoryKey: 'shopping_amazon' },
    { id: 'q_flipkart', name: 'Flipkart Shopping', icon: '🛒', categoryKey: 'shopping_flipkart' },
    { id: 'q_other_online', name: 'Other Online Retail', icon: '💻', categoryKey: 'shopping_other' },
    { id: 'q_flights', name: 'Flight Bookings', icon: '✈️', categoryKey: 'travel_flights' },
    { id: 'q_hotels', name: 'Hotel Stays', icon: '🏨', categoryKey: 'travel_hotels' },
    { id: 'q_food_delivery', name: 'Online Food Delivery', icon: '🍕', categoryKey: 'online-food-ordering' },
    { id: 'q_dining_out', name: 'Dining Out', icon: '🍽️', categoryKey: 'dining' },
    { id: 'q_grocery_spend', name: 'Grocery Spends', icon: '/grocery-bag-icon.svg', isImage: true, categoryKey: 'grocery' },
    { id: 'q_fuel_spend', name: 'Fuel Spends', icon: '⛽', categoryKey: 'fuel' },
    { id: 'q_utility_bills', name: 'Utility Bills', icon: '💡', categoryKey: 'bills' },
  ];

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>The all-in-one finance platform for your business and beyond</HeroTitle>
        <HeroSubtitle>Simplify your financial journey with the Tide app, manage expenses, and earn rewards on your transactions.</HeroSubtitle>
        {/* Optional: <HeroButton>Learn More</HeroButton> */}
      </HeroSection>

      <ContentSection>
        <SectionTitle>Welcome to Tide Services</SectionTitle>
        <WelcomeGrid>
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              style={service.isSpecialTile ? { backgroundColor: 'var(--primary-color)' } : {}}
              onClick={service.action ? service.action : () => {}}
            >
              <ServiceIcon className={service.isSpecialTile ? 'special-icon' : ''}>
                {service.isImageIcon ? 
                  <img src={service.icon} alt={service.name} /> :
                  service.isEmojiIcon ?
                    <span role="img" aria-label={service.name} style={{fontSize: '2.5rem'}}>{service.icon}</span> :
                    service.icon
                }
              </ServiceIcon>
              <ServiceName style={service.isSpecialTile ? { color: 'var(--text-on-dark-bg)' } : {}}>{service.name}</ServiceName>
              <ServiceDescription style={service.isSpecialTile ? { color: 'var(--text-on-dark-bg)' } : {}}>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </WelcomeGrid>
      </ContentSection>
      
      <QuickCalculatorTilesSection>
        <SectionTitle>Quick Spend-Based Calculators</SectionTitle>
        <HeroSubtitle style={{ fontSize: '1rem', marginBottom: '2rem' }}>
            Instantly see potential savings for common spending categories. Click a category to get started.
        </HeroSubtitle>
        <TilesGrid>
          {quickCalculatorCategories.map(cat => (
            <CalculatorTile key={cat.id} onClick={() => handleQuickCalculatorClick(cat.categoryKey)}>
              <TileIcon>
                {cat.isImage ? <img src={cat.icon} alt={cat.name} /> : cat.icon}
              </TileIcon>
              <TileName>{cat.name}</TileName>
            </CalculatorTile>
          ))}
        </TilesGrid>
      </QuickCalculatorTilesSection>
    </PageContainer>
  );
};

export default TideLandingPage; 