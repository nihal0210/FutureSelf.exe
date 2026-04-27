import json
import google.generativeai as genai
from config import Config

if Config.GEMINI_API_KEY:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def generate_quests(user, num_quests=3):
    if not model:
        return [
            {"title": "Configure AI", "description": "Add Gemini API key to .env file", "difficulty": "easy", "xp_reward": 100}
        ]
        
    prompt = f"""
    Act as the System in a Solo Leveling-style RPG habit tracker.
    The user '{user.name}' is Level {user.level}, Rank {user.rank}.
    Persona: {user.user_type}. Goal: {user.primary_goal}. Pain Point: {user.pain_point}.
    
    Generate {num_quests} daily quests specifically tailored to help them overcome their pain point and achieve their goal.
    Make the descriptions sound like RPG quests (e.g., 'Defeat the Procrastination Demon by...', 'Acquire knowledge of...').
    
    Return as raw JSON array (no markdown tags) where each quest has:
    - "title": (String, short punchy quest name)
    - "description": (String, detailed action to take)
    - "difficulty": (String, "easy", "medium", or "hard")
    - "xp_reward": (Integer, easy=50, medium=100, hard=200)
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        
        quests = json.loads(text.strip())
        return quests
    except Exception as e:
        print(f"Quest Engine Error: {e}")
        return [
            {"title": "Daily Grind", "description": "Complete your basic daily habits.", "difficulty": "easy", "xp_reward": 50}
        ]
