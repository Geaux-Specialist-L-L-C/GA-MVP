# Use the official Node.js image as the base image
FROM node:18

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
ENV VITE_FIREBASE_API_KEY=your_api_key_here
ENV VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
ENV VITE_FIREBASE_PROJECT_ID=your_project_id_here
ENV VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
ENV VITE_FIREBASE_APP_ID=your_app_id_here
ENV VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
ENV VITE_OPENAI_API_KEY=your_openai_api_key_here
ENV REACT_APP_AZURE_ENDPOINT=your_azure_endpoint_here
ENV REACT_APP_MODEL_NAME=your_model_name_here
ENV REACT_APP_AZURE_API_KEY=your_azure_api_key_here

# Command to run the application
CMD ["npm", "run", "dev"]
