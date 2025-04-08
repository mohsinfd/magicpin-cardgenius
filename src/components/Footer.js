import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
`;

const FooterText = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© 2024 MagicPin. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer; 