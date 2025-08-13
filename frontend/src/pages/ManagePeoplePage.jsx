// Arquivo: frontend/src/pages/ManagePeoplePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePeoplePage.css";
import { FaPen, FaSave, FaTimes, FaUser, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

function ManagePeoplePage() {
  const [people, setPeople] = useState([]);
  const [editingName, setEditingName] = useState({});
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

      setPeople(people.map((p) => (p.id === id ? response.data : p)));
      setEditingPersonId(null);
      setEditingName({ ...editingName, [id]: "" });

      // Feedback visual de sucesso
      showSuccessMessage("Nome atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      showErrorMessage("Falha ao atualizar o nome.");
    }
  };

  const cancelEdit = (id) => {
    setEditingPersonId(null);
    setEditingName({ ...editingName, [id]: "" });
  };

  const showSuccessMessage = (message) => {
    // Implementar toast de sucesso se necessário
    alert(message);
  };

  const showErrorMessage = (message) => {
    // Implementar toast de erro se necessário
    alert(message);
  };

  if (isLoading) {
    return <PeoplePageSkeleton />;
  }

  if (!people || people.length === 0) {
    return (
      <div className="people-empty-state">
        <div className="empty-state-icon">👥</div>
        <h3>Nenhuma pessoa cadastrada</h3>
        <p>As pessoas detectadas nas fotos aparecerão aqui automaticamente!</p>
      </div>
    );
  }

  return (
    <div className="people-container">
      <div className="people-header">
        <h2>Nossa Família</h2>
        <p className="people-subtitle">
          {people.length} {people.length === 1 ? "pessoa" : "pessoas"} em nossa
          rede
        </p>
      </div>

      <div className="people-grid">
        {people.map((person) => {
          const isEditing = person.id === editingPersonId;
          const photoCount = person.photo_count || 0;

          return (
            <div key={person.id} className="person-card">
              {/* Foto da Pessoa */}
              <Link to={`/people/${person.id}`} className="person-photo-link">
                <div className="person-photo-container">
                  {person.representative_photo ? (
                    <img
                      src={person.representative_photo}
                      alt={person.name}
                      className="person-photo"
                    />
                  ) : (
                    <div className="person-photo-placeholder">
                      <FaUser className="placeholder-icon" />
                    </div>
                  )}
                  <div className="photo-count-badge">
                    <FaCamera />
                    <span>{photoCount}</span>
                  </div>
                </div>
              </Link>

              {/* Informações da Pessoa */}
              <div className="person-info">
                {isEditing ? (
                  <div className="edit-container">
                    <input
                      className="edit-input"
                      type="text"
                      defaultValue={person.name}
                      onChange={(e) =>
                        handleNameChange(person.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        className="action-btn save-btn"
                        onClick={() => handleUpdateName(person.id)}
                        title="Salvar"
                      >
                        <FaSave />
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => cancelEdit(person.id)}
                        title="Cancelar"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="person-details">
                    <Link
                      to={`/people/${person.id}`}
                      className="person-name-link"
                    >
                      <h3 className="person-name">{person.name}</h3>
                    </Link>
                    <p className="person-stats">
                      {photoCount} {photoCount === 1 ? "foto" : "fotos"}
                    </p>
                    <button
                      className="edit-name-btn"
                      onClick={() => {
                        setEditingPersonId(person.id);
                        handleNameChange(person.id, person.name);
                      }}
                      title="Editar nome"
                    >
                      <FaPen />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente Skeleton para carregamento
function PeoplePageSkeleton() {
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="people-container">
      <div className="people-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>

      <div className="people-grid">
        {skeletonItems.map((item) => (
          <div key={item} className="person-card skeleton-card">
            <div className="skeleton-photo"></div>
            <div className="skeleton-content">
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
