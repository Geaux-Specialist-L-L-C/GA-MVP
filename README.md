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
   Create `.env` file with Firebase configuration (see `.env.example`)

3. Start development:
   ```bash
   npm run dev    # Start dev server
   ```

Visit `http://localhost:5173` for development.

## Key Features
- AI-powered learning style assessment through interactive chat
- Personalized learning paths based on VARK model
- Real-time progress tracking
- Google authentication
- Interactive dashboard for students and educators

## Documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Detailed setup, architecture, and development roadmap
- [Component Structure](./src/components/README.md) - UI component documentation
- [API Documentation](./backend/README.md) - Backend API reference

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to Firebase
```

## Contributing
See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed development instructions and roadmap.

## License
[MIT License](LICENSE)
