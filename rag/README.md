# Conversational Architectural AI Chatbot - Retrieval and generation (RAG)

## Description 

A Rag service API responds to client questions utilizing LLM's function-calling.

* Database: Chroma (https://docs.trychroma.com/).
* LLM: OpenAI (https://openai.com/).
  
## Runtime 

* Python 3.12.0

## Environment variables 

* OPENAI_API_KEY = OpenAI's API Key.
* CHROMA_HOST = Chromadb's hostname.
* CHROMA_PORT = Chromadb's port.
* INDEX_COLLECTION_NAME = Collection where you'll store your embeddings.
* STREAMLIT_SERVER_ENABLE_STATIC_SERVING = static service flag.

## Libraries 

* langchain==0.1.1
* langchain-community==0.0.13
* langchain-openai==0.0.2.post1
* chromadb-client==0.4.23.dev0
* fastapi==0.109.0
* python-dotenv==1.0.0
## API definition/test

http://localhost:8000/docs

## Make a Indexing container 

```bash
docker build . -t ca-chatbot-rag:0.2
```

## Run a Indexing container 

```bash
docker run --rm --net=ca-chatbot-net --name ca-chatbot-rag -p 9090:9090 -e OPENAI_API_KEY=<an-api-key> -e CHROMA_HOST=chromadb -e CHROMA_PORT=8000 -e BASE_URL=http://<base_path>:9090/app/static -e INDEX_COLLECTION_NAME=adrs -e STREAMLIT_SERVER_ENABLE_STATIC_SERVING=true -v <a-local-path>/adrs:/app/static/adrs -d ca-chatbot-rag:0.2
```

## Authorization Server

Tenemos un problema:

Estamos usando un framework de front-end llamado streamlit.
* Streamit indica que no es apto para producción
* Tiene un soporte de oauth pero en una librería, hay que probarla.
* Usa analitycs por default, aunque dice que es posible desactivarlo

Si cambiamos a nodejs
* Tiene fameworks de seguridad (oauth) probados con varios años de evolución (passport). 
* Los ejemplos de chat tienen interfaces mas básicas, es necesario agregar los links.
* Tenamos una poc usando oauth2/oidc

Si cambiamos a React u otro
* Hay ejemplos de chatbot basicos
* Investigar login
* Investigar