import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import Navigation from './Navigation';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Link to="/">
            <LogoText>Geaux Academy</LogoText>
          </Link>
        </LogoSection>
        <Navigation />
        <AuthSection>
          {user ? (
            <>
              <UserInfo>{user.email}</UserInfo>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <LoginButton to="/login">Login</LoginButton>
          )}
        </AuthSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  a {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
  }
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.span`
  color: var(--text-color);
`;

const Button = styled.button`
  // ...existing styles...
`;

export default Header;
