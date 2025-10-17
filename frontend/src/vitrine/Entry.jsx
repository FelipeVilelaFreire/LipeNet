import { useEffect, useRef, useState } from 'react';
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

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function Entry() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Create GSAP context
    const ctx = gsap.context(() => {
      try {
        // Configure ScrollTrigger
        ScrollTrigger.defaults({
          markers: false,
          toggleActions: "play none none none"
        });

        // Kill any existing ScrollTriggers to prevent conflicts
        ScrollTrigger.getAll().forEach(st => st.kill());

        // Hero Section Animations
        const heroTimeline = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power2.out"
          }
        });

        // Hero content animation
        heroTimeline
          .fromTo('.hero-badge', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 }
          )
          .fromTo('.hero-title',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.4"
          )
          .fromTo('.hero-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.5"
          )
          .fromTo('.hero-cta > *',
            { opacity: 0, y: 20 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.5,
              stagger: 0.1 
            },
            "-=0.3"
          )
          .fromTo('.hero-stat',
            { opacity: 0, scale: 0.9 },
            { 
              opacity: 1, 
              scale: 1, 
              duration: 0.4,
              stagger: 0.1 
            },
            "-=0.2"
          );

        // Device mockup animation
        gsap.fromTo('.device-mockup',
          { 
            opacity: 0, 
            scale: 0.95,
            y: 20 
          },
          { 
            opacity: 1, 
            scale: 1,
            y: 0,
            duration: 1,
            delay: 0.5,
            ease: "power2.out"
          }
        );

        // Photo grid items
        gsap.fromTo('.photo-item',
          { 
            opacity: 0, 
            scale: 0.8 
          },
          { 
            opacity: 1, 
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 1,
            ease: "back.out(1.5)"
          }
        );

        // Floating elements animation
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
          gsap.to(el, {
            y: "random(-15, -25)",
            x: "random(-10, 10)",
            duration: "random(3, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3
          });
        });

        // Background orbs parallax
        ScrollTrigger.create({
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const orb1 = document.querySelector('.orb-1');
            const orb2 = document.querySelector('.orb-2');
            
            if (orb1) {
              gsap.set(orb1, {
                y: -100 * progress,
                x: -50 * progress
              });
            }
            
            if (orb2) {
              gsap.set(orb2, {
                y: 100 * progress,
                x: 50 * progress
              });
            }
          }
        });

        // Stats counter animation
        ScrollTrigger.create({
          trigger: '.stats-section',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            // Animate stat cards
            gsap.fromTo('.stat-card',
              { opacity: 0, y: 30 },
              { 
                opacity: 1, 
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
              }
            );

            // Animate numbers
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((el) => {
              const endValue = parseInt(el.getAttribute('data-value') || el.textContent);
              const suffix = el.getAttribute('data-suffix') || '';
              
              const obj = { value: 0 };
              gsap.to(obj, {
                value: endValue,
                duration: 2,
                ease: "power1.out",
                onUpdate: () => {
                  el.textContent = Math.round(obj.value) + suffix;
                }
              });
            });
          }
        });

        // Features cards animation
        ScrollTrigger.create({
          trigger: '.features-section',
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.feature-card',
              { 
                opacity: 0, 
                y: 40,
                scale: 0.95
              },
              { 
                opacity: 1, 
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: {
                  amount: 0.8,
                  from: "start"
                },
                ease: "power2.out"
              }
            );
          }
        });

        // Section headers animation
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach((header) => {
          ScrollTrigger.create({
            trigger: header,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const badge = header.querySelector('.section-badge');
              const title = header.querySelector('.section-title');
              const subtitle = header.querySelector('.section-subtitle');
              
              const tl = gsap.timeline();
              
              if (badge) {
                tl.fromTo(badge,
                  { opacity: 0, scale: 0.8 },
                  { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
                );
              }
              
              if (title) {
                tl.fromTo(title,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.6 },
                  "-=0.3"
                );
              }
              
              if (subtitle) {
                tl.fromTo(subtitle,
                  { opacity: 0, y: 15 },
                  { opacity: 1, y: 0, duration: 0.5 },
                  "-=0.4"
                );
              }
            }
          });
        });

        // Timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const content = item.querySelector('.timeline-content');
              const icon = item.querySelector('.timeline-icon');
              const number = item.querySelector('.timeline-number');
              
              const tl = gsap.timeline();
              
              // Fade in the item
              tl.fromTo(item,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
              );
              
              // Slide in content
              if (content) {
                const direction = index % 2 === 0 ? -50 : 50;
                tl.fromTo(content,
                  { x: direction, opacity: 0 },
                  { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                  "-=0.2"
                );
              }
              
              // Scale in icon
              if (icon) {
                tl.fromTo(icon,
                  { scale: 0, rotation: -180 },
                  { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.5)" },
                  "-=0.4"
                );
              }
              
              // Pop in number
              if (number) {
                tl.fromTo(number,
                  { scale: 0 },
                  { scale: 1, duration: 0.4, ease: "back.out(2)" },
                  "-=0.3"
                );
              }
            }
          });
        });

        // Timeline line animation
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
          ScrollTrigger.create({
            trigger: '.timeline-section',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
            onUpdate: (self) => {
              gsap.set(timelineLine, {
                scaleY: self.progress,
                transformOrigin: 'top center'
              });
            }
          });
        }

        // Testimonials animation
        ScrollTrigger.create({
          trigger: '.testimonials-section',
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.fromTo('.testimonial-card',
              { 
                opacity: 0, 
                y: 30,
                scale: 0.95
              },
              { 
                opacity: 1, 
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
              }
            );
          }
        });

        // CTA section animation
        ScrollTrigger.create({
          trigger: '.cta-section',
          start: 'top 70%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            
            tl.fromTo('.cta-card',
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
            )
            .fromTo('.cta-badge',
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.5 },
              "-=0.5"
            )
            .fromTo('.cta-title',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6 },
              "-=0.3"
            )
            .fromTo('.cta-subtitle',
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5 },
              "-=0.4"
            )
            .fromTo('.cta-feature',
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 },
              "-=0.2"
            )
            .fromTo('.cta-buttons > *',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
              "-=0.2"
            );
            
            // Glow animation
            const ctaGlow = document.querySelector('.cta-glow');
            if (ctaGlow) {
              gsap.to(ctaGlow, {
                scale: 1.2,
                opacity: 0.6,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            }
          }
        });

        // Footer animation
        ScrollTrigger.create({
          trigger: '.entry-footer',
          start: 'top 90%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            
            tl.fromTo('.footer-brand',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6 }
            )
            .fromTo('.footer-column',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
              "-=0.3"
            )
            .fromTo('.footer-social > *',
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 },
              "-=0.2"
            );
          }
        });

        // Smooth scroll for hero visual
        const heroVisual = document.querySelector('.hero-visual-main');
        if (heroVisual) {
          ScrollTrigger.create({
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
            onUpdate: (self) => {
              gsap.set(heroVisual, {
                y: -50 * self.progress
              });
            }
          });
        }

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();

      } catch (error) {
        console.error('GSAP animation error:', error);
        // Fallback: make everything visible if animations fail
        gsap.set('*', { clearProps: 'all' });
      }
    }, mainRef);

    // Cleanup
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded]);

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
              <h3 className="stat-number" data-value="5000" data-suffix="+">0</h3>
              <p>Famílias Conectadas</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Image />
              </div>
              <h3 className="stat-number" data-value="2" data-suffix="M+">0</h3>
              <p>Fotos Organizadas</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Brain />
              </div>
              <h3 className="stat-number" data-value="99" data-suffix="%">0</h3>
              <p>Precisão da IA</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Star />
              </div>
              <h3 className="stat-number" data-value="5" data-suffix="">0</h3>
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