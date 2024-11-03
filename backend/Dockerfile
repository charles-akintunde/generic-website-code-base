# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

# RUN apt-get update && apt-get install -y \
#     libdbus-1-dev \
#     libgirepository1.0-dev \
#     build-essential \
#     pkg-config \
#     libcairo2-dev \
#     libgirepository-1.0-1 \
#     gir1.2-glib-2.0 \
#     libsystemd-dev

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8000

# # Add --reload to enable auto-reload on file changes
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libdbus-1-dev \
    libgirepository1.0-dev \
    build-essential \
    pkg-config \
    libcairo2-dev \
    libgirepository-1.0-1 \
    gir1.2-glib-2.0 \
    libsystemd-dev

# Set working directory
WORKDIR /app

# Copy the certificates into the container
COPY certificates /app/certificates

# Copy the FastAPI app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 443

# Start FastAPI on port 443 with SSL
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "443", "--ssl-keyfile", "/app/certificates/privkey.pem", "--ssl-certfile", "/app/certificates/fullchain.pem"]