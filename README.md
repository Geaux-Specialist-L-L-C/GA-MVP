# Geaux Academy

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd GA-MVP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=geaux-academy
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```

2. To run Firebase emulators (optional, for local development):
   ```bash
   firebase emulators:start
   ```

3. To build for production:
   ```bash
   npm run build
   ```

4. To preview the production build:
   ```bash
   npm run preview
   ```

### Accessing the Application
- Development: `http://localhost:5173`
- Production preview: `http://localhost:4173`

### Firebase Setup
1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase project:
   ```bash
   firebase init
   ```

### Deployment
To deploy the application to Firebase:
   ```bash
   npm run deploy
   ```

### Creating GitHub Issues
1. Go to the GitHub repository and click on the "Issues" tab.
2. Create the following issues and assign them to GitHub Copilot:
   - Title: "Setup Authentication"
     Description: "Implement Firebase authentication with Google login."
   - Title: "UI setup"
     Description: "Design and implement the user interface."
   - Title: "Database setup"
     Description: "Set up the database schema and models."
   - Title: "API setup"
     Description: "Develop the API endpoints."

## React Setup

This section provides guidelines for setting up and using React in this project.
