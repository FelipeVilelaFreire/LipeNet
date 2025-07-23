from PIL import Image

print("Iniciando o experimento com a Pillow...")

try:
    imagem_original = Image.open('StackbierfestPaulaner.jpg')

    print(f"Sucesso! Imagem 'teste.jpg' aberta.")
    print(f"  -> Formato: {imagem_original.format}")
    print(f"  -> Dimensões: {imagem_original.size} (Largura x Altura)")
    print(f"  -> Modo de cor: {imagem_original.mode}")

    largura, altura = imagem_original.size
    novo_tamanho = (largura // 2, altura // 2)
    imagem_redimensionada = imagem_original.resize(novo_tamanho)

    print(f"\nImagem redimensionada para o novo tamanho: {imagem_redimensionada.size}")

    # E para finalizar, vamos salvar esta nova imagem
    imagem_redimensionada.save('teste_modificado.jpg')
    print("Uma nova imagem modificada foi salva como 'teste_modificado.jpg'")

except FileNotFoundError:
    print("\nERRO: Não encontrei o arquivo 'teste.jpg' na pasta.")
    print("Verifique se você copiou a imagem para a pasta do projeto e se o nome está correto.")