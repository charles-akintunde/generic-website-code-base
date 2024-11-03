# Generic Website Code Base

This repository contains a full-stack application with frontend and backend services, using Docker Compose to simplify the setup. Follow the instructions below to get everything up and running.

### Skip Prerequisites if WSL, Docker Desktop, and VS Code are already installed

## Prerequisites

1. **Windows Subsystem for Linux (WSL)**: 
   - This guide assumes you have WSL installed. If not, follow [Microsoft's instructions to install WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
   - Video Guide: [WSL Setup](https://www.youtube.com/watch?v=HrAsmXy1-78)

2. **VS Code with Remote - WSL Extension**:
 
  - Video Guide: [VS Code](https://www.youtube.com/watch?v=cu_ykIfBprI&ab_channel=ProgrammingKnowledge)
  - Links
    1. Download and install **Visual Studio Code**: [VS Code Download](https://code.visualstudio.com/).
  - Install the **Remote - WSL** extension for VS Code:
     1. Open VS Code.
     2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar (or pressing `Ctrl+Shift+X`).
     3. Search for **Remote - WSL** and click **Install**.

3. . **Docker and Docker Desktop**:
   - Video Guide:
        - [WSL Setup](https://www.youtube.com/watch?v=HrAsmXy1-78)
        - [Docker Desktop Setup](https://www.youtube.com/watch?v=ZyBBv1JmnWQ&ab_channel=CodeBear)
   - Links:
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

### 3. Open the Project in VS Code

1. In your WSL terminal, navigate to the project directory if you’re not already there:

   ```bash
   cd /path/to/generic-website-code-base
   ```

2. Open the project in VS Code by running:

   ```bash
   code .
   ```

   This command will launch VS Code with the project opened directly from WSL. Make sure the **Remote - WSL** extension is active to work seamlessly with files in the WSL environment.

### 4. Configure Environment Variables

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
  SUPER_ADMIN_EMAILS = ["admin@example.com"]
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

This guide should help new users set up and run your application smoothly.
