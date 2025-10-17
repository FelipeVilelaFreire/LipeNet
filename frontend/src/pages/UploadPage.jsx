import { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiX, FiImage, FiCheck, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

function UploadPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [originalCaption, setOriginalCaption] = useState(''); // Caption original da IA
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [aiCaptionGenerated, setAiCaptionGenerated] = useState(false);
  const [userEditedDescription, setUserEditedDescription] = useState(false); // Rastreia se usuário editou manualmente
  const [detectedPersons, setDetectedPersons] = useState([]);
  const [detectedPersonsInitial, setDetectedPersonsInitial] = useState([]); // Nomes iniciais das pessoas
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [processingStep, setProcessingStep] = useState(''); // Novo: rastreia etapa atual
  const [editingPersonIndex, setEditingPersonIndex] = useState(null); // Índice da pessoa sendo editada
  const [editingPersonName, setEditingPersonName] = useState(''); // Nome temporário durante edição
  const [existingPersons, setExistingPersons] = useState([]); // Pessoas já cadastradas no banco
  const [filteredPersons, setFilteredPersons] = useState([]); // Pessoas filtradas pela busca
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Gera descrição prévia com IA
      await generateAICaption(file);
    } else {
      alert('Por favor, selecione apenas arquivos de imagem.');
    }
  };

  // Busca pessoas já cadastradas no banco
  const fetchExistingPersons = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/persons/');
      setExistingPersons(response.data);
    } catch (error) {
      console.error('Erro ao buscar pessoas existentes:', error);
    }
  };

  const generateAICaption = async (file) => {
    setIsGeneratingCaption(true);
    setAiCaptionGenerated(false);
    setUserEditedDescription(false); // Reset do flag de edição
    setDescription('');
    setOriginalCaption('');
    setDetectedPersons([]);
    setDetectedPersonsInitial([]);
    setSelectedPersons([]);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Busca pessoas existentes paralelamente
      fetchExistingPersons();

      // Passo 1: Gerando descrição
      setProcessingStep('Gerando descrição com IA...');

      // Pequeno delay para mostrar a etapa
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await axios.post(
        'http://127.0.0.1:8000/api/photos/preview/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.caption) {
        // Usa caption em português se disponível, senão usa em inglês
        const displayCaption = response.data.caption_pt || response.data.caption;
        setDescription(displayCaption);
        setOriginalCaption(displayCaption); // Guarda caption original
        setAiCaptionGenerated(true);
      }

      // Passo 2: Detectando rostos
      setProcessingStep('Detectando rostos...');

      // Delay para mostrar a transição de etapa
      await new Promise(resolve => setTimeout(resolve, 500));

      if (response.data.detected_persons && response.data.detected_persons.length > 0) {
        setDetectedPersons(response.data.detected_persons);
        setDetectedPersonsInitial(response.data.detected_persons.map(p => p.name)); // Guarda nomes iniciais
        // Por padrão, todas as pessoas detectadas são selecionadas
        setSelectedPersons(response.data.detected_persons.map((_, index) => index));

        // Pequeno delay final para mostrar o resultado
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Erro ao gerar descrição com IA:', error);
      setDescription('');
      setOriginalCaption('');
      setAiCaptionGenerated(false);
      setDetectedPersons([]);
      setDetectedPersonsInitial([]);
      setSelectedPersons([]);
    } finally {
      setIsGeneratingCaption(false);
      setProcessingStep('');
    }
  };

  const togglePersonSelection = (index) => {
    setSelectedPersons(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const startEditingPerson = (index, currentName) => {
    setEditingPersonIndex(index);
    setEditingPersonName(currentName);
    setFilteredPersons(existingPersons); // Mostra todas as pessoas inicialmente
  };

  const savePersonName = (index) => {
    if (editingPersonName.trim()) {
      setDetectedPersons(prev =>
        prev.map((person, i) =>
          i === index ? { ...person, name: editingPersonName.trim() } : person
        )
      );
    }
    setEditingPersonIndex(null);
    setEditingPersonName('');
    setFilteredPersons([]);
  };

  const cancelEditingPerson = () => {
    setEditingPersonIndex(null);
    setEditingPersonName('');
    setFilteredPersons([]);
  };

  // Seleciona pessoa existente do banco
  const selectExistingPerson = (index, existingPerson) => {
    setDetectedPersons(prev =>
      prev.map((person, i) =>
        i === index ? { ...person, id: existingPerson.id, name: existingPerson.name, is_known: true } : person
      )
    );
    setEditingPersonIndex(null);
    setEditingPersonName('');
    setFilteredPersons([]);
  };

  // Filtra pessoas conforme o usuário digita
  const handleNameInputChange = (value) => {
    setEditingPersonName(value);

    if (value.trim() === '') {
      setFilteredPersons(existingPersons);
    } else {
      const filtered = existingPersons.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPersons(filtered);
    }
  };

  // Atualiza descrição quando nomes de pessoas mudam
  const updateDescriptionWithNames = () => {
    // Não atualiza se usuário editou manualmente a descrição
    if (userEditedDescription || !originalCaption || detectedPersons.length === 0) return;

    let updatedCaption = originalCaption;

    // Para cada pessoa detectada, substitui o nome inicial pelo nome atual
    detectedPersonsInitial.forEach((initialName, index) => {
      const currentPerson = detectedPersons[index];
      if (currentPerson && currentPerson.name !== initialName) {
        // Cria regex para encontrar o nome inicial (case insensitive, mas preserva o case original)
        const regex = new RegExp(initialName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        // Substitui todas as ocorrências do nome inicial pelo nome atual
        updatedCaption = updatedCaption.replace(regex, (match) => {
          // Preserva a capitalização do match original
          if (match[0] === match[0].toUpperCase()) {
            return currentPerson.name.charAt(0).toUpperCase() + currentPerson.name.slice(1);
          }
          return currentPerson.name;
        });
      }
    });

    setDescription(updatedCaption);
  };

  // useEffect para atualizar descrição quando pessoas mudarem
  useEffect(() => {
    updateDescriptionWithNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedPersons]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('text', description);
    if (location) {
      formData.append('location', location);
    }

    // Adiciona IDs das pessoas selecionadas e nomes customizados
    if (detectedPersons.length > 0) {
      const selectedPersonIds = selectedPersons.map(index => detectedPersons[index].id).filter(id => id !== null);
      formData.append('selected_persons', JSON.stringify(selectedPersonIds));

      // Mapeia IDs para nomes customizados (apenas pessoas editadas)
      const customNames = {};
      const newPersons = []; // Novas pessoas para criar

      selectedPersons.forEach(index => {
        const person = detectedPersons[index];

        // Se tem ID e nome foi alterado
        if (person.id && !person.name.startsWith('Pessoa Desconhecida')) {
          customNames[person.id] = person.name;
        }

        // Se NÃO tem ID mas o nome foi alterado (pessoa desconhecida renomeada)
        if (!person.id && !person.name.startsWith('Pessoa Desconhecida')) {
          newPersons.push({
            name: person.name,
            encoding: person.encoding
          });
        }
      });

      if (Object.keys(customNames).length > 0) {
        formData.append('custom_person_names', JSON.stringify(customNames));
      }

      if (newPersons.length > 0) {
        formData.append('new_persons', JSON.stringify(newPersons));
      }
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(
        'http://127.0.0.1:8000/api/photos/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar a foto. Por favor, tente novamente.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setDescription('');
    setOriginalCaption('');
    setUserEditedDescription(false);
    setAiCaptionGenerated(false);
    setIsGeneratingCaption(false);
    setProcessingStep('');
    setDetectedPersons([]);
    setDetectedPersonsInitial([]);
    setSelectedPersons([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setDescription('');
    setOriginalCaption('');
    setUserEditedDescription(false);
    setLocation('');
    setUploadProgress(0);
    setUploadSuccess(false);
    setAiCaptionGenerated(false);
    setIsGeneratingCaption(false);
    setProcessingStep('');
    setDetectedPersons([]);
    setDetectedPersonsInitial([]);
    setSelectedPersons([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadSuccess) {
    return (
      <div className="upload-page">
        <div className="upload-success">
          <div className="success-icon">
            <FiCheck />
          </div>
          <h2>Upload Concluído!</h2>
          <p>Sua foto foi enviada com sucesso e está sendo processada.</p>
          <button onClick={resetForm} className="btn btn-primary">
            Enviar Outra Foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Compartilhe suas memórias</h1>
          <p className="text-muted">
            Adicione fotos à sua galeria familiar e deixe a IA organizar tudo para você
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`dropzone ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-preview' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            {!imagePreview ? (
              <div className="dropzone-content">
                <FiUploadCloud className="dropzone-icon" />
                <h3>Arraste sua foto aqui</h3>
                <p>ou clique para selecionar</p>
                <span className="file-types">JPG, PNG, GIF até 10MB</span>
              </div>
            ) : (
              <div className="preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <FiX />
                </button>
                <div className="image-info">
                  <FiImage />
                  <span>{imageFile.name}</span>
                  <span className="file-size">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="file-input-hidden"
            />
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="description">
                Descrição
                {isGeneratingCaption && (
                  <span className="generating-badge">
                    <span className="spinner-small"></span>
                    {processingStep || 'Processando...'}
                  </span>
                )}
                {aiCaptionGenerated && !isGeneratingCaption && (
                  <span className="ai-badge">
                    ✨ Descrição gerada pela IA
                  </span>
                )}
              </label>
              <textarea
                id="description"
                placeholder={isGeneratingCaption ? "Aguarde, a IA está analisando a imagem..." : "Conte a história por trás desta foto..."}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setUserEditedDescription(true); // Marca que usuário editou
                  if (aiCaptionGenerated) {
                    setAiCaptionGenerated(false);
                  }
                }}
                rows="4"
                className={`form-textarea ${isGeneratingCaption ? 'generating' : ''}`}
                disabled={isGeneratingCaption}
              />
              <span className="field-hint">
                {aiCaptionGenerated
                  ? "Você pode editar a descrição gerada pela IA ou deixá-la como está"
                  : "A IA usará esta descrição para melhorar a busca"}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="location">Local (opcional)</label>
              <input
                id="location"
                type="text"
                placeholder="Ex: Praia de Copacabana, Rio de Janeiro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Pessoas Detectadas */}
            {(detectedPersons.length > 0 || isGeneratingCaption) && (
              <div className="form-group">
                <label>
                  Pessoas Detectadas
                  {isGeneratingCaption && processingStep === 'Detectando rostos...' && (
                    <span className="generating-badge">
                      <span className="spinner-small"></span>
                      {processingStep}
                    </span>
                  )}
                  {detectedPersons.length > 0 && !isGeneratingCaption && (
                    <span className="ai-badge">
                      👥 {detectedPersons.length} pessoa{detectedPersons.length !== 1 ? 's' : ''} encontrada{detectedPersons.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </label>
                <div className="detected-persons-container">
                  {detectedPersons.map((person, index) => (
                    <div key={index} className="person-tag-wrapper">
                      {editingPersonIndex === index ? (
                        <div className="person-edit-dropdown">
                          <div className="person-tag-edit">
                            <input
                              type="text"
                              value={editingPersonName}
                              onChange={(e) => handleNameInputChange(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') savePersonName(index);
                                if (e.key === 'Escape') cancelEditingPerson();
                              }}
                              className="person-name-input"
                              placeholder="Digite o nome ou selecione abaixo"
                              autoFocus
                            />
                            <div className="person-edit-actions">
                              <button
                                type="button"
                                onClick={() => savePersonName(index)}
                                className="person-edit-btn save"
                                title="Salvar (Enter)"
                              >
                                <FiCheck size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingPerson}
                                className="person-edit-btn cancel"
                                title="Cancelar (Esc)"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Lista de pessoas existentes */}
                          {filteredPersons.length > 0 && (
                            <div className="existing-persons-list">
                              <div className="list-header">
                                <span>Pessoas cadastradas:</span>
                              </div>
                              <div className="persons-scroll">
                                {filteredPersons.map((existingPerson) => (
                                  <button
                                    key={existingPerson.id}
                                    type="button"
                                    className="existing-person-item"
                                    onClick={() => selectExistingPerson(index, existingPerson)}
                                  >
                                    <div className="person-avatar">
                                      {existingPerson.representative_photo ? (
                                        <img src={existingPerson.representative_photo} alt={existingPerson.name} />
                                      ) : (
                                        <span>{existingPerson.name.charAt(0).toUpperCase()}</span>
                                      )}
                                    </div>
                                    <div className="person-info">
                                      <span className="person-name-text">{existingPerson.name}</span>
                                      <span className="person-photo-count">{existingPerson.photo_count} fotos</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`person-tag ${selectedPersons.includes(index) ? 'selected' : 'unselected'} ${person.is_known ? 'known' : 'unknown'}`}
                          onClick={() => togglePersonSelection(index)}
                        >
                          <div className="person-tag-content">
                            <span className="person-name">{person.name}</span>
                          </div>
                          <div className="person-tag-actions">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingPerson(index, person.name);
                              }}
                              className="person-edit-icon"
                              title="Editar nome"
                            >
                              <FiEdit2 size={11} />
                            </button>
                            {selectedPersons.includes(index) ? (
                              <span className="tag-icon">✓</span>
                            ) : (
                              <span className="tag-icon">✕</span>
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <span className="field-hint">
                  Clique nas pessoas para incluir ou remover. Use o ícone de edição para alterar o nome.
                  {selectedPersons.length === 0
                    ? " Nenhuma pessoa selecionada."
                    : ` ${selectedPersons.length} pessoa(s) selecionada(s).`}
                </span>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="upload-progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">
                Enviando... {uploadProgress}%
              </span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!imageFile || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <FiUploadCloud />
                  Enviar Foto
                </>
              )}
            </button>
          </div>
        </form>

        <div className="upload-tips">
          <h4>Dicas para melhores resultados:</h4>
          <ul>
            <li>Use fotos de alta qualidade para melhor reconhecimento facial</li>
            <li>Adicione descrições detalhadas para facilitar a busca</li>
            <li>Inclua o local para organizar por eventos e viagens</li>
            <li>A IA identificará automaticamente pessoas e objetos na foto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;