import { useState, useEffect, useRef } from "react";
import { UserCircle, Camera, Edit2, Save, X, Users, Upload, Check, Trash2, UserPlus } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManagePeoplePage.css";

function ManagePeoplePage() {
  const [people, setPeople] = useState([]);
  const [editingName, setEditingName] = useState({});
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState(null);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [hiddenPeople, setHiddenPeople] = useState([]);
  const [addingPersonId, setAddingPersonId] = useState(null);
  const [deletingPersonId, setDeletingPersonId] = useState(null);
  const fileInputRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/persons/");
      setPeople(response.data);
    } catch (err) {
      console.error("Erro ao buscar pessoas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (id, name) => {
    setEditingName({ ...editingName, [id]: name });
  };

  const handleUpdateName = async (id) => {
    const newName = editingName[id];
    if (!newName || newName.trim() === "") return;

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/persons/${id}/`,
        {
          name: newName.trim(),
        }
      );

      // Atualiza a lista de pessoas com os dados completos retornados do backend
      setPeople(people.map((p) => (p.id === id ? { ...p, ...response.data } : p)));
      setEditingPersonId(null);
      setEditingName({ ...editingName, [id]: "" });
    } catch (err) {
      console.error("Erro ao atualizar nome:", err);
      alert("Erro ao atualizar o nome da pessoa");
    }
  };

  const cancelEdit = (id) => {
    setEditingPersonId(null);
    setEditingName({ ...editingName, [id]: "" });
  };

  const handlePhotoUpload = async (personId, file) => {
    if (!file) return;

    setUploadingPhotoFor(personId);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', `Foto de perfil`);

    try {
      // Upload da nova foto
      const uploadResponse = await axios.post(
        'http://127.0.0.1:8000/api/photos/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const newPhotoId = uploadResponse.data.id;

      // Atualizar a pessoa para usar esta foto como principal
      const updateResponse = await axios.patch(
        `http://127.0.0.1:8000/api/persons/${personId}/`,
        {
          photo_principal: newPhotoId
        }
      );

      // Atualizar o estado local
      setPeople(people.map((p) => 
        p.id === personId 
          ? { ...p, representative_photo: uploadResponse.data.image }
          : p
      ));

      setUploadingPhotoFor(null);
    } catch (err) {
      console.error("Erro ao fazer upload da foto:", err);
      setUploadingPhotoFor(null);
    }
  };

  const triggerFileInput = (personId) => {
    if (fileInputRefs.current[personId]) {
      fileInputRefs.current[personId].click();
    }
  };

  const navigateToPersonPhotos = (personId) => {
    navigate(`/people/${personId}`);
  };

  const handleDeletePerson = async (personId, personName) => {
    if (window.confirm(`Tem certeza que deseja deletar ${personName}?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/persons/${personId}/`);
        setPeople(people.filter(p => p.id !== personId));
      } catch (err) {
        console.error("Erro ao deletar pessoa:", err);
        alert("Erro ao deletar pessoa");
      }
    }
  };

  const fetchHiddenPeople = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/persons/hidden/");
      setHiddenPeople(response.data);
    } catch (err) {
      console.error("Erro ao buscar pessoas ocultas:", err);
    }
  };

  const handleOpenAddPersonModal = () => {
    setShowAddPersonModal(true);
    fetchHiddenPeople();
  };

  const handleAddPersonManually = async (personId) => {
    setAddingPersonId(personId);
    try {
      await axios.post(`http://127.0.0.1:8000/api/persons/${personId}/add-manually/`);
      
      // Recarrega as listas
      await fetchPeople();
      await fetchHiddenPeople();
      
      // Remove a pessoa da lista de ocultas
      setHiddenPeople(hiddenPeople.filter(p => p.id !== personId));
    } catch (err) {
      console.error("Erro ao adicionar pessoa:", err);
      alert("Erro ao adicionar pessoa");
    } finally {
      setAddingPersonId(null);
    }
  };

  const handleDeletePersonFromModal = async (personId, personName) => {
    if (window.confirm(`Tem certeza que deseja deletar ${personName} permanentemente?`)) {
      setDeletingPersonId(personId);
      try {
        await axios.delete(`http://127.0.0.1:8000/api/persons/${personId}/`);
        // Remove a pessoa da lista de ocultas
        setHiddenPeople(hiddenPeople.filter(p => p.id !== personId));
      } catch (err) {
        console.error("Erro ao deletar pessoa:", err);
        alert("Erro ao deletar pessoa");
      } finally {
        setDeletingPersonId(null);
      }
    }
  };

  if (isLoading) {
    return <PeoplePageSkeleton />;
  }

  if (!people || people.length === 0) {
    return (
      <div className="people-empty-state">
        <Users size={80} />
        <h2>Nenhuma pessoa identificada ainda</h2>
        <p>As pessoas aparecem aqui quando são identificadas em 2 ou mais fotos</p>
        <Link to="/upload" className="empty-state-btn">
          <Camera size={20} />
          Adicionar Fotos
        </Link>
      </div>
    );
  }

  return (
    <div className="people-page">
      <header className="people-header">
        <div className="header-content">
          <div className="header-title">
            <Users size={32} />
            <div>
              <h1>Pessoas da Família</h1>
              <p className="header-subtitle">
                {people.length} {people.length === 1 ? "pessoa identificada" : "pessoas identificadas"}
              </p>
            </div>
          </div>
          <button 
            className="add-person-btn"
            onClick={handleOpenAddPersonModal}
          >
            <UserPlus size={20} />
            Adicionar Pessoas
          </button>
        </div>
      </header>

      <div className="people-container">
        {people.map((person) => {
          const isEditing = person.id === editingPersonId;
          const photoCount = person.photo_count || 0;
          const photoUrl = person.representative_photo || person.first_photo;
          const isUploading = uploadingPhotoFor === person.id;

          return (
            <article key={person.id} className="person-card">
              {/* Foto com Hover para Ver Fotos */}
              <div 
                className="person-visual"
                onClick={() => navigateToPersonPhotos(person.id)}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={person.name}
                    className="person-image"
                  />
                ) : (
                  <div className="person-avatar">
                    <UserCircle size={60} />
                  </div>
                )}
                
                {/* Overlay de Ver Fotos */}
                <div className="person-overlay">
                  <div className="overlay-content">
                    <Camera size={24} />
                    <span>Ver Fotos</span>
                  </div>
                </div>
                
                {/* Badge de contagem */}
                <div className="photo-count-badge">
                  <Camera size={14} />
                  <span>{photoCount}</span>
                </div>

                {/* Botão de Upload de Foto */}
                <button 
                  className="upload-photo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput(person.id);
                  }}
                  title="Alterar foto de perfil"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="upload-spinner"></div>
                  ) : (
                    <Upload size={16} />
                  )}
                </button>

                {/* Input file oculto */}
                <input
                  ref={(el) => fileInputRefs.current[person.id] = el}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePhotoUpload(person.id, e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Informações e Edição de Nome */}
              <div className="person-details">
                {isEditing ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      className="name-input"
                      defaultValue={person.name}
                      onChange={(e) => handleNameChange(person.id, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateName(person.id)}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        className="icon-btn save"
                        onClick={() => handleUpdateName(person.id)}
                        title="Salvar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="icon-btn cancel"
                        onClick={() => cancelEdit(person.id)}
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="person-info">
                      <h3 className="person-name">{person.name}</h3>
                      <p className="person-stats">
                        {photoCount === 0 && "Sem fotos ainda"}
                        {photoCount === 1 && "1 foto"}
                        {photoCount > 1 && `${photoCount} fotos`}
                      </p>
                    </div>
                    <div className="person-actions">
                      <button
                        className="edit-name-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPersonId(person.id);
                          handleNameChange(person.id, person.name);
                        }}
                        title="Editar nome"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="delete-person-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePerson(person.id, person.name);
                        }}
                        title="Deletar pessoa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal para adicionar pessoas */}
      {showAddPersonModal && (
        <div className="modal-overlay" onClick={() => setShowAddPersonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Pessoas</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddPersonModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {hiddenPeople.length === 0 ? (
                <div className="modal-empty">
                  <Users size={48} />
                  <p>Não há pessoas ocultas para adicionar</p>
                  <span className="modal-hint">
                    Pessoas com 1 foto aparecem aqui para adição manual
                  </span>
                </div>
              ) : (
                <div className="hidden-people-list">
                  {hiddenPeople.map((person) => (
                    <div key={person.id} className="hidden-person-card">
                      <div className="person-info">
                        {person.representative_photo || person.first_photo ? (
                          <img
                            src={person.representative_photo || person.first_photo}
                            alt={person.name}
                            className="person-thumbnail"
                          />
                        ) : (
                          <div className="person-avatar-small">
                            <UserCircle size={40} />
                          </div>
                        )}
                        <div className="person-details">
                          <h3>{person.name}</h3>
                          <span className="person-photo-count">
                            {person.photo_count || 0} {person.photo_count === 1 ? 'foto' : 'fotos'}
                          </span>
                        </div>
                      </div>
                      <div className="modal-person-actions">
                        <button 
                          className="add-person-action-btn"
                          onClick={() => handleAddPersonManually(person.id)}
                          disabled={addingPersonId === person.id || deletingPersonId === person.id}
                        >
                          {addingPersonId === person.id ? (
                            <>
                              <div className="spinner-small"></div>
                              Adicionando...
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} />
                              Cadastrar Pessoa
                            </>
                          )}
                        </button>
                        <button 
                          className="delete-person-modal-btn"
                          onClick={() => handleDeletePersonFromModal(person.id, person.name)}
                          disabled={deletingPersonId === person.id || addingPersonId === person.id}
                        >
                          {deletingPersonId === person.id ? (
                            <>
                              <div className="spinner-small"></div>
                              Deletando...
                            </>
                          ) : (
                            <>
                              <Trash2 size={18} />
                              Deletar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Skeleton para carregamento
function PeoplePageSkeleton() {
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="people-page">
      <header className="people-header">
        <div className="header-content">
          <div className="skeleton skeleton-header"></div>
        </div>
      </header>
      
      <div className="people-container">
        {skeletonItems.map((item) => (
          <div key={item} className="person-card skeleton">
            <div className="skeleton-photo"></div>
            <div className="skeleton-info">
              <div className="skeleton-name"></div>
              <div className="skeleton-stats"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagePeoplePage;