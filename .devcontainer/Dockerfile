FROM python:3.12-bookworm AS builder

RUN apt-get update --fix-missing && apt-get install -y --fix-missing \
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

RUN pip install --no-cache-dir --upgrade -r requirements.txt
# --prefix="/install"

# streamlit run app.py --server.port=9090 --server.address=0.0.0.0
