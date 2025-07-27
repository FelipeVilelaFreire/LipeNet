// Arquivo: src/components/UploadForm.jsx
import { useState } from 'react';

function UploadForm() {
  // 1. Criamos um 'state' para cada campo do nosso formulário
  const [userText, setUserText] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // 2. Função que será chamada quando o formulário for enviado
  const handleSubmit = (event) => {
    // 3. Previne o comportamento padrão do navegador de recarregar a página
    event.preventDefault();

    // Verificamos se uma imagem foi selecionada
    if (!imageFile) {
      alert("Por favor, selecione uma imagem antes de enviar.");
      return;
    }

    // Por enquanto, vamos apenas mostrar os dados capturados no console
    console.log("--- Dados do Formulário Enviados ---");
    console.log("Texto do usuário:", userText);
    console.log("Arquivo da imagem:", imageFile);
    console.log("------------------------------------");
    alert("Formulário enviado! Verifique o console do desenvolvedor (F12).");
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h2>Adicionar Nova Foto</h2>
      {/* 4. Conectamos nossa função ao evento 'onSubmit' do formulário */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user-text">Descrição:</label>
          <br />
          {/* 5. Este é um COMPONENTE CONTROLADO */}
          <input
            id="user-text"
            type="text"
            value={userText} // O valor do input é ditado pelo nosso estado
            onChange={(e) => setUserText(e.target.value)} // Quando o usuário digita, atualizamos o estado
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="image-file">Imagem:</label>
          <br />
          {/* O input de arquivo é um pouco diferente, não usamos 'value' */}
          <input
            id="image-file"
            type="file"
            accept="image/png, image/jpeg" // Aceita apenas imagens
            onChange={(e) => setImageFile(e.target.files[0])} // Pegamos o primeiro arquivo selecionado
          />
        </div>
        <button type="submit" style={{ marginTop: '15px' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default UploadForm;