// Arquivo: src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // Importe as ferramentas de rota
import axios from "axios";
import Header from "./components/Header";
import HomePage from "./pages/HomePage"; // Importe suas novas páginas
import UploadPage from "./pages/UploadPage";
import PhotoGallery from "./components/PhotoGallery"; // E os componentes que elas usarão
import UploadForm from "./components/UploadForm";

function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // ... (a lógica de buscar fotos que já tínhamos continua igual)
    axios
      .get("http://127.0.0.1:8000/api/photos/")
      .then((response) => setPhotos(response.data))
      .catch((error) => console.error("Erro:", error));
  }, []);

  const handlePhotoUpload = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  return (
    <div>
      <Header />
      <main>
        <Routes>
          {/* Rota para a página inicial */}
          <Route path="/" element={<PhotoGallery photos={photos} />} />

          {/* Rota para a página de upload */}
          <Route
            path="/upload"
            element={<UploadForm onPhotoUpload={handlePhotoUpload} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
