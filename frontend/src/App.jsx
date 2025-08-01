// Arquivo: src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import PhotoGallery from './components/PhotoGallery';
import UploadForm from './components/UploadForm';
import ManagePeoplePage from './pages/ManagePeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  // 2. Novo estado para guardar apenas os resultados da busca
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/photos/')
      .then(response => setPhotos(response.data))
      .catch(error => console.error("Erro:", error));
  }, []);

  const handlePhotoUpload = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  // 3. Função que será chamada pela SearchBar
  const handleSearch = (query) => {
    if (query) {
      setIsSearching(true); // Ativa o modo de busca
      axios.get(`http://127.0.0.1:8000/api/search/?query=${query}`)
        .then(response => setSearchResults(response.data))
        .catch(error => console.error("Erro na busca:", error));
    } else {
      setIsSearching(false); // Desativa o modo de busca se o campo estiver vazio
      setSearchResults([]);
    }
  };

  return (
    <div>
      <Header />
      <main className="app-main-content">
        <Routes>
          {/* 4. Modificamos a rota principal */}
          <Route
            path="/"
            element={
              <>
                <SearchBar onSearch={handleSearch} />
                {/* Renderiza a galeria com os resultados da busca OU com todas as fotos */}
                <PhotoGallery photos={isSearching ? searchResults : photos} />
              </>
            }
          />
          <Route path="/upload" element={<UploadForm onPhotoUpload={handlePhotoUpload} />} />
          <Route path="/people" element={<ManagePeoplePage />} />
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;