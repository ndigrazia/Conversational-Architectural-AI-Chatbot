FROM python:3.12-bookworm AS builder

ENV http_proxy="http://10.204.164.38:10003"
ENV https_proxy="http://10.204.164.38:10003"

RUN apt-get update --fix-missing && apt-get install -y --fix-missing \
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
