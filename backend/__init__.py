// File: /backend/__init__.py
// Description: Index file for backend. Exposes the FastAPI app and registers application routes.
// Author: GitHub Copilot
// Created: 2023-10-04

from .main import app
from .routes.users import router as users_router


def register_routes():
    """Register all routers to the FastAPI app."""
    app.include_router(users_router)

register_routes()

# Export the app for running the server
__all__ = ['app']
