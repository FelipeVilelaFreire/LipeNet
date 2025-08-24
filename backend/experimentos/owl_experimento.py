import torch
from PIL import Image
import requests
from transformers import OwlViTProcessor, OwlViTForObjectDetection

def analisar_imagem_com_owl(caminho_ou_url, etiquetas_candidatas, is_url=False):
    print("--- INICIANDO EXPERIMENTO OWL-ViT (V3 - SEM DUPLICATAS) ---")

    # --- 1. Carregar o modelo e o processador ---
    print("Carregando modelo e processador...")
    processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
    model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")
    print("Modelo carregado com sucesso.")

    # --- 2. Carregar a imagem ---
    try:
        if is_url:
            image = Image.open(requests.get(caminho_ou_url, stream=True).raw).convert("RGB")
        else:
            image = Image.open(caminho_ou_url).convert("RGB")
        print("Imagem carregada.")
    except Exception as e:
        print(f"Erro ao carregar a imagem: {e}")
        return

    # --- 3. Processar e Analisar ---
    print(f"\nProcurando por: {etiquetas_candidatas}")
    inputs = processor(text=[etiquetas_candidatas], images=image, return_tensors="pt")
    outputs = model(**inputs)

    # --- 4. Pós-processar e Exibir os Resultados ---
    nivel_de_confianca = 0.03
    target_sizes = torch.Tensor([image.size[::-1]])
    results = processor.post_process_object_detection(
        outputs=outputs, target_sizes=target_sizes, threshold=nivel_de_confianca
    )

    print(f"\n--- RESULTADOS DA DETECÇÃO (Confiança Mínima: {nivel_de_confianca}) ---")
    scores = results[0]["scores"].tolist()
    labels = results[0]["labels"].tolist()

    if not scores:
        print("Nenhum objeto encontrado.")
    else:
        # ############################################################### #
        # NOVA LÓGICA PARA EVITAR DUPLICATAS                              #
        # ############################################################### #
        etiquetas_ja_exibidas = set() # Usamos um 'set' para eficiência
        resultados_ordenados = sorted(zip(scores, labels), key=lambda x: x[0], reverse=True)

        for score, label_index in resultados_ordenados:
            etiqueta_detectada = etiquetas_candidatas[label_index]

            # Verificamos se já exibimos esta etiqueta
            if etiqueta_detectada not in etiquetas_ja_exibidas:
                # Se for nova, a exibimos...
                print(f"  - Objeto: '{etiqueta_detectada}' | Confiança: {score:.2f}")
                # ...e a adicionamos ao nosso controle para não repetir.
                etiquetas_ja_exibidas.add(etiqueta_detectada)

    print("\n--- EXPERIMENTO CONCLUÍDO ---")


# --- ÁREA DE TESTE ---
caminho_local_da_foto = "../media/photos/FotoEspontanea.jpg"

etiquetas_para_teste = [
    "homem", "estádio", "torcida", "bandeira",
    "camisa de futebol", "camisa de time", "camisa",
    "sorriso", "pessoa", "cachecol", "escudo", "bermuda"
]

analisar_imagem_com_owl(caminho_local_da_foto, etiquetas_para_teste, is_url=False)
