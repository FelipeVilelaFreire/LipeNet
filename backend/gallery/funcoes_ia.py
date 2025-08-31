"""
Módulo de Funções de Inteligência Artificial
============================================

Este módulo contém todas as funções relacionadas ao processamento de IA,
incluindo reconhecimento facial, análise de imagens, geração de tags e descrições.

Estrutura:
- Inicialização de modelos de IA
- Funções de análise de imagem
- Funções de processamento de tags
- Funções de reconhecimento facial
- Funções principais de processamento
"""

import warnings
import os
from collections import Counter
import numpy as np
import face_recognition
from PIL import Image
from transformers import pipeline

from .models import Photo, Tag, Person


# ========================================================================================
# CONFIGURAÇÃO E INICIALIZAÇÃO DOS MODELOS DE IA
# ========================================================================================

# Suprimir avisos desnecessários
warnings.filterwarnings("ignore", category=UserWarning, module='torch.nn.modules.module')
warnings.filterwarnings("ignore", category=FutureWarning, module='transformers.models.auto.modeling_auto')

# Carregamento dos modelos de IA (executado uma vez ao importar o módulo)
print("Carregando modelos de IA...")
captioner = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
object_detector = pipeline("object-detection", model="facebook/detr-resnet-50")
print("Modelos de IA carregados com sucesso.")

# Cache global de rostos conhecidos
known_face_encodings = []
known_face_names = []


def inicializar_cache_rostos():
    """
    Inicializa o cache de rostos conhecidos a partir do banco de dados.
    Deve ser chamada ao iniciar a aplicação.
    """
    global known_face_encodings, known_face_names
    
    known_face_encodings.clear()
    known_face_names.clear()
    
    for person in Person.objects.all():
        known_face_encodings.append(person.encoding)
        known_face_names.append(person.name)
    
    print(f"{len(known_face_names)} rostos carregados no cache.")


# ========================================================================================
# FUNÇÕES DE ANÁLISE DE CORES E IMAGEM
# ========================================================================================

def analyze_image_colors(pil_image):
    """
    Analisa as cores dominantes e características visuais de uma imagem.
    
    Args:
        pil_image: Objeto PIL.Image para análise
        
    Returns:
        dict: Dicionário com informações sobre cores e brilho
              - avg_color: Cor média RGB
              - brightness: Nível de brilho (0-255)
              - is_bright: Se a imagem é clara
              - is_dark: Se a imagem é escura
              - is_warm: Se tem tons quentes
              - is_cool: Se tem tons frios
              - is_green: Se tem predominância verde
    """
    try:
        # Redimensiona para acelerar processamento
        img_sample = pil_image.resize((64, 64))
        avg_color = np.mean(np.array(img_sample), axis=(0, 1))
        brightness = np.mean(avg_color)
        
        color_info = {
            'avg_color': avg_color,
            'brightness': brightness,
            'is_bright': brightness > 190,
            'is_dark': brightness < 80,
            'is_warm': avg_color[0] > avg_color[1] + 25 and avg_color[0] > avg_color[2] + 25,
            'is_cool': avg_color[2] > avg_color[0] + 25 and avg_color[2] > avg_color[1] + 25,
            'is_green': avg_color[1] > avg_color[0] + 20 and avg_color[1] > avg_color[2] + 20
        }
        return color_info
    except Exception:
        return None


# ========================================================================================
# FUNÇÕES DE GERAÇÃO DE DESCRIÇÃO
# ========================================================================================

def enhance_description(basic_caption, detected_objects, pil_image):
    """
    Enriquece a descrição básica gerada pela IA com informações contextuais.
    
    Args:
        basic_caption (str): Descrição básica gerada pelo modelo de captioning
        detected_objects (list): Lista de objetos detectados pelo modelo
        pil_image: Imagem PIL para análise de cores
        
    Returns:
        str: Descrição enriquecida com contexto sobre objetos e cores
    """
    enhanced_parts = [basic_caption]

    # Adiciona objetos principais detectados com alta confiança
    main_objects = []
    for obj in detected_objects:
        if obj['score'] > 0.85:  # Apenas objetos com alta confiança
            obj_name = obj['label'].replace('_', ' ').replace('-', ' ')
            main_objects.append(obj_name)

    if main_objects:
        unique_objects = list(set(main_objects))[:4]  # Máximo 4 objetos
        if len(unique_objects) > 1:
            enhanced_parts.append(f"showing {', '.join(unique_objects[:-1])} and {unique_objects[-1]}")
        else:
            enhanced_parts.append(f"featuring {unique_objects[0]}")

    # Adiciona informações sobre cores e iluminação
    color_info = analyze_image_colors(pil_image)
    if color_info:
        # Temperatura de cor
        if color_info['is_warm']:
            enhanced_parts.append("with warm reddish lighting")
        elif color_info['is_cool']:
            enhanced_parts.append("with cool blue tones")
        elif color_info['is_green']:
            enhanced_parts.append("with natural green ambiance")
        
        # Nível de iluminação
        if color_info['is_bright']:
            enhanced_parts.append("in bright conditions")
        elif color_info['is_dark']:
            enhanced_parts.append("in low-light setting")
        elif color_info['brightness'] > 140:
            enhanced_parts.append("in good lighting")

    return " ".join(enhanced_parts)


# ========================================================================================
# FUNÇÕES DE GERAÇÃO DE TAGS
# ========================================================================================

def generate_smart_tags(detected_objects, pil_image):
    """
    Gera tags inteligentes baseadas em objetos detectados e análise visual.
    
    Args:
        detected_objects (list): Lista de objetos detectados
        pil_image: Imagem PIL para análise
        
    Returns:
        list: Lista de tags relevantes para a imagem
    """
    found_tags = set()
    object_counts = Counter()

    # Processa objetos detectados
    for obj in detected_objects:
        if obj['score'] > 0.75:  # Threshold de confiança
            tag_name = obj['label'].lower().replace('_', ' ').replace('-', ' ')
            object_counts[tag_name] += 1
            found_tags.add(tag_name)

    # Adiciona tags contextuais
    add_contextual_tags(found_tags, list(object_counts.keys()))
    
    # Adiciona tags baseadas em quantidade de objetos
    add_count_based_tags(found_tags, object_counts)
    
    # Adiciona tags de análise de cores
    add_color_tags(found_tags, pil_image)

    return list(found_tags)


def add_contextual_tags(found_tags, objects_list):
    """
    Adiciona tags de categoria baseadas nos objetos encontrados.
    
    Por exemplo: se encontrou 'car', adiciona tag 'transportation'
    """
    context_mapping = {
        'transportation': ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
        'nature': ['tree', 'grass', 'flower', 'plant', 'leaf'],
        'architecture': ['building', 'house', 'skyscraper'],
        'furniture': ['chair', 'table', 'couch', 'bed', 'desk'],
        'technology': ['laptop', 'computer', 'phone', 'screen', 'keyboard'],
        'animals': ['dog', 'cat', 'bird', 'horse'],
        'food': ['pizza', 'sandwich', 'cake', 'apple', 'banana']
    }

    for category, items in context_mapping.items():
        if any(item in objects_list for item in items):
            found_tags.add(category)


def add_count_based_tags(found_tags, object_counts):
    """
    Adiciona tags baseadas na quantidade e tipo de objetos.
    
    Por exemplo: 1 pessoa = 'portrait', 2 pessoas = 'couple', etc.
    """
    if object_counts:
        total_objects = sum(object_counts.values())
        
        # Tags baseadas na complexidade da cena
        if total_objects > 5:
            found_tags.add('busy')
            found_tags.add('complex scene')
        elif total_objects == 1:
            found_tags.add('minimalist')
            found_tags.add('focused')

        # Tags específicas para pessoas
        people_count = object_counts.get('person', 0)
        if people_count == 1:
            found_tags.add('portrait')
        elif people_count == 2:
            found_tags.add('couple')
            found_tags.add('duo')
        elif people_count > 2:
            found_tags.add('group')
            if people_count > 5:
                found_tags.add('crowd')


def add_color_tags(found_tags, pil_image):
    """
    Adiciona tags baseadas na análise de cores da imagem.
    
    Analisa: luminosidade, saturação, temperatura de cor
    """
    try:
        img_small = pil_image.resize((50, 50))
        colors = np.array(img_small)
        avg_color = colors.mean(axis=(0, 1))
        std_color = colors.std(axis=(0, 1))

        brightness = avg_color.mean()
        
        # Tags de luminosidade
        if brightness > 200:
            found_tags.add('bright')
            found_tags.add('high key')
        elif brightness < 60:
            found_tags.add('dark')
            found_tags.add('low key')

        # Tags de saturação (variação de cor)
        if std_color.mean() > 70:
            found_tags.add('colorful')
            found_tags.add('vibrant')
        elif std_color.mean() < 20:
            found_tags.add('monochrome')

        # Tags de temperatura de cor
        if avg_color[0] > avg_color[2] + 30:  # Mais vermelho que azul
            found_tags.add('warm tones')
        elif avg_color[2] > avg_color[0] + 30:  # Mais azul que vermelho
            found_tags.add('cool tones')
    except Exception:
        pass


# ========================================================================================
# FUNÇÕES DE RECONHECIMENTO FACIAL
# ========================================================================================

def process_face_recognition(img_array, photo):
    """
    Processa reconhecimento facial em uma imagem e associa pessoas à foto.
    
    Args:
        img_array: Array numpy da imagem
        photo: Objeto Photo do Django para associar pessoas
    """
    global known_face_encodings, known_face_names
    
    # Detecta rostos na imagem
    face_locations = face_recognition.face_locations(img_array)
    face_encodings = face_recognition.face_encodings(img_array, face_locations)
    
    # Processa cada rosto encontrado
    for face_encoding in face_encodings:
        person = identify_or_create_person(face_encoding)
        if person:
            photo.persons.add(person)


def identify_or_create_person(face_encoding):
    """
    Identifica uma pessoa conhecida ou cria uma nova entrada no banco.
    
    Args:
        face_encoding: Encoding do rosto detectado
        
    Returns:
        Person: Objeto Person (existente ou novo)
    """
    global known_face_encodings, known_face_names
    
    if len(known_face_encodings) > 0:
        # Compara com rostos conhecidos
        matches = face_recognition.compare_faces(
            known_face_encodings, 
            face_encoding, 
            tolerance=0.6  # Tolerância para matching (0.6 é padrão)
        )
        face_distances = face_recognition.face_distance(
            known_face_encodings, 
            face_encoding
        )
        
        if True in matches:
            # Encontra o melhor match
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                # Pessoa conhecida encontrada
                person_name = known_face_names[best_match_index]
                return Person.objects.filter(name=person_name).first()
    
    # Criar nova pessoa se não encontrou correspondência
    person_name = f"Pessoa {Person.objects.count() + 1}"
    person = Person.objects.create(
        name=person_name,
        encoding=face_encoding.tolist()  # Converte numpy array para lista
    )
    
    # Atualiza o cache
    known_face_encodings.append(face_encoding)
    known_face_names.append(person_name)
    
    return person


def update_face_cache_after_delete(person_name):
    """
    Remove uma pessoa do cache após ser deletada do banco.
    
    Args:
        person_name (str): Nome da pessoa a remover do cache
    """
    global known_face_encodings, known_face_names
    try:
        index = known_face_names.index(person_name)
        known_face_encodings.pop(index)
        known_face_names.pop(index)
    except (ValueError, IndexError):
        pass


# ========================================================================================
# FUNÇÃO PRINCIPAL DE PROCESSAMENTO
# ========================================================================================

def process_photo_with_ai(photo, image_file):
    """
    Função principal que coordena todo o processamento de IA em uma foto.
    
    Esta função:
    1. Gera uma descrição (caption) usando IA
    2. Detecta objetos na imagem
    3. Melhora a descrição com contexto
    4. Gera tags inteligentes
    5. Detecta e identifica rostos
    6. Salva tudo no banco de dados
    
    Args:
        photo: Objeto Photo do Django (ainda não salvo)
        image_file: Arquivo de imagem enviado
        
    Returns:
        Photo: Objeto photo processado e salvo
    """
    try:
        # Abre e prepara a imagem
        pil_image = Image.open(image_file)
        pil_image = pil_image.convert('RGB')  # Garante formato RGB
        
        # 1. Gera descrição básica usando modelo de captioning
        caption_result = captioner(pil_image)[0]
        basic_caption = caption_result['generated_text']
        
        # 2. Detecta objetos na imagem
        detected_objects = object_detector(pil_image)
        
        # 3. Enriquece a descrição com contexto
        photo.caption = enhance_description(basic_caption, detected_objects, pil_image)
        
        # 4. Gera tags inteligentes
        smart_tags = generate_smart_tags(detected_objects, pil_image)
        
        # 5. Prepara para reconhecimento facial
        img_array = np.array(pil_image)
        
        # Salva a foto antes de adicionar relações ManyToMany
        photo.save()
        
        # 6. Adiciona tags (limitado a 15 mais relevantes)
        for tag_name in smart_tags[:15]:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            photo.tags.add(tag)
        
        # 7. Processa reconhecimento facial
        process_face_recognition(img_array, photo)
        
        return photo
        
    except Exception as e:
        print(f"Erro na análise de IA: {e}")
        photo.caption = "Erro ao processar imagem"
        photo.save()
        return photo


# ========================================================================================
# FUNÇÕES AUXILIARES PARA GERENCIAMENTO DE ARQUIVOS
# ========================================================================================

def delete_photo_file(photo):
    """
    Deleta o arquivo físico de uma foto do disco.
    
    Args:
        photo: Objeto Photo com campo image
    """
    if photo.image:
        try:
            if os.path.exists(photo.image.path):
                os.remove(photo.image.path)
        except Exception as e:
            print(f"Erro ao deletar arquivo de imagem: {e}")


def clear_photo_references(photo):
    """
    Remove todas as referências de uma foto antes de deletá-la.
    Necessário para evitar erros de integridade referencial.
    
    Args:
        photo: Objeto Photo a ter referências removidas
    """
    # Remove foto como foto principal de qualquer pessoa
    for person in Person.objects.filter(photo_principal=photo):
        person.photo_principal = None
        person.save()


# Inicializa o cache de rostos ao importar o módulo
inicializar_cache_rostos()