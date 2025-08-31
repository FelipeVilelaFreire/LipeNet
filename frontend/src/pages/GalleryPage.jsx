import { useState, useEffect } from 'react';
import PhotoCard from '../components/PhotoCard';
import { Calendar, User, Tag } from 'lucide-react';
import './GalleryPage.css';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
const response = await fetch('http://localhost:8000/api/photos/');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoDelete = (photoId) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  };

  const getSortedPhotos = () => {
    let sorted = [...photos];
    
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
        break;
      case 'name':
        sorted.sort((a, b) => (a.description || '').localeCompare(b.description || ''));
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const getFilteredPhotos = () => {
    const sorted = getSortedPhotos();
    
    if (filter === 'all') return sorted;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    switch (filter) {
      case 'week':
        return sorted.filter(photo => new Date(photo.uploaded_at) >= oneWeekAgo);
      case 'month':
        return sorted.filter(photo => new Date(photo.uploaded_at) >= oneMonthAgo);
      case 'people':
        return sorted.filter(photo => photo.detected_faces && photo.detected_faces.length > 0);
      default:
        return sorted;
    }
  };

  const filteredPhotos = getFilteredPhotos();

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Carregando galeria...</p>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1 className="gallery-title">Galeria de Fotos</h1>
        <p className="gallery-subtitle">
          {filteredPhotos.length} {filteredPhotos.length === 1 ? 'foto' : 'fotos'} na sua coleção
        </p>
      </div>

      <div className="gallery-controls">
        <div className="filter-group">
          <label className="filter-label">Filtrar por:</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filter-button ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              <Calendar size={16} />
              Última semana
            </button>
            <button
              className={`filter-button ${filter === 'month' ? 'active' : ''}`}
              onClick={() => setFilter('month')}
            >
              <Calendar size={16} />
              Último mês
            </button>
            <button
              className={`filter-button ${filter === 'people' ? 'active' : ''}`}
              onClick={() => setFilter('people')}
            >
              <User size={16} />
              Com pessoas
            </button>
          </div>
        </div>

        <div className="sort-group">
          <label className="sort-label">Ordenar por:</label>
          <select 
            className="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>

      {filteredPhotos.length > 0 ? (
        <div className="gallery-grid">
          {filteredPhotos.map(photo => (
            <PhotoCard key={photo.id} photo={photo} onDelete={handlePhotoDelete} />
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <Tag size={48} />
          <p>Nenhuma foto encontrada com os filtros selecionados</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;