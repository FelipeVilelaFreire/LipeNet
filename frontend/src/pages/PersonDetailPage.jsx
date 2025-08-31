import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera, User, Calendar, Upload, X, Check } from 'lucide-react';
import axios from 'axios';
import PhotoCard from '../components/PhotoCard';
import './PersonDetailPage.css';

function PersonDetailPage() {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPersonAndPhotos();
  }, [personId]);

  const fetchPersonAndPhotos = async () => {
    setLoading(true);
    try {
      // Busca os detalhes da pessoa
      const personRes = await axios.get(`http://127.0.0.1:8000/api/persons/${personId}/`);
      setPerson(personRes.data);
      
      // Busca as fotos daquela pessoa
      const photosRes = await axios.get(`http://127.0.0.1:8000/api/persons/${personId}/photos/`);
      setPhotos(photosRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePhoto = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('photo_principal', selectedFile);

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/persons/${personId}/update-photo/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Recarregar dados da pessoa
      const personRes = await axios.get(`http://127.0.0.1:8000/api/persons/${personId}/`);
      setPerson(personRes.data);
      
      // Fechar modal e limpar estado
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      alert('Erro ao atualizar foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <div className="person-detail-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="person-detail-error">
        <User size={60} />
        <h2>Pessoa não encontrada</h2>
        <Link to="/people" className="back-link">
          <ArrowLeft size={20} />
          Voltar para Pessoas
        </Link>
      </div>
    );
  }

  const photoUrl = person.photo_principal || person.representative_photo || person.first_photo;

  return (
    <div className="person-detail-page">
      {/* Header com navegação */}
      <div className="detail-navigation">
        <div className="nav-container">
          <Link to="/people" className="back-button">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      {/* Informações da Pessoa */}
      <div className="person-detail-header">
        <div className="header-container">
          <div className="person-profile">
            <div className="profile-image-container">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={person.name}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <User size={60} />
                </div>
              )}
              
              {/* Botão de trocar foto */}
              <button 
                className="change-photo-btn"
                onClick={() => setShowUploadModal(true)}
                title="Trocar foto de perfil"
              >
                <Camera size={18} />
              </button>
            </div>
            
            <div className="profile-info">
              <h1 className="person-title">{person.name}</h1>
              <div className="person-stats">
                <div className="stat-item">
                  <Camera size={18} />
                  <span>{photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</span>
                </div>
                <div className="stat-item">
                  <Calendar size={18} />
                  <span>Membro da família</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upload de Foto */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={closeModal}>
          <div className="upload-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Alterar Foto de Perfil</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {!previewUrl ? (
                <div 
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} />
                  <p>Clique para selecionar uma foto</p>
                  <span>JPG, PNG ou GIF - Máx 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="preview-container">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="preview-image"
                  />
                  <button 
                    className="change-image-btn"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      fileInputRef.current?.click();
                    }}
                  >
                    Escolher outra foto
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={closeModal}
                disabled={uploading}
              >
                Cancelar
              </button>
              <button 
                className="save-btn" 
                onClick={handleUploadProfilePhoto}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <div className="button-spinner"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Salvar Foto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galeria de Fotos */}
      <div className="person-photos-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Fotos de {person.name}</h2>
            <p className="section-subtitle">
              {photos.length === 0 
                ? 'Nenhuma foto encontrada' 
                : `${photos.length} ${photos.length === 1 ? 'memória registrada' : 'memórias registradas'}`
              }
            </p>
          </div>

          {photos.length > 0 ? (
            <div className="photos-grid">
              {photos.map(photo => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  photos={photos}
                  currentIndex={photos.findIndex(p => p.id === photo.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-photos">
              <Camera size={60} />
              <h3>Ainda não há fotos</h3>
              <p>As fotos de {person.name} aparecerão aqui quando forem identificadas</p>
              <Link to="/upload" className="upload-link">
                Adicionar Fotos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonDetailPage;