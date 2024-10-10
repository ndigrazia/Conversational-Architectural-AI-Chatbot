# Conversational Architectural AI Chatbot

## Overview

![image info](./conversational-architectural-ai-chatbot.drawio.png)

## Vector database

Chroma (https://docs.trychroma.com/) is a vector database that allows you to create LLM apps by making knowledge, facts, and abilities pluggable for LLM. 

 Vector database stores all the information the LLM model needs to be able to search and generate relevant outputs based on the user's query.

You can use Docker to operate a Chroma server. You may download the Chroma Docker image from Docker Hub.

### Create networking

```bash
docker network create ca-chatbot-net
```

### Run chroma database

```bash
docker pull chromadb/chroma:0.4.22.dev44

docker build ./chromadb -t ca-chatbot-chromadb:0.1

docker run --net=ca-chatbot-net -d --rm --name chromadb -p 8000:8000 -v ./chroma:/chroma/chroma -e IS_PERSISTENT=TRUE -e ANONYMIZED_TELEMETRY=TRUE ca-chatbot-chromadb:0.1
```
## Indexing Service

Our embedding service transforms information sourced from external providers into numerical vectors. This service is capable of processing data in various formats, including images, text, or audio, and converting them into lists of integers, representing the embedded features.

See more [Readme file](./indexing/README.md).

## Rag Service

Our Rag service esposes an API that can you invoke to resolve questions. It's all powered by LLM's function-calling magic, making sure you get the answers you need in a snap.

See more [Readme file](./rag/README.md).

## Front Service

Is the front-end of the chatbot. You can ask questions in intereactive way, internally this call rag API.

## Start all services from docker.io

Here is a step-by-step breakdown of the provided instructions:

### Create folders:

```bash
mkdir ./adrs
mkdir ./chroma
```

These commands create two directories named adrs and chroma. 

See more [ADR files](https://github.com/ndigrazia/ArchitectureDecisions) to figure out documents that may be used as sources in "adrs" folder.

### Set environment variables in a .env file:

These variables are used in a configuration file (.env) to set up and run containers. Here's a breakdown of the variables:

OPENAI_API_KEY_INDEXING: This variable probably holds the API key for OpenAI used in the indexing process. Ensure you replace the placeholder with your actual OpenAI API key.

OPENAI_API_KEY_RAG: This variable likely holds the API key for OpenAI's Retrieval-Augmented Generation (RAG) model. Replace the placeholder with your actual OpenAI API key.

HUGGINGFACEHUB_API_TOKEN_INDEXING: This variable probably holds the API key for OpenAI used in the indexing process. Ensure you replace the placeholder with your actual HuggingFace API key.

HUGGINGFACEHUB_API_TOKEN_RAG: This variable likely holds the API key for OpenAI's Retrieval-Augmented Generation (RAG) model. Replace the placeholder with your actual HuggingFace API key.

CHROMADB_IMAGE: Specifies the Docker image for the ChromaDB service. Docker images are used to package applications and their dependencies.

CHATBOT_RAG_IMAGE: Specifies the Docker image for the chatbot using the RAG model.

CHATBOT_INDEXING_IMAGE: Specifies the Docker image for the chatbot indexing process. 

BASE_URL: Specifies the actual base path.

IS_OPEN_SOURCE: Specifies whether you are working with an open-source solution framework or not. 

FILE_TYPE: Specifies the type of files to be loaded. Choose: md or pdf.

To set these environment variables inside a .env file, you can create or edit the file with the following content:

Create a file named .env and add the following lines:

```bash
OPENAI_API_KEY_INDEXING=<your_indexing_api_key>
OPENAI_API_KEY_RAG=<your_rag_api_key>
HUGGINGFACEHUB_API_TOKEN_INDEXING=<your_indexing_api_key>
HUGGINGFACEHUB_API_TOKEN_RAG=<your_rag_api_key>
CHROMA_HOST=localhost
CHROMA_PORT=8000
INDEX_COLLECTION_NAME=adrs
STREAMLIT_SERVER_PORT=9090
STREAMLIT_SERVER_ENABLE_STATIC_SERVING=true
BASE_URL=http://<base_path>:9090/app/static
IS_OPEN_SOURCE=true
FILE_TYPE=md
MARKDOWN_IN_FORMAT=.pdf
```

Make sure to replace <your_indexing_api_key> and <your_rag_api_key> with your actual API keys.

Make sure to replace <base_path> with your actual base path.

After setting these variables, you can use them in your scripts or configuration files for running Docker containers or other relevant processes.

if MARKDOWN_IN_HTML=true is configured, you must generate htmls files. See below.  

### Pull Docker images:

```bash
docker pull ndigrazia/ca-chatbot-indexing:0.2
docker pull ndigrazia/ca-chatbot-rag:0.3
docker pull ndigrazia/ca-chatbot-chromadb:0.1
```

These commands pull Docker images from Docker Hub. 

### Copy ADRs files:

Copy your ADRs (Architectural Decision Records) files to the ./adrs directory.

### Generate html from mardown:

if you want to view formated md files yo must set environment variable:  

```bash
MARKDOWN_IN_FORMAT=.html
```

and run the script to convert md to html:  

```bash
sh ./scripts/generate_md_html.sh
```
ignore warnings.  

###  Run Docker Compose:

```bash
docker-compose up -d
```

This command uses Docker Compose to start the services defined in the docker-compose.yml file in detached mode (-d).

Make sure you have Docker and Docker Compose installed on your system before running these commands. Additionally, ensure that the required ADRs files are placed in the ./adrs directory before starting the services.

## Choose your solution framework

The Conversational Architectural AI Chatbot can work with two type of frameworks. You may choose your framework by setting IS_OPEN_SOURCE variable. Assign "true" if you want to work with an open-source framework, and "false" otherwise

### Open-source Solution Framework

If you've chosen the open-source solution framework, please set the environment variables as follows:

```bash
HUGGINGFACEHUB_API_TOKEN_INDEXING=<your_indexing_api_key>
HUGGINGFACEHUB_API_TOKEN_RAG=<your_rag_api_key>
```

Make sure to replace <your_indexing_api_key> and <your_rag_api_key>  with your actual HuggingFace API key.

### Non-Open-source Solution Framework

If you've chosen the non-open-source solution framework, please set the environment variables as follows:

```bash
OPENAI_API_KEY_INDEXING=<your_indexing_api_key>
OPENAI_API_KEY_RAG=<your_rag_api_key>
```

Make sure to replace <your_indexing_api_key> and <your_rag_api_key>  with your actual OpenAI API key.

## Initialize all services anew

```bash
docker-compose up -d --build
```

## Discover the Chatbot

Explore the Conversational Architectural AI Chatbot by accessing it at http://\<your-host\>:9090 and enjoy it!. Immerse yourself in its capabilities and enjoy the interaction!
