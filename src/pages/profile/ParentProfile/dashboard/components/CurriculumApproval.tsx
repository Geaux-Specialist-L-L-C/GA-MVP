import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;