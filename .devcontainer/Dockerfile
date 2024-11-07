#FROM python:3.12-bookworm AS builder
FROM ubuntu:24.04

#RUN apt install python3.12 -y

RUN apt-get update --fix-missing && apt-get install -y --fix-missing \
    python3.12 \
    python3-pip \
#    python3-dev \
#    python3-venv \
#    libssl-dev \
#    libffi-dev \
    pipx \
    nodejs \
    npm \
    podman \
    git \
    build-essential \
    gcc \
    g++ \
    cmake \
    autoconf \
    pkgconf && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir /install 

WORKDIR /install

COPY ./rag/requirements.txt requirements.txt

# CORREGIR!! Saco para probat front end, pero es necesario. Da error.
#RUN pip install --no-cache-dir --upgrade -r requirements.txt

