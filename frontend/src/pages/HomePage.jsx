import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Users, Search, Upload, Clock, TrendingUp } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalPeople: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchRecentPhotos();
    fetchStats();
  }, []);

  const fetchRecentPhotos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/photos/');
      if (response.ok) {
        const data = await response.json();
        setRecentPhotos(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Erro ao buscar fotos recentes:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const photosResponse = await fetch('http://localhost:8000/api/photos/');
      const peopleResponse = await fetch('http://localhost:8000/api/persons/');
      
      if (photosResponse.ok && peopleResponse.ok) {
        const photos = await photosResponse.json();
        const people = await peopleResponse.json();
        
        const thisMonth = photos.filter(photo => {
          const photoDate = new Date(photo.uploaded_at);
          const now = new Date();
          return photoDate.getMonth() === now.getMonth() && 
                 photoDate.getFullYear() === now.getFullYear();
        }).length;
        
        setStats({
          totalPhotos: photos.length,
          totalPeople: people.length,
          thisMonth
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-icon">
            <Camera size={48} />
          </div>
          <h1 className="hero-title">LipeNet</h1>
          <p className="hero-subtitle">Memórias em Família</p>
          <p className="hero-description">
            Organize, encontre e compartilhe suas memórias familiares com inteligência artificial
          </p>
          
          <div className="hero-actions">
            <button 
              className="hero-btn primary"
              onClick={() => navigate('/search')}
            >
              <Search size={20} />
              Pesquisa Inteligente
            </button>
            <button 
              className="hero-btn secondary"
              onClick={() => navigate('/upload')}
            >
              <Upload size={20} />
              Adicionar Fotos
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Camera />
              </div>
              <div className="stat-info">
                <h3>{stats.totalPhotos}</h3>
                <p>Fotos na galeria</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-info">
                <h3>{stats.totalPeople}</h3>
                <p>Pessoas identificadas</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-info">
                <h3>{stats.thisMonth}</h3>
                <p>Adicionadas este mês</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="container">
          <h2 className="section-title">O que você deseja fazer?</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/gallery')}>
              <Camera className="action-icon" />
              <h3>Ver Galeria</h3>
              <p>Explore todas as suas fotos organizadas</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/search')}>
              <Search className="action-icon" />
              <h3>Buscar Memórias</h3>
              <p>Encontre fotos usando linguagem natural</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/upload')}>
              <Upload className="action-icon" />
              <h3>Adicionar Fotos</h3>
              <p>Faça upload de novas memórias</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/people')}>
              <Users className="action-icon" />
              <h3>Gerenciar Pessoas</h3>
              <p>Organize e identifique pessoas nas fotos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Photos */}
      {recentPhotos.length > 0 && (
        <section className="recent-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <Clock size={24} />
                Adicionadas Recentemente
              </h2>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/gallery')}
              >
                Ver todas →
              </button>
            </div>
            
            <div className="recent-grid">
              {recentPhotos.map(photo => (
                <div key={photo.id} className="recent-photo">
                  <img 
                    src={`http://localhost:8000${photo.image}`}
                    alt={photo.description || 'Foto'}
                  />
                  <div className="recent-overlay">
                    <p>{new Date(photo.uploaded_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


export default HomePage;