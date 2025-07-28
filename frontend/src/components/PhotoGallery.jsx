import PhotoCard from './PhotoCard';

// A galeria agora recebe a lista de fotos via props!
function PhotoGallery({ photos }) {
  return (
    <div>
      <h2>Minha Galeria</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map(photo => (
          <PhotoCard
            key={photo.id}
            photo={photo}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;