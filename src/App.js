import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CategoryList from './components/CategoryList';
import SpendingForm from './components/SpendingForm';
import CardResults from './components/CardResults';
import AmazonCardResults from './components/AmazonCardResults';
import Footer from './components/Footer';
import Header from './components/Header';
import CalculatorPageLayout from './components/CalculatorPageLayout';
import { granularCategoriesData } from './components/CalculatorPageLayout';
import TideLandingPage from './components/TideLandingPage';
import { getCardRecommendations, getAllCards } from './api/cardsApi';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--light-gray);
`;

const MainContent = styled.main`
  flex: 1;
  padding-bottom: 60px;
`;

// All state, handlers, and routing logic moved into AppContent
const AppContent = () => {
  const [selectedMasterCategory, setSelectedMasterCategory] = useState(null);
  const [formData, setFormData] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenericCardView, setIsGenericCardView] = useState(false);
  const navigate = useNavigate(); // useNavigate is now correctly within Router context

  useEffect(() => {
    document.title = "Tide Credit Card Calculator";
  }, []);

  useEffect(() => {
    console.log('AppContent state: cards:', cards?.length, 'isLoading:', isLoading, 'error:', error);
  }, [cards, isLoading, error]);

  const handleMasterCategorySelect = (masterCategoryKey) => {
    setSelectedMasterCategory(masterCategoryKey);
    setFormData({});
    setCards([]);
    setError(null);
    setIsGenericCardView(false); // Selecting a category means it's not generic
    // navigate('/calculator'); // Optional: navigate to calculator form directly
  };

  const handleFormSubmit = async (data) => {
    console.log('App.js handleFormSubmit: data=', data, 'selectedMasterCategory=', selectedMasterCategory);
    setFormData(data); 
    setIsLoading(true);
    setError(null);
    setIsGenericCardView(false);
    
    try {
      const results = await getCardRecommendations(selectedMasterCategory, data);
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

  const handleExploreAllCardsClick = async () => {
    setIsLoading(true);
    setError(null);
    setFormData({}); 
    setSelectedMasterCategory(null); 
    setIsGenericCardView(true); 
    navigate('/calculator'); // Navigate to the route that shows results

    try {
      const results = await getAllCards();
      if (!results || !results?.data?.cards) {
        throw new Error('Invalid API response format from getAllCards. Expected cards array in response.');
      }
      if (results.data.cards.length === 0) {
        setError('No cards are currently available. Please check back later.');
        setCards([]);
      } else {
        setCards(results.data.cards);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching all cards:', err);
      setError(
        err.response 
          ? `API Error: ${err.response.status} - ${err.response.statusText}`
          : err.message || 'There was an error fetching cards. Please try again.'
      );
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultsBack = () => {
    const previousSelectedCategory = selectedMasterCategory; // Store before clearing
    const wasGeneric = isGenericCardView;

    setCards([]);
    setError(null);
    
    if (wasGeneric) {
        setSelectedMasterCategory(null); 
        setIsGenericCardView(false);
        navigate('/'); // Go to landing page if coming back from generic view
    } else {
        // If coming back from spend-based results, selectedMasterCategory should still be set
        // The CalculatorRouteWrapper will show the form for this category
        // No explicit navigation needed here if already on /calculator
    }
  };
  
  // Wrapper component to read URL parameters for the calculator route
  const CalculatorRouteWrapper = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const granularCategoryFromUrl = queryParams.get('category'); // This is now a granular key

    const initialKeyForLayout = granularCategoryFromUrl;

    useEffect(() => {
      if (granularCategoryFromUrl) {
        const foundGranularCat = granularCategoriesData.find(gCat => gCat.formCategoryKey === granularCategoryFromUrl);
        const masterCatKey = foundGranularCat ? foundGranularCat.masterCategory : null;

        if (masterCatKey && masterCatKey !== selectedMasterCategory) {
          setSelectedMasterCategory(masterCatKey);
        } else if (!masterCatKey && selectedMasterCategory !== null) {
            setSelectedMasterCategory(null);
        }

        // Only reset form data if we're changing categories
        if (masterCatKey !== selectedMasterCategory) {
          setFormData({});
          setCards([]);
          setError(null);
          setIsGenericCardView(false);
        }
      } else {
        if (selectedMasterCategory !== null) {
            setSelectedMasterCategory(null);
        }
      }
    }, [granularCategoryFromUrl, selectedMasterCategory]);

    if (cards && cards.length > 0) {
      return (
        <CardResults
          cards={cards}
          onReset={handleResultsBack}
          isLoading={isLoading}
          error={error}
          category={isGenericCardView ? 'All Available Cards' : selectedMasterCategory}
          formData={isGenericCardView ? {} : formData}
        />
      );
    } 
    else if (isLoading || error) {
        return (
            <CardResults
                cards={[]}
                onReset={handleResultsBack}
                isLoading={isLoading}
                error={error}
                category={isGenericCardView ? 'All Available Cards' : selectedMasterCategory}
                formData={isGenericCardView ? {} : formData}
            />
        );
    }
    else {
      return (
        <CalculatorPageLayout 
          // onMasterCategorySelect={handleMasterCategorySelect} // This might be less relevant if granular is king
          onFormSubmit={handleFormSubmit}
          initialSelectedCategoryKey={initialKeyForLayout} // Pass the granular key directly
        />
      );
    }
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<TideLandingPage onExploreAllCardsClick={handleExploreAllCardsClick} />} />
          <Route path="/calculator" element={<CalculatorRouteWrapper />} />
          <Route path="/amazon-cards" element={<AmazonCardResults />} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>
      <Footer />
      <Toaster position="top-right" />
    </AppContainer>
  );
};

// App component now just provides the Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 