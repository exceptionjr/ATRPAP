FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema para mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

ENV PYTHONUNBUFFERED=1

CMD gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
