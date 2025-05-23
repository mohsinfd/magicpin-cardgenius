import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--light-gray);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
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
  margin: 0;
  font-size: 1.6rem;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  margin: 0;
  font-weight: 600;
`;

const SliderContainer = styled.div`
  padding: 2rem 0;
  width: 100%;
`;

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 8px;
`;

const StyledThumb = styled.div`
  height: 20px;
  width: 20px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -6px;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(1.2);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props => props.$index === 0 ? 'var(--secondary-color)' : 'var(--medium-gray)'};
  border-radius: 999px;
`;

const ValueDisplay = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--primary-color);
  position: relative;

  input {
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    text-align: center;
    width: 100%;
    border: none;
    background: transparent;
    cursor: text;
    padding: 0;
    margin: 0;
    outline: none;
    
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const NextButton = styled.button`
  background: var(--secondary-color);
  color: var(--text-on-dark-bg);
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;

  &:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
`;

const SpendingForm = ({ category, onSubmit, onBack }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    const categoryQuestions = getCategoryQuestions(category);
    console.log(`SpendingForm Effect: category='${category}', fetchedQuestions:`, categoryQuestions);
    setQuestions(categoryQuestions);
    // Initialize form values
    const initialValues = {};
    categoryQuestions.forEach(q => {
      initialValues[q.key] = 0;
    });
    setFormValues(initialValues);
  }, [category]);

  const handleBack = (e) => {
    e.preventDefault();
    onBack();
  };
    
  const handleSubmit = async () => {
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  const handleValueChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const getCategoryQuestions = (categoryKey) => {
    const allQuestionsMap = {
      'shopping_amazon': [{ key: 'amazon_spends', text: "Monthly Amazon Spends", max: 100000, step: 1000 }],
      'shopping_flipkart': [{ key: 'flipkart_spends', text: "Monthly Flipkart Spends", max: 100000, step: 1000 }],
      'shopping_other': [{ key: 'other_online_spends', text: "Monthly Other Online Spends", max: 100000, step: 1000 }],
      'travel_flights': [{ key: 'flights_annual', text: "Annual Flight Spends", max: 500000, step: 5000 }],
      'travel_hotels': [{ key: 'hotels_annual', text: "Annual Hotel Spends", max: 500000, step: 5000 }],
      'online-food-ordering': [{ key: 'online_food_ordering', text: "Monthly Food Delivery Spends", max: 30000, step: 500 }],
      'dining': [{ key: 'dining_or_going_out', text: "Monthly Dining/Restaurant Spends", max: 50000, step: 1000 }],
      'grocery': [{ key: 'grocery_spends_online', text: "Monthly Grocery Spends", max: 40000, step: 500 }],
      'fuel': [{ key: 'fuel_spends_monthly', text: "Monthly Fuel Spends", max: 20000, step: 500 }],
      'bills': [
        { key: 'water_bills', text: "Monthly Water Bill", max: 5000, step: 100 },
        { key: 'electricity_bills', text: "Monthly Electricity Bill", max: 10000, step: 200 },
        { key: 'mobile_phone_bills', text: "Monthly Mobile Bill", max: 5000, step: 100 }
      ],
    };

    return allQuestionsMap[categoryKey] || [];
  };

  const getCategoryTitle = (categoryKey) => {
    const titles = {
      'shopping_amazon': 'Amazon Shopping Spends',
      'shopping_flipkart': 'Flipkart Shopping Spends',
      'shopping_other': 'Other Online Shopping Spends',
      'travel_flights': 'Flight Spends',
      'travel_hotels': 'Hotel Spends',
      'online-food-ordering': 'Online Food Delivery Spends',
      'dining': 'Dining & Restaurant Spends',
      'grocery': 'Grocery Spends',
      'fuel': 'Fuel Spends',
      'bills': 'Utility Bill Spends',
    }
    return titles[categoryKey] || 'Enter Your Spends';
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <Title>{getCategoryTitle(category)}</Title>
      </Header>
      
      <QuestionContainer>
        {questions.map((question, index) => (
          <div key={question.key} style={{ width: '100%', marginBottom: '2rem' }}>
            <QuestionText>{question.text}</QuestionText>
            <SliderContainer>
              <StyledSlider
                value={formValues[question.key] || 0}
                onChange={(value) => handleValueChange(question.key, value)}
                min={0}
                max={question.max}
                step={question.step}
                renderThumb={(props, state) => (
                  <StyledThumb {...props}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '-30px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      background: '#2e108e',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap'
                    }}>
                      ₹{state.valueNow.toLocaleString()}
                    </div>
                  </StyledThumb>
                )}
                renderTrack={(props, state) => (
                  <StyledTrack {...props} $index={state.index} />
                )}
              />
            </SliderContainer>
          </div>
        ))}
        
        <NextButton onClick={handleSubmit}>
          Find Cards
        </NextButton>
      </QuestionContainer>
    </Container>
  );
};

export default SpendingForm; 