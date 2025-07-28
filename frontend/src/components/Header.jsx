import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h1>LipeNet</h1>
        <p>Sua Galeria de Fotos Inteligente</p>
      </div>
      <nav>
        <Link to="/" style={{ marginRight: "15px" }}>
          Galeria
        </Link>
        <Link to="/upload">Upload</Link>
      </nav>
    </header>
  );
}

export default Header;
