# HRMS Enterprise Deployment Guide

This guide covers how to build and deploy the Enterprise HRMS application using Docker.

## Prerequisites
- **Docker**: Ensure Docker Engine is installed and running.
- **Docker Compose**: Ensure Docker Compose is installed.

## Building and Running the Application

1. **Clone the repository** (or navigate to the project root):
   ```bash
   cd HRMS
   ```

2. **Environment Variables**:
   By default, the `docker-compose.yml` configures the backend to connect to the MongoDB container (`mongodb://mongodb:27017/hrms`).
   If you wish to use a remote cluster, modify the `MONGO_URI` environment variable in `docker-compose.yml`.

3. **Start the containers**:
   Run the following command from the root directory:
   ```bash
   docker-compose up --build -d
   ```
   * The `--build` flag ensures the latest code is compiled into Docker images.
   * The `-d` flag runs the containers in the background.

## Services Overview

- **Frontend**: Accessible at `http://localhost:80`. Served via an Nginx container. It proxies API requests to the Backend automatically.
- **Backend**: Runs on `http://localhost:5000`. Provides the REST APIs for the HRMS.
- **Database**: MongoDB instance running on port `27017`. Data is persisted using Docker volumes.

## Stopping the Application

To shut down the containers without deleting the database volume:
```bash
docker-compose down
```

To completely wipe the database along with the containers:
```bash
docker-compose down -v
```

## Logs

To view the backend logs:
```bash
docker logs -f hrms_backend
```

To view the frontend access logs:
```bash
docker logs -f hrms_frontend
```
