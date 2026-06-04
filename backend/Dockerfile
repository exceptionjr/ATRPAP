FROM python:3.12-slim

WORKDIR /app

# Dependências do sistema para mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Caminhos relativos à raiz do repositório (contexto de build do Railway)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY backend/ .

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]
