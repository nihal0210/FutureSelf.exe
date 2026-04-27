from flask import Blueprint, session, jsonify, request
from extensions import db
from models import User, DailyHabit
from engines.stat_engine import calculate_stats, calculate_xp, calculate_level
from engines.prediction_engine import generate_prediction
from engines.advisor_engine import generate_advice
from datetime import date
import json

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/habits/submit', methods=['POST'])
def submit_habit():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = User.query.get(session['user_id'])
    data = request.json
    
    today = date.today()
    habit = DailyHabit.query.filter_by(user_id=user.id, date=today).first()
    
    if not habit:
        habit = DailyHabit(user_id=user.id, date=today)
        db.session.add(habit)
        
        # Update streak
        if user.last_active == date.fromordinal(today.toordinal() - 1):
            user.streak += 1
        elif user.last_active != today:
            user.streak = 1
        user.last_active = today
    
    # Update inputs
    habit.study_hours = float(data.get('study_hours', 0))
    habit.sleep_hours = float(data.get('sleep_hours', 0))
    habit.screen_time = float(data.get('screen_time', 0))
    habit.exercise_mins = int(data.get('exercise_mins', 0))
    habit.skill_level = int(data.get('skill_level', 1))
    
    # Calculate stats
    stats = calculate_stats(
        habit.study_hours, habit.sleep_hours, habit.screen_time, habit.exercise_mins, habit.skill_level
    )
    
    habit.strength_score = stats['strength']
    habit.vitality_score = stats['vitality']
    habit.intelligence_score = stats['intelligence']
    habit.overall_score = stats['overall']
    user.rank = stats['rank']
    
    # Calculate XP
    xp_gained = calculate_xp(habit.overall_score, user.rank)
    old_level = user.level
    user.xp += xp_gained
    user.level = calculate_level(user.xp)
    
    # Get AI Prediction & Advice
    prediction_json = generate_prediction(user, stats, user.streak)
    advice_text = generate_advice(stats)
    
    habit.ai_prediction = prediction_json
    habit.ai_advice = advice_text
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "stats": stats,
        "xp_gained": xp_gained,
        "level_up": user.level > old_level,
        "new_level": user.level,
        "prediction": json.loads(prediction_json) if prediction_json.startswith('{') else prediction_json,
        "advice": advice_text
    })

@api_bp.route('/api/user/profile')
def profile():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = User.query.get(session['user_id'])
    return jsonify({
        "name": user.name,
        "level": user.level,
        "xp": user.xp,
        "rank": user.rank,
        "streak": user.streak
    })
