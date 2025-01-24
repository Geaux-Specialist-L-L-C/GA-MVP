import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './styles/Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Geaux Academy Logo" />
          </Link>
        </div>
        <Navigation />
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-login">Login</Link>
          <Link to="/signup" className="btn btn-signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;