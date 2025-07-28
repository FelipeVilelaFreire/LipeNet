import PhotoCard from './PhotoCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PhotoGallery({ photos }) {
  return (
    <Container>
      <h2 className="my-4">Minha Galeria</h2>
      <Row>
        {photos.map(photo => (
          <Col key={photo.id} lg={4} md={6} xs={12} className="mb-4">
            <PhotoCard photo={photo} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PhotoGallery;