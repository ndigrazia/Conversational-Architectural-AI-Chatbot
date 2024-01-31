FROM python:3.12-slim-bookworm AS builder

RUN apt-get update --fix-missing && apt-get install -y --fix-missing \
    build-essential && \
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

CMD ["python", "app.py"]