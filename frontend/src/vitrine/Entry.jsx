import { useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Camera, 
  Users, 
  Search, 
  Shield, 
  Sparkles, 
  Heart,
  Cloud,
  Brain,
  Share2,
  Lock,
  Zap,
  Image,
  Star,
  Award,
  TrendingUp,
  Globe,
  Smile,
  Clock,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import './Entry.css';

gsap.registerPlugin(ScrollTrigger);

function Entry() {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reset inicial
      gsap.set('.hero-badge, .hero-title, .hero-subtitle, .hero-cta > *, .hero-stat', {
        opacity: 0,
        y: 30
      });

      // Hero Timeline
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      heroTl
        .to('.hero-badge', {
          opacity: 1,
          y: 0,
          duration: 0.8
        })
        .to('.hero-title', {
          opacity: 1,
          y: 0,
          duration: 1
        }, '-=0.4')
        .to('.hero-subtitle', {
          opacity: 1,
          y: 0,
          duration: 0.8
        }, '-=0.6')
        .to('.hero-cta > *', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1
        }, '-=0.4')
        .to('.hero-stat', {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }, '-=0.3');

      // Device mockup animation
      gsap.fromTo('.device-mockup',
        {
          opacity: 0,
          scale: 0.8,
          rotateY: -30
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          delay: 0.5,
          ease: 'power3.out'
        }
      );

      // Floating elements continuous animation
      gsap.to('.floating-element', {
        y: 'random(-20, -40)',
        x: 'random(-10, 10)',
        rotation: 'random(-5, 5)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          each: 0.2,
          from: 'random'
        }
      });

      // Parallax orbs
      gsap.to('.orb-1', {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: -200,
        x: -100
      });

      gsap.to('.orb-2', {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        },
        y: 150,
        x: 100
      });

      // Stats Section - Counter animation
      ScrollTrigger.create({
        trigger: '.stats-section',
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.stat-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
          });

          // Animate numbers
          document.querySelectorAll('.stat-number').forEach((el) => {
            const endValue = parseInt(el.textContent);
            const suffix = el.dataset.suffix || '';
            
            gsap.fromTo(el, 
              { textContent: 0 },
              {
                textContent: endValue,
                duration: 2,
                ease: 'power2.inOut',
                snap: { textContent: 1 },
                onUpdate: function() {
                  el.textContent = Math.round(this.targets()[0].textContent) + suffix;
                }
              }
            );
          });
        },
        once: true
      });

      // Features Section - Advanced stagger animation
      gsap.set('.feature-card', {
        opacity: 0,
        y: 60,
        scale: 0.9
      });

      ScrollTrigger.batch('.feature-card', {
        start: 'top 85%',
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
              each: 0.15,
              grid: [2, 3],
              from: 'start'
            },
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        once: true
      });

      // Section headers animation
      gsap.utils.toArray('.section-header').forEach(header => {
        const badge = header.querySelector('.section-badge');
        const title = header.querySelector('.section-title');
        const subtitle = header.querySelector('.section-subtitle');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        if (badge) {
          tl.from(badge, {
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: 'back.out(1.7)'
          });
        }

        if (title) {
          tl.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.3');
        }

        if (subtitle) {
          tl.from(subtitle, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
          }, '-=0.4');
        }
      });

      // Timeline Section - Zigzag animation
      gsap.set('.timeline-item', {
        opacity: 0
      });

      gsap.set('.timeline-item:nth-child(odd) .timeline-content', {
        x: -100
      });

      gsap.set('.timeline-item:nth-child(even) .timeline-content', {
        x: 100
      });

      gsap.set('.timeline-icon', {
        scale: 0,
        rotation: -180
      });

      ScrollTrigger.batch('.timeline-item', {
        start: 'top 80%',
        onEnter: (elements) => {
          elements.forEach((el, i) => {
            const content = el.querySelector('.timeline-content');
            const icon = el.querySelector('.timeline-icon');
            const number = el.querySelector('.timeline-number');

            gsap.timeline()
              .to(el, {
                opacity: 1,
                duration: 0.3
              })
              .to(content, {
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
              }, '-=0.2')
              .to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
              }, '-=0.4')
              .from(number, {
                scale: 0,
                duration: 0.4,
                ease: 'back.out(2)'
              }, '-=0.5');
          });
        },
        once: true
      });

      // Timeline line drawing animation
      gsap.fromTo('.timeline-line',
        {
          scaleY: 0,
          transformOrigin: 'top'
        },
        {
          scaleY: 1,
          scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1
          }
        }
      );

      // Testimonials - 3D card effect
      gsap.set('.testimonial-card', {
        opacity: 0,
        rotateY: -90,
        z: -100
      });

      ScrollTrigger.batch('.testimonial-card', {
        start: 'top 80%',
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            rotateY: 0,
            z: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
          });
        },
        once: true
      });

      // CTA Section - Dramatic entrance
      ScrollTrigger.create({
        trigger: '.cta-section',
        start: 'top 80%',
        onEnter: () => {
          const ctaTl = gsap.timeline();

          ctaTl
            .from('.cta-card', {
              scale: 0.8,
              opacity: 0,
              duration: 1,
              ease: 'power3.out'
            })
            .from('.cta-badge', {
              scale: 0,
              opacity: 0,
              duration: 0.6,
              ease: 'back.out(1.7)'
            }, '-=0.5')
            .from('.cta-title', {
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out'
            }, '-=0.3')
            .from('.cta-subtitle', {
              y: 30,
              opacity: 0,
              duration: 0.6,
              ease: 'power3.out'
            }, '-=0.4')
            .from('.cta-feature', {
              scale: 0,
              opacity: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: 'back.out(1.7)'
            }, '-=0.2')
            .from('.cta-buttons > *', {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power3.out'
            }, '-=0.3');

          // Glow pulse effect
          gsap.to('.cta-glow', {
            scale: 1.5,
            opacity: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        },
        once: true
      });

      // Footer animation
      ScrollTrigger.create({
        trigger: '.entry-footer',
        start: 'top 90%',
        onEnter: () => {
          gsap.from('.footer-brand', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
          });

          gsap.from('.footer-column', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2
          });

          gsap.from('.footer-social > *', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.4
          });
        },
        once: true
      });

      // Smooth parallax for device mockup
      gsap.to('.hero-visual-main', {
        y: -50,
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Photo grid items animation
      gsap.utils.toArray('.photo-item').forEach((item, i) => {
        gsap.set(item, {
          opacity: 0,
          scale: 0
        });

        gsap.to(item, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 1 + (i * 0.1),
          ease: 'back.out(1.7)'
        });
      });

      // Text reveal animation for important text
      gsap.utils.toArray('.text-gradient').forEach(text => {
        gsap.from(text, {
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          backgroundPosition: '200% 0',
          duration: 1.5,
          ease: 'power2.inOut'
        });
      });

      // Refresh ScrollTrigger after all animations are set
      ScrollTrigger.refresh();

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/');
  };

  return (
    <div className="entry-page" ref={mainRef}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="entry-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <Camera size={28} />
              </div>
              <span>LipeNet</span>
            </div>
            <nav className="header-nav">
              <button className="btn-ghost" onClick={handleLogin}>Entrar</button>
              <button className="btn-gradient" onClick={handleSignup}>
                Começar Grátis
                <ArrowRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={16} />
                <span>Nova plataforma de memórias familiares</span>
              </div>
              
              <h1 className="hero-title">
                Transforme suas fotos em 
                <span className="text-gradient"> memórias organizadas</span> 
                <span className="text-emphasis"> com IA</span>
              </h1>
              
              <p className="hero-subtitle">
                O LipeNet usa inteligência artificial avançada para reconhecer rostos, 
                organizar automaticamente suas fotos e criar uma linha do tempo 
                interativa das memórias da sua família.
              </p>

              <div className="hero-cta">
                <button className="btn-primary-large" onClick={handleSignup}>
                  <Play size={20} />
                  Começar Agora - É Grátis
                </button>
                <button className="btn-secondary-large" onClick={handleLogin}>
                  Ver Demonstração
                </button>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <CheckCircle size={20} className="stat-icon" />
                  <div>
                    <strong>100%</strong>
                    <span>Privado e Seguro</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <CheckCircle size={20} className="stat-icon" />
                  <div>
                    <strong>IA Avançada</strong>
                    <span>Reconhecimento Facial</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <CheckCircle size={20} className="stat-icon" />
                  <div>
                    <strong>Ilimitado</strong>
                    <span>Armazenamento</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-main">
                <div className="device-mockup">
                  <div className="device-screen">
                    <div className="photo-grid-preview">
                      <div className="photo-item item-1">
                        <Users size={20} />
                      </div>
                      <div className="photo-item item-2">
                        <Heart size={20} />
                      </div>
                      <div className="photo-item item-3">
                        <Camera size={20} />
                      </div>
                      <div className="photo-item item-4">
                        <Image size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="floating-element element-1">
                <Brain size={24} />
                <span>IA Inteligente</span>
              </div>
              <div className="floating-element element-2">
                <Shield size={24} />
                <span>100% Seguro</span>
              </div>
              <div className="floating-element element-3">
                <Zap size={24} />
                <span>Super Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users />
              </div>
              <h3 className="stat-number" data-suffix="+">5000</h3>
              <p>Famílias Conectadas</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Image />
              </div>
              <h3 className="stat-number" data-suffix="M+">2</h3>
              <p>Fotos Organizadas</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Brain />
              </div>
              <h3 className="stat-number" data-suffix="%">99</h3>
              <p>Precisão da IA</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Star />
              </div>
              <h3 className="stat-number" data-suffix="">5</h3>
              <p>Estrelas de Avaliação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Sparkles size={20} />
              <span>Recursos Premium</span>
            </div>
            <h2 className="section-title">
              Tecnologia que <span className="text-gradient">impressiona</span>
            </h2>
            <p className="section-subtitle">
              Descubra como o LipeNet transforma a maneira como você 
              guarda e compartilha memórias familiares
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-glow"></div>
              <div className="feature-icon-wrapper">
                <Brain />
              </div>
              <h3>Reconhecimento Facial Inteligente</h3>
              <p>
                Nossa IA identifica automaticamente cada membro da família, 
                criando álbuns personalizados para cada pessoa.
              </p>
              <div className="feature-tags">
                <span className="tag">Machine Learning</span>
                <span className="tag">99% Precisão</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Search />
              </div>
              <h3>Busca por Contexto</h3>
              <p>
                Encontre fotos buscando por "aniversário da vovó" ou 
                "férias na praia" - nossa IA entende o contexto.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock />
              </div>
              <h3>Linha do Tempo Automática</h3>
              <p>
                Veja a evolução da sua família através de uma linha do 
                tempo interativa e emocionante.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield />
              </div>
              <h3>Privacidade Total</h3>
              <p>
                Criptografia de ponta a ponta. Suas fotos são suas, 
                sempre protegidas e privadas.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Globe />
              </div>
              <h3>Acesso de Qualquer Lugar</h3>
              <p>
                Acesse suas memórias de qualquer dispositivo, 
                a qualquer hora, em qualquer lugar.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Heart />
              </div>
              <h3>Compartilhamento Familiar</h3>
              <p>
                Crie grupos familiares privados e compartilhe 
                momentos especiais com quem você ama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <TrendingUp size={20} />
              <span>Simples e Rápido</span>
            </div>
            <h2 className="section-title">
              Como o <span className="text-gradient">LipeNet</span> funciona
            </h2>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <div className="timeline-item">
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3>Faça Upload das Fotos</h3>
                <p>Arraste e solte suas fotos ou selecione do seu dispositivo. 
                   Aceita todos os formatos populares.</p>
              </div>
              <div className="timeline-icon">
                <Cloud />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3>IA Processa Tudo</h3>
                <p>Nossa inteligência artificial analisa, reconhece rostos, 
                   objetos e contextos automaticamente.</p>
              </div>
              <div className="timeline-icon">
                <Brain />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3>Organize e Encontre</h3>
                <p>Suas fotos são organizadas em álbuns inteligentes. 
                   Busque por pessoa, data, local ou contexto.</p>
              </div>
              <div className="timeline-icon">
                <Search />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3>Compartilhe Memórias</h3>
                <p>Crie grupos familiares, compartilhe álbuns e 
                   reviva momentos especiais juntos.</p>
              </div>
              <div className="timeline-icon">
                <Share2 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Award size={20} />
              <span>Depoimentos</span>
            </div>
            <h2 className="section-title">
              Famílias <span className="text-gradient">adoram</span> o LipeNet
            </h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p>
                "Incrível! Encontrei fotos do meu avô que não via há anos. 
                A IA reconheceu ele em fotos antigas automaticamente!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Smile />
                </div>
                <div>
                  <strong>Maria Silva</strong>
                  <span>Mãe de 3 filhos</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p>
                "Finalmente posso organizar 10 anos de fotos familiares! 
                O reconhecimento facial é impressionante."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Smile />
                </div>
                <div>
                  <strong>João Santos</strong>
                  <span>Fotógrafo</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p>
                "A busca por contexto é mágica! Procurei 'natal 2020' 
                e encontrou todas as fotos daquele dia especial."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Smile />
                </div>
                <div>
                  <strong>Ana Costa</strong>
                  <span>Avó de 5 netos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow"></div>
            <div className="cta-content">
              <div className="cta-badge">
                <Zap size={20} />
                <span>Oferta Limitada</span>
              </div>
              
              <h2 className="cta-title">
                Comece a organizar suas memórias 
                <span className="text-gradient"> hoje mesmo</span>
              </h2>
              
              <p className="cta-subtitle">
                Junte-se a milhares de famílias que já transformaram 
                suas fotos em memórias organizadas e acessíveis
              </p>

              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle size={20} />
                  <span>Grátis para sempre</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={20} />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={20} />
                  <span>Configuração em 2 minutos</span>
                </div>
              </div>

              <div className="cta-buttons">
                <button className="btn-cta-primary" onClick={handleSignup}>
                  Criar Conta Grátis
                  <ArrowRight size={20} />
                </button>
                <button className="btn-cta-secondary" onClick={handleLogin}>
                  Já tenho conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="entry-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">
                  <Camera size={24} />
                </div>
                <span>LipeNet</span>
              </div>
              <p>Transformando fotos em memórias organizadas com IA</p>
              <div className="footer-social">
                <Globe size={20} />
                <Heart size={20} />
                <Users size={20} />
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Produto</h4>
                <a href="#features">Recursos</a>
                <a href="#how">Como funciona</a>
                <a href="#pricing">Preços</a>
                <a href="#api">API</a>
              </div>
              <div className="footer-column">
                <h4>Empresa</h4>
                <a href="#about">Sobre nós</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Carreiras</a>
                <a href="#press">Imprensa</a>
              </div>
              <div className="footer-column">
                <h4>Suporte</h4>
                <a href="#help">Central de Ajuda</a>
                <a href="#contact">Contato</a>
                <a href="#status">Status</a>
                <a href="#feedback">Feedback</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#privacy">Privacidade</a>
                <a href="#terms">Termos</a>
                <a href="#security">Segurança</a>
                <a href="#cookies">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 LipeNet. Todos os direitos reservados.</p>
            <p>Feito com <Heart size={14} /> para famílias do mundo todo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Entry;