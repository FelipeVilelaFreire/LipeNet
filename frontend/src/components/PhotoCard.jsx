import { useState } from "react";
import { Calendar, Users, Tag, ChevronLeft, ChevronRight, Download, Share2, Heart, Trash2, Star } from 'lucide-react';
import axios from 'axios';
import "./PhotoCard.css";

function PhotoCard({ photo, photos = [], currentIndex = 0, onDelete, onFavoriteToggle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(currentIndex);
  const [liked, setLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(photo.is_favorite || false);

  // A URL da imagem já vem completa do backend agora
  const imageUrl = photo.image && photo.image.startsWith('http') 
    ? photo.image 
    : photo.image 
      ? `http://127.0.0.1:8000${photo.image}`
      : '/placeholder.jpg';

  const handleImageError = () => {
    setImageError(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
    const photoIndex = photos.findIndex(p => p.id === photo.id);
    if (photoIndex !== -1) {
      setCurrentPhotoIndex(photoIndex);
    }
  };
  
  const closeModal = () => setIsModalOpen(false);
  
  const navigatePhoto = (direction) => {
    if (!photos || photos.length === 0) return;
    
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    } else {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `photo-${photo.id}.jpg`;
    link.click();
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.text || 'Foto',
        text: photo.caption_pt || photo.caption || '',
        url: window.location.href
      });
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/photos/${photo.id}/toggle-favorite/`
      );
      setIsFavorite(response.data.is_favorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(photo.id, response.data.is_favorite);
      }
    } catch (error) {
      console.error('Erro ao favoritar foto:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta foto?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/photos/${displayPhoto.id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          closeModal();
          if (onDelete) {
            onDelete(displayPhoto.id);
          }
        } else {
          alert('Erro ao deletar a foto');
        }
      } catch (error) {
        console.error('Erro ao deletar foto:', error);
        alert('Erro ao deletar a foto');
      }
    }
  };
  
  const displayPhoto = photos && photos.length > 0 ? photos[currentPhotoIndex] : photo;
  const displayImageUrl = displayPhoto.image && displayPhoto.image.startsWith('http') 
    ? displayPhoto.image 
    : displayPhoto.image 
      ? `http://127.0.0.1:8000${displayPhoto.image}`
      : '/placeholder.jpg';

  // Formatação da data
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString("pt-BR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Card da Foto */}
      <div className="photo-card" onClick={openModal}>
        <div className="card-image-container">
          <img
            src={imageError ? '/placeholder.jpg' : imageUrl}
            alt={photo.text || "Foto"}
            className="card-image"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        <div className="card-body">
          <div className="card-date">
            <Calendar size={16} />
            {formatDate(photo.created_at)}
          </div>
          
          <h4 className="card-title">
            {photo.text || "Sem descrição"}
          </h4>
          
          <p className="card-text">
            {photo.caption_pt || photo.caption || "Processando legenda..."}
          </p>

          {/* Tags se houver */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="card-tags">
              {photo.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
              {photo.tags.length > 3 && (
                <span className="tag-item">+{photo.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer com pessoas */}
          <div className="card-footer">
            {photo.persons && photo.persons.length > 0 && (
              <div className="card-people">
                <Users size={16} />
                {photo.persons.length === 1 
                  ? photo.persons[0]
                  : `${photo.persons.length} pessoas`}
              </div>
            )}
            <div className="card-actions">
              <button 
                className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star size={18} fill={isFavorite ? '#FFD700' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lightbox Enhanced */}
      {isModalOpen && (
        <div className="lightbox-modal" onClick={closeModal}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeModal}>
              ✕
            </button>
            
            {/* Navigation Arrows */}
            {photos && photos.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-nav-prev" 
                  onClick={() => navigatePhoto('prev')}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={30} />
                </button>
                <button 
                  className="lightbox-nav lightbox-nav-next" 
                  onClick={() => navigatePhoto('next')}
                  aria-label="Next photo"
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}
            
            <div className="lightbox-image-container">
              <img 
                src={imageError ? '/placeholder.jpg' : displayImageUrl} 
                alt={displayPhoto.text || "Foto"} 
                className="lightbox-image"
                onError={handleImageError} 
              />
              
              {/* Image Actions */}
              <div className="lightbox-image-actions">
                <button 
                  className={`lightbox-action-btn ${liked ? 'liked' : ''}`}
                  onClick={() => setLiked(!liked)}
                  title="Curtir"
                >
                  <Heart size={20} fill={liked ? '#e74c3c' : 'none'} />
                </button>
                <button 
                  className="lightbox-action-btn"
                  onClick={handleDownload}
                  title="Baixar"
                >
                  <Download size={20} />
                </button>
                <button 
                  className="lightbox-action-btn"
                  onClick={handleShare}
                  title="Compartilhar"
                >
                  <Share2 size={20} />
                </button>
                <button 
                  className="lightbox-action-btn delete-btn"
                  onClick={handleDelete}
                  title="Deletar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="lightbox-info">
              <h3>{displayPhoto.text || "Sem descrição"}</h3>
              
              <p className="lightbox-caption">
                {displayPhoto.caption_pt || displayPhoto.caption || "Processando legenda..."}
              </p>
              
              <div className="lightbox-meta">
                <div className="meta-group">
                  <Calendar size={18} />
                  <span>{formatDate(displayPhoto.created_at)}</span>
                </div>
              </div>

              {/* Tags no modal */}
              {displayPhoto.tags && displayPhoto.tags.length > 0 && (
                <div className="lightbox-tags">
                  {displayPhoto.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Pessoas no modal */}
              {displayPhoto.persons && displayPhoto.persons.length > 0 && (
                <div className="lightbox-people">
                  <h4>Pessoas na foto</h4>
                  <div className="people-list">
                    {displayPhoto.persons.map((person, index) => (
                      <div key={index} className="person-item">
                        <Users size={16} />
                        {person}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Photo Counter */}
              {photos && photos.length > 1 && (
                <div className="lightbox-counter">
                  {currentPhotoIndex + 1} de {photos.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoCard;