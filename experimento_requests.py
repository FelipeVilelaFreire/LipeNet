import requests

url_api = 'https://catfact.ninja/fact'

print("Fazendo um pedido para a API de fatos sobre gatos...")

try:
    resposta = requests.get(url_api)

    if resposta.status_code == 200:
        print("Conexão bem-sucedida! Recebemos uma resposta.")
        dados = resposta.json()

        fato_sobre_gato = dados['fact']
        print(f"\nFato Recebido: {fato_sobre_gato}")

    else:
        print(f"O servidor respondeu com um erro. Código: {resposta.status_code}")

except requests.exceptions.RequestException as e:
    print(f"\nERRO: Falha ao tentar se conectar à internet.")