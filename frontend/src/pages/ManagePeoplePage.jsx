// Arquivo: frontend/src/pages/ManagePeoplePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagePeoplePage.css';
import { FaPen, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importe o Link!

function ManagePeoplePage() {
  // A LÓGICA DE REACT (useState, useEffect, handlers) CONTINUA A MESMA
  const [people, setPeople] = useState([]);
  const [editingName, setEditingName] = useState({});
  const [editingPersonId, setEditingPersonId] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/persons/')
      .then(res => setPeople(res.data))
      .catch(err => console.error("Erro ao buscar pessoas:", err));
  }, []);

  const handleNameChange = (id, name) => {
    setEditingName({ ...editingName, [id]: name });
  };

  const handleUpdateName = (id) => {
    const newName = editingName[id];
    if (!newName) return;

    axios.patch(`http://127.0.0.1:8000/api/persons/${id}/`, { name: newName })
      .then(res => {
        setPeople(people.map(p => p.id === id ? res.data : p));
        setEditingPersonId(null);
        alert("Nome atualizado com sucesso!");
      })
      .catch(err => {
          console.error(err);
          alert("Falha ao atualizar o nome.");
      });
  };

  return (
    <div className="people-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Gerenciar Pessoas</h2>
      <div className="people-list">
        {people.map(person => {
          const isEditing = person.id === editingPersonId;

          return (
            // O item da lista agora é o container principal
            <div key={person.id} className="people-list-item">

              {/* O Link envolve a imagem e o nome para torná-los clicáveis */}
              <Link to={`/people/${person.id}`} className="person-link">
                <img
                  src={person.representative_photo || 'https://via.placeholder.com/150'}
                  alt={person.name}
                  className="person-avatar"
                />
              </Link>

              {isEditing ? (
                <input
                  className="edit-input"
                  type="text"
                  defaultValue={person.name}
                  onChange={(e) => handleNameChange(person.id, e.target.value)}
                  // Impede que o clique no input acione o link
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <Link to={`/people/${person.id}`} className="person-link">
                    <span className="person-name-display">{person.name}</span>
                </Link>
              )}

              {/* Os botões de ação ficam fora do Link */}
              <div className="edit-button-container">
                {isEditing ? (
                  <button className="icon-button" onClick={() => handleUpdateName(person.id)}>
                    <FaSave />
                  </button>
                ) : (
                  <button className="icon-button" onClick={() => {
                    setEditingPersonId(person.id);
                    handleNameChange(person.id, person.name);
                  }}>
                    <FaPen />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManagePeoplePage;