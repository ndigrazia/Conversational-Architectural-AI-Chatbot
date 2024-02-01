# Conversational Architecture AI Chatbot - Indexing
## Description 

 An embedding service turns data from images, text, or audio into a list of integers (a vector). This service accepts ADRs from a external source. The information sources must be *.md files.

* Database: Chroma (https://docs.trychroma.com/).
* Embeddings LLM: OpenAI (https://openai.com/).

## Runtime 

* Python 3.12.0

## Environment variables 

* OPENAI_API_KEY = OpenAI's API Key.
* CHROMA_HOST = Chromadb's hostname.
* CHROMA_PORT = Chromadb's port.
* INDEX_COLLECTION_NAME = Collection where you'll store your embeddings.
* ADRS_PATH = Path with *.md files.

## Libraries 

* langchain==0.1.1
* langchain-community==0.0.13
* langchain-openai==0.0.2.post1
* unstructured==0.11.8
* markdown==3.5.2
* pinecone-client==3.0.0
* chromadb-client==0.4.23.dev0
* fastapi==0.109.0
* python-dotenv==1.0.0

## Make a Indexing container 

```bash
docker build . -t ca-chatbot-indexing:0.1
```

## Run a Indexing container 

```bash
docker run --rm --net=ca-chatbot-net --name ca-chatbot-indexing -e OPENAI_API_KEY=<an-api-key> -e CHROMA_HOST=chromadb -e CHROMA_PORT=8000 -e INDEX_COLLECTION_NAME=adrs -e ADRS_PATH=/adrs -v <a-local-path>/adrs:/adrs -d ca-chatbot-indexing:0.1
```