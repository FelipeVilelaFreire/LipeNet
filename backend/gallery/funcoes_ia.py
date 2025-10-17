"""Funções de Inteligência Artificial para processamento de imagens"""

import os
import warnings
import numpy as np
import face_recognition
from collections import Counter
from PIL import Image, ImageEnhance, ImageStat
from transformers import pipeline

from .models import Photo, Tag, Person

# Configuração
warnings.filterwarnings("ignore", category=UserWarning, module='torch.nn.modules.module')
warnings.filterwarnings("ignore", category=FutureWarning, module='transformers.models.auto.modeling_auto')

# Modelos de IA
captioner = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")
object_detector = pipeline("object-detection", model="facebook/detr-resnet-101")

# Cache global de rostos
known_face_encodings = []
known_face_names = []


# ============================================================================
# CACHE DE ROSTOS
# ============================================================================

def inicializar_cache_rostos():
    """Carrega rostos conhecidos do banco para o cache"""
    global known_face_encodings, known_face_names
    known_face_encodings.clear()
    known_face_names.clear()

    for person in Person.objects.all():
        known_face_encodings.append(person.encoding)
        known_face_names.append(person.name)


def update_face_cache_after_delete(person_name):
    """Remove pessoa do cache após deleção"""
    global known_face_encodings, known_face_names
    try:
        index = known_face_names.index(person_name)
        known_face_encodings.pop(index)
        known_face_names.pop(index)
    except (ValueError, IndexError):
        pass


def detect_faces_for_preview(pil_image):
    """Detecta e identifica rostos para preview (sem salvar no banco)"""
    global known_face_encodings, known_face_names

    img_array = np.array(pil_image)
    model_type = "cnn" if img_array.shape[0] * img_array.shape[1] < 4000000 else "hog"
    face_locations = face_recognition.face_locations(img_array, number_of_times_to_upsample=1, model=model_type)
    face_encodings = face_recognition.face_encodings(img_array, face_locations, num_jitters=2)

    detected_persons = []
    for idx, (face_encoding, face_location) in enumerate(zip(face_encodings, face_locations)):
        top, right, bottom, left = face_location
        face_area = (bottom - top) * (right - left)
        face_prominence = face_area / (img_array.shape[0] * img_array.shape[1])

        tolerance = 0.5 if face_prominence > 0.1 else 0.55 if face_prominence > 0.05 else 0.6

        person_id = None
        person_name = f"Pessoa Desconhecida {idx + 1}"

        if len(known_face_encodings) > 0:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=tolerance)

            if True in matches:
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                valid_matches = [(i, d) for i, (m, d) in enumerate(zip(matches, face_distances)) if m and d < tolerance]

                if valid_matches:
                    best_match_index = min(valid_matches, key=lambda x: x[1])[0]
                    person_name = known_face_names[best_match_index]

                    try:
                        person = Person.objects.filter(name=person_name).first()
                        if person:
                            person_id = person.id
                    except:
                        pass

        detected_persons.append({
            "id": person_id,
            "name": person_name,
            "is_known": person_id is not None,
            "encoding": face_encoding.tolist()  # Adiciona encoding para usar no upload
        })

    return detected_persons


# ============================================================================
# ANÁLISE DE IMAGEM
# ============================================================================

def analyze_image_colors(pil_image):
    """Analisa cores e características visuais da imagem"""
    try:
        img_sample = pil_image.resize((128, 128))
        colors = np.array(img_sample)

        avg_color = np.mean(colors, axis=(0, 1))
        std_color = np.std(colors, axis=(0, 1))

        brightness = np.mean(avg_color)
        contrast = std_color.mean()

        r_dominance = avg_color[0] / (avg_color.sum() + 1e-6)
        g_dominance = avg_color[1] / (avg_color.sum() + 1e-6)
        b_dominance = avg_color[2] / (avg_color.sum() + 1e-6)

        return {
            'avg_color': avg_color,
            'std_color': std_color,
            'brightness': brightness,
            'contrast': contrast,
            'is_bright': brightness > 190,
            'is_dark': brightness < 80,
            'is_warm': avg_color[0] > avg_color[1] + 25 and avg_color[0] > avg_color[2] + 25,
            'is_cool': avg_color[2] > avg_color[0] + 25 and avg_color[2] > avg_color[1] + 25,
            'is_green': avg_color[1] > avg_color[0] + 20 and avg_color[1] > avg_color[2] + 20,
            'is_high_contrast': contrast > 60,
            'is_low_contrast': contrast < 25,
            'is_saturated': std_color.max() > 80,
            'dominant_channel': ['red', 'green', 'blue'][np.argmax([r_dominance, g_dominance, b_dominance])]
        }
    except Exception as e:
        print(f"Erro na análise de cores: {e}")
        return None


# ============================================================================
# GERAÇÃO DE DESCRIÇÃO
# ============================================================================

def personalize_caption_with_names(caption, person_names):
    """Substitui termos genéricos por nomes reais das pessoas"""
    import re

    if not person_names:
        return caption

    # Separa pessoas conhecidas e desconhecidas, mantendo ordem: conhecidas primeiro
    known_persons = [name for name in person_names if not name.startswith('Pessoa Desconhecida') and not name.startswith('Pessoa ')]
    unknown_persons = [name for name in person_names if name.startswith('Pessoa Desconhecida') or name.startswith('Pessoa ')]

    # Lista completa: conhecidas + desconhecidas
    all_persons = known_persons + unknown_persons

    if not all_persons:
        return caption

    caption_lower = caption.lower()

    # Substitui números de pessoas (two men, three people, etc)
    numbers_map = {
        'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
        'a couple of': 2, 'several': len(all_persons)
    }

    for num_word, num_value in numbers_map.items():
        if num_word in caption_lower and len(all_persons) >= num_value:
            pattern = rf'\b{num_word}\s+(men|women|people|persons)\b'
            if re.search(pattern, caption_lower):
                selected_names = all_persons[:num_value]
                # Formata: "Felipe, Papai and Pessoa Desconhecida 1"
                if len(selected_names) == 2:
                    names_str = f"{selected_names[0]} and {selected_names[1]}"
                elif len(selected_names) > 2:
                    names_str = ', '.join(selected_names[:-1]) + f' and {selected_names[-1]}'
                else:
                    names_str = selected_names[0]

                caption = re.sub(pattern, names_str, caption, flags=re.IGNORECASE)
                break

    # Substitui "man and woman" / "woman and man"
    if 'man and woman' in caption_lower or 'woman and man' in caption_lower:
        if len(all_persons) >= 2:
            names_str = f"{all_persons[0]} and {all_persons[1]}"
            caption = re.sub(r'\ba man and (a )?woman\b', names_str, caption, flags=re.IGNORECASE)
            caption = re.sub(r'\ba woman and (a )?man\b', names_str, caption, flags=re.IGNORECASE)
            caption = re.sub(r'\b(man and woman|woman and man)\b', names_str, caption, flags=re.IGNORECASE)

    # Substitui "person on the left/right/center"
    if len(all_persons) >= 1:
        if 'person on the right' in caption_lower:
            caption = re.sub(r'\bperson on the right\b', f"{all_persons[-1]} on the right", caption, flags=re.IGNORECASE)

        if 'person on the left' in caption_lower:
            caption = re.sub(r'\bperson on the left\b', f"{all_persons[0]} on the left", caption, flags=re.IGNORECASE)

        if 'person in the center' in caption_lower:
            caption = re.sub(r'\bperson in the center\b', f"{all_persons[0]} in the center", caption, flags=re.IGNORECASE)

    # Substitui "person" genérico se houver apenas uma pessoa
    if len(all_persons) == 1:
        caption = re.sub(r'\ba person\b', all_persons[0], caption, flags=re.IGNORECASE)
        caption = re.sub(r'\bthe person\b', all_persons[0], caption, flags=re.IGNORECASE)

    # Substitui "man" ou "woman" genérico
    if len(all_persons) >= 1:
        if re.search(r'\ba man\b', caption, flags=re.IGNORECASE):
            caption = re.sub(r'\ba man\b', all_persons[0], caption, flags=re.IGNORECASE, count=1)
        elif re.search(r'\bthe man\b', caption, flags=re.IGNORECASE):
            caption = re.sub(r'\bthe man\b', all_persons[0], caption, flags=re.IGNORECASE, count=1)

        if len(all_persons) >= 2:
            if re.search(r'\ba woman\b', caption, flags=re.IGNORECASE):
                caption = re.sub(r'\ba woman\b', all_persons[1], caption, flags=re.IGNORECASE, count=1)
            elif re.search(r'\bthe woman\b', caption, flags=re.IGNORECASE):
                caption = re.sub(r'\bthe woman\b', all_persons[1], caption, flags=re.IGNORECASE, count=1)
        elif re.search(r'\ba woman\b', caption, flags=re.IGNORECASE):
            caption = re.sub(r'\ba woman\b', all_persons[0], caption, flags=re.IGNORECASE, count=1)

    return caption


def enhance_description(basic_caption, detected_objects, pil_image, person_names=None):
    """Enriquece descrição básica com objetos, cores e composição"""
    # Personaliza caption básica primeiro
    if person_names:
        basic_caption = personalize_caption_with_names(basic_caption, person_names)

    enhanced_parts = [basic_caption]
    high_confidence = []
    medium_confidence = []
    object_positions = []

    # Analisa objetos detectados
    for obj in detected_objects:
        obj_name = obj['label'].replace('_', ' ').replace('-', ' ')

        if obj['score'] > 0.9:
            high_confidence.append(obj_name)
            # Posição do objeto
            if 'box' in obj:
                box = obj['box']
                x_center = (box['xmin'] + box['xmax']) / 2
                if x_center < 0.4:
                    object_positions.append(f"{obj_name} on the left")
                elif x_center > 0.6:
                    object_positions.append(f"{obj_name} on the right")
                else:
                    object_positions.append(f"{obj_name} in the center")
        elif obj['score'] > 0.75:
            medium_confidence.append(obj_name)

    # Adiciona objetos principais
    if high_confidence:
        unique = list(set(high_confidence))[:5]
        if len(unique) > 2:
            enhanced_parts.append(f"prominently showing {', '.join(unique[:-1])} and {unique[-1]}")
        elif len(unique) == 2:
            enhanced_parts.append(f"featuring {unique[0]} and {unique[1]}")
        else:
            enhanced_parts.append(f"focused on {unique[0]}")

    # Objetos secundários
    if medium_confidence:
        secondary = list(set(medium_confidence))[:2]
        enhanced_parts.append(f"with {' and '.join(secondary)} in the background")

    # Análise de cores
    color_info = analyze_image_colors(pil_image)
    if color_info:
        if color_info['is_high_contrast']:
            enhanced_parts.append("with high contrast and dramatic lighting")
        elif color_info['is_low_contrast']:
            enhanced_parts.append("with soft, muted tones")

        if color_info['is_warm']:
            enhanced_parts.append("bathed in warm golden light" if color_info['brightness'] > 180 else "with rich warm tones")
        elif color_info['is_cool']:
            enhanced_parts.append("with vibrant cool colors" if color_info['is_saturated'] else "in subtle cool tones")
        elif color_info['is_green']:
            enhanced_parts.append("surrounded by natural greenery")

        if color_info['is_bright']:
            enhanced_parts.append("in brilliant daylight" if color_info['is_saturated'] else "under bright, even lighting")
        elif color_info['is_dark']:
            enhanced_parts.append("with dramatic shadows" if color_info['is_high_contrast'] else "in atmospheric low light")

    # Posicionamento
    if object_positions and len(object_positions) <= 3:
        enhanced_parts.append(f"composition showing {', '.join(object_positions[:2])}")

    # Junta todas as partes e personaliza novamente (para pegar "person" adicionados na composição)
    final_description = " ".join(enhanced_parts)
    if person_names:
        final_description = personalize_caption_with_names(final_description, person_names)

    return final_description


# ============================================================================
# GERAÇÃO DE TAGS
# ============================================================================

def generate_smart_tags(detected_objects, pil_image):
    """Gera tags inteligentes baseadas em objetos e análise visual"""
    found_tags = set()
    object_counts = Counter()

    # Processa objetos detectados
    for obj in detected_objects:
        tag_name = obj['label'].lower().replace('_', ' ').replace('-', ' ')

        if obj['score'] > 0.9:
            object_counts[tag_name] += 1
            found_tags.add(tag_name)
            # Tags contextuais
            if 'person' in tag_name:
                found_tags.add('people')
            elif 'car' in tag_name or 'truck' in tag_name:
                found_tags.add('vehicle')
            elif 'dog' in tag_name or 'cat' in tag_name:
                found_tags.add('pet')
        elif obj['score'] > 0.7:
            object_counts[tag_name] += 1
            found_tags.add(tag_name)

    add_contextual_tags(found_tags, list(object_counts.keys()))
    add_count_based_tags(found_tags, object_counts)
    add_color_tags(found_tags, pil_image)

    return list(found_tags)


def add_contextual_tags(found_tags, objects_list):
    """Adiciona tags de categoria baseadas em objetos"""
    context_mapping = {
        'transportation': ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'airplane', 'boat', 'train'],
        'nature': ['tree', 'grass', 'flower', 'plant', 'leaf', 'forest', 'mountain', 'river', 'sky'],
        'architecture': ['building', 'house', 'skyscraper', 'bridge', 'tower', 'church', 'castle'],
        'furniture': ['chair', 'table', 'couch', 'bed', 'desk', 'cabinet', 'shelf', 'sofa'],
        'technology': ['laptop', 'computer', 'phone', 'screen', 'keyboard', 'monitor', 'camera', 'tablet'],
        'animals': ['dog', 'cat', 'bird', 'horse', 'cow', 'sheep', 'elephant', 'lion'],
        'food': ['pizza', 'sandwich', 'cake', 'apple', 'banana', 'wine', 'coffee', 'bread'],
        'sports': ['ball', 'racket', 'bicycle', 'skateboard', 'surfboard', 'skis'],
        'urban': ['street', 'traffic light', 'stop sign', 'parking meter', 'sidewalk'],
        'indoor': ['door', 'window', 'wall', 'ceiling', 'floor', 'room'],
        'outdoor': ['sky', 'cloud', 'sun', 'mountain', 'beach', 'ocean', 'field']
    }

    for category, items in context_mapping.items():
        if any(item in objects_list for item in items):
            found_tags.add(category)


def add_count_based_tags(found_tags, object_counts):
    """Tags baseadas em quantidade de objetos"""
    if not object_counts:
        return

    total_objects = sum(object_counts.values())

    if total_objects > 5:
        found_tags.add('busy')
        found_tags.add('complex scene')
    elif total_objects == 1:
        found_tags.add('minimalist')
        found_tags.add('focused')

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
    """Tags baseadas em análise de cores"""
    try:
        img_small = pil_image.resize((100, 100))
        colors = np.array(img_small)
        avg_color = colors.mean(axis=(0, 1))
        std_color = colors.std(axis=(0, 1))

        brightness = avg_color.mean()
        contrast = std_color.mean()

        # Luminosidade
        if brightness > 220:
            found_tags.add('very bright')
            found_tags.add('high key')
        elif brightness > 180:
            found_tags.add('bright')
            found_tags.add('well lit')
        elif brightness < 40:
            found_tags.add('very dark')
            found_tags.add('low key')
        elif brightness < 80:
            found_tags.add('dark')
            found_tags.add('moody')

        # Contraste
        if contrast > 80:
            found_tags.add('high contrast')
            found_tags.add('dramatic')
        elif contrast > 60:
            found_tags.add('vibrant')
            found_tags.add('colorful')
        elif contrast < 15:
            found_tags.add('low contrast')
            found_tags.add('soft')

        # Saturação
        saturation = np.max(std_color) - np.min(std_color)
        if saturation > 50:
            found_tags.add('highly saturated')
        elif saturation < 10:
            found_tags.add('desaturated')
            if std_color.mean() < 15:
                found_tags.add('monochrome')

        # Temperatura de cor
        r_bias = avg_color[0] - avg_color.mean()
        b_bias = avg_color[2] - avg_color.mean()
        g_bias = avg_color[1] - avg_color.mean()

        if r_bias > 20:
            found_tags.add('warm tones')
            if r_bias > 40:
                found_tags.add('sunset colors')
        elif b_bias > 20:
            found_tags.add('cool tones')
            if b_bias > 40:
                found_tags.add('blue hour')
        elif g_bias > 15:
            found_tags.add('green tones')

        # Estilos fotográficos
        if brightness > 180 and contrast < 30:
            found_tags.add('soft light')
            found_tags.add('dreamy')
        elif brightness < 80 and contrast > 60:
            found_tags.add('noir style')
            found_tags.add('cinematic')

    except Exception as e:
        print(f"Erro na análise de cores: {e}")


# ============================================================================
# RECONHECIMENTO FACIAL
# ============================================================================

def process_face_recognition(img_array, photo):
    """Detecta e identifica rostos na imagem"""
    global known_face_encodings, known_face_names

    # Escolhe modelo baseado no tamanho da imagem
    model_type = "cnn" if img_array.shape[0] * img_array.shape[1] < 4000000 else "hog"
    face_locations = face_recognition.face_locations(img_array, number_of_times_to_upsample=1, model=model_type)
    face_encodings = face_recognition.face_encodings(img_array, face_locations, num_jitters=2)

    for face_encoding, face_location in zip(face_encodings, face_locations):
        # Calcula proeminência do rosto
        top, right, bottom, left = face_location
        face_area = (bottom - top) * (right - left)
        face_prominence = face_area / (img_array.shape[0] * img_array.shape[1])

        person = identify_or_create_person(face_encoding, face_prominence)
        if person:
            photo.persons.add(person)
            # Define foto principal se rosto for grande
            if face_prominence > 0.05 and not person.photo_principal:
                person.photo_principal = photo
                person.save()


def identify_or_create_person(face_encoding, face_prominence=0.0):
    """Identifica pessoa conhecida ou cria nova entrada"""
    global known_face_encodings, known_face_names

    if len(known_face_encodings) > 0:
        # Tolerância adaptativa baseada no tamanho do rosto
        tolerance = 0.5 if face_prominence > 0.1 else 0.55 if face_prominence > 0.05 else 0.6

        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=tolerance)

        if True in matches:
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            valid_matches = [(i, d) for i, (m, d) in enumerate(zip(matches, face_distances)) if m and d < tolerance]

            if valid_matches:
                best_match_index = min(valid_matches, key=lambda x: x[1])[0]

                person_name = known_face_names[best_match_index]
                person = Person.objects.filter(name=person_name).first()

                if person:
                    # Atualiza encoding com média ponderada para melhorar precisão
                    if face_prominence > 0.08:
                        current_encoding = np.array(person.encoding)
                        weight_new = min(0.3, face_prominence * 2)
                        weight_old = 1 - weight_new

                        updated_encoding = (current_encoding * weight_old + face_encoding * weight_new)
                        updated_encoding = updated_encoding / np.linalg.norm(updated_encoding)

                        person.encoding = updated_encoding.tolist()
                        person.save()

                        known_face_encodings[best_match_index] = updated_encoding

                    return person

    # Cria nova pessoa
    person_count = Person.objects.count()
    person_name = f"Pessoa {person_count + 1}"

    if face_prominence > 0.1:
        person_name = f"Pessoa {person_count + 1} (HD)"
    elif face_prominence < 0.02:
        person_name = f"Pessoa {person_count + 1} (Distante)"

    person = Person.objects.create(name=person_name, encoding=face_encoding.tolist())

    known_face_encodings.append(face_encoding)
    known_face_names.append(person_name)

    return person


# ============================================================================
# PROCESSAMENTO PRINCIPAL
# ============================================================================

def process_photo_with_ai(photo, image_file):
    """Processa foto com IA completa: caption, objetos, tags e rostos"""
    try:
        pil_image = Image.open(image_file).convert('RGB')

        # Redimensiona se muito grande (max 2048px)
        if pil_image.width > 2048 or pil_image.height > 2048:
            pil_image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)

        # Ajusta contraste levemente para melhor detecção
        enhancer = ImageEnhance.Contrast(pil_image)
        pil_image_enhanced = enhancer.enhance(1.1)

        # Gera descrição
        caption_results = captioner(pil_image_enhanced, max_new_tokens=50)
        basic_caption = caption_results[0]['generated_text'] if caption_results else "Image processed"

        # Detecta objetos
        detected_objects = sorted(object_detector(pil_image_enhanced), key=lambda x: x['score'], reverse=True)

        # Reconhecimento facial ANTES de gerar descrição
        img_array = np.array(pil_image)
        process_face_recognition(img_array, photo)

        # Pega nomes das pessoas identificadas para personalizar descrição
        photo.save()
        detected_person_names = [person.name for person in photo.persons.all()]

        # Enriquece descrição COM nomes das pessoas
        enhanced_caption_en = enhance_description(basic_caption, detected_objects, pil_image, detected_person_names)

        # Salva caption em inglês (original)
        photo.caption = enhanced_caption_en

        # Traduz e salva caption em português
        photo.caption_pt = translate_caption_to_portuguese(enhanced_caption_en)

        # Gera tags
        smart_tags = generate_smart_tags(detected_objects, pil_image)

        # Adiciona tags de orientação
        width, height = pil_image.size
        aspect_ratio = width / height
        if aspect_ratio > 1.5:
            smart_tags.extend(['landscape orientation', 'wide format'])
        elif aspect_ratio < 0.67:
            smart_tags.extend(['portrait orientation', 'vertical format'])
        elif 0.95 < aspect_ratio < 1.05:
            smart_tags.append('square format')

        photo.save()

        # Adiciona tags (máximo 20, sem duplicatas)
        unique_tags = []
        seen = set()
        for tag in smart_tags:
            tag_lower = tag.lower().strip()
            if tag_lower not in seen and tag_lower:
                unique_tags.append(tag_lower)
                seen.add(tag_lower)

        for tag_name in unique_tags[:20]:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            photo.tags.add(tag)

        return photo

    except Exception as e:
        # Fallback para análise básica
        try:
            pil_image = Image.open(image_file).convert('RGB')
            caption_result = captioner(pil_image)
            photo.caption = caption_result[0].get('generated_text', 'Image uploaded') if caption_result else "Image uploaded"
        except:
            photo.caption = "Image uploaded"

        photo.save()
        return photo


# ============================================================================
# TRADUÇÃO
# ============================================================================

def translate_caption_to_portuguese(caption_en):
    """Traduz caption do inglês para português usando deep-translator"""
    if not caption_en or caption_en.strip() == '':
        return ''

    try:
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator(source='en', target='pt')
        caption_pt = translator.translate(caption_en)
        return caption_pt
    except Exception as e:
        print(f"Erro ao traduzir caption: {e}")
        # Se falhar, retorna o original em inglês
        return caption_en


# ============================================================================
# UTILITÁRIOS DE ARQUIVOS
# ============================================================================

def delete_photo_file(photo):
    """Deleta arquivo físico da foto"""
    if photo.image:
        try:
            if os.path.exists(photo.image.path):
                os.remove(photo.image.path)
        except Exception as e:
            print(f"Erro ao deletar arquivo: {e}")


def clear_photo_references(photo):
    """Remove referências da foto antes de deletar"""
    for person in Person.objects.filter(photo_principal=photo):
        person.photo_principal = None
        person.save()


# Inicializa cache ao importar
inicializar_cache_rostos()
