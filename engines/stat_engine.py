def calculate_stats(study_hours, sleep_hours, screen_time, exercise_mins, skill_level):
    # Base inputs are normalized and weighted
    
    # Strength = Study output + Skill level
    str_score = (study_hours / 12 * 60) + (skill_level / 10 * 40)
    
    # Vitality = Sleep + Exercise
    vit_score = (sleep_hours / 9 * 50) + (exercise_mins / 120 * 50)
    
    # Intelligence = Study output - Screen time penalty + Skill level
    int_score = (study_hours / 12 * 60) - (screen_time / 14 * 40) + (skill_level / 10 * 40)
    
    # Clamp all scores to 0-100
    str_score = max(0, min(100, str_score))
    vit_score = max(0, min(100, vit_score))
    int_score = max(0, min(100, int_score))
    
    overall = (str_score + vit_score + int_score) / 3
    
    rank = get_rank(overall)
    
    return {
        'strength': round(str_score, 1),
        'vitality': round(vit_score, 1),
        'intelligence': round(int_score, 1),
        'overall': round(overall, 1),
        'rank': rank
    }

def get_rank(score):
    if score >= 90:
        return 'S'
    elif score >= 75:
        return 'A'
    elif score >= 60:
        return 'B'
    elif score >= 40:
        return 'C'
    elif score >= 20:
        return 'D'
    else:
        return 'E'

def calculate_xp(overall_score, rank):
    base_xp = int(overall_score * 10)
    multipliers = {'S': 3.0, 'A': 2.0, 'B': 1.5, 'C': 1.2, 'D': 1.0, 'E': 0.8}
    return int(base_xp * multipliers.get(rank, 1.0))

def calculate_level(total_xp):
    import math
    if total_xp <= 0:
        return 1
    # Level = floor(sqrt(total_xp / 100)) + 1
    return math.floor(math.sqrt(total_xp / 100)) + 1
