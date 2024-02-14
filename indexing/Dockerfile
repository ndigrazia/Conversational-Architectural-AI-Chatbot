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

RUN apt-get update

RUN apt-get update && apt-get -y install cron

RUN touch /var/log/cron.log

WORKDIR /app

# Run every day at 08:00 o'clock
RUN crontab -l | { cat; echo "0 8 * * * /usr/local/bin/python /app/app.py >> /var/log/cron.log 2>&1"; } | crontab -

COPY --from=builder /install /usr/local

# COPY --chown=papus:papus . /app
COPY . /app

# USER papus
CMD  printenv | grep -v "no_proxy" >> /etc/environment && cron && tail -f /var/log/cron.log