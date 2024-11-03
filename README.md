# Generic Website Code Base

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

4. Save the file.

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

### 4. Run the Application with Docker Compose

From the root directory of the project, execute:

```bash
docker-compose up --build
```

This command will:
- Build and start both the frontend and backend services.
- Set up the necessary database within the Docker network.

### 5. Starting the Application After the First Build

After the initial build, you can start the application without rebuilding it by running:

```bash
docker-compose up
```

Use this command unless you’ve made changes to the Docker configuration or code that require a rebuild.

### 6. Apply Database Migrations

Once Docker Compose has successfully started, open a new terminal in WSL, navigate to the backend folder, and run the Alembic migrations:

```bash
cd backend
alembic upgrade head
```

This command applies the necessary database migrations to the new database.

## Service-Specific Configuration

- **Frontend**:
  - Images and static assets are located in the `frontend/assets` folder.
  - To configure the application settings, edit `frontend/utils/appConfig.ts` with any necessary frontend configuration values.

- **Backend**:
  - Navigate to `backend/utils/app_config.py` to set backend-specific configurations.
  - In `app_config.py`, add the name(s) and email(s) of the super admin(s) under the appropriate configuration variable.

  ```python
   "super_admin_email": "admin@example.com", # Change this to the super admin's email
    "super_admin_first_name": "Super First Name", # Change this to the super admin's first name
    "super_admin_last_name": "Super Last Name", # Change this to the super admin's last
  ```

  After configuring the super admin, you can reset the password by going to the frontend reset page.

## Accessing the Application

- **Frontend**: Open [https://localhost:3000](https://localhost:3000) in your browser.
- **Backend**: The API is available at [https://localhost:8443](https://localhost:8443).

### Resetting Super Admin Password

After setting up the super admin in `app_config.py`, go to [https://localhost:3000/reset-password](https://localhost:3000/reset-password), enter the super admin's email, and follow the instructions to reset the password.

## Troubleshooting

- **Environment Variables**: Ensure `.env` and `.env.local` files contain all required values.
- **Docker WSL Integration**: Verify WSL integration is enabled in Docker Desktop if you experience issues.

---

This guide should help you run the application smoothly.
