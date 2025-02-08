import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from '../shared/shared.module.css';

/**
 * CardProps interface
 * @property {IconProp} [icon] - Optional FontAwesome icon
 * @property {string} [title] - Card title
 * @property {string} [description] - Card description text
 * @property {React.ReactNode} [children] - Elements to render inside the card
 * @property {string} [className] - Optional additional class names for styling
 * @property {() => void} [onClick] - Optional click handler for the card
 */
interface CardProps {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component for displaying content in a card layout
 * @component
 * @example
 * return (
 *   <Card icon="coffee" title="Sample Title" description="Sample Description">
 *     <p>Any additional content can go here.</p>
 *   </Card>
 * )
 */
const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  children,
  className,
  onClick
}) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <div 
      className={`${styles.card} ${className || ''}`} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && (
        <div className={styles['card-icon']}>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </div>
      )}
      {title && <h3 className={styles['card-title']}>{title}</h3>}
      {description && (
        Array.isArray(description) ? (
          <ul className={styles['card-list']}>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles['card-description']}>{description}</p>
        )
      )}
      {children}
    </div>
  );
};

export default Card;
