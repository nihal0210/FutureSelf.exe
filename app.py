import os
from flask import Flask, session
from flask_session import Session
from config import Config
from extensions import db, oauth
from models import User

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    oauth.init_app(app)
    
    # Configure Flask-Session
    Session(app)

    # Register Google OAuth
    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

    # Register blueprints
    from routes.auth import auth_bp
    from routes.onboarding import onboarding_bp
    from routes.dashboard import dashboard_bp
    from routes.quests import quests_bp
    from routes.api import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(onboarding_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(quests_bp)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
