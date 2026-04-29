// Progress Tracker — localStorage-backed persistence
// Handles save / load / reset of child progress

const STORAGE_KEY = 'phonics-quest-progress';

export function createInitialProgress(childName = 'Explorer') {
  return {
    childName,
    currentLevelId: 'L1',
    selectedWorld: 'ocean',
    skills: {},          // { phoneme: { attempts, correct, mastery, streak, errors } }
    sessions: [],        // last 50 sessions
    gamesPlayed: 0,
    unlockedCreatures: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProgress(progress) {
  try {
    const updated = { ...progress, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not save progress:', e);
    return progress;
  }
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function unlockCreature(progress, creatureName) {
  if (progress.unlockedCreatures.includes(creatureName)) return progress;
  return {
    ...progress,
    unlockedCreatures: [...progress.unlockedCreatures, creatureName],
  };
}

export function setChildName(progress, name) {
  return saveProgress({ ...progress, childName: name });
}

export function getRecentAccuracy(progress, count = 5) {
  const recent = (progress.sessions || []).slice(-count);
  if (recent.length === 0) return 0;
  const avg = recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length;
  return Math.round(avg);
}

export function getTotalWordsRead(progress) {
  return (progress.sessions || []).reduce((sum, s) => sum + (s.count || 0), 0);
}

export function getStreakDays(progress) {
  const sessions = progress.sessions || [];
  if (sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))];
  dates.sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
