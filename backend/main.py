from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.connection import MongoDB
from .routes import users, courses, assessments
from .config.settings import get_settings
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# ...existing code...
