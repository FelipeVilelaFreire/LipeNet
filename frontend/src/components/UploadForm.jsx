// Arquivo: src/components/UploadForm.jsx
import { useState } from 'react';
import axios from 'axios';
// Importe os componentes de formulário do React-Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function UploadForm({ onPhotoUpload }) {
  const [userText, setUserText] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // SUA LÓGICA 'handleSubmit' CONTINUA A MESMA
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }
    const formData = new FormData();
    formData.append('text', userText);
    formData.append('image', imageFile);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/photos/', formData);
      onPhotoUpload(response.data);
      alert('Foto enviada com sucesso!');
      setUserText('');
      setImageFile(null);
      document.getElementById('image-file').value = '';
    } catch (error) {
      console.error('Erro no upload:', error.response.data);
      alert('Falha no upload da foto.');
    }
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Adicionar Nova Foto</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUserText">
            <Form.Label>Descrição:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Eu e Belinha na praia"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image-file">
            <Form.Label>Imagem:</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Enviar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UploadForm;