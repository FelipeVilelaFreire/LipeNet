import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import ManagePeoplePage from './pages/ManagePeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/people" element={<ManagePeoplePage />} />
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;