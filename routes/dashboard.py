from flask import Blueprint, render_template, session, redirect, url_for
from models import User, DailyHabit, Quest
from datetime import date

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def index():
    if 'user_id' not in session:
        return redirect(url_for('auth.index'))
        
    user = User.query.get(session['user_id'])
    if not user.onboarding_completed:
        return redirect(url_for('onboarding.index'))
        
    # Get today's habit if it exists
    today_habit = DailyHabit.query.filter_by(user_id=user.id, date=date.today()).first()
    
    # Get active quests
    active_quests = Quest.query.filter_by(user_id=user.id, is_completed=False).all()
    
    return render_template('dashboard.html', user=user, today_habit=today_habit, active_quests=active_quests)

@dashboard_bp.route('/history')
def history():
    if 'user_id' not in session:
        return redirect(url_for('auth.index'))
        
    user = User.query.get(session['user_id'])
    habits = DailyHabit.query.filter_by(user_id=user.id).order_by(DailyHabit.date.desc()).limit(30).all()
    
    return render_template('history.html', user=user, habits=habits)
