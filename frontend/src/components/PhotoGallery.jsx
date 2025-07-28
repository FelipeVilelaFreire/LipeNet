// Arquivo: src/components/PhotoGallery.jsx

// 1. Importamos os hooks 'useState' e 'useEffect' do React
import { useState, useEffect } from 'react';
// 2. Importamos o axios para fazer as chamadas de API
import axios from 'axios';
import PhotoCard from './PhotoCard';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);

  // 3. Usamos o useEffect para buscar os dados da API QUANDO o componente carregar.
  useEffect(() => {
    // Criamos uma função 'async' para poder usar 'await'
    async function fetchPhotos() {
      try {
        // 5. O axios faz a requisição GET para nosso endpoint Django.
        const response = await axios.get('http://127.0.0.1:8000/api/photos/');
        // 6. Atualizamos nosso estado 'photos' com os dados recebidos da API.
        setPhotos(response.data);
      } catch (error) {
        // Se der erro, mostramos no console.
        console.error("Erro ao buscar as fotos:", error);
      }
    }

    fetchPhotos(); // Executamos a função que acabamos de criar.
  }, []); // 7. O array vazio [] significa: "execute este efeito apenas UMA VEZ".

  return (
    <div>
      <h2>Minha Galeria</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* 8. Agora, o .map() usa a nossa variável de estado 'photos' */}
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