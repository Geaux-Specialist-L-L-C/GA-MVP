
import React from 'react';
import { Link } from 'react-router-dom';
import './StyledLink.css'; // Assuming you have some CSS for styling

const StyledLink = ({ to, children }) => {
  return (
    <Link to={to} className="styled-link">
      {children}
    </Link>
  );
};

export default StyledLink;