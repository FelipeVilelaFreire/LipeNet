// Arquivo: src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import PhotoGallery from './components/PhotoGallery';
import UploadForm from './components/UploadForm';
import Container from 'react-bootstrap/Container';

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
      {/* Adicionamos um Container para centralizar e alinhar o conteúdo */}
      <Container className="mt-4">
        <main>
          <Routes>
            <Route path="/" element={<PhotoGallery photos={photos} />} />
            <Route path="/upload" element={<UploadForm onPhotoUpload={handlePhotoUpload} />} />
          </Routes>
        </main>
      </Container>
    </div>
  );
}

export default App;