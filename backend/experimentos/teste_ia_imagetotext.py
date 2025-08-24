from transformers import pipeline
from PIL import Image

print("Iniciando o sistema de Inteligência Artificial...")

# 2. Criamos nosso 'gerador de legendas' usando um pipeline
#    Esta linha diz ao Hugging Face: "Eu quero uma IA que transforma imagem em texto,
#    e quero usar o modelo específico 'nlpconnect/vit-gpt2-image-captioning'."
try:
    gerador_de_legenda = pipeline(
        "image-to-text", model="nlpconnect/vit-gpt2-image-captioning"
    )
    print("Modelo de IA carregado com sucesso!")

    # 3. Abrimos nossa imagem local usando a Pillow
    imagem = Image.open("../../imagens/Eu e belinha.jpg")
    print("Imagem 'Eu e belinha.jpg' carregada.")

    # 4. A MÁGICA: Passamos a imagem para a IA
    print("\nAnalisando a imagem... Isso pode levar um momento.")
    resultado = gerador_de_legenda(imagem)
    print("Análise concluída!")

    # 5. Exibimos o resultado
    legenda_gerada = resultado[0]["generated_text"]

    print("\n--- LEGENDA GERADA PELA IA ---")
    print(legenda_gerada)
    print("-----------------------------")

except Exception as e:
    print(f"\nOcorreu um erro: {e}")
    print(
        "Verifique sua conexão com a internet (para o primeiro download do modelo) ou se as bibliotecas foram instaladas corretamente."
    )
