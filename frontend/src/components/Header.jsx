// Arquivo: src/components/Header.jsx
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <h1>FamilyTV</h1>
          <p>Conectando famílias através de memórias</p>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          
          <Link to="/gallery" className="nav-link">
            <span className="nav-icon">🖼️</span>
            <span className="nav-text">Galeria</span>
          </Link>
          
          <Link to="/upload" className="nav-link">
            <span className="nav-icon">📤</span>
            <span className="nav-text">Upload</span>
          </Link>
          
          <Link to="/search" className="nav-link">
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Buscar</span>
          </Link>
          
          <Link to="/people" className="nav-link">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Pessoas</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;