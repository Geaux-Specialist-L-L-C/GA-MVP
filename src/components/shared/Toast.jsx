import { useState, useEffect } from 'react';
import './styles/Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <div className={`toast toast-${type}`}>
      <p>{message}</p>
    </div>
  ) : null;
};

export default Toast;
