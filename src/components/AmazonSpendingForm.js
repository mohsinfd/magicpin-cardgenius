import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  color: #232f3e;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #37475a;
  font-weight: 500;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #232f3e;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #37475a;
      transform: scale(1.1);
    }
  }
`;

const ValueDisplay = styled.div`
  min-width: 80px;
  text-align: right;
  color: #232f3e;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #232f3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #37475a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AmazonSpendingForm = ({ onSubmit }) => {
  const [amazonSpending, setAmazonSpending] = useState(5000);

  const handleChange = (e) => {
    setAmazonSpending(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amazonSpending,
      flipkartSpending: 0,
      otherOnlineSpending: 0
    });
  };

  return (
    <FormContainer>
      <FormTitle>Tell us about your Amazon spending</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Monthly Amazon Spending</Label>
          <SliderContainer>
            <Slider
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={amazonSpending}
              onChange={handleChange}
            />
            <ValueDisplay>₹{amazonSpending.toLocaleString()}</ValueDisplay>
          </SliderContainer>
        </FormGroup>

        <SubmitButton type="submit">
          Find My Amazon Card
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AmazonSpendingForm; 