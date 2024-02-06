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

Our Rag service is like your go-to problem solver when you have questions. It's all powered by LLM's function-calling magic, making sure you get the answers you need in a snap.

See more [Readme file](./rag/README.md).

## Start all services from docker.io

Here is a step-by-step breakdown of the provided instructions:

### Create folders:

```bash
mkdir ./adrs
mkdir ./chroma
```

These commands create two directories named adrs and chroma.

### Pull Docker images:

```bash
docker pull ndigrazia/ca-chatbot-indexing:0.1
docker pull ndigrazia/ca-chatbot-rag:0.1
docker pull ndigrazia/ca-chatbot-chromadb:0.1
```

These commands pull Docker images from Docker Hub. 

### Copy ADRs files:

Copy your ADRs (Architectural Decision Records) files to the ./adrs directory.

###  Run Docker Compose:

```bash
docker-compose up -d
```

This command uses Docker Compose to start the services defined in the docker-compose.yml file in detached mode (-d).

Make sure you have Docker and Docker Compose installed on your system before running these commands. Additionally, ensure that the required ADRs files are placed in the ./adrs directory before starting the services.


## Initialize all services anew

```bash
docker-compose up -d --build
```

## Discover the Chatbot

Explore the Conversational Architectural AI Chatbot by accessing it at http://\<your-host\>:9090 and enjoy it!. Immerse yourself in its capabilities and enjoy the interaction!
