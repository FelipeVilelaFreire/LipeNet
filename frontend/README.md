# LipeNet Frontend - Refatoração Completa

## 🎨 Nova Identidade Visual

O frontend do LipeNet passou por uma **refatoração completa** para criar uma experiência moderna, acolhedora e interativa, adequada para uma rede social familiar.

## ✨ Principais Mudanças

### 🎨 Sistema de Design Renovado

- **Nova Paleta de Cores**: Tons quentes, acolhedores e vibrantes (terracota, mostarda, verde oliva, azul suave)
- **Tipografia Moderna**: Fontes Inter e Playfair Display para melhor legibilidade
- **Sistema de Variáveis CSS**: Organização consistente de cores, espaçamentos e transições
- **Gradientes e Sombras**: Efeitos visuais sutis e elegantes

### 🖼️ Galeria de Fotos Transformada

- **Layout Masonry**: Grid responsivo que se adapta ao conteúdo
- **Modal Lightbox**: Visualização em tela cheia ao clicar nas fotos
- **Skeleton Loading**: Indicadores de carregamento elegantes
- **Micro-interações**: Efeitos hover, zoom e transições suaves
- **Meta-informações**: Exibição de datas e contadores de pessoas

### 📤 Upload Modernizado

- **Drag & Drop**: Interface intuitiva para arrastar e soltar imagens
- **Preview em Tempo Real**: Visualização da imagem antes do envio
- **Barra de Progresso**: Feedback visual durante o upload
- **Validação Visual**: Estados de erro e sucesso claros

### 👥 Página de Pessoas Redesenhada

- **Cards Visuais**: Layout em grid com fotos e informações
- **Contadores de Fotos**: Badges mostrando quantas fotos cada pessoa aparece
- **Edição Inline**: Modo de edição integrado aos cards
- **Estados Vazios**: Mensagens acolhedoras quando não há conteúdo

### 🔍 Busca Aprimorada

- **Design Moderno**: Campo de busca com bordas arredondadas e efeitos
- **Debounce Inteligente**: Busca otimizada com delay de 500ms
- **Feedback Visual**: Estados de foco e hover melhorados

## 🚀 Tecnologias Utilizadas

- **React 19**: Framework principal com hooks modernos
- **CSS Custom Properties**: Sistema de variáveis para design consistente
- **CSS Grid & Flexbox**: Layouts responsivos e modernos
- **CSS Animations**: Transições e animações suaves
- **React Icons**: Ícones consistentes e acessíveis
- **Axios**: Comunicação com a API backend

## 🎯 Características Técnicas

### Responsividade

- Design mobile-first com breakpoints otimizados
- Layout adaptativo para todos os tamanhos de tela
- Grid systems flexíveis e responsivos

### Performance

- Lazy loading de imagens
- Skeleton loading para melhor UX
- Animações CSS otimizadas
- Debounce na busca para reduzir chamadas à API

### Acessibilidade

- Contraste adequado entre cores
- Estados de foco visíveis
- Textos alternativos para imagens
- Navegação por teclado

## 🎨 Paleta de Cores

### Cores Primárias

- **Terracota**: `#ed7a1f` - Cor principal acolhedora
- **Mostarda**: `#d66f2a` - Cor secundária vibrante

### Cores de Acento

- **Verde Oliva**: `#3d9a5f` - Para elementos de sucesso
- **Azul Suave**: `#3b82f6` - Para informações e links

### Cores Neutras

- **Branco**: `#fafaf9` - Fundo principal
- **Cinza Quente**: `#78716c` - Texto secundário

## 📱 Breakpoints Responsivos

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

## 🚀 Como Executar

1. **Instalar dependências**:

   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:

   ```bash
   npm run dev
   ```

3. **Build para produção**:
   ```bash
   npm run build
   ```

## 🔧 Estrutura de Arquivos

```
src/
├── components/
│   ├── Header.jsx          # Header com navegação
│   ├── PhotoGallery.jsx    # Galeria com layout masonry
│   ├── PhotoCard.jsx       # Card individual com modal
│   ├── UploadForm.jsx      # Formulário com drag & drop
│   └── SearchBar.jsx       # Campo de busca inteligente
├── pages/
│   ├── ManagePeoplePage.jsx # Página de pessoas
│   └── PersonDetailPage.jsx # Detalhes da pessoa
├── context/                 # Contextos React (se necessário)
├── App.jsx                  # Componente principal
├── App.css                  # Estilos globais
└── index.css               # Sistema de design e variáveis
```

## 🎯 Próximos Passos

- [ ] Implementar sistema de notificações toast
- [ ] Adicionar modo escuro/claro
- [ ] Implementar cache de imagens
- [ ] Adicionar testes automatizados
- [ ] Otimizar para PWA

## 🤝 Contribuição

Este projeto foi refatorado para demonstrar as melhores práticas de design e desenvolvimento frontend. Todas as mudanças mantêm a compatibilidade com o backend existente.

---

**LipeNet** - Sua Galeria de Fotos Inteligente e Familiar ✨
