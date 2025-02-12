
noagenda
{
  "image": "mcr.microsoft.com/devcontainers/javascript:alpine",
  "remoteUser": "node"
}

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Firebase CLI
RUN npm install -g firebase-tools

# Copy the rest of the application code to the working directory
COPY . .

# Expose the ports the app runs on
EXPOSE 3000 5000

# Set environment variables from .env file
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}
ENV VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
ENV REACT_APP_AZURE_ENDPOINT=${REACT_APP_AZURE_ENDPOINT}
ENV REACT_APP_AZURE_COGNITIVE_ENDPOINT=${REACT_APP_AZURE_COGNITIVE_ENDPOINT}
ENV REACT_APP_AZURE_DEPLOYMENT_ENDPOINT=${REACT_APP_AZURE_DEPLOYMENT_ENDPOINT}
ENV REACT_APP_MODEL_NAME=${REACT_APP_MODEL_NAME}
ENV REACT_APP_AZURE_API_KEY=${REACT_APP_AZURE_API_KEY}

# Command to run the application
CMD ["npm", "run", "dev"]
