# Dockerfile

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

RUN apt-get update && apt-get install -y \
    libsystemd-dev \
    pkg-config

WORKDIR /app

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

COPY ./cert.pem /app/cert.pem
COPY ./key.pem /app/key.pem

# Expose HTTPS port (443)
EXPOSE 443

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "443", "--ssl-keyfile", "/app/key.pem", "--ssl-certfile", "/app/cert.pem", "--reload"]


