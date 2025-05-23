import React, { useState } from 'react';
import styled from 'styled-components';
import CardResults from './CardResults';
import AmazonSpendingForm from './AmazonSpendingForm';
import Hero from './Hero';
import { getCardRecommendations } from '../api/cardsApi';

const AmazonContainer = styled.div`
  background: var(--light-gray);
  min-height: 100vh;
`;

const StyledCardResults = styled.div`
  /* These styles will now be primarily handled by CardResults.js with CSS variables */
  /* We can add more specific overrides here if needed for Amazon page */
  .card-container {
    /* Example: border: 1px solid var(--medium-gray); */
    &:hover {
      /* Example: border-color: var(--secondary-color); */
    }
  }

  .card-title {
    /* Example: color: var(--primary-color); */
    &:hover {
      /* Example: color: var(--secondary-color); */
    }
  }

  .apply-button {
    /* Example: background: var(--secondary-color); */
    /* Example: color: var(--text-on-dark-bg); */
    &:hover {
      /* Example: background: var(--primary-light); */
    }
  }

  .rank-label {
    /* Rank label styling is complex, might need to ensure it uses new vars if customized here */
    /* Otherwise, CardResults.js handles it */
  }
`;

const AmazonCardResults = () => {
  const [showResults, setShowResults] = useState(false);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setFormData(formData);
    
    try {
      const payload = {
        tag_id: "2",
        amazon_spends: formData.amazonSpending,
        flipkart_spends: formData.flipkartSpending,
        other_online_spends: formData.otherOnlineSpending,
        card_networks: [],
        credit_score: "",
        eligiblityPayload: {},
        free_cards: "",
        slug: "best-shopping-credit-card",
        sort_by: ""
      };

      console.log('Sending payload:', payload);
      const results = await getCardRecommendations('shopping', payload);
      console.log('API Response:', results);
      
      // Check if results exists and has the correct structure
      if (!results || !results?.data?.filteredCards) {
        throw new Error('No response received from API');
      }

      const filteredCards = results.data.filteredCards;
      
      if (filteredCards.length === 0) {
        setError('No credit cards match your spending profile. Try adjusting your spending amounts.');
        setCards([]);
      } else {
        // Transform the cards data to match the expected format
        const transformedCards = filteredCards.map((card, index) => {
          // Find Amazon spending breakdown
          const amazonBreakdown = card.spending_breakdown_array?.find(
            breakdown => breakdown.on === 'amazon_spends'
          ) || { spend: 0, savings: 0 };

          return {
            id: card.id,
            name: card.name,
            rank: index + 1,
            image: card.image,
            card_bg_image: card.card_bg_image,
            card_bg_gradient: card.card_bg_gradient,
            annual_saving: parseInt(card.annual_saving) || 0,
            joining_fee: card.joining_fee_text || '0',
            annual_fee: card.annual_fee_text || '0',
            network_url: card.network_url,
            product_usps: card.product_usps || [],
            tags: card.tags || [],
            spending_breakdown: card.spending_breakdown_array || [],
            amazon_spend: amazonBreakdown.spend,
            amazon_savings: amazonBreakdown.savings,
            rating: card.rating || 0,
            user_rating_count: card.user_rating_count || 0,
            card_type: card.card_type || '',
            employment_type: card.employment_type || 'both',
            min_age: card.min_age || 21,
            max_age: card.max_age || 60,
            income: card.income || '20000',
            crif: card.crif || '720'
          };
        });
        console.log('Transformed cards:', transformedCards);
        setCards(transformedCards);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching card recommendations:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(
        err.response 
          ? `API Error: ${err.response.status} - ${err.response.statusText}`
          : err.message || 'There was an error processing your request. Please try again.'
      );
      setCards([]);
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  const handleResultsBack = () => {
    setCards([]);
    setError(null);
    setShowResults(false);
  };

  return (
    <AmazonContainer>
      {!showResults && (
        <Hero
          isVisible={true}
          title="Best Tide Cards for Amazon Shopping"
          subtitle="Maximize your rewards on Amazon with specially selected Tide credit cards."
        />
      )}
      
      {!showResults ? (
        <AmazonSpendingForm onSubmit={handleFormSubmit} />
      ) : (
        <StyledCardResults>
          <CardResults
            cards={cards}
            onReset={handleResultsBack}
            isLoading={isLoading}
            error={error}
            category="Amazon"
            tagId={2}
            maxUsps={1}
            formData={{ amazon_spends: formData.amazonSpending }}
          />
        </StyledCardResults>
      )}
    </AmazonContainer>
  );
};

export default AmazonCardResults; 