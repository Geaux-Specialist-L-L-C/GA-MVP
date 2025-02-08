import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styles from "./shared/shared.module.css";

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

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <Card
      title={title}
      description={type}
      className={`${styles.card} border-l-4 border-blue-500`}
    >
      <div className="text-3xl">{iconMap[type]}</div>
      <p className="text-sm text-gray-500 mt-1">{category}</p>
    </Card>
  );
};

export default CourseCard;
