// Arquivo: src/components/PhotoGallery.jsx
import { useState, useEffect } from "react";
import PhotoCard from "./PhotoCard";
import "./PhotoGallery.css";

function PhotoGallery({ photos }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento para mostrar o skeleton
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [photos]);

  if (isLoading) {
    return <PhotoGallerySkeleton />;
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="gallery-empty-state">
        <div className="empty-state-icon">📸</div>
        <h3>Nenhuma foto encontrada</h3>
        <p>
          Comece fazendo upload de suas primeiras fotos para criar memórias
          incríveis!
        </p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Nossa Galeria de Memórias</h2>
        <p className="gallery-subtitle">
          {photos.length} {photos.length === 1 ? "foto" : "fotos"} para reviver
          momentos especiais
        </p>
      </div>

      <div className="masonry-gallery">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="masonry-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Skeleton para carregamento
function PhotoGallerySkeleton() {
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>

      <div className="masonry-gallery">
        {skeletonItems.map((item) => (
          <div key={item} className="masonry-item skeleton-item">
            <div className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-text skeleton-text-large"></div>
                <div className="skeleton-text skeleton-text-medium"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
