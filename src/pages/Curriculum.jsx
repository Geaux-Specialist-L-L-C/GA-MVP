// src/pages/Curriculum.jsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Curriculum = () => {
  const subjects = [
    { id: 1, name: 'Mathematics', courses: ['Algebra', 'Geometry', 'Calculus'] },
    { id: 2, name: 'Science', courses: ['Biology', 'Chemistry', 'Physics'] },
    { id: 3, name: 'Languages', courses: ['English', 'Spanish', 'French'] }
  ];

  return (
    <CurriculumContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Our Curriculum</h1>
          <p>Explore our comprehensive course offerings</p>
        </Header>

        <SubjectGrid>
          {subjects.map((subject) => (
            <SubjectCard key={subject.id}>
              <h2>{subject.name}</h2>
              <CourseList>
                {subject.courses.map((course, index) => (
                  <CourseItem key={index}>{course}</CourseItem>
                ))}
              </CourseList>
            </SubjectCard>
          ))}
        </SubjectGrid>
      </motion.div>
    </CurriculumContainer>
  );
};

const CurriculumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const SubjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const SubjectCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CourseList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CourseItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

export default Curriculum;