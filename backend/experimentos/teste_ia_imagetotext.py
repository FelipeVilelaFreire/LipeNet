from transformers import pipeline
from PIL import Image

print("Iniciando o sistema de Inteligência Artificial...")


try:
    gerador_de_legenda = pipeline(
        "image-to-text", model="nlpconnect/vit-gpt2-image-captioning"
    )
    print("Modelo de IA carregado com sucesso!")

    imagem = Image.open("../../imagens/Eu e belinha.jpg")
    print("Imagem 'Eu e belinha.jpg' carregada.")

    # 4. A MÁGICA: Passamos a imagem para a IA
    print("\nAnalisando a imagem... Isso pode levar um momento.")
    resultado = gerador_de_legenda(imagem)
    print("Análise concluída!")

    legenda_gerada = resultado[0]["generated_text"]

    print("\n--- LEGENDA GERADA PELA IA ---")
    print(legenda_gerada)
    print("-----------------------------")

except Exception as e:
    print(f"\nOcorreu um erro: {e}")
    print(
        "Verifique sua conexão com a internet (para o primeiro download do modelo) ou se as bibliotecas foram instaladas corretamente."
    )
