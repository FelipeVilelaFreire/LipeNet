import Card from "react-bootstrap/Card";
import "./PhotoCard.css";

function PhotoCard({ photo }) {
  const imageUrl = `http://127.0.0.1:8000${photo.image}`;

  return (
    <Card className="h-100 photo-card">
      {/* Este container força a proporção da imagem */}
      <div className="card-image-container">
        <Card.Img variant="top" src={imageUrl} className="card-image" />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="card-title">{photo.text}</Card.Title>
        <Card.Text as="em" className="card-text mt-auto">
          Legenda da IA: {photo.caption || "Ainda não gerada."}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PhotoCard;
