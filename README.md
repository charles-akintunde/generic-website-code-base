# Generic Website Code-base

## Project Overview

The Generic Website Code-base is a content management system designed to facilitate the rapid deployment of websites with similar structures. This project is structured using microservices to handle different functionalities independently, ensuring scalability and ease of maintenance.

### Features

- Admin interface to create and manage web pages (both static and dynamic)
- User registration and management
- Team member management with application and approval process
- Modular design for easy extension and customization

## Technologies Used

### Backend

- **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python 3.7+.
- **PostgreSQL**: An advanced, enterprise-class, and open-source relational database system.
- **Alembic**: A lightweight database migration tool for SQLAlchemy.
- **Docker**: A platform to develop, ship, and run applications inside containers.

### Frontend

- **Next.js**: A React framework for building server-side rendering and static web applications.



## Setup and Installation

### Prerequisites

- Docker and Docker Compose installed
- Python 3.8 or higher installed
- Node.js and npm (or yarn) installed

### Backend Setup

1. **Clone the Repository**:

    ```sh
    git clone https://github.com/charles-akintunde/generic-website-code-base.git
    cd generic-website-code-base/backend/user_management
    ```

2. **Set Up Virtual Environment**:

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install Dependencies**:

    ```sh
    pip install -r requirements.txt
    ```

4. **Set Up Environment Variables**:

    Create a `.env` file in the `backend/user_management` directory and add the following:

    ```plaintext
    DATABASE_URL=postgresql://charles:usermanagementpass@db/user_management_service
    ```

5. **Run Docker Containers**:

    ```sh
    docker-compose up --build
    ```

6. **Run Database Migrations**:

    ```sh
    docker exec -it user-management /bin/sh
    alembic upgrade head
    ```
