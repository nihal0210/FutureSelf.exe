from flask import Blueprint, session, jsonify, request
from extensions import db
from models import User, Quest
from engines.quest_engine import generate_quests
from engines.stat_engine import calculate_level
from datetime import datetime

quests_bp = Blueprint('quests', __name__)

@quests_bp.route('/api/quests/generate', methods=['POST'])
def gen_quests():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = User.query.get(session['user_id'])
    
    # Clear old incomplete quests
    Quest.query.filter_by(user_id=user.id, is_completed=False).delete()
    
    # Generate new quests via AI
    ai_quests = generate_quests(user, 3)
    
    new_quests = []
    for q in ai_quests:
        quest = Quest(
            user_id=user.id,
            title=q.get('title', 'Unknown Quest'),
            description=q.get('description', ''),
            difficulty=q.get('difficulty', 'easy'),
            xp_reward=q.get('xp_reward', 50),
            persona_type=user.user_type
        )
        db.session.add(quest)
        new_quests.append(quest)
        
    db.session.commit()
    
    return jsonify({
        "success": True, 
        "quests": [{"id": q.id, "title": q.title, "description": q.description, "difficulty": q.difficulty, "xp": q.xp_reward} for q in new_quests]
    })

@quests_bp.route('/api/quests/complete/<int:quest_id>', methods=['POST'])
def complete_quest(quest_id):
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = User.query.get(session['user_id'])
    quest = Quest.query.get_or_404(quest_id)
    
    if quest.user_id != user.id or quest.is_completed:
        return jsonify({"error": "Invalid quest"}), 400
        
    quest.is_completed = True
    quest.completed_at = datetime.utcnow()
    
    # Award XP and check level up
    old_level = user.level
    user.xp += quest.xp_reward
    new_level = calculate_level(user.xp)
    
    level_up = False
    if new_level > old_level:
        user.level = new_level
        level_up = True
        
    db.session.commit()
    
    return jsonify({
        "success": True,
        "xp_earned": quest.xp_reward,
        "total_xp": user.xp,
        "level_up": level_up,
        "new_level": user.level
    })
