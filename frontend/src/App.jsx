// Arquivo: src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import PhotoGallery from './components/PhotoGallery';
import UploadForm from './components/UploadForm';
import ManagePeoplePage from './pages/ManagePeoplePage';
import './App.css'; // Importa nosso CSS do App
import PersonDetailPage from './pages/PersonDetailPage';


function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/photos/')
      .then(response => setPhotos(response.data))
      .catch(error => console.error("Erro:", error));
  }, []);

  const handlePhotoUpload = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  return (
    <div>
      <Header />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<PhotoGallery photos={photos} />} />
          <Route path="/upload" element={<UploadForm onPhotoUpload={handlePhotoUpload} />} />
          <Route path="/people" element={<ManagePeoplePage />} />
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;