import { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiImage, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

function UploadPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecione apenas arquivos de imagem.');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('text', description);
    if (location) {
      formData.append('location', location);
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/photos/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar a foto. Por favor, tente novamente.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setDescription('');
    setLocation('');
    setUploadProgress(0);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadSuccess) {
    return (
      <div className="upload-page">
        <div className="upload-success">
          <div className="success-icon">
            <FiCheck />
          </div>
          <h2>Upload Concluído!</h2>
          <p>Sua foto foi enviada com sucesso e está sendo processada.</p>
          <button onClick={resetForm} className="btn btn-primary">
            Enviar Outra Foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Compartilhe suas memórias</h1>
          <p className="text-muted">
            Adicione fotos à sua galeria familiar e deixe a IA organizar tudo para você
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`dropzone ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-preview' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            {!imagePreview ? (
              <div className="dropzone-content">
                <FiUploadCloud className="dropzone-icon" />
                <h3>Arraste sua foto aqui</h3>
                <p>ou clique para selecionar</p>
                <span className="file-types">JPG, PNG, GIF até 10MB</span>
              </div>
            ) : (
              <div className="preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <FiX />
                </button>
                <div className="image-info">
                  <FiImage />
                  <span>{imageFile.name}</span>
                  <span className="file-size">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="file-input-hidden"
            />
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                placeholder="Conte a história por trás desta foto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-textarea"
              />
              <span className="field-hint">
                A IA usará esta descrição para melhorar a busca
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="location">Local (opcional)</label>
              <input
                id="location"
                type="text"
                placeholder="Ex: Praia de Copacabana, Rio de Janeiro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {isUploading && (
            <div className="upload-progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">
                Enviando... {uploadProgress}%
              </span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!imageFile || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <FiUploadCloud />
                  Enviar Foto
                </>
              )}
            </button>
          </div>
        </form>

        <div className="upload-tips">
          <h4>Dicas para melhores resultados:</h4>
          <ul>
            <li>Use fotos de alta qualidade para melhor reconhecimento facial</li>
            <li>Adicione descrições detalhadas para facilitar a busca</li>
            <li>Inclua o local para organizar por eventos e viagens</li>
            <li>A IA identificará automaticamente pessoas e objetos na foto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;