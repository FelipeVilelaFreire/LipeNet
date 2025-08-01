// Arquivo: src/components/SearchBar.jsx
import { useState } from 'react';
import './SearchBar.css';

// O componente recebe uma função 'onSearch' via props do pai (App.jsx)
function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // Limpa o "timer" antigo a cada nova letra digitada
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Cria um novo "timer"
    const newTimeout = setTimeout(() => {
      // Quando o timer terminar, chama a função de busca do pai
      onSearch(newSearchTerm);
    }, 500); // Espera 500ms (meio segundo)

    setDebounceTimeout(newTimeout);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Pesquisar por pessoas, lugares ou objetos..."
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;