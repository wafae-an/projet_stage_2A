# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Evite les .pyc et buffer, et cache pip
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Dépendances système (psycopg2, curl si besoin)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*


# Répertoire de travail dans l'image
WORKDIR /app

# 1) Installer les deps Python en amont (meilleur cache)
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 2) Copier le code
COPY . .

# Expose le port interne (FastAPI écoutera en 8000 dans le conteneur)
EXPOSE 8000

# (optionnel) healthcheck si tu as un endpoint /health
# HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl -f http://localhost:8000/health || exit 1

# Commande par défaut : uvicorn sans --reload pour éviter le hot-reload en container
# (Tu peux activer --reload en dev via docker-compose)
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
