from extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.String(100), primary_key=True) # Google sub ID
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.String(255))
    
    # RPG Stats
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Integer, default=0)
    rank = db.Column(db.String(10), default='E')
    streak = db.Column(db.Integer, default=0)
    last_active = db.Column(db.Date)
    
    # Onboarding persona fields
    user_type = db.Column(db.String(50)) # school/college/graduate/professional
    primary_goal = db.Column(db.String(100))
    pain_point = db.Column(db.String(100))
    available_hours = db.Column(db.Float)
    motivation_style = db.Column(db.String(50))
    onboarding_completed = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    habits = db.relationship('DailyHabit', backref='user', lazy=True, cascade="all, delete-orphan")
    quests = db.relationship('Quest', backref='user', lazy=True, cascade="all, delete-orphan")

class DailyHabit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    # Inputs
    study_hours = db.Column(db.Float, default=0)
    sleep_hours = db.Column(db.Float, default=0)
    screen_time = db.Column(db.Float, default=0)
    exercise_mins = db.Column(db.Integer, default=0)
    skill_level = db.Column(db.Integer, default=1)
    
    # Calculated Scores (0-100)
    strength_score = db.Column(db.Float, default=0)
    vitality_score = db.Column(db.Float, default=0)
    intelligence_score = db.Column(db.Float, default=0)
    overall_score = db.Column(db.Float, default=0)
    
    # AI Responses
    ai_prediction = db.Column(db.Text) # Stored as JSON string
    ai_advice = db.Column(db.Text)
    
    # Enforce one habit entry per user per day
    __table_args__ = (db.UniqueConstraint('user_id', 'date', name='uq_user_date'),)

class Quest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20)) # easy/medium/hard
    xp_reward = db.Column(db.Integer, nullable=False)
    persona_type = db.Column(db.String(50))
    
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
