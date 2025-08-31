import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import ManagePeoplePage from './pages/ManagePeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import Entry from './vitrine/Entry';
import './App.css';

function App() {
  const location = useLocation();
  const isEntryPage = location.pathname === '/entry';

  return (
    <div className="app">
      {!isEntryPage && <Header />}
      <main className="app-main-content">
        <Routes>
          <Route path="/entry" element={<Entry />} />
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