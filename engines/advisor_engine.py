import google.generativeai as genai
from config import Config

if Config.GEMINI_API_KEY:
    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def generate_advice(stats_dict):
    if not model:
        return "The system is disconnected from the AI network. Cannot provide advice."
        
    # Find the weakest stat
    weakest = min(
        [('Strength', stats_dict.get('strength', 0)), 
         ('Vitality', stats_dict.get('vitality', 0)), 
         ('Intelligence', stats_dict.get('intelligence', 0))],
        key=lambda x: x[1]
    )
    
    prompt = f"""
    Act as a "Shadow Advisor", a harsh but motivating AI mentor in an RPG habit tracker.
    The user's current weakest stat is {weakest[0]} at {weakest[1]}/100.
    Overall Rank is {stats_dict.get('rank')}.
    
    Give them a 2-3 sentence 'roast' and actionable advice on how to improve this specific weak point.
    Use an intense, slightly dramatic RPG tone (e.g. 'You are running on fumes. Your vitality is crumbling. Sleep before you collapse.')
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Advisor Engine Error: {e}")
        return "Keep pushing forward. Consistency is the key to leveling up."
