from flask import Blueprint, render_template, request, session, redirect, url_for, jsonify
from extensions import db
from models import User

onboarding_bp = Blueprint('onboarding', __name__)

@onboarding_bp.route('/onboarding')
def index():
    if 'user_id' not in session:
        return redirect(url_for('auth.index'))
        
    user = User.query.get(session['user_id'])
    if user.onboarding_completed:
        return redirect(url_for('dashboard.index'))
        
    return render_template('onboarding.html')

@onboarding_bp.route('/api/user/onboarding', methods=['POST'])
def save_onboarding():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.json
    user = User.query.get(session['user_id'])
    
    if user:
        user.user_type = data.get('user_type')
        user.primary_goal = data.get('primary_goal')
        user.pain_point = data.get('pain_point')
        user.available_hours = data.get('available_hours')
        user.motivation_style = data.get('motivation_style')
        user.onboarding_completed = True
        
        db.session.commit()
        return jsonify({"success": True})
        
    return jsonify({"error": "User not found"}), 404
