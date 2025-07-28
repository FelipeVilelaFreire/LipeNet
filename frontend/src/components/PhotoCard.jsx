import Card from 'react-bootstrap/Card';

function PhotoCard({ photo }) {
  const imageUrl = `http://127.0.0.1:8000${photo.image}`;

  return (
    // Usamos o componente Card do Bootstrap, que já tem uma ótima estrutura
    <Card style={{ width: '18rem' }} className="m-2">
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{photo.text}</Card.Title>
        <Card.Text as="em" className="text-muted">
          Legenda da IA: {photo.caption || "Ainda não gerada."}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PhotoCard;