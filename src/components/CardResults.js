import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LoadingScreen from './LoadingScreen';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-hot-toast';

const ApplyButton = styled.a`
  background: ${props => props.$hollow ? 'transparent' : '#ef1c71'};
  color: ${props => props.$hollow ? '#ef1c71' : 'white'};
  border: 2px solid #ef1c71;
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.3s ease;
  width: 100%;

  @media (min-width: 768px) {
    width: fit-content;
    min-width: 200px;
  }

  &:hover {
    background: ${props => props.$hollow ? '#ef1c71' : '#ff3b8b'};
    color: white;
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 480px) {
    padding: 1rem;
    width: 100%;
    overflow-x: hidden;
    position: relative;
    touch-action: pan-y;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #2e108e;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  
  &:hover {
    background-color: rgba(46, 16, 142, 0.1);
  }
`;

const Title = styled.h2`
  margin: 0 auto 0 1rem;
  font-size: 1.6rem;
  color: #2e108e;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const TopCardsSection = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  
  @media (min-width: 768px) {
    height: 200px;
  }
`;

const JoiningFeeLabel = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 1;
`;

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(46, 16, 142, 0.1);
  transition: transform 0.2s ease;
  color: #333;
  
  ${props => props.$isTopCard && `
    border: 2px solid #ef1c71;
    
    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
      min-height: 480px;
      max-width: 340px;

      ${CardInfo} {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      ${ApplyButton} {
        margin-top: auto;
        width: 100%;
      }
    }
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(46, 16, 142, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  color: #ef1c71;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  
  a {
    color: inherit;
    text-decoration: inherit;
    
    &:hover {
      color: #ff3b8b;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const TopCardsScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const RemainingCardsSection = styled.section``;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${CardContainer} {
    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      align-items: start;

      > div:first-child {
        grid-column: 1;
        width: 100%;
      }

      ${CardInfo} {
        grid-column: 2;
        grid-row: 1 / span 2;
      }
    }
  }
`;

const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: ${props => props.rank <= 3 ? `2px solid ${props.rank === 1 ? '#febd69' : props.rank === 2 ? '#37475a' : '#232f3e'}` : 'none'};
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  opacity: 0;
  transform: translateY(20px);
  animation: ${props => props.isVisible ? 'cardAppear 0.3s forwards' : 'none'};
  animation-delay: ${props => props.animationDelay}ms;
  
  ${props => props.isTopCard && `
    scroll-snap-align: start;
  `}
  
  @media (max-width: 480px) {
    padding: 1rem;
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
  
  @keyframes cardAppear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const RankLabel = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch(props.rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#666';
    }
  }};
  color: ${props => props.rank <= 3 ? '#000' : '#FFF'};
  padding: 4px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const CategorySavings = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardBenefits = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const BenefitItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 1rem;
  line-height: 1.4;
`;

const BenefitHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2e108e;
`;

const BenefitDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-left: 1.8rem;
`;

const BenefitIcon = styled.span`
  font-size: 1.2rem;
  color: #ef1c71;
  margin-right: 0.5rem;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.1rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  font-size: 1.1rem;
  color: #d32f2f;
`;

const CardSavings = styled.div`
  position: relative;
  font-size: 1.6rem;
  font-weight: 700;
  color: #0052FF;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(0, 82, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite linear;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CardResults = ({ cards, onReset, isLoading, error, category, formData, onAuthClick, isAuthenticated, isAmazonOnly, tagId, maxUsps }) => {
  console.log('CardResults received cards:', cards);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      setShowLoadingScreen(true);
    } else if (cards && cards.length > 0) {
      console.log('Setting visible cards:', cards);
      setVisibleCards(cards);
      setShowLoadingScreen(false);
    }
  }, [cards, isLoading]);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  const getCategoryTitle = (category, isAmazonOnly) => {
    if (isAmazonOnly) {
      return 'Amazon Shopping';
    }

    const categoryTitles = {
      'shopping': 'Shopping',
      'travel': 'Travel',
      'dining': 'Dining',
      'grocery': 'Grocery',
      'bills': 'Utility Bills',
      'fuel': 'Fuel',
      'online-food-ordering': 'Online Food Ordering'
    };
    return categoryTitles[category] || category;
  };

  const calculateTotalSpend = (formData) => {
    if (!formData) return 0;
    return Object.values(formData).reduce((sum, value) => sum + (Number(value) || 0), 0);
  };

  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (error) {
    return (
      <ErrorMessage>
        <p>{error}</p>
        <button onClick={onReset}>Try Again</button>
      </ErrorMessage>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <NoResultsMessage>
        <p>No credit cards match your spending profile. Try adjusting your spending amounts.</p>
        <button onClick={onReset}>Try Again</button>
      </NoResultsMessage>
    );
  }

  const getTagIdForCategory = (category) => {
    const categoryTitles = {
      'shopping': 2,
      'travel': 12,
      'dining': 6,
      'grocery': 7,
      'bills': 14,
      'fuel': 1,
      'online-food-ordering': 5
    };
    return categoryTitles[category] || 0;
  };

  const renderBenefits = (card) => {
    const categoryBenefits = card.product_usps
      ?.filter(benefit => !tagId || benefit.tag_id === tagId)
      ?.sort((a, b) => a.priority - b.priority) || [];

    const benefitsToShow = maxUsps ? categoryBenefits.slice(0, maxUsps) : categoryBenefits;

    if (benefitsToShow.length === 0) {
      return (
        <BenefitItem>
          <BenefitHeader>
            <BenefitIcon>✓</BenefitIcon>
            Great all-round benefits
          </BenefitHeader>
        </BenefitItem>
      );
    }

    return benefitsToShow.map((benefit, index) => (
      <BenefitItem key={index}>
        <BenefitHeader>
          <BenefitIcon>✓</BenefitIcon>
          {benefit.header}
        </BenefitHeader>
        <BenefitDescription>
          {benefit.description}
        </BenefitDescription>
      </BenefitItem>
    ));
  };

  const totalSpend = calculateTotalSpend(formData);

  return (
    <Container>
      <Header>
        <BackButton onClick={onReset}>←</BackButton>
        <Title>
          MagicPin Recommendations for your {getCategoryTitle(category, isAmazonOnly)} spends of ₹{totalSpend.toLocaleString()}
        </Title>
      </Header>
      
          <TopCardsSection>
        <SectionTitle>Top Picks</SectionTitle>
            <TopCardsScroll>
          {visibleCards.slice(0, 3).map((card, index) => (
            <CardContainer key={card.id} $isTopCard={true}>
              <RankLabel rank={index + 1}>
                {index === 0 ? 'Best Card' : `#${index + 1}`}
              </RankLabel>
              <div style={{ position: 'relative' }}>
                <CardImage
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/card-placeholder.png';
                  }}
                />
                <JoiningFeeLabel>
                  Joining Fee: ₹{card.joining_fee || 0}
                </JoiningFeeLabel>
              </div>
              <CardHeader>
                <CardTitle>
                  <a href={card.network_url} target="_blank" rel="noopener noreferrer">
                    {card.name}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardInfo>
                <CardSavings>
                  Your {getCategoryTitle(category, isAmazonOnly)} Savings: ₹{card.annual_saving.toLocaleString()}
                </CardSavings>
                <BenefitsList>
                  {renderBenefits(card)}
                </BenefitsList>
                <ApplyButton 
                  href={card.network_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Apply Now
                </ApplyButton>
              </CardInfo>
            </CardContainer>
          ))}
            </TopCardsScroll>
          </TopCardsSection>
          
            <RemainingCardsSection>
        <SectionTitle>More Options</SectionTitle>
              <CardsList>
          {visibleCards.slice(3).map((card, index) => (
            <CardContainer key={card.id} $isTopCard={false}>
              <div style={{ position: 'relative' }}>
                <CardImage
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/card-placeholder.png';
                  }}
                />
                <JoiningFeeLabel>
                  Joining Fee: ₹{card.joining_fee || 0}
                </JoiningFeeLabel>
              </div>
              <CardHeader>
                <CardTitle>
                  <a href={card.network_url} target="_blank" rel="noopener noreferrer">
                    {card.name}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardInfo>
                <CardSavings>
                  Your {getCategoryTitle(category, isAmazonOnly)} Savings: ₹{card.annual_saving.toLocaleString()}
                </CardSavings>
                <BenefitsList>
                  {renderBenefits(card)}
                </BenefitsList>
                <ApplyButton 
                  href={card.network_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  $hollow={true}
                >
                  Apply Now
                </ApplyButton>
              </CardInfo>
            </CardContainer>
          ))}
              </CardsList>
            </RemainingCardsSection>
    </Container>
  );
};

export default CardResults; 