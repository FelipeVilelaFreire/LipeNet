import './PhotoCard.css';

function PhotoCard({ photo }) {
  // Construímos a URL completa para a imagem, adicionando o endereço do backend
  const imageUrl = `http://127.0.0.1:8000${photo.image}`;

  return (
    // No nosso refactor para CSS puro, não precisamos mais do <Card> do Bootstrap
    <div className="h-100 photo-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={photo.text} className="card-image" />
      </div>
      <div className="card-body"> {/* Usamos div com classe para o corpo do card */}
        <h4 className="card-title">{photo.text}</h4>
        <p className="card-text">
          Legenda da IA: {photo.caption || "Ainda   não gerada."}
        </p>
      </div>
    </div>
  );
}

export default PhotoCard;