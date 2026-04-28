import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #020408;
    --bg2: #060d14;
    --panel: rgba(8, 20, 35, 0.85);
    --border: rgba(0, 180, 255, 0.15);
    --border-glow: rgba(0, 180, 255, 0.5);
    --cyan: #00b4ff;
    --cyan-dim: rgba(0, 180, 255, 0.6);
    --gold: #ffd700;
    --gold-dim: rgba(255, 215, 0, 0.7);
    --red: #ff3b5c;
    --green: #00ff9d;
    --purple: #b44aff;
    --text: #c8dff0;
    --text-dim: rgba(200, 223, 240, 0.5);
    --font-display: 'Cinzel Decorative', serif;
    --font-body: 'Rajdhani', sans-serif;
    --font-mono: 'Share Tech Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .hex-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0,100,200,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(80,0,200,0.06) 0%, transparent 60%),
      repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(0,180,255,0.015) 40px, rgba(0,180,255,0.015) 41px),
      repeating-linear-gradient(-60deg, transparent, transparent 40px, rgba(0,180,255,0.015) 40px, rgba(0,180,255,0.015) 41px);
  }

  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    animation: scan 8s linear infinite;
  }

  @keyframes scan {
    0% { background-position: 0 0; }
    100% { background-position: 0 100px; }
  }

  .app { position: relative; z-index: 2; min-height: 100vh; }

  /* ── ONBOARDING ── */
  .onboard-wrap {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 24px;
  }

  .onboard-title {
    font-family: var(--font-display); font-size: clamp(1.4rem, 4vw, 2.4rem);
    color: var(--cyan); text-align: center; letter-spacing: 0.05em;
    text-shadow: 0 0 30px rgba(0,180,255,0.6), 0 0 60px rgba(0,180,255,0.3);
    margin-bottom: 6px;
  }

  .onboard-sub {
    font-family: var(--font-mono); color: var(--text-dim); font-size: 0.8rem;
    text-align: center; margin-bottom: 36px; letter-spacing: 0.2em;
  }

  .onboard-card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 2px; padding: 32px; max-width: 520px; width: 100%;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 60px rgba(0,180,255,0.05), inset 0 1px 0 rgba(0,180,255,0.1);
    animation: fadeUp 0.5s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .step-indicator {
    display: flex; gap: 6px; margin-bottom: 28px; justify-content: center;
  }

  .step-dot {
    width: 28px; height: 3px; background: var(--border);
    transition: all 0.3s ease;
  }
  .step-dot.active { background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
  .step-dot.done { background: var(--green); }

  .q-label {
    font-family: var(--font-mono); font-size: 0.7rem; color: var(--cyan-dim);
    letter-spacing: 0.3em; margin-bottom: 10px;
  }

  .q-text {
    font-family: var(--font-body); font-size: 1.25rem; font-weight: 600;
    color: var(--text); margin-bottom: 20px; line-height: 1.3;
  }

  .option-grid { display: grid; gap: 10px; }

  .option-btn {
    background: rgba(0,180,255,0.04); border: 1px solid var(--border);
    color: var(--text); font-family: var(--font-body); font-size: 0.95rem;
    font-weight: 500; padding: 12px 16px; text-align: left; cursor: pointer;
    transition: all 0.2s ease; letter-spacing: 0.02em; border-radius: 1px;
    display: flex; align-items: center; gap: 10px;
  }

  .option-btn:hover { border-color: var(--cyan-dim); background: rgba(0,180,255,0.1); color: #fff; }
  .option-btn.selected {
    border-color: var(--cyan); background: rgba(0,180,255,0.18);
    color: var(--cyan); box-shadow: 0 0 20px rgba(0,180,255,0.1);
  }

  .option-icon { font-size: 1.2rem; }

  .nav-row { display: flex; justify-content: flex-end; margin-top: 24px; gap: 10px; }

  /* ── BUTTONS ── */
  .btn-primary {
    background: transparent; border: 1px solid var(--cyan);
    color: var(--cyan); font-family: var(--font-mono); font-size: 0.8rem;
    letter-spacing: 0.15em; padding: 10px 24px; cursor: pointer;
    transition: all 0.2s ease; text-transform: uppercase;
    position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: var(--cyan); transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary:hover { color: var(--bg); }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-primary:disabled:hover::before { transform: translateX(-100%); }
  .btn-primary:disabled:hover { color: var(--cyan); }

  .btn-gold {
    background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: var(--font-mono); font-size: 0.8rem;
    letter-spacing: 0.15em; padding: 10px 24px; cursor: pointer;
    transition: all 0.2s ease; text-transform: uppercase;
  }
  .btn-gold:hover { background: var(--gold); color: var(--bg); }

  /* ── DASHBOARD ── */
  .dash-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 16px 60px; }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 0 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px;
    flex-wrap: wrap; gap: 12px;
  }

  .logo { font-family: var(--font-display); font-size: 1.1rem; color: var(--cyan); letter-spacing: 0.05em; text-shadow: 0 0 20px rgba(0,180,255,0.5); }
  .logo small { display: block; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); letter-spacing: 0.3em; margin-top: 2px; }

  .header-right { display: flex; align-items: center; gap: 16px; }

  .rank-badge {
    font-family: var(--font-display); font-size: 1.6rem; font-weight: 900;
    padding: 6px 16px; border: 2px solid;
    text-shadow: 0 0 20px currentColor;
    box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02);
  }

  .rank-E { color: #aaa; border-color: #aaa; }
  .rank-D { color: #4af; border-color: #4af; }
  .rank-C { color: #4f4; border-color: #4f4; }
  .rank-B { color: #f90; border-color: #f90; }
  .rank-A { color: #f44; border-color: #f44; }
  .rank-S { color: var(--gold); border-color: var(--gold); box-shadow: 0 0 30px rgba(255,215,0,0.4); animation: pulse-gold 2s ease infinite; }

  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.4); }
    50% { box-shadow: 0 0 40px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.3); }
  }

  .xp-bar-wrap { flex: 1; min-width: 120px; max-width: 180px; }
  .xp-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.2em; margin-bottom: 4px; display: flex; justify-content: space-between; }
  .xp-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 0; overflow: hidden; }
  .xp-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--purple)); transition: width 0.8s cubic-bezier(.4,0,.2,1); box-shadow: 0 0 8px var(--cyan); }

  /* ── GRID LAYOUT ── */
  .dash-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .dash-grid-2 { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; margin-bottom: 20px; }
  @media (max-width: 800px) { .dash-grid { grid-template-columns: 1fr; } .dash-grid-2 { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .dash-grid { grid-template-columns: 1fr; } }

  /* ── PANELS ── */
  .panel {
    background: var(--panel); border: 1px solid var(--border);
    backdrop-filter: blur(16px); padding: 20px;
    position: relative; overflow: hidden;
    box-shadow: 0 4px 40px rgba(0,0,0,0.4);
  }

  .panel::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan-dim), transparent);
  }

  .panel-label {
    font-family: var(--font-mono); font-size: 0.65rem; color: var(--cyan-dim);
    letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .panel-label::before { content: '◈'; font-size: 0.55rem; }

  /* ── STAT BARS ── */
  .stat-row { margin-bottom: 14px; }
  .stat-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .stat-name { font-family: var(--font-body); font-weight: 600; font-size: 0.9rem; letter-spacing: 0.05em; }
  .stat-value { font-family: var(--font-mono); font-size: 0.85rem; }

  .stat-track { height: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); position: relative; overflow: hidden; }
  .stat-fill {
    height: 100%; transition: width 1s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  .stat-fill::after {
    content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 4px;
    background: white; opacity: 0.8;
    box-shadow: 0 0 8px white;
  }

  .stat-STR .stat-fill { background: linear-gradient(90deg, #ff3b5c80, var(--red)); box-shadow: 0 0 10px rgba(255,59,92,0.3); }
  .stat-VIT .stat-fill { background: linear-gradient(90deg, #00ff9d40, var(--green)); box-shadow: 0 0 10px rgba(0,255,157,0.3); }
  .stat-INT .stat-fill { background: linear-gradient(90deg, #00b4ff40, var(--cyan)); box-shadow: 0 0 10px rgba(0,180,255,0.3); }

  .overall-score {
    text-align: center; padding: 10px 0 4px;
    border-top: 1px solid var(--border); margin-top: 16px;
  }
  .score-num { font-family: var(--font-display); font-size: 2.4rem; color: var(--gold); text-shadow: 0 0 20px rgba(255,215,0,0.4); }
  .score-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.2em; }

  /* ── HABIT INPUTS ── */
  .habit-row { display: flex; flex-direction: column; gap: 10px; }

  .habit-item { display: flex; flex-direction: column; gap: 4px; }

  .habit-label-row { display: flex; justify-content: space-between; }
  .habit-name { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; }
  .habit-val { font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan); }

  .slider {
    -webkit-appearance: none; width: 100%; height: 4px;
    background: rgba(255,255,255,0.08); outline: none; border-radius: 0;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px;
    background: var(--cyan); cursor: pointer;
    box-shadow: 0 0 10px var(--cyan); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  /* ── PREDICTION ── */
  .pred-timeline { display: flex; flex-direction: column; gap: 10px; }

  .pred-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 10px; border: 1px solid var(--border);
    background: rgba(0,180,255,0.02); transition: all 0.2s ease;
  }
  .pred-item:hover { border-color: var(--cyan-dim); background: rgba(0,180,255,0.06); }

  .pred-time {
    font-family: var(--font-mono); font-size: 0.65rem; color: var(--cyan);
    letter-spacing: 0.1em; white-space: nowrap; min-width: 50px; padding-top: 2px;
  }

  .pred-text { font-size: 0.85rem; line-height: 1.5; color: var(--text); }

  .pred-loading { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-family: var(--font-mono); font-size: 0.75rem; }
  .dot-blink { animation: blink 1s step-end infinite; }
  .dot-blink:nth-child(2) { animation-delay: 0.33s; }
  .dot-blink:nth-child(3) { animation-delay: 0.66s; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* ── QUEST ── */
  .quest-card {
    border: 1px solid rgba(255,215,0,0.2);
    background: rgba(255,215,0,0.02);
    padding: 16px; margin-bottom: 12px;
    position: relative;
  }
  .quest-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--gold);
  }

  .quest-title { font-weight: 700; font-size: 1rem; color: var(--gold); margin-bottom: 4px; }
  .quest-diff { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.2em; margin-bottom: 10px; }
  .quest-diff.easy { color: var(--green); }
  .quest-diff.medium { color: #ff9d00; }
  .quest-diff.hard { color: var(--red); }
  .quest-desc { font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; margin-bottom: 12px; }
  .quest-reward { font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold-dim); }

  /* ── ADVISOR ── */
  .advisor-msg {
    font-size: 0.9rem; line-height: 1.7; color: var(--text);
    border-left: 2px solid var(--cyan); padding-left: 14px; margin-bottom: 12px;
  }

  .advisor-tag {
    display: inline-block; font-family: var(--font-mono); font-size: 0.65rem;
    padding: 2px 8px; border: 1px solid; letter-spacing: 0.15em;
    margin-right: 6px; margin-bottom: 6px;
  }
  .tag-warn { color: var(--red); border-color: var(--red); }
  .tag-ok { color: var(--green); border-color: var(--green); }
  .tag-info { color: var(--cyan); border-color: var(--cyan); }

  /* ── STREAK ── */
  .streak-num { font-family: var(--font-display); font-size: 2rem; color: #ff6b35; text-shadow: 0 0 20px rgba(255,107,53,0.5); }
  .streak-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.2em; }
  .streak-fire { font-size: 1.5rem; animation: flicker 0.5s ease infinite alternate; }
  @keyframes flicker { from { transform: scaleY(1); } to { transform: scaleY(1.15); } }

  .persona-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-mono); font-size: 0.7rem; color: var(--purple);
    border: 1px solid rgba(180,74,255,0.4); padding: 4px 10px;
    background: rgba(180,74,255,0.06); letter-spacing: 0.1em;
  }

  /* ── SUBMIT ROW ── */
  .submit-row { display: flex; justify-content: center; padding: 8px 0 4px; }

  .glitch {
    position: relative;
  }
  .glitch:hover { animation: glitch-anim 0.3s steps(1) 1; }
  @keyframes glitch-anim {
    0% { text-shadow: 2px 0 var(--red), -2px 0 var(--cyan); }
    33% { text-shadow: -2px 0 var(--red), 2px 0 var(--cyan); }
    66% { text-shadow: 2px 2px var(--purple), -2px -2px var(--cyan); }
    100% { text-shadow: none; }
  }

  /* ── FOOTER ── */
  .footer {
    text-align: center; font-family: var(--font-mono); font-size: 0.65rem;
    color: rgba(255,255,255,0.1); letter-spacing: 0.2em; padding: 20px 0;
  }

  /* ── TRANSITION ── */
  .fade-in { animation: fadeIn 0.6s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .level-up-flash {
    position: fixed; inset: 0; background: rgba(0,180,255,0.15);
    z-index: 999; pointer-events: none; animation: levelFlash 0.6s ease forwards;
  }
  @keyframes levelFlash {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
\`;

// ── QUESTIONS ──
const QUESTIONS = [
  {
    key: "user_type",
    label: "SYSTEM SCAN",
    text: "Who are you, Hunter?",
    options: [
      { icon: "📚", label: "School Student", value: "school" },
      { icon: "🎓", label: "College Student", value: "college" },
      { icon: "🔬", label: "Graduate / Researcher", value: "graduate" },
      { icon: "💼", label: "Working Professional", value: "professional" },
    ],
  },
  {
    key: "primary_goal",
    label: "PRIMARY OBJECTIVE",
    text: "What is your main quest?",
    options: [
      { icon: "🏆", label: "Crack Exams (JEE/Boards)", value: "exams" },
      { icon: "💻", label: "FAANG Placement / DSA", value: "placement" },
      { icon: "📄", label: "Research Paper / Publication", value: "research" },
      { icon: "📈", label: "Career Growth / Promotion", value: "career" },
    ],
  },
  {
    key: "pain_point",
    label: "WEAKNESS DETECTED",
    text: "What is your biggest enemy?",
    options: [
      { icon: "📱", label: "Distraction & Social Media", value: "distraction" },
      { icon: "😴", label: "Procrastination", value: "procrastination" },
      { icon: "🎯", label: "Lack of Deep Focus", value: "focus" },
      { icon: "🔥", label: "Burnout & Exhaustion", value: "burnout" },
    ],
  },
  {
    key: "available_hours",
    label: "TIME RESOURCE",
    text: "Daily hours you can dedicate?",
    options: [
      { icon: "⚡", label: "1–2 Hours", value: "low" },
      { icon: "🔷", label: "3–4 Hours", value: "medium" },
      { icon: "💎", label: "5–6 Hours", value: "high" },
      { icon: "🚀", label: "6+ Hours (No Limits)", value: "extreme" },
    ],
  },
  {
    key: "motivation_style",
    label: "POWER SOURCE",
    text: "What fuels your grind?",
    options: [
      { icon: "⚔️", label: "Competition (Beat others)", value: "competition" },
      { icon: "🌟", label: "Vision (Future self)", value: "vision" },
      { icon: "🎮", label: "Gamification (XP & Rewards)", value: "gamification" },
      { icon: "🛡️", label: "Discipline (Pure willpower)", value: "discipline" },
    ],
  },
];

const RANK_THRESHOLDS = [
  { rank: "S", min: 85 },
  { rank: "A", min: 70 },
  { rank: "B", min: 55 },
  { rank: "C", min: 40 },
  { rank: "D", min: 25 },
  { rank: "E", min: 0 },
];

function getRank(score) {
  return RANK_THRESHOLDS.find((r) => score >= r.min)?.rank || "E";
}

function calcStats(h) {
  const str = Math.min(100, Math.round((h.study / 8) * 50 + (h.skill / 10) * 30 + ((10 - h.screen / 1.4) / 10) * 20));
  const vit = Math.min(100, Math.round((h.sleep / 9) * 40 + (h.exercise / 60) * 35 + ((10 - h.screen / 1.4) / 10) * 25));
  const intel = Math.min(100, Math.round((h.study / 8) * 40 + (h.skill / 10) * 35 + ((9 - h.sleep) > 0 ? 15 : 25)));
  const overall = Math.round((str + vit + intel) / 3);
  return { str, vit, intel, overall };
}

function calcXP(stats, level) {
  return Math.round(stats.overall * 12 + level * 5);
}

const QUESTS = {
  school: [
    { title: "NCERT Mastery Run", diff: "easy", desc: "Complete 2 full chapters from your weakest subject. Summarize key formulas at the end.", xp: 80 },
    { title: "Speed Solve — MCQs", diff: "medium", desc: "Solve 40 MCQs in under 30 minutes. Time yourself strictly. Review all wrong answers.", xp: 140 },
    { title: "Mock Paper Assault", diff: "hard", desc: "Attempt a full 3-hour mock paper under exam conditions. No phone, no breaks.", xp: 250 },
  ],
  college: [
    { title: "Array & Two Pointer", diff: "easy", desc: "Solve 3 LeetCode array problems (Easy tier). Code clean O(n) solutions.", xp: 80 },
    { title: "Binary Search Raid", diff: "medium", desc: "Solve 2 Medium binary search problems. Analyze time complexity for each.", xp: 150 },
    { title: "DP Boss Battle", diff: "hard", desc: "Solve 1 Hard DP problem. Write the recurrence relation before coding.", xp: 280 },
  ],
  graduate: [
    { title: "Paper Survey Sprint", diff: "easy", desc: "Read and summarize 2 recent papers in your domain. Extract key methodologies.", xp: 90 },
    { title: "Experiment Replication", diff: "medium", desc: "Replicate a baseline result from a paper. Document your setup thoroughly.", xp: 160 },
    { title: "Novel Hypothesis", diff: "hard", desc: "Formulate one original research hypothesis and write a 300-word justification.", xp: 300 },
  ],
  professional: [
    { title: "Skill Module — 1hr", diff: "easy", desc: "Complete one structured learning module from your growth area. Take notes.", xp: 70 },
    { title: "Deep Work Block", diff: "medium", desc: "90-minute uninterrupted deep work session on your highest-impact task.", xp: 140 },
    { title: "Strategic Deliverable", diff: "hard", desc: "Complete and submit a project deliverable that directly impacts your KPIs.", xp: 260 },
  ],
};

// ── MAIN APP ──
export default function ShadowSlayer() {
  const [phase, setPhase] = useState("onboard"); // onboard | dashboard
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [persona, setPersona] = useState(null);
  const [habits, setHabits] = useState({ study: 4, sleep: 7, screen: 4, exercise: 30, skill: 5 });
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [advisor, setAdvisor] = useState("");
  const [advisorTags, setAdvisorTags] = useState([]);
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [levelFlash, setLevelFlash] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const currentQ = QUESTIONS[step];

  function selectOption(val) {
    setAnswers((prev) => ({ ...prev, [currentQ.key]: val }));
  }

  function nextStep() {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finishOnboarding();
    }
  }

  function finishOnboarding() {
    const p = {
      ...answers,
      name: "SHADOW HUNTER",
    };
    setPersona(p);
    setQuest(pickQuest(p.user_type || "college"));
    setPhase("dashboard");
  }

  function pickQuest(type) {
    const pool = QUESTS[type] || QUESTS.college;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function handleSubmit() {
    const s = calcStats(habits);
    setStats(s);
    const newXp = xp + calcXP(s, level);
    const xpToLevel = 500 + level * 200;
    if (newXp >= xpToLevel) {
      setLevel((l) => l + 1);
      setXp(newXp - xpToLevel);
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 700);
    } else {
      setXp(newXp);
    }
    setSubmitted(true);
    setLoading(true);
    setPredictions([]);
    setAdvisor("");
    await fetchAI(s);
  }

  async function fetchAI(s) {
    const personaCtx = persona
      ? \`User is a \${persona.user_type} whose goal is \${persona.primary_goal}. Pain point: \${persona.pain_point}. Available hours: \${persona.available_hours}. Motivation: \${persona.motivation_style}.\`
      : "";

    const prompt = \`You are the Shadow Advisor — an elite AI life coach inside a Solo Leveling RPG game called Shadow Slayer.

\${personaCtx}

Today's stats:
- Strength (Career): \${s.str}/100
- Vitality (Health): \${s.vit}/100
- Intelligence (Productivity): \${s.intel}/100
- Overall Score: \${s.overall}/100
- Rank: \${getRank(s.overall)}

Habits logged:
- Study: \${habits.study}h
- Sleep: \${habits.sleep}h
- Screen time: \${habits.screen}h
- Exercise: \${habits.exercise} mins
- Skill level: \${habits.skill}/10

Respond ONLY in this exact JSON format:
{
  "predictions": [
    { "time": "1 MONTH", "text": "..." },
    { "time": "6 MONTHS", "text": "..." },
    { "time": "1 YEAR", "text": "..." },
    { "time": "5 YEARS", "text": "..." }
  ],
  "advisor": "2-3 sentence personalized insight about their current trajectory. Be dramatic, specific, and motivating like a Solo Leveling narrator.",
  "tags": ["TAG1", "TAG2", "TAG3"]
}

For predictions, be SPECIFIC to the persona's goal. Use exact numbers (LPA, rank, etc). Make them feel real and earned.
Tags should be 1-2 word status indicators from these options: RISING, GRINDING, BURNOUT RISK, PEAK STATE, DANGER ZONE, ON TRACK, UNSTOPPABLE, NEEDS REST, FOCUS MODE, ACCELERATING.
Only return JSON, no other text.\`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
      const parsed = JSON.parse(clean);
      setPredictions(parsed.predictions || []);
      setAdvisor(parsed.advisor || "");
      setAdvisorTags(parsed.tags || []);
    } catch (e) {
      setPredictions([
        { time: "1 MONTH", text: "Your current trajectory shows steady growth. Maintain consistency." },
        { time: "6 MONTHS", text: "Significant skill improvement expected if habits hold." },
        { time: "1 YEAR", text: "Major milestone within reach. Keep pushing." },
        { time: "5 YEARS", text: "Top percentile outcome is achievable from this path." },
      ]);
      setAdvisor("The path of a Shadow Hunter is not linear — but your data shows potential. Stay consistent.");
      setAdvisorTags(["ON TRACK", "GRINDING"]);
    } finally {
      setLoading(false);
    }
  }

  function completeQuest() {
    const earned = quest?.xp || 100;
    const newXp = xp + earned;
    const xpToLevel = 500 + level * 200;
    if (newXp >= xpToLevel) {
      setLevel((l) => l + 1);
      setXp(newXp - xpToLevel);
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 700);
    } else {
      setXp(newXp);
    }
    setStreak((s) => s + 1);
    setQuest(pickQuest(persona?.user_type || "college"));
  }

  const rank = stats ? getRank(stats.overall) : "E";
  const xpToLevel = 500 + level * 200;
  const xpPct = Math.min(100, Math.round((xp / xpToLevel) * 100));

  const personaLabels = {
    school: "SCHOOL HUNTER",
    college: "COLLEGE HUNTER",
    graduate: "GRAD HUNTER",
    professional: "PRO HUNTER",
  };

  const tagType = (tag) => {
    if (["BURNOUT RISK", "DANGER ZONE", "NEEDS REST"].includes(tag)) return "tag-warn";
    if (["PEAK STATE", "UNSTOPPABLE", "ACCELERATING"].includes(tag)) return "tag-ok";
    return "tag-info";
  };

  if (phase === "onboard") {
    return (
      <div className="app">
        <div className="hex-bg" />
        <div className="scanlines" />
        <div className="onboard-wrap">
          <div className="onboard-title glitch">⚔ SHADOW SLAYER</div>
          <div className="onboard-sub">FUTURE YOU SIMULATOR · SYSTEM INITIALIZATION</div>
          <div className="onboard-card">
            <div className="step-indicator">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={\`step-dot \${i < step ? "done" : i === step ? "active" : ""}\`} />
              ))}
            </div>
            <div className="q-label">// {currentQ.label}</div>
            <div className="q-text">{currentQ.text}</div>
            <div className="option-grid">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  className={\`option-btn \${answers[currentQ.key] === opt.value ? "selected" : ""}\`}
                  onClick={() => selectOption(opt.value)}
                >
                  <span className="option-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="nav-row">
              <button
                className="btn-primary"
                disabled={!answers[currentQ.key]}
                onClick={nextStep}
              >
                <span>{step === QUESTIONS.length - 1 ? "ENTER THE SYSTEM →" : "NEXT →"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app fade-in">
      <div className="hex-bg" />
      <div className="scanlines" />
      {levelFlash && <div className="level-up-flash" />}

      <div className="dash-wrap">
        {/* ── HEADER ── */}
        <div className="header">
          <div className="logo">
            ⚔ SHADOW SLAYER
            <small>FUTURE YOU SIMULATOR</small>
          </div>
          <div className="header-right">
            <div className="xp-bar-wrap">
              <div className="xp-label">
                <span>LVL {level}</span>
                <span>{xp}/{xpToLevel} XP</span>
              </div>
              <div className="xp-track">
                <div className="xp-fill" style={{ width: \`\${xpPct}%\` }} />
              </div>
            </div>
            <div className={\`rank-badge rank-\${rank}\`}>{rank}</div>
          </div>
        </div>

        {/* ── ROW 1: HABITS + STATS + ADVISOR ── */}
        <div className="dash-grid">
          {/* HABIT INPUT */}
          <div className="panel">
            <div className="panel-label">DAILY HABITS</div>
            <div className="habit-row">
              {[
                { key: "study", label: "Study Hours", max: 12, unit: "h" },
                { key: "sleep", label: "Sleep Hours", max: 12, unit: "h" },
                { key: "screen", label: "Screen Time", max: 14, unit: "h" },
                { key: "exercise", label: "Exercise", max: 120, unit: "min" },
                { key: "skill", label: "Skill Level", max: 10, unit: "/10" },
              ].map((h) => (
                <div key={h.key} className="habit-item">
                  <div className="habit-label-row">
                    <span className="habit-name">{h.label}</span>
                    <span className="habit-val">{habits[h.key]}{h.unit}</span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    min={0}
                    max={h.max}
                    step={h.key === "exercise" ? 5 : h.key === "skill" ? 1 : 0.5}
                    value={habits[h.key]}
                    onChange={(e) => setHabits((prev) => ({ ...prev, [h.key]: parseFloat(e.target.value) }))}
                  />
                </div>
              ))}
            </div>
            <div className="submit-row" style={{ marginTop: 16 }}>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                <span>{loading ? "ANALYZING..." : "⚡ ANALYZE TODAY"}</span>
              </button>
            </div>
          </div>

          {/* STAT ENGINE */}
          <div className="panel">
            <div className="panel-label">RPG STAT ENGINE</div>
            {stats ? (
              <>
                <div className="stat-row stat-STR">
                  <div className="stat-header">
                    <span className="stat-name" style={{ color: "var(--red)" }}>⚔ STRENGTH</span>
                    <span className="stat-value" style={{ color: "var(--red)" }}>{stats.str}</span>
                  </div>
                  <div className="stat-track"><div className="stat-fill" style={{ width: \`\${stats.str}%\` }} /></div>
                </div>
                <div className="stat-row stat-VIT">
                  <div className="stat-header">
                    <span className="stat-name" style={{ color: "var(--green)" }}>🛡 VITALITY</span>
                    <span className="stat-value" style={{ color: "var(--green)" }}>{stats.vit}</span>
                  </div>
                  <div className="stat-track"><div className="stat-fill" style={{ width: \`\${stats.vit}%\` }} /></div>
                </div>
                <div className="stat-row stat-INT">
                  <div className="stat-header">
                    <span className="stat-name" style={{ color: "var(--cyan)" }}>🧠 INTELLIGENCE</span>
                    <span className="stat-value" style={{ color: "var(--cyan)" }}>{stats.intel}</span>
                  </div>
                  <div className="stat-track"><div className="stat-fill" style={{ width: \`\${stats.intel}%\` }} /></div>
                </div>
                <div className="overall-score">
                  <div className="score-num">{stats.overall}</div>
                  <div className="score-label">OVERALL · RANK {rank}</div>
                </div>
              </>
            ) : (
              <div style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center", paddingTop: 40 }}>
                Log your habits to<br />unlock your stats
              </div>
            )}
          </div>

          {/* SHADOW ADVISOR */}
          <div className="panel">
            <div className="panel-label">SHADOW ADVISOR</div>
            <div style={{ marginBottom: 10 }}>
              <span className="persona-chip">
                ◈ {personaLabels[persona?.user_type] || "HUNTER"}
              </span>
            </div>
            {loading ? (
              <div className="pred-loading">
                <span>SCANNING TRAJECTORY</span>
                <span className="dot-blink">▮</span>
                <span className="dot-blink">▮</span>
                <span className="dot-blink">▮</span>
              </div>
            ) : advisor ? (
              <>
                <div className="advisor-msg">{advisor}</div>
                <div>
                  {advisorTags.map((t) => (
                    <span key={t} className={\`advisor-tag \${tagType(t)}\`}>{t}</span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                The Shadow Advisor awakens<br />after you log habits.
              </div>
            )}

            {/* STREAK */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <span className="streak-fire">🔥</span>
              <div>
                <div className="streak-num">{streak}</div>
                <div className="streak-label">DAY STREAK</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: FUTURE PREDICTION + QUEST ── */}
        <div className="dash-grid-2">
          {/* PREDICTION */}
          <div className="panel">
            <div className="panel-label">FUTURE PREDICTION ENGINE</div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["1 MONTH", "6 MONTHS", "1 YEAR", "5 YEARS"].map((t) => (
                  <div key={t} className="pred-item">
                    <div className="pred-time">{t}</div>
                    <div className="pred-loading">
                      <span className="dot-blink">▮</span>
                      <span className="dot-blink">▮</span>
                      <span className="dot-blink">▮</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : predictions.length > 0 ? (
              <div className="pred-timeline">
                {predictions.map((p) => (
                  <div key={p.time} className="pred-item">
                    <div className="pred-time">{p.time}</div>
                    <div className="pred-text">{p.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center", paddingTop: 30 }}>
                Log your habits to<br />see your future trajectory
              </div>
            )}
          </div>

          {/* QUEST */}
          <div className="panel">
            <div className="panel-label">ACTIVE QUEST</div>
            {quest && (
              <div className="quest-card">
                <div className="quest-title">{quest.title}</div>
                <div className={\`quest-diff \${quest.diff}\`}>
                  [{quest.diff.toUpperCase()}] · {quest.xp} XP REWARD
                </div>
                <div className="quest-desc">{quest.desc}</div>
                <div className="quest-reward">⚡ REWARD: +{quest.xp} XP · +1 STAT BOOST</div>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-gold" onClick={completeQuest}>
                <span>✓ COMPLETE QUEST</span>
              </button>
              <button
                className="btn-primary"
                onClick={() => setQuest(pickQuest(persona?.user_type || "college"))}
              >
                <span>↻ NEW QUEST</span>
              </button>
            </div>
          </div>
        </div>

        <div className="footer">
          SHADOW SLAYER · FUTURE YOU SIMULATOR · v2.1 · SYSTEM ONLINE
        </div>
      </div>
    </div>
  );
}
