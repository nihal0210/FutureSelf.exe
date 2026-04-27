from flask import Blueprint, url_for, session, redirect, render_template, request
from extensions import oauth, db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def index():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user and user.onboarding_completed:
            return redirect(url_for('dashboard.index'))
        else:
            return redirect(url_for('onboarding.index'))
    return render_template('login.html')

@auth_bp.route('/auth/login')
def login():
    redirect_uri = url_for('auth.callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/auth/callback')
def callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        if not user_info:
            return "OAuth Failed: No user info received from Google.", 400
        
        # Check if user exists
        user = User.query.get(user_info['sub'])
        if not user:
            user = User(
                id=user_info['sub'],
                email=user_info['email'],
                name=user_info['name'],
                avatar_url=user_info.get('picture')
            )
            db.session.add(user)
            db.session.commit()
            
        session['user_id'] = user.id
        
        if user.onboarding_completed:
            return redirect(url_for('dashboard.index'))
        else:
            return redirect(url_for('onboarding.index'))
            
    except Exception as e:
        print(f"Auth error: {e}")
        return f"Authentication failed: {str(e)}", 400

@auth_bp.route('/auth/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('auth.index'))
