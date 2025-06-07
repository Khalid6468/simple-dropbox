# Simple Dropbox Clone

This project is a simplified, Dropbox-like file management application that allows users to upload, download, and view files through a web interface. It is a full-stack application built with a Node.js backend and a React frontend.

## Features

- **File Upload**: Upload various file types with restrictions on size and format.
- **File List**: View a list of all uploaded files.
- **File Preview**: Click on a file to view its contents in a new tab (for supported formats).
- **File Download**: Download files directly from the list.

## Technologies Used

- **Backend**: Node.js, Express, Multer, SQLite
- **Frontend**: React, Vite, Axios, Nginx
- **Containerization**: Docker, Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## How to Run

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Build and run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```

3.  **Access the application**:
    Open your web browser and navigate to [http://localhost](http://localhost).

## Project Structure

```
.
├── backend
│   ├── src
│   │   ├── routes
│   │   │   └── files.js      # API routes for files
│   │   ├── app.js            # Express app setup
│   │   └── database.js       # SQLite database setup
│   ├── Dockerfile            # Docker configuration for the backend
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── uploads/              # Directory for uploaded files
├── frontend
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx           # Main React component
│   │   └── main.jsx
│   ├── Dockerfile            # Docker configuration for the frontend
│   ├── nginx.conf            # Nginx reverse proxy configuration
│   └── package.json
├── docker-compose.yml        # Docker Compose orchestration
└── README.md                 # This file
```

## API Endpoints

- `POST /api/upload`: Upload a new file.
- `GET /api/files`: Get a list of all files.
- `GET /api/download/:filename`: Download a specific file.
- `GET /api/view/:filename`: View a specific file.
``` 