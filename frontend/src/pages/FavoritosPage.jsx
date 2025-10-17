import { useState, useEffect } from 'react';
import { Star, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PhotoCard from '../components/PhotoCard';
import './FavoritosPage.css';

function FavoritosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    fetchFavoritePhotos();
  }, []);

  const fetchFavoritePhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/favorites/');
      setPhotos(response.data);
    } catch (error) {
      console.error('Erro ao buscar fotos favoritas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (photoId, isFavorite) => {
    if (!isFavorite) {
      // Adiciona o ID à lista de remoção para animação
      setRemovingIds(prev => new Set(prev).add(photoId));
      
      // Remove da lista após a animação
      setTimeout(() => {
        setPhotos(photos.filter(p => p.id !== photoId));
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      }, 500); // Duração da animação
    }
  };

  const handleDelete = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  if (loading) {
    return <FavoritosPageSkeleton />;
  }

  if (photos.length === 0) {
    return (
      <div className="favoritos-empty-state">
        <Star size={80} />
        <h2>Nenhuma foto favorita ainda</h2>
        <p>Marque suas fotos favoritas clicando na estrela</p>
        <Link to="/gallery" className="empty-state-btn">
          <Camera size={20} />
          Ver Galeria
        </Link>
      </div>
    );
  }

  return (
    <div className="favoritos-page">
      <header className="favoritos-header">
        <div className="header-content">
          <div className="header-title">
            <Star size={32} />
            <div>
              <h1>Fotos Favoritas</h1>
              <p className="header-subtitle">
                {photos.length} {photos.length === 1 ? 'foto favorita' : 'fotos favoritas'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`photo-card-wrapper ${removingIds.has(photo.id) ? 'removing' : ''}`}
          >
            <PhotoCard
              photo={photo}
              photos={photos}
              currentIndex={index}
              onDelete={handleDelete}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Skeleton para carregamento
function FavoritosPageSkeleton() {
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="favoritos-page">
      <header className="favoritos-header">
        <div className="header-content">
          <div className="skeleton skeleton-header"></div>
        </div>
      </header>
      
      <div className="photo-grid">
        {skeletonItems.map((item) => (
          <div key={item} className="photo-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritosPage;