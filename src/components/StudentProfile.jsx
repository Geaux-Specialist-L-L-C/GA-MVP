import React, { useState } from "react";
import CourseCard from "./CourseCard";

const StudentProfile = () => {
  const [filter, setFilter] = useState("");

  const courses = [
    { title: "Geaux Academy Overview", type: "Video Animated", category: "Workspace" },
    { title: "AI in Education", type: "Quiz", category: "Courses" },
    { title: "Personalized Learning", type: "Mind Map", category: "Courses" },
    { title: "Understanding Sound", type: "Quiz", category: "Courses" },
  ];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search courses..."
        className="border px-4 py-2 w-full mb-4 rounded-lg"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Course List */}
      <div className="grid grid-cols-3 gap-4">
        {courses
          .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
          .map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
      </div>
    </div>
  );
};

export default StudentProfile;
