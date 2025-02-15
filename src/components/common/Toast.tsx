import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer $type={type}>
      <p>{message}</p>
    </ToastContainer>
  );
};

const showToast = (props: ToastProps): void => {
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const onClose = () => {
    document.body.removeChild(toastElement);
    props.onClose?.();
  };
  
  const toastComponent = React.createElement(Toast, { ...props, onClose });
  ReactDOM.render(toastComponent, toastElement);
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.palette.success?.main || '#2ECC71'};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.palette.warning?.main || '#F1C40F'};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${({ theme }) => theme.palette.error?.main || '#E74C3C'};
        color: white;
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.palette.info?.main || '#3498DB'};
        color: white;
      `;
  }
};

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  ${props => getToastColor(props.$type)}

  p {
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Toast;
