import PhotoCard from './PhotoCard'; // Importamos nosso componente de card

// 1. Nossos dados "falsos" (mock data) para o teste de hoje.
const dummyPhotos = [
  {
    id: 1,
    text: 'Gato olhando a paisagem',
    image: 'https://placekitten.com/300/200', // URL de imagem de gatinho
    caption: 'a cat looking out a window'
  },
  {
    id: 2,
    text: 'Outro gatinho!',
    image: 'https://placekitten.com/301/200',
    caption: 'a closeup of a cat face'
  },
  {
    id: 3,
    text: 'Um terceiro gatinho para dar sorte',
    image: 'https://placekitten.com/300/201',
    caption: 'a small kitten sitting on a blanket'
  }
];

function PhotoGallery() {
  return (
    <div>
      <h2>Minha Galeria</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* 2. A MÁGICA ACONTECE AQUI */}
        {dummyPhotos.map(photo => (<PhotoCard key={photo.id} photo={photo}/>))}
      </div>
    </div>
  );
}

export default PhotoGallery;