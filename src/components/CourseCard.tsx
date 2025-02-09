import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styled from "styled-components";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const iconMap = {
  "Video Animated": <FaVideo style={{ color: "#9333ea" }} />,
  "Quiz": <FaListAlt style={{ color: "#eab308" }} />,
  "Mind Map": <FaBrain style={{ color: "#ec4899" }} />,
};

const StyledCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.palette.primary.main};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.875rem;
`;

const CategoryText = styled.p`
  color: ${props => props.theme.palette.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <StyledCard title={title} description={type}>
      <IconWrapper>{iconMap[type]}</IconWrapper>
      <CategoryText>{category}</CategoryText>
    </StyledCard>
  );
};

export default CourseCard;
