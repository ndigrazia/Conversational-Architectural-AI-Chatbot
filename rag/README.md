# Conversational Architecture AI - Retrieval and generation (RAG)

## Description 

A Rag service responds to customer questions utilizing LLM's function-calling.

* Database: Chroma (https://docs.trychroma.com/).
* LLM: OpenAI (https://openai.com/).
* Frontend: Streamlit (https://streamlit.io/).
  
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
* streamlit==1.30.0

## Make a Indexing container 

```bash
docker build . -t ca-chatbot-rag:0.1
```

## Run a Indexing container 

```bash
docker run --rm --net=ca-chatbot-net --name ca-chatbot-rag -p 9090:9090 -e OPENAI_API_KEY=<an-api-key> -e CHROMA_HOST=chromadb -e CHROMA_PORT=8000 -e INDEX_COLLECTION_NAME=adrs -e STREAMLIT_SERVER_ENABLE_STATIC_SERVING=true -v <a-local-path>/adrs:/app/static/adrs -d ca-chatbot-rag:0.1
```