import { useState, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';
import PhotoCard from '../components/PhotoCard';
import debounce from 'lodash.debounce';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSuggestions] = useState([
    'vovô com o cachorro no parque',
    'aniversário da mamãe',
    'férias na praia 2024',
    'primeiro dia de aula',
    'Natal em família'
  ]);

  const performSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const response = await fetch(`http://localhost:8000/api/search/?query=${encodeURIComponent(term)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Erro na pesquisa:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    performSearch(suggestion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-icon-wrapper">
          <Sparkles className="search-sparkle" />
        </div>
        <h1 className="search-title">Pesquisa Inteligente</h1>
        <p className="search-subtitle">Encontre suas memórias usando linguagem natural</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Search className="search-input-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Ex: "fotos do João brincando no jardim" ou "aniversário da Ana"'
              className="search-input"
            />
            <button type="submit" className="search-button">
              Buscar
            </button>
          </div>
        </form>

        {!hasSearched && (
          <div className="search-suggestions">
            <p className="suggestions-label">Experimente pesquisar por:</p>
            <div className="suggestions-list">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isSearching && (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Buscando suas memórias...</p>
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            <>
              <h2 className="results-title">
                {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} encontrados
              </h2>
              <div className="results-grid">
                {searchResults.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            </>
          ) : searchTerm && (
            <div className="no-results">
              <p>Nenhuma foto encontrada para "{searchTerm}"</p>
              <p className="no-results-hint">Tente usar palavras diferentes ou mais detalhes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;