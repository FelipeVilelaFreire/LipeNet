// Arquivo: src/components/UploadForm.jsx
import { useState } from 'react';
import axios from 'axios'; // Precisamos do axios aqui

// O componente agora recebe a função 'onPhotoUpload' via props
function UploadForm({ onPhotoUpload }) {
  const [userText, setUserText] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    // 1. Criamos a "caixa" FormData
    const formData = new FormData();
    formData.append('text', userText); // Lembre-se que 'text' e 'image' são os nomes dos campos no seu model Photo
    formData.append('image', imageFile);

    try {
      // 2. Enviamos o FormData para a API com axios.post
      const response = await axios.post('http://127.0.0.1:8000/api/photos/', formData);

      // 3. Se deu certo, chamamos a função do componente pai!, usado basicamente como canal de comunicação(Lifting State Up)
      onPhotoUpload(response.data);

      alert('Foto enviada com sucesso!');
      // Limpamos o formulário
      setUserText('');
      setImageFile(null);
      document.getElementById('image-file').value = ''; // Truque para limpar o input de arquivo

    } catch (error) {
      console.error('Erro no upload:', error.response.data);
      alert('Falha no upload da foto.');
    }
  };

  // O JSX do return continua o mesmo de antes
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h2>Adicionar Nova Foto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user-text">Descrição:</label><br />
          <input id="user-text" type="text" value={userText} onChange={(e) => setUserText(e.target.value)} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="image-file">Imagem:</label><br />
          <input id="image-file" type="file" accept="image/png, image/jpeg" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <button type="submit" style={{ marginTop: '15px' }}>Enviar</button>
      </form>
    </div>
  );
}

export default UploadForm;