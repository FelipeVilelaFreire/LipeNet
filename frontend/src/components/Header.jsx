import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Upload, Search, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/gallery', label: 'Galeria', icon: Camera },
    { path: '/search', label: 'Busca', icon: Search },
    { path: '/upload', label: 'Adicionar', icon: Upload },
    { path: '/people', label: 'Pessoas', icon: Users },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          <div className="brand-icon">
            <Camera />
          </div>
          <div className="brand-text">
            <h1>LipeNet</h1>
            <span>Memórias em Família</span>
          </div>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export default Header;