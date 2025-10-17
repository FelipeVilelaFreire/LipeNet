import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Upload, Search, Users, Menu, X, Star, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/gallery', label: 'Galeria', icon: Camera },
    { path: '/search', label: 'Busca', icon: Search },
    { path: '/upload', label: 'Adicionar', icon: Upload },
    { path: '/people', label: 'Pessoas', icon: Users },
    { path: '/favoritos', label: 'Favoritos', icon: Star },
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
          <button
            className="nav-link settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Configurações"
          >
            <Settings className="nav-icon" />
            <span className="nav-text">Configurações</span>
          </button>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Barra lateral de configurações - Renderizado como Portal */}
      {showSettings && createPortal(
        <>
          <div className="settings-overlay" onClick={() => setShowSettings(false)} />
          <div className="settings-sidebar">
            <div className="settings-header">
              <h2>Configurações</h2>
              <button 
                className="settings-close"
                onClick={() => setShowSettings(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="settings-content">
              <div className="settings-section">
                <h3>Informações Pessoais</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label htmlFor="name">Nome</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Seu nome completo"
                      defaultValue="Felipe Vilela"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="username">Nome de usuário</label>
                    <input 
                      type="text" 
                      id="username" 
                      placeholder="@username"
                      defaultValue="@felipe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="seu@email.com"
                      defaultValue="felipe@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea 
                      id="bio" 
                      rows="3"
                      placeholder="Conte um pouco sobre você..."
                      defaultValue="Amante de fotografia e memórias familiares"
                    />
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Preferências</h3>
                <div className="settings-options">
                  <label className="settings-option">
                    <input type="checkbox" defaultChecked />
                    <span>Notificações de novas fotos</span>
                  </label>
                  <label className="settings-option">
                    <input type="checkbox" defaultChecked />
                    <span>Identificação automática de pessoas</span>
                  </label>
                  <label className="settings-option">
                    <input type="checkbox" />
                    <span>Modo escuro</span>
                  </label>
                </div>
              </div>
              
              <div className="settings-actions">
                <button className="settings-save-btn">
                  Salvar Alterações
                </button>
                <button className="settings-cancel-btn" onClick={() => setShowSettings(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}

export default Header;