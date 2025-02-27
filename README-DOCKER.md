# Docker Setup for Geaux Academy

This guide provides instructions for setting up and running the Geaux Academy application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Git repository cloned locally

## Architecture Overview

The Geaux Academy application consists of the following services:

1. **Frontend** - React with TypeScript
2. **Backend** - FastAPI
3. **Postgres** - Supabase PostgreSQL database
4. **MongoDB** - Document storage
5. **Cheshire Cat** - AI service

## Getting Started

### 1. Setting Up Environment Variables

Before starting the services, make sure you have the proper environment variables set:

```bash
# Copy example environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 2. Starting Services

Run the following command from the root directory:

```bash
docker-compose up
```

To start in detached mode:

```bash
docker-compose up -d
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend API Documentation**: http://localhost:8000/docs
- **Cheshire Cat UI**: http://localhost:1865

### 4. Managing Services

#### Stop all services:
```bash
docker-compose down
```

#### Rebuild services:
```bash
docker-compose build
```

#### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
```

## Development Workflow

### Frontend Development

The frontend code is mounted as a volume, so changes will be reflected immediately with hot reloading.

### Backend Development

The backend code is also mounted as a volume with auto-reload enabled. Changes to Python files will automatically restart the server.

### Database Management

#### Access PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d geaux_academy
```

#### Access MongoDB:
```bash
docker-compose exec mongodb mongo
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8000, 5432, 27017, and 1865 are not already in use.

2. **Connection issues between containers**: Check the network configuration and make sure services can communicate.

3. **Volume permission issues**: If you encounter permission problems with volumes, try:
```bash
sudo chown -R $USER:$USER ./cat_data
```

### Resetting Data

To completely reset data volumes:
```bash
docker-compose down -v
```

Warning: This will delete all data in the databases.
