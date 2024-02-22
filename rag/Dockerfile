FROM python:3.12-slim-bookworm AS builder


RUN apt-get update --fix-missing && apt-get install -y --fix-missing \
    build-essential \
    gcc \
    g++ \
    cmake \
    autoconf \
    pkgconf && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir /install 

WORKDIR /install

COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir --upgrade --prefix="/install" -r requirements.txt

FROM python:3.12-slim-bookworm AS final


# RUN useradd -m papus

WORKDIR /app

COPY --from=builder /install /usr/local

# COPY --chown=papus:papus . /app
COPY . /app

# USER papus

EXPOSE 9090

HEALTHCHECK CMD curl --fail http://localhost:9090/_stcore/health

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=9090", "--server.address=0.0.0.0"]
