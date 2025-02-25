# ...existing code...
from fastapi.middleware.cors import CORSMiddleware

# Remove redundant CORS middleware configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# ...existing code...
