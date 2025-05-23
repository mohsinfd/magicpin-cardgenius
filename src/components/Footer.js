import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--light-gray);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow);
`;

const FooterText = styled.p`
  color: var(--text-color);
  margin: 0;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© {new Date().getFullYear()} Tide. All rights reserved. Credit Card Calculator.</FooterText>
    </FooterContainer>
  );
};

export default Footer; 