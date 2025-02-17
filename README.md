# Geaux Academy

An interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation
1. Clone and install:
   ```bash
   git clone <repository-url>
   cd GA-MVP
   npm install
   ```

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Replace placeholder values with your Firebase configuration
   - IMPORTANT: Never commit `.env` file with real credentials
   - For production, use GitHub Secrets and CI/CD environment variables

3. Start development:
   ```bash
   npm run dev    # Start dev server
   ```

Visit `http://localhost:5173` for development.

## Security Best Practices

### Firebase Configuration
- Store Firebase credentials in environment variables
- Use different Firebase projects for development/staging/production
- Enable secure authentication methods in Firebase Console
- Implement proper Firestore security rules
- Use App Check in production to prevent abuse

For detailed security guidelines, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).

## Key Features
- AI-powered learning style assessment through interactive chat
- Personalized learning paths based on VARK model
- Real-time progress tracking
```

## Contributing
See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed development instructions and roadmap.

## License
[MIT License](LICENSE)
