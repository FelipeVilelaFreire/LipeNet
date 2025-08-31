import { useState, useEffect, useCallback } from 'react';
import { Camera, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Search, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhotoCard from '../components/PhotoCard';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoadingMore) {
        return;
      }
      if (hasMore && !isLoadingMore) {
        fetchPosts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, isLoadingMore]);

  const fetchPosts = async (pageNum, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/photos/?page=${pageNum}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        
        // Se a API não tiver paginação, simula com slice
        const allPhotos = Array.isArray(data) ? data : data.results;
        const startIndex = (pageNum - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedData = allPhotos.slice(startIndex, endIndex);
        
        if (isInitial) {
          setPosts(paginatedData);
        } else {
          setPosts(prev => [...prev, ...paginatedData]);
        }
        
        setPage(pageNum);
        setHasMore(paginatedData.length === 10);
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const PostFeed = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const imageUrl = post.image && post.image.startsWith('http') 
      ? post.image 
      : post.image 
        ? `http://localhost:8000${post.image}`
        : '/placeholder.jpg';

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 7) return `${diffDays} dias atrás`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
      return `${Math.floor(diffDays / 365)} anos atrás`;
    };

    return (
      <>
        <article className="feed-post">
          <header className="post-header">
            <div className="post-user">
              <div className="user-avatar">
                <Camera size={20} />
              </div>
              <div className="user-info">
                <h3>LipeNet Gallery</h3>
                <span className="post-time">{formatDate(post.created_at)}</span>
              </div>
            </div>
            <button className="post-options">
              <MoreHorizontal size={20} />
            </button>
          </header>

          <div className="post-image" onClick={() => setShowModal(true)}>
            <img src={imageUrl} alt={post.text || "Foto"} />
            {post.persons && post.persons.length > 0 && (
              <div className="post-tagged">
                <span className="tagged-count">
                  {post.persons.length} {post.persons.length === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>
            )}
          </div>

          <div className="post-actions">
            <div className="actions-left">
              <button 
                className={`action-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={24} fill={liked ? '#e74c3c' : 'none'} />
              </button>
              <button className="action-btn" onClick={() => setShowModal(true)}>
                <MessageCircle size={24} />
              </button>
              <button className="action-btn">
                <Share2 size={24} />
              </button>
            </div>
            <button 
              className={`action-btn ${saved ? 'saved' : ''}`}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark size={24} fill={saved ? '#333' : 'none'} />
            </button>
          </div>

          <div className="post-content">
            {post.caption && (
              <div className="post-caption">
                <p>{post.caption}</p>
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="feed-tag">#{tag}</span>
                ))}
              </div>
            )}

            {post.text && (
              <div className="post-description">
                <strong>Descrição:</strong> {post.text}
              </div>
            )}
          </div>
        </article>

        {showModal && (
          <div className="feed-modal" onClick={() => setShowModal(false)}>
            <div className="feed-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              <div className="modal-grid">
                <div className="modal-image-side">
                  <img src={imageUrl} alt={post.text || "Foto"} />
                </div>
                <div className="modal-info-side">
                  <header className="modal-header">
                    <div className="post-user">
                      <div className="user-avatar">
                        <Camera size={20} />
                      </div>
                      <div className="user-info">
                        <h3>LipeNet Gallery</h3>
                        <span className="post-time">{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </header>
                  
                  <div className="modal-body">
                    {post.caption && (
                      <div className="modal-caption">
                        <p>{post.caption}</p>
                      </div>
                    )}
                    
                    {post.text && (
                      <div className="modal-description">
                        <h4>Descrição</h4>
                        <p>{post.text}</p>
                      </div>
                    )}
                    
                    {post.persons && post.persons.length > 0 && (
                      <div className="modal-people">
                        <h4>Pessoas na foto</h4>
                        <div className="people-list">
                          {post.persons.map((person, index) => (
                            <span key={index} className="person-tag">{person}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="modal-tags">
                        <h4>Tags</h4>
                        <div className="tags-list">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="modal-tag">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      className={`action-btn ${liked ? 'liked' : ''}`}
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart size={24} fill={liked ? '#e74c3c' : 'none'} />
                    </button>
                    <button className="action-btn">
                      <MessageCircle size={24} />
                    </button>
                    <button className="action-btn">
                      <Share2 size={24} />
                    </button>
                    <button 
                      className={`action-btn ${saved ? 'saved' : ''}`}
                      onClick={() => setSaved(!saved)}
                    >
                      <Bookmark size={24} fill={saved ? '#333' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="home-feed">
      <header className="feed-header">
        <div className="header-container">
          <div className="header-logo">
            <Camera size={32} />
            <h1>LipeNet</h1>
          </div>
          <div className="header-actions">
            <button 
              className="header-btn"
              onClick={() => navigate('/search')}
              title="Pesquisar"
            >
              <Search size={24} />
            </button>
            <button 
              className="header-btn primary"
              onClick={() => navigate('/upload')}
              title="Adicionar foto"
            >
              <Upload size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="feed-container">
        {loading ? (
          <div className="feed-loading">
            <div className="loading-spinner"></div>
            <p>Carregando suas memórias...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="feed-empty">
            <Camera size={64} />
            <h2>Nenhuma foto ainda</h2>
            <p>Comece adicionando suas primeiras memórias familiares</p>
            <button 
              className="empty-cta"
              onClick={() => navigate('/upload')}
            >
              <Upload size={20} />
              Adicionar Primeira Foto
            </button>
          </div>
        ) : (
          <>
            <div className="feed-posts">
              {posts.map(post => (
                <PostFeed key={post.id} post={post} />
              ))}
            </div>
            
            {isLoadingMore && (
              <div className="loading-more">
                <div className="loading-spinner small"></div>
                <p>Carregando mais...</p>
              </div>
            )}
            
            {!hasMore && posts.length > 0 && (
              <div className="feed-end">
                <p>Você viu todas as fotos!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;