# File: /frontend/Dockerfile
# Description: Docker configuration for React frontend
# Author: GitHub Copilot
# Created: 2023-11-13

FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app source
COPY . .

# Start development server
CMD ["npm", "run", "dev"]
