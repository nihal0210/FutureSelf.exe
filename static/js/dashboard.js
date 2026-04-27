document.addEventListener('DOMContentLoaded', () => {
    // Slider value updates
    const sliders = ['study_hours', 'sleep_hours', 'exercise_mins', 'screen_time', 'skill_level'];
    sliders.forEach(id => {
        const el = document.getElementById(id);
        const valEl = document.getElementById(id.split('_')[0] + '-val');
        if (el && valEl) {
            valEl.textContent = el.value;
            el.addEventListener('input', (e) => {
                valEl.textContent = e.target.value;
            });
        }
    });

    // Submit Habit
    const submitBtn = document.getElementById('submit-habit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Syncing...';
            
            const data = {
                study_hours: document.getElementById('study_hours').value,
                sleep_hours: document.getElementById('sleep_hours').value,
                exercise_mins: document.getElementById('exercise_mins').value,
                screen_time: document.getElementById('screen_time').value,
                skill_level: document.getElementById('skill_level').value
            };

            try {
                const res = await fetch('/api/habits/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                
                if (result.success) {
                    // Update Stats UI
                    document.querySelector('#str-ring .stat-val').textContent = result.stats.strength;
                    document.querySelector('#vit-ring .stat-val').textContent = result.stats.vitality;
                    document.querySelector('#int-ring .stat-val').textContent = result.stats.intelligence;
                    document.querySelector('.rank-letter').textContent = result.stats.rank;
                    document.querySelector('.xp-text').textContent = `XP: ${result.total_xp || 'Up'}`;
                    
                    // Update AI panels
                    document.getElementById('ai-advice-content').textContent = result.advice;
                    document.getElementById('pred-1m').textContent = result.prediction['1_month'];
                    document.getElementById('pred-6m').textContent = result.prediction['6_months'];
                    document.getElementById('pred-1y').textContent = result.prediction['1_year'];
                    
                    if (result.level_up) {
                        document.getElementById('new-level-num').textContent = result.new_level;
                        document.getElementById('level-up-modal').classList.remove('hidden');
                        document.querySelector('.level-badge').textContent = `LVL ${result.new_level}`;
                    }
                }
            } catch (e) {
                console.error(e);
                alert("Error syncing stats.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Record Stats';
            }
        });
    }

    // Refresh Quests
    const refreshBtn = document.getElementById('refresh-quests');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '...';
            
            try {
                const res = await fetch('/api/quests/generate', { method: 'POST' });
                const result = await res.json();
                
                if (result.success) {
                    const list = document.getElementById('quest-list');
                    list.innerHTML = '';
                    result.quests.forEach(q => {
                        list.innerHTML += `
                            <div class="quest-card" id="quest-${q.id}">
                                <div class="quest-badge diff-${q.difficulty}">${q.difficulty.toUpperCase()}</div>
                                <h4>${q.title}</h4>
                                <p>${q.description}</p>
                                <div class="quest-footer">
                                    <span class="xp-reward">+${q.xp} XP</span>
                                    <button class="btn sm-btn complete-quest-btn" data-id="${q.id}">Complete</button>
                                </div>
                            </div>
                        `;
                    });
                    attachQuestListeners();
                }
            } catch (e) {
                console.error(e);
            } finally {
                refreshBtn.disabled = false;
                refreshBtn.textContent = '🔄 Refresh';
            }
        });
    }

    function attachQuestListeners() {
        document.querySelectorAll('.complete-quest-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                btn.disabled = true;
                
                try {
                    const res = await fetch(`/api/quests/complete/${id}`, { method: 'POST' });
                    const result = await res.json();
                    
                    if (result.success) {
                        document.getElementById(`quest-${id}`).style.opacity = '0.3';
                        btn.textContent = 'Done';
                        
                        document.querySelector('.xp-text').textContent = `XP: ${result.total_xp}`;
                        if (result.level_up) {
                            document.getElementById('new-level-num').textContent = result.new_level;
                            document.getElementById('level-up-modal').classList.remove('hidden');
                            document.querySelector('.level-badge').textContent = `LVL ${result.new_level}`;
                        }
                    }
                } catch (err) {
                    console.error(err);
                    btn.disabled = false;
                }
            });
        });
    }
    attachQuestListeners();
});
