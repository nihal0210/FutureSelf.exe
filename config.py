import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'dev-fallback-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///shadow_slayer.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session config for OAuth
    SESSION_TYPE = 'filesystem'
    
    # OAuth
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    
    # Gemini
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
