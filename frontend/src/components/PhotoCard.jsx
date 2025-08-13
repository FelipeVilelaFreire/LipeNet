import { useState } from "react";
import "./PhotoCard.css";

function PhotoCard({ photo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Construímos a URL completa para a imagem, adicionando o endereço do backend
  const imageUrl = `http://127.0.0.1:8000${photo.image}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Card da Foto */}
      <div className="photo-card" onClick={openModal}>
        <div className="card-image-container">
          <img
            src={imageUrl}
            alt={photo.text}
            className="card-image"
            loading="lazy"
          />
          <div className="card-overlay">
            <div className="overlay-content">
              <span className="view-icon">👁️</span>
              <span className="view-text">Clique para ampliar</span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h4 className="card-title">{photo.text}</h4>
          <p className="card-text">
            {photo.caption || "Legenda da IA ainda não gerada."}
          </p>
          <div className="card-meta">
            <span className="meta-item">
              📅{" "}
              {new Date(photo.created_at || Date.now()).toLocaleDateString(
                "pt-BR"
              )}
            </span>
            {photo.persons && photo.persons.length > 0 && (
              <span className="meta-item">
                👥 {photo.persons.length}{" "}
                {photo.persons.length === 1 ? "pessoa" : "pessoas"}
              </span>
            )}
          </div>
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
              <img src={imageUrl} alt={photo.text} className="lightbox-image" />
            </div>
            <div className="lightbox-info">
              <h3>{photo.text}</h3>
              <p className="lightbox-caption">
                {photo.caption || "Legenda da IA ainda não gerada."}
              </p>
              <div className="lightbox-meta">
                <span className="meta-item">
                  📅{" "}
                  {new Date(photo.created_at || Date.now()).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
                {photo.persons && photo.persons.length > 0 && (
                  <span className="meta-item">
                    👥 {photo.persons.length}{" "}
                    {photo.persons.length === 1 ? "pessoa" : "pessoas"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoCard;
