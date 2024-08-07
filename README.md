```markdown
# Projeto de Transcrição e Sumarização de Áudio

Este projeto utiliza o Whisper para transcrição de áudio e a API da Hugging Face para sumarização abstrativa e extrativa. Ele é desenvolvido com Electron para criar uma aplicação de desktop.

## Pré-requisitos

Antes de começar, você precisa ter o seguinte instalado em sua máquina:

1. **Node.js** (versão 14 ou superior)
2. **Python** (versão 3.6 ou superior)
3. **Pip** (gerenciador de pacotes do Python)
4. **FFmpeg** (para manipulação de áudio)

### Instalação do FFmpeg

No Ubuntu ou Debian, você pode instalar o FFmpeg com o seguinte comando:

```bash
sudo apt update
sudo apt install ffmpeg
```

## Clonando o Repositório

Clone o repositório do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA_DO_REPOSITORIO>
```

## Configuração do Ambiente Python

1. **Crie um ambiente virtual** para isolar as dependências do projeto:

```bash
python3 -m venv python_env
```

2. **Ative o ambiente virtual**:

```bash
source python_env/bin/activate
```

3. **Instale as dependências do Python**:

```bash
pip install -r requirements.txt
```

## Instalação das Dependências do Node.js

1. **Instale as dependências do projeto**:

```bash
npm install
```

## Configuração da API da Hugging Face

1. **Crie uma conta** em [Hugging Face](https://huggingface.co/) e obtenha seu token de API.
2. **Substitua o token de API** no arquivo `sumarize.js`:

```javascript
'Authorization': 'Bearer SEU_TOKEN_AQUI',
```

## Execução do Projeto

1. **Inicie a aplicação**:

```bash
npm start
```

## Estrutura do Projeto

- **app/**: Contém os arquivos principais da aplicação (JavaScript e HTML).
- **python_env/**: O ambiente virtual do Python.
- **requirements.txt**: Lista das dependências do Python.

## Notas Finais

- Certifique-se de ter as permissões necessárias para executar os scripts.
- Em caso de dúvidas ou problemas, consulte a documentação das bibliotecas utilizadas ou abra uma issue no repositório.

```

### Observações

- Não se esqueça de substituir `<URL_DO_REPOSITORIO>` pela URL real do repositório e `<NOME_DA_PASTA_DO_REPOSITORIO>` pelo nome da pasta que o Git irá criar ao clonar o repositório.

Se precisar de mais alguma coisa, é só avisar!
