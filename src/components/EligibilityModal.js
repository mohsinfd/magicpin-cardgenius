import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Ensure axios is installed
import { BASE_API_URL_FOR_ELIGIBILITY } from '../api/cardsApi'; // Import the constant

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  position: relative;

  @media (max-width: 500px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const ModalHeader = styled.h3`
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: var(--text-secondary-color);
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color var(--transition);

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  transition: border-color var(--transition);

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-on-dark-bg);
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;

  &:hover {
    background-color: var(--primary-light);
  }

  &:disabled {
    background-color: var(--medium-gray);
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  min-height: 1.2em; /* Reserve space to prevent layout shifts */
`;

const ApiResultText = styled.p`
  text-align: center;
  font-size: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: ${props => 
    props.type === 'success' ? '#E6F9F0' : 
    props.type === 'error' ? '#FFF0F0' : 'var(--light-gray)'};
  color: ${props => 
    props.type === 'success' ? 'var(--success-color)' : 
    props.type === 'error' ? 'var(--error-color)' : 'var(--text-color)'};
`;

const EligibilityModal = ({ card, onClose, onEligibleAndApply }) => {
  const [pincode, setPincode] = useState('');
  const [inhandIncome, setInhandIncome] = useState('');
  const [empStatus, setEmpStatus] = useState('salaried');
  const [errors, setErrors] = useState({});
  const [apiResult, setApiResult] = useState(null); // {type: 'success'/'error', message: ''}
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!pincode) newErrors.pincode = 'Pincode is required.';
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = 'Pincode must be 6 digits.';

    if (!inhandIncome) newErrors.inhandIncome = 'Monthly income is required.';
    else if (isNaN(inhandIncome) || Number(inhandIncome) <= 0) newErrors.inhandIncome = 'Please enter a valid income.';
    
    if (!empStatus) newErrors.empStatus = 'Employment status is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResult(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        alias: card.alias || card.card_alias || card.seo_card_alias, // Attempt to find a suitable alias field
        pincode,
        inhandIncome: String(inhandIncome),
        empStatus,
      };
      
      // Basic check for alias
      if (!payload.alias) {
        throw new Error('Card alias is missing. Cannot check eligibility.');
      }

      // Use the imported constant for the API URL
      const response = await axios.post(BASE_API_URL_FOR_ELIGIBILITY, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        const eligibilityData = response.data.data[0];
        if (eligibilityData.eligible) {
          setApiResult({ type: 'success', message: 'Congratulations! You are eligible for this card.' });
        } else {
          setApiResult({ 
            type: 'error',
            message: `Not eligible. Reason: ${eligibilityData.rejectionReason || 'Not specified'}` 
          });
        }
      } else {
        throw new Error(response.data.message || 'Invalid API response structure or unsuccessful status.');
      }
    } catch (error) {
      console.error('Eligibility API error:', error);
      setApiResult({ type: 'error', message: error.message || 'Failed to check eligibility. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!card) return null;

  return (
    <ModalOverlay onClick={onClose}> {/* Close on overlay click */}
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Prevent close on content click */}
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>Check Eligibility for {card.name}</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="inhandIncome">Monthly In-hand Income (₹)</Label>
            <Input 
              type="number" 
              id="inhandIncome" 
              value={inhandIncome} 
              onChange={(e) => { setInhandIncome(e.target.value); errors.inhandIncome && validate(); }}
              placeholder="e.g., 50000"
            />
            {errors.inhandIncome && <ErrorText>{errors.inhandIncome}</ErrorText>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="pincode">Pincode</Label>
            <Input 
              type="text" // Use text for easier max-length handling with pattern
              id="pincode" 
              value={pincode} 
              onChange={(e) => { setPincode(e.target.value); errors.pincode && validate(); }}
              placeholder="e.g., 110001"
              maxLength="6"
            />
            {errors.pincode && <ErrorText>{errors.pincode}</ErrorText>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="empStatus">Employment Status</Label>
            <Select id="empStatus" value={empStatus} onChange={(e) => setEmpStatus(e.target.value)}>
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self-employed</option>
            </Select>
            {errors.empStatus && <ErrorText>{errors.empStatus}</ErrorText>}
          </FormGroup>
          
          {apiResult && <ApiResultText type={apiResult.type}>{apiResult.message}</ApiResultText>}

          {apiResult?.type === 'success' ? (
            <SubmitButton type="button" onClick={() => onEligibleAndApply(card.network_url)} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Proceed to Apply'}
            </SubmitButton>
          ) : (
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Check Eligibility'}
            </SubmitButton>
          )}
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EligibilityModal; 