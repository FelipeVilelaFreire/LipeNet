// Arquivo: src/components/Header.jsx
import { Link } from 'react-router-dom';
import './Header.css'; // Importa nosso CSS customizado

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <h1>LipeNet</h1>
          <p>Sua Galeria de Fotos Inteligente</p>
        </div>
        <nav className="header-nav">
          <Link to="/">Galeria</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/people">Pessoas</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;