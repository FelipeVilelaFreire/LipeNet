# LipeNet - Galeria de Fotos Inteligente com IA

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Django](https://img.shields.io/badge/Django-5.2.4-green)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![AI](https://img.shields.io/badge/AI-Powered-purple)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Propósito e Objetivos](#propósito-e-objetivos)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Inteligência Artificial](#inteligência-artificial)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [API Endpoints](#api-endpoints)
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
- [Desenvolvimento Futuro](#desenvolvimento-futuro)

---

## 🎯 Sobre o Projeto

**LipeNet** é uma aplicação web de galeria de fotos inteligente desenvolvida como Trabalho de Conclusão de Curso (TCC). O projeto combina conceitos modernos de desenvolvimento web full-stack com inteligência artificial de visão computacional para criar uma experiência única de gerenciamento e busca de fotografias.

Diferente de galerias convencionais, o LipeNet não apenas armazena fotos - ele as **compreende**. Cada imagem enviada é automaticamente analisada por modelos de IA que geram descrições detalhadas, identificam objetos, reconhecem pessoas e extraem características visuais como cores e composição.

### 🎓 Contexto Acadêmico

Este projeto serve como estudo prático na integração de:
- **Backend robusto** em Python/Django com processamento de IA
- **Frontend moderno** em React com design responsivo
- **APIs RESTful** para comunicação entre camadas
- **Machine Learning** aplicado a visão computacional
- **Processamento de imagens** e reconhecimento facial

---

## 🚀 Propósito e Objetivos

### Propósito Principal

Criar um sistema de galeria de fotos que utiliza inteligência artificial para automatizar a catalogação, organização e busca de imagens, permitindo que usuários encontrem suas fotos usando **linguagem natural** em vez de navegar manualmente por pastas ou datas.

### Objetivos Específicos

#### 1. **Análise Automática de Imagens**
- Gerar legendas descritivas automaticamente para cada foto
- Identificar e categorizar objetos presentes nas imagens
- Analisar características visuais (cores, iluminação, composição)
- Criar tags inteligentes baseadas no conteúdo visual

#### 2. **Reconhecimento Facial Inteligente**
- Detectar rostos em fotografias automaticamente
- Identificar pessoas recorrentes entre diferentes fotos
- Agrupar fotos pela presença de pessoas específicas
- Permitir renomeação e gerenciamento de pessoas identificadas

#### 3. **Busca Avançada com IA**
- Permitir buscas por texto natural (ex: "fotos de criança na praia")
- Buscar por pessoas identificadas
- Filtrar por tags geradas automaticamente
- Combinar múltiplos critérios de busca

#### 4. **Interface Intuitiva**
- Design moderno inspirado em redes sociais
- Visualização em grid e feed
- Modal de visualização ampliada
- Sistema de favoritos
- Filtros e ordenação flexíveis

#### 5. **Aprendizado Prático**
- Dominar integração de modelos de IA em aplicações web
- Desenvolver APIs RESTful robustas
- Criar interfaces React modernas e responsivas
- Implementar processamento assíncrono de imagens
- Gerenciar estado e comunicação frontend-backend

---

## ✨ Funcionalidades Principais

### 🖼️ Gerenciamento de Fotos

#### Upload Inteligente
- Upload de imagens via interface web
- Processamento automático com IA após upload
- Geração instantânea de metadados ricos
- Feedback visual do progresso

#### Visualização
- **Página Inicial (Feed)**: Estilo Instagram com scroll infinito
- **Galeria**: Grid de fotos com cards informativos
- **Modal Ampliado**: Visualização detalhada com navegação
- **Visualização de Favoritos**: Acesso rápido às fotos marcadas

#### Organização
- Sistema de favoritos (⭐)
- Filtros por período (semana, mês, 3 meses)
- Filtros por presença de pessoas
- Ordenação por data, nome ou favoritos

### 🤖 Análise com Inteligência Artificial

#### 1. Geração de Legendas (Image Captioning)
**Modelo**: Salesforce BLIP Large
- Gera descrições textuais automáticas das imagens
- Enriquece legendas com contexto visual detalhado
- Análise de composição e posicionamento de objetos
- Descrições em inglês com alta qualidade

**Exemplo de saída**:
```
"A group of people sitting at a dining table prominently showing dining table,
person and chair featuring wine glass and fork in the background with warm
golden light in brilliant daylight"
```

#### 2. Detecção de Objetos
**Modelo**: Facebook DETR ResNet-101
- Identifica objetos com alta precisão
- Múltiplos níveis de confiança (alta >90%, média >75%)
- Gera tags automáticas baseadas em objetos detectados
- Detecta até 20+ objetos diferentes por imagem

**Categorias detectadas**: pessoas, veículos, animais, alimentos, móveis, eletrônicos, natureza, arquitetura, e muito mais.

#### 3. Análise Avançada de Cores
- Detecção de cores dominantes
- Análise de temperatura de cor (quente/frio)
- Medição de saturação e contraste
- Identificação de estilo fotográfico
- Análise de iluminação (bright/dark/soft)

**Tags geradas**:
- Luminosidade: `bright`, `dark`, `high key`, `low key`
- Temperatura: `warm tones`, `cool tones`, `sunset colors`, `blue hour`
- Estilo: `noir style`, `cinematic`, `dreamy`, `vibrant`

#### 4. Reconhecimento Facial Avançado
**Biblioteca**: face_recognition + dlib (CNN)
- Detecção de rostos com modelo CNN de alta precisão
- Encoding facial de 128 dimensões
- Tolerância adaptativa baseada no tamanho do rosto
- Atualização incremental de encodings para melhor precisão
- Cache em memória para performance otimizada

**Recursos**:
- Identifica automaticamente pessoas recorrentes
- Nomeia inicialmente como "Pessoa 1", "Pessoa 2", etc.
- Permite renomeação manual de pessoas
- Filtra pessoas que aparecem em 2+ fotos
- Gerenciamento de "pessoas ocultas" (1 foto apenas)
- Possibilidade de adicionar pessoas manualmente

#### 5. Sistema de Tags Inteligentes
Geração automática de até **20 tags** por imagem baseadas em:
- Objetos detectados com alta confiança
- Análise de cores e iluminação
- Categorias contextuais (natureza, arquitetura, transporte, etc.)
- Composição (portrait, landscape, minimalist, busy scene)
- Contagem de elementos (couple, group, crowd)
- Metadados EXIF quando disponíveis

### 🔍 Busca Avançada

#### Sistema de Busca Inteligente
- Busca simultânea em múltiplos campos:
  - Descrição manual do usuário
  - Legendas geradas por IA
  - Tags detectadas
  - Nomes de pessoas identificadas
- Busca por palavras-chave múltiplas
- Resultados ordenados por relevância
- Sem necessidade de sintaxe especial

**Exemplos de busca**:
- "criança praia" → encontra fotos com crianças na praia
- "verde natureza" → encontra fotos em ambientes naturais verdes
- "Maria festa" → encontra fotos da pessoa Maria em festas

### 👥 Gerenciamento de Pessoas

#### Página de Pessoas
- Lista todas as pessoas identificadas em 2+ fotos
- Cards com foto representativa de cada pessoa
- Contador de fotos por pessoa
- Possibilidade de renomear pessoas
- Acesso rápido a todas as fotos de uma pessoa

#### Pessoas Ocultas
- Seção especial para pessoas detectadas em apenas 1 foto
- Opção de adicionar manualmente à lista principal
- Evita poluição da lista com rostos únicos

#### Detalhes de Pessoa
- Visualização de todas as fotos onde a pessoa aparece
- Possibilidade de atualizar foto de perfil
- Estatísticas (número de fotos)
- Opção de deletar pessoa do sistema

---

## 🛠️ Tecnologias Utilizadas

### Backend

#### Framework e API
- **Django 5.2.4**: Framework web Python de alto nível
- **Django REST Framework 3.16.0**: Toolkit para construir APIs RESTful
- **django-cors-headers 4.7.0**: Gerenciamento de CORS para comunicação com frontend

#### Inteligência Artificial
- **transformers 4.54.1**: Biblioteca Hugging Face para modelos de linguagem e visão
- **torch 2.5.1**: PyTorch - Framework de deep learning
- **torchvision 0.22.1**: Biblioteca de visão computacional do PyTorch
- **timm 1.0.19**: Modelos de visão computacional pré-treinados
- **face_recognition 1.3.0**: Reconhecimento facial simplificado
- **dlib**: Backend C++ para processamento de imagem e ML

#### Processamento de Imagens
- **Pillow 11.0.0**: Biblioteca Python de processamento de imagens
- **numpy 2.2.6**: Computação numérica e manipulação de arrays
- **opencv**: Visão computacional (dependência do face_recognition)

#### Modelos de IA Utilizados
1. **Salesforce/blip-image-captioning-large**
   - Tarefa: Image-to-Text
   - Gera legendas descritivas de imagens

2. **facebook/detr-resnet-101**
   - Tarefa: Object Detection
   - Detecta e classifica objetos em imagens

#### Banco de Dados
- **SQLite3**: Banco de dados relacional embutido
- **sqlparse 0.5.3**: Parser SQL para Django

#### Outras Dependências
- **requests 2.32.4**: Requisições HTTP
- **huggingface-hub 0.34.3**: Download de modelos da Hugging Face
- **safetensors 0.5.3**: Formato seguro para pesos de modelos
- **tokenizers 0.21.4**: Tokenização rápida
- **PyYAML 6.0.2**: Parser YAML

### Frontend

#### Framework e Bibliotecas Core
- **React 19.1.0**: Biblioteca JavaScript para interfaces
- **React DOM 19.1.0**: Renderização React para web
- **React Router DOM 7.7.1**: Roteamento declarativo

#### Build Tools
- **Vite 4.5.3**: Build tool e dev server ultrarrápido
- **@vitejs/plugin-react 4.6.0**: Plugin React para Vite
- **esbuild**: Bundler JavaScript extremamente rápido (usado pelo Vite)

#### UI e Ícones
- **lucide-react 0.541.0**: Biblioteca de ícones moderna e clean
- **react-icons 5.5.0**: Coleção de ícones populares

#### Animações e Utilidades
- **gsap 3.13.0**: Biblioteca de animações de alta performance
- **axios 1.11.0**: Cliente HTTP baseado em promises
- **lodash.debounce 4.0.8**: Debouncing para otimização de performance

#### Linting e Qualidade de Código
- **ESLint 9.30.1**: Linter para JavaScript/React
- **eslint-plugin-react-hooks 5.2.0**: Regras ESLint para React Hooks
- **eslint-plugin-react-refresh 0.4.20**: Plugin para Fast Refresh

---

## 🏗️ Arquitetura do Sistema

### Arquitetura Geral

O LipeNet utiliza uma **arquitetura desacoplada (decoupled/headless)** com clara separação de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  HomePage  │  │  Gallery   │  │   Search   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  People    │  │  Upload    │  │ Favorites  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
                         │ (REST API)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Django)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API REST (DRF)                          │   │
│  │  - PhotoListAPIView                                  │   │
│  │  - PhotoDetailAPIView                                │   │
│  │  - PersonListAPIView                                 │   │
│  │  - SearchView                                        │   │
│  │  - FavoritePhotosAPIView                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           PROCESSAMENTO DE IA                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   BLIP      │  │    DETR     │  │    Face     │  │   │
│  │  │ Captioning  │  │   Object    │  │ Recognition │  │   │
│  │  │             │  │  Detection  │  │             │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │      Análise de Cores e Composição           │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         MODELOS DE DADOS (Django ORM)                │   │
│  │  - Photo    - Person    - Tag                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              BANCO DE DADOS                          │   │
│  │                SQLite3                               │   │
│  │  + Armazenamento de arquivos (media/)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Modelos de Dados

#### Photo (Foto)
```python
- id: Identificador único
- text: Descrição manual do usuário (opcional)
- image: Arquivo de imagem (ImageField)
- caption: Legenda gerada por IA
- created_at: Data/hora do upload
- is_favorite: Marcador de favorito (booleano)
- tags: Relação Many-to-Many com Tag
- persons: Relação Many-to-Many com Person
```

#### Person (Pessoa)
```python
- id: Identificador único
- name: Nome da pessoa
- encoding: Vetor de 128 dimensões para reconhecimento facial (JSON)
- photo_principal: Foto representativa (ForeignKey para Photo)
- is_manually_added: Indica se foi adicionada manualmente
```

#### Tag (Etiqueta)
```python
- id: Identificador único
- name: Nome da tag (único)
```

### Fluxo de Processamento de Imagem

```
1. UPLOAD
   ↓
2. RECEPÇÃO (Backend Django)
   ↓
3. CRIAÇÃO DO OBJETO PHOTO
   ↓
4. PRÉ-PROCESSAMENTO
   - Conversão para RGB
   - Redimensionamento se necessário (max 2048px)
   - Ajuste de contraste (+10%)
   ↓
5. PROCESSAMENTO DE IA PARALELO
   ├─→ GERAÇÃO DE CAPTION (BLIP)
   ├─→ DETECÇÃO DE OBJETOS (DETR)
   ├─→ ANÁLISE DE CORES
   └─→ RECONHECIMENTO FACIAL
   ↓
6. ENRIQUECIMENTO
   - Combinação de caption com objetos detectados
   - Geração de tags inteligentes
   - Associação de pessoas
   ↓
7. SALVAMENTO NO BANCO
   ↓
8. RESPOSTA JSON PARA FRONTEND
```

---

## 📁 Estrutura do Projeto

```
LipeNet/
│
├── backend/                          # Projeto Django
│   ├── config/                       # Configurações do Django
│   │   ├── settings.py               # Configurações principais
│   │   ├── urls.py                   # URLs principais
│   │   └── wsgi.py                   # WSGI config
│   │
│   ├── gallery/                      # App principal
│   │   ├── migrations/               # Migrações do banco
│   │   ├── models.py                 # Modelos (Photo, Person, Tag)
│   │   ├── views.py                  # Views da API REST
│   │   ├── serializers.py            # Serializers DRF
│   │   ├── urls.py                   # URLs da API
│   │   └── funcoes_ia.py            # Funções de processamento IA
│   │
│   ├── media/                        # Arquivos de mídia (fotos)
│   │   └── photos/                   # Fotos enviadas
│   │
│   ├── manage.py                     # CLI do Django
│   ├── requirements.txt              # Dependências Python
│   ├── db.sqlite3                    # Banco de dados
│   └── venv/                         # Ambiente virtual Python
│
├── frontend/                         # Projeto React
│   ├── public/                       # Arquivos estáticos públicos
│   │
│   ├── src/                          # Código fonte React
│   │   ├── components/               # Componentes reutilizáveis
│   │   │   ├── Header.jsx            # Cabeçalho da aplicação
│   │   │   ├── Header.css
│   │   │   ├── PhotoCard.jsx         # Card de foto
│   │   │   └── PhotoCard.css
│   │   │
│   │   ├── pages/                    # Páginas da aplicação
│   │   │   ├── HomePage.jsx          # Feed de fotos
│   │   │   ├── HomePage.css
│   │   │   ├── GalleryPage.jsx       # Galeria em grid
│   │   │   ├── GalleryPage.css
│   │   │   ├── SearchPage.jsx        # Busca de fotos
│   │   │   ├── UploadPage.jsx        # Upload de fotos
│   │   │   ├── ManagePeoplePage.jsx  # Gerenciar pessoas
│   │   │   ├── PersonDetailPage.jsx  # Detalhes de uma pessoa
│   │   │   ├── FavoritosPage.jsx     # Fotos favoritas
│   │   │   └── ...css
│   │   │
│   │   ├── vitrine/                  # Página de entrada
│   │   │   ├── Entry.jsx
│   │   │   └── Entry.css
│   │   │
│   │   ├── App.jsx                   # Componente principal
│   │   ├── App.css
│   │   └── main.jsx                  # Entry point
│   │
│   ├── package.json                  # Dependências Node.js
│   ├── vite.config.js                # Configuração Vite
│   └── node_modules/                 # Módulos Node
│
├── analise_backend_fotos.txt         # Documentação técnica
├── resources.txt                      # Recursos do projeto
└── README.md                          # Este arquivo
```

---

## 🚀 Como Executar

### Pré-requisitos

- **Python 3.10+** instalado
- **Node.js 16+** e npm instalados
- **Git** para clonar o repositório
- **4GB+ de RAM** (para modelos de IA)
- **Conexão com internet** (primeira execução para download de modelos)

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd LipeNet
```

### Passo 2: Configurar o Backend

#### 2.1. Criar ambiente virtual Python

```bash
cd backend
python -m venv venv
```

#### 2.2. Ativar ambiente virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2.3. Instalar dependências

```bash
pip install -r requirements.txt
```

⚠️ **Nota**: A primeira instalação pode demorar, especialmente para PyTorch e modelos de IA.

#### 2.4. Aplicar migrações do banco de dados

```bash
python manage.py migrate
```

#### 2.5. (Opcional) Criar superusuário para admin

```bash
python manage.py createsuperuser
```

#### 2.6. Iniciar servidor Django

```bash
python manage.py runserver
```

O backend estará rodando em: `http://127.0.0.1:8000`

### Passo 3: Configurar o Frontend

Abra um novo terminal (mantendo o backend rodando).

#### 3.1. Navegar para pasta frontend

```bash
cd frontend
```

#### 3.2. Instalar dependências

```bash
npm install
```

#### 3.3. Iniciar servidor de desenvolvimento

**Windows:**
```bash
npm run dev:win
```

**Linux/Mac:**
```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### Passo 4: Acessar a Aplicação

Abra seu navegador e acesse: `http://localhost:5173`

### Primeira Execução

Na primeira execução, os modelos de IA serão baixados automaticamente da Hugging Face:
- **BLIP Captioning Large**: ~990 MB
- **DETR ResNet-101**: ~166 MB

Isso pode levar alguns minutos dependendo da sua conexão.

---

## 🔌 API Endpoints

### Fotos

#### `GET /api/photos/`
Lista todas as fotos ordenadas por data (mais recente primeiro).

**Resposta:**
```json
[
  {
    "id": 1,
    "text": "Descrição do usuário",
    "image": "http://127.0.0.1:8000/media/photos/foto.jpg",
    "caption": "Caption gerada por IA",
    "created_at": "2025-10-15T10:30:00Z",
    "tags": ["praia", "pessoa", "ensolarado"],
    "persons": ["Maria", "João"],
    "is_favorite": false
  }
]
```

#### `POST /api/photos/`
Faz upload de uma nova foto.

**Request:**
```
Content-Type: multipart/form-data
Body: { image: <arquivo> }
```

**Resposta:**
```json
{
  "id": 2,
  "image": "http://127.0.0.1:8000/media/photos/nova_foto.jpg",
  "caption": "A person standing on a beach...",
  "tags": ["beach", "person", "ocean"],
  "persons": ["Pessoa 1"],
  "created_at": "2025-10-15T11:00:00Z",
  "is_favorite": false
}
```

#### `GET /api/photos/{id}/`
Retorna detalhes de uma foto específica.

#### `DELETE /api/photos/{id}/`
Remove uma foto do sistema.

#### `POST /api/photos/{id}/toggle-favorite/`
Alterna o status de favorito de uma foto.

**Resposta:**
```json
{
  "id": 1,
  "is_favorite": true,
  ...
}
```

### Favoritos

#### `GET /api/favorites/`
Lista todas as fotos marcadas como favoritas.

### Pessoas

#### `GET /api/persons/`
Lista todas as pessoas que aparecem em 2 ou mais fotos ou foram adicionadas manualmente.

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Maria Silva",
    "encoding": [0.123, -0.456, ...],
    "representative_photo": "http://127.0.0.1:8000/media/photos/maria.jpg",
    "photo_principal": "http://127.0.0.1:8000/media/photos/maria.jpg",
    "photo_count": 15,
    "first_photo": "http://127.0.0.1:8000/media/photos/first.jpg"
  }
]
```

#### `GET /api/persons/hidden/`
Lista pessoas que aparecem em apenas 1 foto (pessoas ocultas).

#### `GET /api/persons/{id}/`
Retorna detalhes de uma pessoa específica.

#### `PATCH /api/persons/{id}/`
Atualiza informações de uma pessoa (ex: renomear).

**Request:**
```json
{
  "name": "Maria Silva Santos"
}
```

#### `DELETE /api/persons/{id}/`
Remove uma pessoa do sistema e atualiza cache de rostos.

#### `GET /api/persons/{id}/photos/`
Lista todas as fotos onde uma pessoa específica aparece.

#### `POST /api/persons/{id}/add-manually/`
Adiciona uma pessoa à lista visível mesmo tendo apenas 1 foto.

#### `PATCH /api/persons/{id}/update-photo/`
Atualiza a foto de perfil de uma pessoa.

**Request:**
```
Content-Type: multipart/form-data
Body: { photo_principal: <arquivo> }
```

### Busca

#### `GET /api/search/?q={termo}`
Busca fotos por texto.

**Parâmetros:**
- `q`: Termo de busca (obrigatório)

**Resposta:**
```json
{
  "results": [
    {
      "id": 1,
      "caption": "A person at the beach...",
      "tags": ["beach", "person"],
      "persons": ["Maria"]
      ...
    }
  ]
}
```

A busca é realizada em:
- `text` (descrição do usuário)
- `caption` (legenda da IA)
- `tags.name` (nomes das tags)
- `persons.name` (nomes das pessoas)

---

## 🎨 Funcionalidades Detalhadas

### Pipeline de Processamento de IA

#### 1. Upload e Recepção
```python
# views.py - PhotoListAPIView.post()
image_file = request.FILES.get('image')
photo = Photo(image=image_file)
photo = process_photo_with_ai(photo, image_file)
```

#### 2. Pré-processamento
```python
# funcoes_ia.py - process_photo_with_ai()
pil_image = Image.open(image_file).convert('RGB')

# Redimensionamento inteligente
if pil_image.width > 2048 or pil_image.height > 2048:
    pil_image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)

# Ajuste de contraste
enhancer = ImageEnhance.Contrast(pil_image)
pil_image_enhanced = enhancer.enhance(1.1)
```

#### 3. Geração de Caption
```python
# Usa modelo BLIP Large
caption_results = captioner(pil_image_enhanced, max_new_tokens=50)
basic_caption = caption_results[0]['generated_text']
```

#### 4. Detecção de Objetos
```python
# Usa modelo DETR ResNet-101
detected_objects = object_detector(pil_image_enhanced)
detected_objects = sorted(detected_objects, key=lambda x: x['score'], reverse=True)
```

#### 5. Enriquecimento da Caption
```python
# Combina caption básica com objetos e análise de cores
enhanced_caption = enhance_description(basic_caption, detected_objects, pil_image)
```

A função `enhance_description()` adiciona:
- Objetos de alta confiança (>90%)
- Objetos secundários (>75%)
- Informações de posicionamento
- Análise de contraste e saturação
- Temperatura de cor
- Estilo de iluminação

#### 6. Geração de Tags
```python
smart_tags = generate_smart_tags(detected_objects, pil_image)
```

Tags geradas incluem:
- **Tags de objetos**: Baseadas em detecções
- **Tags contextuais**: Categorias semânticas
- **Tags de contagem**: portrait, couple, group, crowd
- **Tags de cores**: bright, dark, warm tones, cool tones
- **Tags de composição**: landscape orientation, minimalist
- **Tags de estilo**: cinematic, noir, dreamy

#### 7. Reconhecimento Facial
```python
# Detecta rostos com CNN
face_locations = face_recognition.face_locations(img_array, model="cnn")

# Gera encodings
face_encodings = face_recognition.face_encodings(img_array, face_locations, num_jitters=2)

# Compara com rostos conhecidos
matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
```

**Tolerância Adaptativa**:
- Rostos grandes (>10% da imagem): tolerância 0.5
- Rostos médios (5-10%): tolerância 0.55
- Rostos pequenos (<5%): tolerância 0.6

**Atualização de Encodings**:
```python
# Média ponderada para melhorar precisão ao longo do tempo
updated_encoding = (current_encoding * weight_old + face_encoding * weight_new)
updated_encoding = updated_encoding / np.linalg.norm(updated_encoding)
```

### Análise Avançada de Cores

```python
def analyze_image_colors(pil_image):
    # Analisa imagem em 128x128 para precisão
    img_sample = pil_image.resize((128, 128))
    colors = np.array(img_sample)

    # Métricas calculadas
    avg_color = np.mean(colors, axis=(0, 1))
    std_color = np.std(colors, axis=(0, 1))
    brightness = np.mean(avg_color)
    contrast = std_color.mean()

    return {
        'brightness': brightness,
        'contrast': contrast,
        'is_bright': brightness > 190,
        'is_dark': brightness < 80,
        'is_warm': avg_color[0] > avg_color[1] + 25,
        'is_cool': avg_color[2] > avg_color[0] + 25,
        'is_saturated': std_color.max() > 80,
        ...
    }
```

### Sistema de Busca

O sistema de busca utiliza Django Q objects para queries complexas:

```python
# Divide query em palavras
query_words = query.lower().split()

# Cria Q objects para busca OR
q_objects = Q()
for word in query_words:
    q_objects |= (
        Q(text__icontains=word) |
        Q(caption__icontains=word) |
        Q(tags__name__icontains=word) |
        Q(persons__name__icontains=word)
    )

# Busca com distinct para evitar duplicatas
photos = Photo.objects.filter(q_objects).distinct().order_by('-created_at')
```

**Exemplos**:
- `"praia pessoa"` → Fotos com "praia" OU "pessoa" em qualquer campo
- `"maria verde"` → Fotos da pessoa Maria OU com cor verde

---

## 🔮 Desenvolvimento Futuro

### Melhorias Planejadas

#### IA e Processamento
- [ ] Tradução automática de captions para português
- [ ] Modelo OWL-ViT para detecção de conceitos específicos
- [ ] Busca semântica usando embeddings
- [ ] Detecção de emoções em rostos
- [ ] Classificação de eventos (festa, trabalho, viagem)
- [ ] Detecção de duplicatas e fotos similares

#### Frontend
- [ ] Progressive Web App (PWA)
- [ ] Upload múltiplo com drag-and-drop
- [ ] Editor de fotos integrado
- [ ] Slideshow automático
- [ ] Compartilhamento em redes sociais
- [ ] Modo escuro (dark mode)
- [ ] Visualização de timeline
- [ ] Álbuns personalizados

#### Backend
- [ ] Autenticação de usuários (multi-tenant)
- [ ] Processamento assíncrono com Celery
- [ ] Cache com Redis
- [ ] Paginação adequada da API
- [ ] Compressão de imagens
- [ ] Backup automático
- [ ] Logs estruturados
- [ ] Testes automatizados

#### Infraestrutura
- [ ] Migração para PostgreSQL
- [ ] Deploy em produção (AWS/Heroku)
- [ ] CDN para imagens
- [ ] Container Docker
- [ ] CI/CD com GitHub Actions

### Funcionalidades Avançadas

#### 1. Busca Semântica
Implementar busca por similaridade usando embeddings de imagens:
```python
# Usar CLIP ou similar para vetorizar imagens
# Buscar por similaridade de conteúdo visual
```

#### 2. Detecção de Eventos
Agrupar fotos automaticamente por eventos:
- Mesma data e hora
- Mesmo local (usando EXIF GPS)
- Mesmas pessoas
- Contexto similar

#### 3. Sugestões Inteligentes
- "Fotos que você pode gostar"
- "Pessoas que podem ser a mesma"
- "Tags sugeridas para adicionar"

#### 4. Estatísticas
- Dashboard com métricas
- Pessoas mais fotografadas
- Tags mais comuns
- Timeline de uploads

---

## 📚 Referências e Recursos

### Modelos de IA

- **BLIP**: [Salesforce BLIP Paper](https://arxiv.org/abs/2201.12086)
- **DETR**: [Facebook DETR Paper](https://arxiv.org/abs/2005.12872)
- **Face Recognition**: [face_recognition library](https://github.com/ageitgey/face_recognition)

### Documentação

- **Django**: https://docs.djangoproject.com/
- **Django REST Framework**: https://www.django-rest-framework.org/
- **React**: https://react.dev/
- **Hugging Face Transformers**: https://huggingface.co/docs/transformers/

### Datasets e Benchmarks

- **COCO**: Common Objects in Context (objeto detection training)
- **ImageNet**: Large scale image classification
- **VGGFace2**: Face recognition dataset

---

## 👨‍💻 Autor

**Felipe Vilela Freire**
- Projeto desenvolvido como TCC
- Universidade: [Nome da Universidade]
- Ano: 2025

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como Trabalho de Conclusão de Curso.

---

## 🙏 Agradecimentos

- Hugging Face pela disponibilização de modelos de IA
- Comunidade Django e React pelas ferramentas incríveis
- Adam Geitgey pela biblioteca face_recognition
- Salesforce e Facebook AI Research pelos modelos BLIP e DETR

---

**LipeNet** - Inteligência Artificial encontra suas memórias 📸✨
