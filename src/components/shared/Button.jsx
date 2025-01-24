import './styles/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  ...props 
}) => (
  <button 
    className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`}
    disabled={loading}
    {...props}
  >
    {loading ? <span className="btn-spinner"></span> : children}
  </button>
);

export default Button;
