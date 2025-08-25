import { useState } from "react";
import { Calendar, Users, Tag } from 'lucide-react';
import "./PhotoCard.css";

function PhotoCard({ photo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Construímos a URL completa para a imagem, adicionando o endereço do backend
  const imageUrl = `http://127.0.0.1:8000${photo.image}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            src={imageUrl}
            alt={photo.text || "Foto"}
            className="card-image"
            loading="lazy"
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
            {photo.caption || "Processando legenda..."}
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
          {photo.persons && photo.persons.length > 0 && (
            <div className="card-footer">
              <div className="card-people">
                <Users size={16} />
                {photo.persons.length === 1 
                  ? photo.persons[0]
                  : `${photo.persons.length} pessoas`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div className="lightbox-modal" onClick={closeModal}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeModal}>
              ✕
            </button>
            
            <div className="lightbox-image-container">
              <img src={imageUrl} alt={photo.text || "Foto"} className="lightbox-image" />
            </div>
            
            <div className="lightbox-info">
              <h3>{photo.text || "Sem descrição"}</h3>
              
              <p className="lightbox-caption">
                {photo.caption || "Processando legenda..."}
              </p>
              
              <div className="lightbox-meta">
                <div className="meta-group">
                  <Calendar size={18} />
                  <span>{formatDate(photo.created_at)}</span>
                </div>
              </div>

              {/* Tags no modal */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="lightbox-tags">
                  {photo.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Pessoas no modal */}
              {photo.persons && photo.persons.length > 0 && (
                <div className="lightbox-people">
                  <h4>Pessoas na foto</h4>
                  <div className="people-list">
                    {photo.persons.map((person, index) => (
                      <div key={index} className="person-item">
                        <Users size={16} />
                        {person}
                      </div>
                    ))}
                  </div>
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