# TIPI Development Guide

## Prerequisites

- Docker installed and running
- Node.js 16+ and npm
- TIPI CLI (optional but recommended)

## Getting Started

1. Start the TIPI container:
```bash
docker run -d \
  --name cheshire-cat \
  -p 1865:1865 \
  -v $PWD/cat_data:/app/cat_data \
  ghcr.io/cheshire-cat-ai/core:latest
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Configure your .env file with TIPI settings:
```
VITE_CHESHIRE_API_URL=http://localhost:1865
VITE_CHESHIRE_ADMIN_PASSWORD=admin
VITE_CHESHIRE_DEBUG=true
```

4. Start the development server:
```bash
npm run dev
```

## Troubleshooting

### Common Issues

1. CORS Errors
- Ensure the TIPI container is running with proper CORS settings
- Check that vite.config.js proxy settings are correct
- Verify your VITE_CHESHIRE_API_URL matches the TIPI container URL

2. Connection Issues
- Check if the TIPI container is running: `docker ps`
- Verify the port mapping: `docker port cheshire-cat`
- Test direct connection: `curl http://localhost:1865`

3. Authentication Issues
- Verify VITE_CHESHIRE_ADMIN_PASSWORD matches TIPI container settings
- Check network logs for auth token responses
- Try restarting TIPI container if auth persists

### Development Tips

1. Enable debug mode for detailed logs:
```
VITE_CHESHIRE_DEBUG=true
```

2. Monitor TIPI container logs:
```bash
docker logs -f cheshire-cat
```

3. Reset TIPI container if needed:
```bash
docker restart cheshire-cat
```

## Development Workflow

1. Start TIPI container
2. Run development server
3. Initialize Cheshire service (automatic on app start)
4. Monitor logs for connection issues
5. Use CheshireService.checkTipiHealth() to verify connection

## API Integration

The Cheshire Cat service automatically handles:
- Connection management
- Authentication
- Retries on failure
- Error handling with detailed logs

See `src/services/cheshireService.ts` for implementation details.