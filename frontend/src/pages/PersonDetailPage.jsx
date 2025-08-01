// Arquivo: frontend/src/pages/PersonDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importe o hook useParams
import axios from 'axios';
import PhotoGallery from '../components/PhotoGallery'; // Vamos reutilizar nossa galeria!

function PersonDetailPage() {
  // useParams() nos dá um objeto com os parâmetros da URL. Ex: { personId: '1' }
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Busca os detalhes da pessoa
    axios.get(`http://127.0.0.1:8000/api/persons/${personId}/`)
      .then(res => setPerson(res.data))
      .catch(err => console.error("Erro ao buscar pessoa:", err));

    // Busca as fotos daquela pessoa
    axios.get(`http://127.0.0.1:8000/api/persons/${personId}/photos/`)
      .then(res => setPhotos(res.data))
      .catch(err => console.error("Erro ao buscar fotos da pessoa:", err));

  }, [personId]); // O efeito roda novamente se o personId mudar

  if (!person) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Álbum de: {person.name}</h1>
      <hr />
      <PhotoGallery photos={photos} />
    </div>
  );
}

export default PersonDetailPage;