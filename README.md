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

### Creating Issues for Next Steps in Development
1. Navigate to the repository on GitHub.
2. Click on the "Issues" tab.
3. Click on the "New issue" button.
4. Choose the appropriate issue template (e.g., Bug report, Feature request, Custom issue).
5. Fill out the issue template with the necessary information.
6. Click "Submit new issue" to create the issue.

### Contributing
Please refer to the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) file for guidelines on how to contribute to this project.

### Code of Conduct
Please refer to the [CODE_OF_CONDUCT.md](./.github/CODE_OF_CONDUCT.md) file for the code of conduct for this project.

### License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
