// Arquivo: src/components/UploadForm.jsx
import { useState, useRef } from "react";
import axios from "axios";
import "./UploadForm.css";

function UploadForm({ onPhotoUpload }) {
  const [userText, setUserText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, selecione apenas arquivos de imagem.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("text", userText);
    formData.append("image", imageFile);

    try {
      // Simular progresso do upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/photos/",
        formData
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onPhotoUpload(response.data);
        alert("Foto enviada com sucesso!");
        resetForm();
      }, 500);
    } catch (error) {
      console.error("Erro no upload:", error.response?.data || error);
      alert("Falha no upload da foto.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setUserText("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Compartilhe Suas Memórias</h2>
        <p>Faça upload de fotos para criar momentos especiais em família</p>
      </div>

      <div className="upload-form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Área de Drag & Drop */}
          <div
            className={`drag-drop-area ${dragActive ? "drag-active" : ""} ${
              imagePreview ? "has-preview" : ""
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {!imagePreview ? (
              <div className="drag-content">
                <div className="drag-icon">📸</div>
                <h3>Arraste sua foto aqui</h3>
                <p>ou clique para selecionar</p>
                <span className="drag-hint">Suporta JPG, PNG</span>
              </div>
            ) : (
              <div className="preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileInputChange}
              className="file-input"
            />
          </div>

          {/* Campo de Descrição */}
          <div className="form-group">
            <label htmlFor="description">Descrição da Foto</label>
            <textarea
              id="description"
              placeholder="Conte a história por trás desta foto... (ex: Eu e Belinha na praia, um dia incrível!)"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              required
              rows="3"
              className="description-input"
            />
          </div>

          {/* Barra de Progresso */}
          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                Enviando... {uploadProgress}%
              </span>
            </div>
          )}

          {/* Botão de Envio */}
          <button
            type="submit"
            className={`submit-btn ${isUploading ? "uploading" : ""}`}
            disabled={isUploading || !imageFile}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                Enviando...
              </>
            ) : (
              "Compartilhar Foto"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;
