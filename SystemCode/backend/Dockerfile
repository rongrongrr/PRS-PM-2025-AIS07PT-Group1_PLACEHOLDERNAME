# ─── Backend: FastAPI (Python 3.13) ────────────────────────────────────────────
FROM python:3.13-slim

WORKDIR /app
ENV PYTHONWARNINGS=ignore::UserWarning

# 1. unzip + tini for a clean PID 1
RUN apt-get update && \
    apt-get install -y --no-install-recommends unzip tini && \
    rm -rf /var/lib/apt/lists/*

# 2. pip install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. copy source *including* the .zip and entrypoint
COPY . .
COPY docker-entrypoint.sh /usr/local/bin/
# Convert CRLF → LF *inside* the image, then make it executable
RUN apt-get update && apt-get install -y --no-install-recommends dos2unix \
    && dos2unix /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && rm -rf /var/lib/apt/lists/*

# 4. expose relevant port
EXPOSE 8000
ENTRYPOINT ["/usr/bin/tini","--","docker-entrypoint.sh"]