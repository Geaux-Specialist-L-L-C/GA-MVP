import React from 'react';
import styled from 'styled-components';
import AuthForm from '../organisms/AuthForm';
import AssessmentFlow from '../organisms/AssessmentFlow';

interface DashboardLayoutProps {
  userData: {
    name: string;
    email: string;
    profilePicture: string;
  };
  routeContext: {
    currentRoute: string;
  };
  children: React.ReactNode;
  onLogout: () => void;
  sidebar?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userData,
  routeContext,
  children,
  onLogout,
  sidebar = true,
}) => {
  return (
    <Container>
      <Header>
        <Profile>
          <ProfilePicture src={userData.profilePicture} alt={`${userData.name}'s profile`} />
          <ProfileInfo>
            <Name>{userData.name}</Name>
            <Email>{userData.email}</Email>
          </ProfileInfo>
        </Profile>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>
      <Main>
        {sidebar && <Sidebar>Sidebar content here</Sidebar>}
        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4a90e2;
  color: white;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Email = styled.span`
  font-size: 0.875rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
`;

export default DashboardLayout;
