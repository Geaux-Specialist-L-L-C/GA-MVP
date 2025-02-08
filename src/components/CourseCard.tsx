
import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import { IconType } from "react-icons";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

type IconMapType = {
  [K in CourseCardProps["type"]]: JSX.Element;
};

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  const iconMap: IconMapType = {
    "Video Animated": <FaVideo className="text-purple-500" />,
    "Quiz": <FaListAlt className="text-yellow-500" />,
    "Mind Map": <FaBrain className="text-pink-500" />,
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg flex items-center space-x-4 border-l-4 border-blue-500">
      <div className="text-3xl">{iconMap[type]}</div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{type}</p>
        <span className="text-green-500 text-sm font-bold">{category}</span>
      </div>
    </div>
  );
};

export default CourseCard;
