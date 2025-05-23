import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import LoadingScreen from './LoadingScreen';
import EligibilityModal from './EligibilityModal';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-hot-toast';

const APPLY_NOW_TEXT = 'Apply Now';

const ApplyButton = styled.a`
  background: ${props => props.$hollow ? 'transparent' : 'var(--secondary-color)'};
  color: ${props => props.$hollow ? 'var(--secondary-color)' : 'var(--text-on-dark-bg)'};
  border: 2px solid var(--secondary-color);
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
    background: ${props => props.$hollow ? 'var(--secondary-color)' : 'var(--primary-light)'};
    color: var(--text-on-dark-bg);
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
  background-color: var(--light-gray);
  
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
  color: var(--primary-color);
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  
  &:hover {
    background-color: var(--medium-gray);
  }
`;

const Title = styled.h2`
  margin: 0 auto 0 1rem;
  font-size: 1.6rem;
  color: var(--primary-color);
  
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
  color: var(--primary-color);
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  background: var(--light-gray);
  
  @media (min-width: 768px) {
    height: 200px;
  }
`;

const JoiningFeeLabel = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color);
  color: var(--text-on-dark-bg);
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
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  color: var(--text-color);
  
  ${props => props.$isTopCard && `
    border: 2px solid var(--secondary-color);
    
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  color: var(--secondary-color);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  
  a {
    color: inherit;
    text-decoration: inherit;
    
    &:hover {
      color: var(--primary-light);
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
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: ${props => props.rank <= 3 ? `2px solid ${props.rank === 1 ? 'var(--accent-orange)' : props.rank === 2 ? 'var(--secondary-color)' : 'var(--primary-light)'}` : '1px solid var(--medium-gray)'};
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
  flex-shrink: 0;
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
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #d32f2f;
  padding: 1rem;
  border-radius: var(--border-radius);
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: var(--shadow);
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

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ResultsTitle = styled.h1`
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const ResultsSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
  max-width: 700px;
  margin: 0 auto 1.5rem auto;
`;

const BenefitText = styled.span`
  font-size: 1.05rem;
  color: var(--text-color-light);
  line-height: 1.4;
  display: inline;
`;

const NewBenefitsSectionTitle = styled.h4`
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const BenefitListItemStyled = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.6rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const BenefitCheckmarkIcon = styled.span`
  color: var(--accent-green);
  margin-right: 0.5rem;
  font-size: 1.1rem;
  line-height: 1.3;
`;

const BenefitDetailStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const BenefitHeaderStyled = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
  display: block;
  line-height: 1.3;
`;

const BenefitDescriptionStyled = styled.span`
  font-size: 0.9rem;
  color: var(--text-color-light);
  line-height: 1.4;
  display: block;
`;

const SingleLineBenefitStyled = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: var(--text-color-light);
    margin-bottom: 0.3rem;
    line-height: 1.3;
    ${BenefitCheckmarkIcon} {
        font-size: 0.9rem;
        line-height: 1.3;
    }
`;

const BenefitContainer = styled.div`
  margin-top: 1rem;
`;

const CardResults = ({ cards, onReset, isLoading, error, category, formData, onAuthClick, isAuthenticated, isAmazonOnly, tagId, maxUsps }) => {
  console.log('CardResults received cards:', cards);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [selectedCardForEligibility, setSelectedCardForEligibility] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardForModal, setSelectedCardForModal] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [visibleItems, setVisibleItems] = useState({});

  const isGenericAllCardsView = category === 'All Available Cards';

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

  const getCategoryTitle = (cat, isGeneric) => {
    if (isGeneric) return 'All Tide Cards';
    if (!cat) return 'Card Recommendations';
    const categoryTitles = {
      'shopping': 'Shopping',
      'travel': 'Travel',
      'dining': 'Dining',
      'grocery': 'Grocery',
      'bills': 'Utility Bills',
      'fuel': 'Fuel',
      'online-food-ordering': 'Online Food Ordering'
    };
    const titleMap = {
      'shopping': 'Shopping',
      'travel': 'Travel',
      'fuel': 'Fuel',
      'dining': 'Dining',
      'grocery': 'Grocery',
      'bills': 'Utility Bills',
      'online-food-ordering': 'Online Food Ordering',
      default: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
    };
    return titleMap[cat] || titleMap.default;
  };

  const calculateTotalSpend = (currentFormData) => {
    if (!currentFormData || Object.keys(currentFormData).length === 0) return 0;
    return Object.values(currentFormData).reduce((sum, value) => sum + (parseInt(value) || 0), 0);
  };

  const handleApplyNowClick = (card) => {
    setSelectedCardForEligibility(card);
    setShowEligibilityModal(true);
  };

  const handleCloseModal = () => {
    setShowEligibilityModal(false);
    setSelectedCardForEligibility(null);
  };

  const handleEligibleAndApply = (networkUrl) => {
    window.open(networkUrl, '_blank', 'noopener,noreferrer');
    setShowEligibilityModal(false);
    setSelectedCardForEligibility(null);
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

  const totalSpend = calculateTotalSpend(formData);

  // Titles for Spend-Based View
  const spendBasedPageTitle = `Recommendations for ${getCategoryTitle(category)} Spends`;
  const spendBasedResultsTitle = `Credit Cards for ${getCategoryTitle(category)}`;

  // Titles for Generic View
  const genericPageMainTitle = ""; // No main title in the top header for generic view
  const genericResultsContentTitle = "Explore All Cards";
  
  // Determine the main title to display in the <Header><Title> component
  const mainDisplayTitle = isGenericAllCardsView ? genericPageMainTitle : spendBasedPageTitle;
  
  // Determine the title for the <ResultsHeader><ResultsTitle> component
  const resultsContentTitle = isGenericAllCardsView ? genericResultsContentTitle : spendBasedResultsTitle;

  // Determine the subtitle for the <ResultsHeader><ResultsSubtitle> component
  const resultsHeaderSubtitleText = isGenericAllCardsView 
    ? "Sorted by our Recommendations" // Updated for generic view
    : `Based on your total monthly spending of ₹${totalSpend.toLocaleString()}.`;

  const renderBenefits = (card, isTopCard) => {
    if (!card || !card.product_usps || card.product_usps.length === 0) {
      return null; 
    }

    let uspsToProcess = card.product_usps.map(usp => ({ 
      ...usp, 
      tag_id: parseInt(usp.tag_id, 10)
    }));

    const BENEFITS_LIMIT = 2;
    let uspsToShow = [];

    // Prioritize tag_id 0, then fill with others up to the limit
    const tagZeroUsps = uspsToProcess.filter(usp => usp.tag_id === 0);
    const nonTagZeroUsps = uspsToProcess.filter(usp => usp.tag_id !== 0);

    uspsToShow = tagZeroUsps.slice(0, BENEFITS_LIMIT);
    if (uspsToShow.length < BENEFITS_LIMIT) {
      uspsToShow = uspsToShow.concat(nonTagZeroUsps.slice(0, BENEFITS_LIMIT - uspsToShow.length));
    }
    
    if (uspsToShow.length === 0) {
      return null;
    }

    // All cards (top and non-top, in both views) will use the detailed display
    return (
      <BenefitContainer>
        {uspsToShow.map((usp, index) => (
          <BenefitListItemStyled key={index}>
            <BenefitCheckmarkIcon>✓</BenefitCheckmarkIcon>
            <BenefitDetailStyled>
              <BenefitHeaderStyled>{usp.header}</BenefitHeaderStyled>
              <BenefitDescriptionStyled>{usp.description}</BenefitDescriptionStyled>
            </BenefitDetailStyled>
          </BenefitListItemStyled>
        ))}
      </BenefitContainer>
    );
  };

  const renderCard = (card, index, isTopCard) => (
    <CardContainer key={card.id} $isTopCard={isTopCard}>
      {isTopCard && (
        <RankLabel rank={index + 1}>
          {index === 0 ? 'Best Card' : `#${index + 1}`}
        </RankLabel>
      )}
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
          {isGenericAllCardsView 
            ? `Annual Card Savings: ₹${card.annual_saving.toLocaleString()}`
            : `Your ${getCategoryTitle(category)} Savings: ₹${card.annual_saving.toLocaleString()}`}
        </CardSavings>
        <BenefitsList>
          {renderBenefits(card, isTopCard)}
        </BenefitsList>
        <ApplyButton 
          onClick={() => handleApplyNowClick(card)}
        >
          Apply Now
        </ApplyButton>
      </CardInfo>
    </CardContainer>
  );

  return (
    <Container>
      <Header>
        <BackButton onClick={onReset} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
          </svg>
           Back
        </BackButton>
        <Title>
          {mainDisplayTitle}
          {/* Show spends subtitle only for spend-based recommendations and if formData is present */}
          {!isGenericAllCardsView && formData && Object.keys(formData).length > 0 && (
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary-color)', display: 'block', marginTop: '0.25rem' }}>
              Spends of ₹{totalSpend.toLocaleString()}
            </span>
          )}
        </Title>
      </Header>
      
      {isLoading && <LoadingScreen />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!isLoading && !error && cards.length > 0 && (
        <>
          <ResultsHeader>
            <ResultsTitle>{resultsContentTitle}</ResultsTitle>
            <ResultsSubtitle>{resultsHeaderSubtitleText}</ResultsSubtitle>
          </ResultsHeader>
          <TopCardsSection>
            <SectionTitle>Top Picks</SectionTitle>
            <TopCardsScroll>
              {visibleCards.slice(0, 3).map((card, index) => (
                renderCard(card, index, true)
              ))}
            </TopCardsScroll>
          </TopCardsSection>
          
          <RemainingCardsSection>
            <SectionTitle>More Options</SectionTitle>
            <CardsList>
              {visibleCards.slice(3).map((card, index) => (
                renderCard(card, index, false)
              ))}
            </CardsList>
          </RemainingCardsSection>
        </>
      )}
      {showEligibilityModal && selectedCardForEligibility && (
        <EligibilityModal 
          card={selectedCardForEligibility} 
          onClose={handleCloseModal} 
          onEligibleAndApply={handleEligibleAndApply} 
        />
      )}
    </Container>
  );
};

export default CardResults; 