import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
  
  @media (max-width: 768px) {
    height: 32px;
  }

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }
`;

const Logo = () => {
  return (
    <LogoContainer>
      <img src="/magicpin-logo.png" alt="MagicPin" />
    </LogoContainer>
  );
};

export default Logo; 