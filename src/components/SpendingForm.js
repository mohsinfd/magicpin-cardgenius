import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
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
  color: var(--text-color);
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  color: #2e108e;
  
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
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(46, 16, 142, 0.15);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: #2e108e;
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
  background-color: #ef1c71;
  border-radius: 50%;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -6px;
  outline: none;
  box-shadow: 0 2px 8px rgba(239, 28, 113, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(239, 28, 113, 0.4);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(1.2);
    box-shadow: 0 6px 16px rgba(239, 28, 113, 0.5);
  }
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props => props.$index === 0 ? '#ef1c71' : '#e9ecef'};
  border-radius: 999px;
`;

const ValueDisplay = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #0000FF;
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
  background: #ef1c71;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;

  &:hover {
    background: #ff3b8b;
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

const SpendingForm = ({ category, onSubmit, onBack, isAmazonOnly }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    const categoryQuestions = getCategoryQuestions(category, isAmazonOnly);
    setQuestions(categoryQuestions);
    // Initialize form values
    const initialValues = {};
    categoryQuestions.forEach(q => {
      initialValues[q.key] = 0;
    });
    setFormValues(initialValues);
  }, [category, isAmazonOnly]);

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
  
  const getCategoryQuestions = (category, isAmazonOnly) => {
    if (isAmazonOnly) {
      return [
        {
          key: 'amazon_spends',
          text: "Enter your monthly Amazon spends",
          max: 100000,
          step: 1000
        }
      ];
    }

    switch(category) {
      case 'shopping':
        return [
          {
            key: 'amazon_spends',
            text: "Enter your monthly Amazon spends",
            max: 100000,
            step: 1000
          },
          {
            key: 'flipkart_spends',
            text: "Enter your monthly Flipkart spends",
            max: 100000,
            step: 1000
          },
          {
            key: 'other_online_spends',
            text: "Enter your monthly other online spends",
            max: 100000,
            step: 1000
          }
        ];
      case 'online-food-ordering':
        return [
          {
            key: 'online_food_ordering',
            text: "Enter your monthly food delivery spends",
            max: 100000,
            step: 1000
          }
        ];
      case 'dining':
        return [
          {
            key: 'dining_or_going_out',
            text: "Enter your monthly dining spends",
            max: 100000,
            step: 1000
          }
        ];
      case 'grocery':
        return [
          {
            key: 'grocery_spends_online',
            text: "Enter your monthly grocery spends",
            max: 100000,
            step: 1000
          }
        ];
      case 'travel':
        return [
          {
            key: 'flights_annual',
            text: "Enter your annual flight spends",
            max: 100000,
            step: 1000
          },
          {
            key: 'hotels_annual',
            text: "Enter your annual hotel spends",
            max: 100000,
            step: 1000
          }
        ];
      case 'bills':
        return [
          {
            key: 'water_bills',
            text: "Enter your monthly water bill spends",
            max: 100000,
            step: 1000
          },
          {
            key: 'electricity_bills',
            text: "Enter your monthly electricity bill spends",
            max: 100000,
            step: 1000
          },
          {
            key: 'mobile_phone_bills',
            text: "Enter your monthly mobile bill spends",
            max: 100000,
            step: 1000
          }
        ];
      default:
        return [];
    }
  };

  const getCategoryTitle = (category, isAmazonOnly) => {
    if (isAmazonOnly) {
      return 'Amazon Shopping Expenses';
    }

    switch(category) {
      case 'shopping':
        return 'Shopping Expenses';
      case 'online-food-ordering':
        return 'Online Food Ordering Expenses';
      case 'dining':
        return 'Dining Expenses';
      case 'grocery':
        return 'Grocery Expenses';
      case 'travel':
        return 'Travel Expenses';
      case 'bills':
        return 'Bills Expenses';
      default:
        return 'Expenses';
    }
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>←</BackButton>
        <Title>{getCategoryTitle(category, isAmazonOnly)}</Title>
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