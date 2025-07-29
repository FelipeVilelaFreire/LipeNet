// Arquivo: src/components/PhotoGallery.jsx
import PhotoCard from "./PhotoCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./PhotoGallery.css";

function PhotoGallery({ photos }) {
  return (
    <div className="gallery-container">
      <h2 className="my-4 text-center">Minha Galeria</h2>
      <Row>
        {photos.map((photo) => (
          <Col key={photo.id}
 xl={3}
            lg={4}
            md={6}
            xs={12}
            className="mb-4 d-flex"
          >
            <PhotoCard photo={photo} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PhotoGallery;
