import { useState, useEffect, useCallback } from "react"; // 1. IMPORTE O useCallback
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import PhotoGallery from "./components/PhotoGallery";
import PhotoCard from "./components/PhotoCard";
import UploadForm from "./components/UploadForm";
import ManagePeoplePage from "./pages/ManagePeoplePage";
import PersonDetailPage from "./pages/PersonDetailPage";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/photos/")
      .then((response) => setPhotos(response.data))
      .catch((error) => console.error("Erro:", error));
  }, []);

  // 2. ENVOLVA A FUNÇÃO EM useCallback
  // Isso garante que a função só será recriada se 'photos' mudar.
  const handlePhotoUpload = useCallback((newPhoto) => {
    setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
  }, []); // Usamos a forma de callback no setState para não depender de 'photos' diretamente

  // 3. ENVOLVA A FUNÇÃO DE BUSCA EM useCallback
  // Isso garante que a mesma instância da função seja passada para o SearchBar
  // a cada renderização, quebrando o loop.
  const handleSearch = useCallback((query) => {
    if (query) {
      setIsSearching(true);
      axios
        .get(`http://127.0.0.1:8000/api/search/?query=${query}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Erro na busca:", error));
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, []); // O array de dependências está vazio, pois a função não depende de nenhum state ou prop.

  return (
    <div className="app">
      <Header />
      <main className="app-main-content">
        <Routes>
          {/* Home - Feed principal estilo Instagram */}
          <Route
            path="/"
            element={
              <div className="home-feed">
                <div className="feed-header">
                  <h1>Feed da Família</h1>
                  <p>Momentos especiais compartilhados por todos</p>
                </div>
                <div className="feed-content">
                  {photos.map((photo) => (
                    <div key={photo.id} className="feed-post">
                      <PhotoCard photo={photo} />
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Galeria - Todas as fotos */}
          <Route
            path="/gallery"
            element={
              <>
                <SearchBar onSearch={handleSearch} />
                <PhotoGallery photos={isSearching ? searchResults : photos} />
              </>
            }
          />

          {/* Upload - Formulário de envio */}
          <Route
            path="/upload"
            element={<UploadForm onPhotoUpload={handlePhotoUpload} />}
          />

          {/* Busca - Página dedicada à busca */}
          <Route
            path="/search"
            element={
              <div className="search-page">
                <div className="search-header">
                  <h1>Busca Inteligente</h1>
                  <p>Encontre suas memórias usando linguagem natural</p>
                </div>
                <SearchBar onSearch={handleSearch} />
                {isSearching && (
                  <div className="search-results">
                    <h2>Resultados da Busca</h2>
                    <PhotoGallery photos={searchResults} />
                  </div>
                )}
              </div>
            }
          />

          {/* Pessoas - Gerenciamento de pessoas */}
          <Route path="/people" element={<ManagePeoplePage />} />
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
