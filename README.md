# Conversational Architecture AI Chatbot

## Vector database

Chroma (https://docs.trychroma.com/) is a vector database that allows you to create LLM apps by making knowledge, facts, and abilities pluggable for LLM. 

 Vector database stores all the information the LLM model needs to be able to search and generate relevant outputs based on the user's query.

You can use Docker to operate a Chroma server. You may download the Chroma Docker image from Docker Hub.

```bash
docker pull chromadb/chroma:0.4.22.dev44

docker network create ca-chatbot-net

docker run --net=ca-chatbot-net -d --rm --name chromadb -p 8000:8000 -v ./chroma:/chroma/chroma -e IS_PERSISTENT=TRUE -e ANONYMIZED_TELEMETRY=TRUE chromadb/chroma:0.4.22.dev44
```

## Indexing Service

An embedding service transforms information sourced from external providers into numerical vectors. This service is capable of processing data in various formats, including images, text, or audio, and converting them into lists of integers, representing the embedded features.

See more [Readme file](./indexing/README.md).
