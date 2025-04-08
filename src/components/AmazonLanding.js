import React, { useState } from 'react';
import styled from 'styled-components';
import Hero from './Hero';
import SpendingForm from './SpendingForm';
import CardResults from './CardResults';
import { getCardRecommendations } from '../api/cardsApi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
`;

const AmazonLanding = ({ onAuthClick, isAuthenticated }) => {
  const [formData, setFormData] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data with only Amazon spends
      const shoppingData = {
        amazon_spends: data.amazon_spends || 0,
        flipkart_spends: 0,
        other_online_spends: 0
      };

      const results = await getCardRecommendations('shopping', shoppingData);
      
      if (!results || !results?.data?.cards) {
        throw new Error('Invalid API response format. Expected cards array in response.');
      }
      
      if (results.data.cards.length === 0) {
        setError('No credit cards match your spending profile. Try adjusting your spending amounts.');
        setCards([]);
      } else {
        setCards(results.data.cards);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching card recommendations:', err);
      setError(
        err.response 
          ? `API Error: ${err.response.status} - ${err.response.statusText}`
          : err.message || 'There was an error processing your request. Please try again.'
      );
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultsBack = () => {
    setCards([]);
    setError(null);
  };

  return (
    <Container>
      {!cards || cards.length === 0 ? (
        <>
          <Hero 
            isVisible={true} 
            title="Best Credit Cards for Amazon Shopping"
            subtitle="Find the perfect credit card to maximize your Amazon rewards"
            imageUrl="/amazon-hero.jpg"
          />
          <SpendingForm
            category="shopping"
            onSubmit={handleFormSubmit}
            onBack={() => {}}
            isAmazonOnly={true}
          />
        </>
      ) : (
        <CardResults
          cards={cards}
          onReset={handleResultsBack}
          isLoading={isLoading}
          error={error}
          category="shopping"
          formData={formData}
          onAuthClick={onAuthClick}
          isAuthenticated={isAuthenticated}
          isAmazonOnly={true}
        />
      )}
    </Container>
  );
};

export default AmazonLanding; 