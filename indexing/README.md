# README #

Chatbot Arquitectura Hispam - Indexing

### Description ###

* Proyecto para la ingesta de lineamientos desde una fuente externa y su indexación.
* Base de datos vectorial: Chroma.
* Modelo de generación de embeddings: OpenAI.
* Versión: 1.0

### Runtime ###
* Python 3.12.0

### Environment variables ###
* OPENAI_API_KEY = Clave de API de OpenAI usado para el trabajo con embeddings y respuestas generativas.
* CHROMA_HOST = Hostname de la instancia de Chromadb.
* CHROMA_PORT = Puerto de la instancia de Chromadb.
* INDEX_COLLECTION_NAME = Nombre de la colección que contiene los embeddings de los lineamientos.
* PATH_LINEAMIENTOS = Ruta de la carpeta que contiene los lineamientos en formato *.md.

### Libraries ###

* langchain==0.1.1
* langchain-community==0.0.13
* langchain-openai==0.0.2.post1
* unstructured==0.11.8
* markdown==3.5.2
* pinecone-client==3.0.0
* chromadb-client==0.4.23.dev0
* fastapi==0.109.0
* python-dotenv==1.0.0

### Owner ###

* Equipo Cloud - Arquitectura Hispam