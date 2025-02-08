import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";

const ParentProfileForm: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>Parent Profile Form</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </FormBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default ParentProfileForm;
