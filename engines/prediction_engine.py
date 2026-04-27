import os
import json
import google.generativeai as genai
from config import Config

# Configure Gemini once
if Config.GEMINI_API_KEY:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def generate_prediction(user, stats_dict, streak):
    if not model:
        return json.dumps({
            "1_month": "API key missing. Unable to compute future timeline.",
            "6_months": "API key missing.",
            "1_year": "API key missing.",
            "5_years": "API key missing."
        })
        
    prompt = f"""
    Act as a "Shadow Advisor", an AI entity in a Solo Leveling-style RPG habit tracker.
    The user is currently a '{user.user_type}' with the goal '{user.primary_goal}' and their main struggle is '{user.pain_point}'.
    Their motivation style is '{user.motivation_style}'.
    
    Current Stats:
    - Strength (Career/Study Power): {stats_dict.get('strength')}/100
    - Vitality (Health/Energy): {stats_dict.get('vitality')}/100
    - Intelligence (Focus/Mind): {stats_dict.get('intelligence')}/100
    - Overall Rank: {stats_dict.get('rank')} (E is lowest, S is highest)
    - Current Streak: {streak} days
    
    Based ONLY on these stats, predict their future life trajectory in exactly 1 month, 6 months, 1 year, and 5 years.
    Be brutally honest, a bit dramatic (Solo Leveling theme), and directly tie it to their stats and persona. 
    If stats are low, predict failure. If high, predict success. Keep it to 1-2 sentences per timeframe.
    
    Return the response as a raw JSON string (no markdown formatting, no ```json tags) with exactly these keys:
    {{"1_month": "...", "6_months": "...", "1_year": "...", "5_years": "..."}}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean up any potential markdown wrappers from Gemini
        if text.startswith('```json'): text = text[7:]
        if text.startswith('```'): text = text[3:]
        if text.endswith('```'): text = text[:-3]
        return text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return json.dumps({
            "1_month": "The timeline is clouded. Cannot compute.",
            "6_months": "...", "1_year": "...", "5_years": "..."
        })
