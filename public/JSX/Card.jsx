import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Card.css';

const Card = ({ icon, title, description, children, className }) => {
  return (
    <div className={`card ${className || ''}`}>
      {icon && (
        <div className="card-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
};

export default Card;