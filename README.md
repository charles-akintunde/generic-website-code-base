
# Generic Website Code Base Local Setup

This repository contains a full-stack application with frontend and backend services, using Docker Compose to simplify the setup. Follow the instructions below to get everything up and running.

### Skip Prerequisites if WSL and Docker Desktop are already installed

## Prerequisites

1. **Windows Subsystem for Linux (WSL)**: This guide assumes you have WSL installed. If not, follow [Microsoft's instructions to install WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

2. **Video References**:

   - Watch these for additional Docker setup help:
     - [WSL Setup](https://www.youtube.com/watch?v=HrAsmXy1-78)
     - [Docker Desktop Setup](https://www.youtube.com/watch?v=ZyBBv1JmnWQ&ab_channel=CodeBear)

3. **Docker and Docker Desktop**:

   - Install Docker Desktop: [Docker Desktop Installation](https://docs.docker.com/desktop/windows/install/).
   - Make sure **WSL integration** is enabled in Docker Desktop to allow Docker to work within WSL.

4. **Enable WSL Integration in Docker Desktop** (Optional):
   - Open Docker Desktop.
   - Go to **Settings** > **Resources** > **WSL Integration**.
   - Ensure **Enable integration with my default (Ubuntu) WSL distro** is checked.
   - Click **Apply & Restart** to enable the integration.

## Setup Steps

### 1. Clone the Repository

Open your terminal in WSL and navigate to your desired directory, then run:

```bash
git clone https://github.com/charles-akintunde/generic-website-code-base.git
cd generic-website-code-base
```

### 2. Confirm WSL is Active

To verify WSL is properly set up, run the following command:

```bash
uname -a
```

If you see a Linux-based output, your WSL environment is ready.

### 3. Configure Environment Variables

This project requires specific environment variables for both the frontend and backend. These should be provided by the admin.

#### Backend Environment Setup

1. Change into the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file:

   ```bash
   touch .env
   ```

3. Add the required environment variables to `.env`. You can request these values from the admin.

4. Configure super admin details:

   - Open `backend/utils/app_config.py`.
   - Add the super admin's name and email under the appropriate configuration variables:

     ```python
     "super_admin_email": "admin@example.com", # Change this to the super admin's email
     "super_admin_first_name": "Super First Name", # Change this to the super admin's first name
     "super_admin_last_name": "Super Last Name", # Change this to the super admin's last name
     ```

   After configuring the super admin, you can reset the password by going to the frontend reset page.

5. Save the file.

#### Frontend Environment Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Create a `.env.local` file:

   ```bash
   touch .env.local
   ```

3. Add the required environment variables for the frontend, also provided by the admin.

4. Save the file.

### 4. Generate SSL Certificates 

To set up HTTPS for local development, create a `certificates` folder and generate self-signed SSL certificates:

1. In the `backend` directory, create a `certificates` folder:

   ```bash
   mkdir certificates
   ```

2. Generate the SSL certificates by running the following command:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout ./certificates/privkey.pem -out ./certificates/fullchain.crt -days 365 -nodes -subj "/CN=localhost"
   ```

This command will:
- Generate a 4096-bit RSA private key (`privkey.pem`) in `./backend/certificates`.
- Create a self-signed certificate (`fullchain.pem`) valid for 365 days in the same folder.
- Set the common name (CN) to `localhost`, suitable for local development.

Make sure the paths to `privkey.pem` and `fullchain.pem` align with your backend configuration.

### 5. Run the Application with Docker Compose

From the root directory of the project, execute:

```bash
docker-compose up --build
```

This command will:

- Build and start both the frontend and backend services.
- Set up the necessary database within the Docker network.

### 6. Starting the Application After the First Build

After the initial build, you can start the application without rebuilding it by running:

```bash
docker-compose up
```

Use this command unless you’ve made changes to the Docker configuration or code that require a rebuild.

### 7. Apply Database Migrations

Once Docker Compose has successfully started, open a new terminal in WSL and enter the backend container to run the Alembic migrations:

1. List the running containers to find the backend container’s name:

   ```bash
   docker-compose ps
   ```

2. Enter the backend container:

   ```bash
   docker exec -it generic_website_backend /bin/bash
   ```

3. Run the Alembic migrations inside the container:

   ```bash
   alembic upgrade head
   ```

This command applies the necessary database migrations to the new database.

## Accessing the Application

- **Frontend**: Open [https://localhost:3000](https://localhost:3000) in your browser.
- **Backend**: The API is available at [https://localhost:8443](https://localhost:8443).

### Resetting Super Admin Password

After setting up the super admin in `app_config.py`, go to [https://localhost:3000/reset-password](https://localhost:3000/reset-password), enter the super admin's email, and follow the instructions to reset the password.

## Troubleshooting

- **Environment Variables**: Ensure `.env` and `.env.local` files contain all required values.
- **Docker WSL Integration**: Verify WSL integration is enabled in Docker Desktop if you experience issues.

---

# Comprehensive Guide for Deploying a Full-Stack Application (Back-End and Front-End) on Azure

#### **Note on Naming Conventions**:
- You can use any name for your container, preferably the name of the app you are deploying. For example, if your app is called `myapp`, name the container `myapp-backend` or `myapp-frontend`.

---

### **Part 1: Initial Setup**

#### **Resource Group and Blob Storage Considerations**
- **Resource Group**: You can choose to create a new resource group for each application or use the same resource group for multiple related applications. While it is possible to separate them, it is recommended to use the **same resource group** for better management, consistent policies, and simplified cost tracking for related applications.
- **Blob Storage**: Similarly, you can use separate blob storage accounts for each application or a single blob storage account with different containers. For most cases, it is recommended to use the **same blob storage account** with different containers for related applications. This approach centralizes data management, maintains consistency, and can reduce costs.

#### **Step 1: Create a Resource Group**
1. Go to [Azure Portal](https://portal.azure.com/).
2. Navigate to **Resource groups** > **+ Create**.
3. Enter a **Name** for the resource group (e.g., `myapp-rg`).
4. Select a **Region** (e.g., `Canada East`).
5. Click **Review + Create** > **Create**.

---

### **Part 2: Set Up Azure Container Registry (ACR)**

#### **Step 1: Create an ACR**
1. Go to **Azure Container Registry** > **+ Create**.
2. Select the **Resource Group** created earlier.
3. Enter a **Registry Name** (e.g., `myappacr`).
4. Choose **Region** (e.g., `Canada East`).
5. Choose **SKU** (e.g., `Basic`).
6. Click **Review + Create** > **Create**.
7. Enable **Admin user** under **Access keys** after the registry is created.

---

### **Part 3: Set Up Blob Storage**

#### **Step 1: Create Blob Storage**
1. Go to **Storage accounts** > **+ Create**.
2. Select the **Resource Group**.
3. Enter a **Name** (e.g., `myappstorage`).
4. Choose **Region** (e.g., `Canada East`).
5. Select **Performance** (Standard) and **Redundancy** (e.g., Locally-redundant storage (LRS)).
6. Click **Review + Create** > **Create**.

#### **Step 2: Configure Public Access for Blob Storage**
1. Go to **Storage accounts** > your storage account > **Configuration**.
2. Ensure that **Public access** is allowed to enable public access to blobs.
3. Save the configuration.

#### **Step 3: Create a Container in Blob Storage**
1. Navigate to **Storage accounts** > your storage account > **Containers**.
2. Click **+ Container** and name it (e.g., `uploads`).
3. Set **Public access level** to `Blob` to allow external access.
4. Click **Create**.

---

### **Part 4: Create the Database**

#### **Step 1: Create an Azure Database for PostgreSQL**
1. Go to **Azure Database for PostgreSQL** > **+ Create**.
2. Select the **Resource Group**.
3. Enter a **Name** (e.g., `myapp-db`).
4. Choose **Region** (e.g., `Canada East`).
5. Set **Version** (e.g., PostgreSQL 16).
6. Configure **Compute + Storage**.
7. Click **Review + Create** > **Create**.

#### **Step 2: Configure Database Access**
1. Go to your PostgreSQL server > **Networking**.
2. Add your local IP under **Firewall rules** and enable **Allow access to Azure services**.
3. Ensure "Allow all virtual networks" is enabled for internal connectivity.

#### **Step 3: Get the Connection String**
1. Go to **Connection strings** in the PostgreSQL server overview and copy the string for the `.env` file.

---

### **Part 5: Configure the Environment Variables**

#### **Step 1: Set Up the `.env` File for the Back-End**
- Add the following to your `.env` file:
  ```env
  DATABASE_URL=Server=myapp-db.postgres.database.azure.com;Database=myapp;Port=5432;User Id=your-db-user;Password=your-password;Ssl Mode=Require;
  AZURE_BLOB_STORAGE_CONNECTION_STRING=your_blob_storage_connection_string
  ```

---

### **Part 6: Run and Test the Back-End Locally**

#### **Step 1: Build and Run the Docker Container**
1. Navigate to your back-end project folder.
2. Build the Docker image:
   ```bash
   docker build -t myapp-backend .
   ```
3. Run the container:
   ```bash
   docker run --env-file .env -d -p 8000:8000 myapp-backend
   ```

#### **Step 2: Enter the Container and Run Migrations**
1. Get the container ID with:
   ```bash
   docker ps
   ```
   - Copy the container ID using **Ctrl + Shift + C**.
2. Enter the container:
   ```bash
   docker exec -it <container_id> /bin/sh
   ```
3. Run migrations:
   ```bash
   alembic upgrade head
   ```

---

### **Part 7: Deploy the Back-End to Azure**

#### **Step 1: Tag and Push the Docker Image to ACR**
1. Tag the Docker image:
   ```bash
   docker tag myapp-backend myappacr.azurecr.io/myapp-backend:latest
   ```
2. Push the image:
   ```bash
   docker push myappacr.azurecr.io/myapp-backend:latest
   ```

#### **Step 2: Create an App Service for the Back-End**
1. Go to **App Services** > **+ Create**.
2. Select the **Resource Group** and **App Service Plan**.
3. Choose **Docker Container** as the publish option.
4. Set the **Image source** to ACR and choose the container (e.g., `myappacr.azurecr.io/myapp-backend:latest`).
5. Click **Review + Create** > **Create**.

---

### **Part 8: Deploy the Front-End**

#### **Step 1: Configure the Front-End `.env` File**
- Add the backend URL to the front-end `.env` file:
  ```env
  BACKEND_API_URL=https://myapp-api.azurewebsites.net
  ```

#### **Step 2: Build, Tag, and Push the Front-End Docker Image**
1. Build the Docker image:
   ```bash
   docker build -t myapp-frontend .
   ```
2. Tag the image:
   ```bash
   docker tag myapp-frontend myappacr.azurecr.io/myapp-frontend:latest
   ```
3. Push the image:
   ```bash
   docker push myappacr.azurecr.io/myapp-frontend:latest
   ```

#### **Step 3: Create an App Service for the Front-End**
1. Go to **App Services** > **+ Create**.
2. Select the **Resource Group** and **App Service Plan**.
3. Choose **Docker Container** as the publish option.
4. Set the **Image source** to ACR and choose the container (e.g., `myappacr.azurecr.io/myapp-frontend:latest`).
5. Click **Review + Create** > **Create**.

---

### **Part 9: Configuring Environment Variables in Azure**

#### **Step 1: Add Environment Variables**
1. Go to **Configuration** > **Application settings** in the App Service.
2. Add necessary environment variables.
3. Click **Save**.

---

### **Part 10: Adding a Custom Domain**

#### **Step 1: Add Custom Domain**
1. Go to your **App Service** > **Custom domains**.
2. Click **+ Add custom domain**.
3. Enter your domain name.
4. Verify domain ownership by adding a TXT record to your DNS provider.
5. Once verified, map the domain to your App Service.

#### **Step 2: Configure SSL Binding**
1. Go to **TLS/SSL settings** > **Private Key Certificates**.
2. Upload your SSL certificate or create a free App Service-managed certificate.
3. Bind the SSL certificate to your custom domain.

---

### **Part 11: Updating and Pushing New Versions**

#### **Step 1: Update and Build Docker Images**
- Make code changes and build the updated images:
  ```bash
  docker build -t myapp-backend .
  docker build -t myapp-frontend .
  ```

#### **Step 2: Tag and Push Images**
1. Tag and push the images:
   ```bash
   docker tag myapp-backend myappacr.azurecr.io/myapp-backend:latest
   docker push myappacr.azurecr.io/myapp-backend:latest

   docker tag myapp-frontend myappacr.azurecr.io/myapp-frontend:latest
   docker push myappacr.azurecr.io/myapp-frontend:latest
   ```

#### **Step 3: Restart App Services**
- Go to **App Services** > select your app > **Restart**.

---
