// Adaptive Learning Engine
// Tracks accuracy, detects error patterns, adjusts difficulty in real time

import { getLevelById, getNextLevel, PHONICS_LEVELS } from './phonicsEngine.js';

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const MASTERY_THRESHOLD   = 0.80; // 80% accuracy = mastered
const STRUGGLE_THRESHOLD  = 0.50; // below 50% = needs re-teaching
const LEVEL_UP_MIN_GAMES  = 3;    // must play at least 3 games to level up
const HINT_TRIGGER_COUNT  = 2;    // 2 consecutive errors → show hint

// ─────────────────────────────────────────────────────────
// Update skill data after a single question attempt
// ─────────────────────────────────────────────────────────
export function recordAttempt(progress, phoneme, isCorrect) {
  const prev = progress.skills[phoneme] || { attempts: 0, correct: 0, streak: 0, errors: 0, mastery: 0 };

  const attempts = prev.attempts + 1;
  const correct  = prev.correct + (isCorrect ? 1 : 0);
  const streak   = isCorrect ? prev.streak + 1 : 0;
  const errors   = isCorrect ? 0 : prev.errors + 1;
  const mastery  = correct / attempts;

  return {
    ...progress,
    skills: {
      ...progress.skills,
      [phoneme]: { attempts, correct, streak, errors, mastery },
    },
  };
}

// ─────────────────────────────────────────────────────────
// Record a full game session result
// ─────────────────────────────────────────────────────────
export function recordSession(progress, levelId, gameType, results) {
  // results: [{ phoneme, correct, word }]
  let updated = { ...progress };

  for (const r of results) {
    updated = recordAttempt(updated, r.phoneme, r.correct);
  }

  const accuracy = results.filter(r => r.correct).length / Math.max(results.length, 1);

  const session = {
    date:     Date.now(),
    levelId,
    gameType,
    accuracy: Math.round(accuracy * 100),
    count:    results.length,
  };

  return {
    ...updated,
    sessions: [...(updated.sessions || []).slice(-50), session], // keep last 50
    gamesPlayed: (updated.gamesPlayed || 0) + 1,
  };
}

// ─────────────────────────────────────────────────────────
// Determine if the child is ready to advance to next level
// ─────────────────────────────────────────────────────────
export function shouldLevelUp(progress, levelId) {
  const level = getLevelById(levelId);
  if (!level) return false;

  const gamesAtLevel = (progress.sessions || []).filter(s => s.levelId === levelId).length;
  if (gamesAtLevel < LEVEL_UP_MIN_GAMES) return false;

  const allMastered = level.skills.every(skill => {
    const s = progress.skills[skill];
    return s && s.mastery >= MASTERY_THRESHOLD;
  });

  return allMastered;
}

// ─────────────────────────────────────────────────────────
// Select best word targets for the next game
// Prioritises weak/unmastered skills; avoids dead repetition
// ─────────────────────────────────────────────────────────
export function selectNextWords(progress, levelId, count = 4) {
  const level = getLevelById(levelId);
  if (!level) return [];

  const skillScore = (skill) => {
    const s = progress.skills[skill];
    if (!s) return 0; // never seen = highest priority
    return s.mastery;
  };

  // Sort words so that words containing weak skills come first
  const scored = level.words.map(w => {
    const weakestPhoneme = Math.min(...w.phonemes.map(skillScore));
    const noise = Math.random() * 0.1; // tiny randomness prevents identical repetition
    return { ...w, score: weakestPhoneme + noise };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, count);
}

// ─────────────────────────────────────────────────────────
// Error pattern analysis — returned for parent dashboard
// ─────────────────────────────────────────────────────────
export function analyseErrorPatterns(progress) {
  const patterns = [];
  const skills = progress.skills || {};

  const shortVowels = ['a','e','i','o','u'];
  const confusedVowels = shortVowels.filter(v => skills[v] && skills[v].mastery < 0.6);
  if (confusedVowels.length > 1) {
    patterns.push({
      type: 'vowel-confusion',
      label: 'Vowel Confusion',
      detail: `Mixing up: ${confusedVowels.map(v => `/${v}/`).join(', ')}`,
      suggestion: `Say two vowel words side by side: "ship" vs "shop". Ask: which letter makes the middle sound?`,
    });
  }

  const reversalCandidates = [['b','d'],['p','q'],['m','w']];
  for (const [a, b] of reversalCandidates) {
    const aData = skills[a];
    const bData = skills[b];
    if (aData && bData && aData.mastery < 0.65 && bData.mastery < 0.65) {
      patterns.push({
        type: 'letter-reversal',
        label: 'Letter Reversal',
        detail: `Confusing "${a}" and "${b}"`,
        suggestion: `Trace the letter "${a}" with your finger in a sandbox or on their back. Say: "${a}" starts with a stick then a ball.`,
      });
    }
  }

  const blends = Object.entries(skills).filter(([k, v]) => k.length === 2 && v.mastery < 0.6);
  if (blends.length >= 2) {
    patterns.push({
      type: 'blend-difficulty',
      label: 'Blending Challenge',
      detail: `Struggling with consonant blends`,
      suggestion: `Clap each sound separately: /s/ ... /t/ ... /o/ ... /p/. Then clap faster until it sounds like one word.`,
    });
  }

  return patterns;
}

// ─────────────────────────────────────────────────────────
// Daily physical play suggestions based on weak skills
// ─────────────────────────────────────────────────────────
export function generateDailySuggestions(progress, levelId) {
  const level = getLevelById(levelId);
  if (!level) return [];

  const weak = level.skills
    .filter(s => {
      const d = progress.skills[s];
      return !d || d.mastery < MASTERY_THRESHOLD;
    })
    .slice(0, 2);

  const suggestions = [];

  if (weak.length === 0) {
    suggestions.push({
      emoji: '🎉',
      text: 'Amazing! All sounds mastered at this level.',
      activity: 'Try making up a silly story using as many /sh/ words as you can!',
    });
    return suggestions;
  }

  const activities = {
    s: { emoji: '🐍', activity: 'Find 3 things in the house that start with the /sss/ sound!' },
    a: { emoji: '🍎', activity: 'Clap every time you hear the short /a/ sound in: cat, hat, bat, mat.' },
    t: { emoji: '🥁', activity: 'Tap the table: T-T-T. Say a word that starts with that tapping sound!' },
    p: { emoji: '💨', activity: 'Feel your breath on your hand: /p/ is a puff! Try: pat, pet, pot, put.' },
    i: { emoji: '🦋', activity: 'Hunt for /i/ words: "In the bin, the pin has a thin tip." Which words have /i/?' },
    n: { emoji: '🐝', activity: 'Hum: mmmmm… then change to nnnnnn. Feel your tongue move up!' },
    m: { emoji: '🎶', activity: 'Sing: "Mmm-mmm, what word starts with M?" and take turns naming things.' },
    d: { emoji: '🥁', activity: 'Drum game! Every word that starts with /d/ gets one drum tap on your knee.' },
    g: { emoji: '🐸', activity: 'Play frog jumps: jump once for each /g/ word you can think of!' },
    o: { emoji: '🐙', activity: 'Octopus stretch: every time you say a short /o/ word, reach out 8 fingers!' },
    e: { emoji: '🥚', activity: 'Egg hunt! Hide letters around the room — find only the E eggs!' },
    u: { emoji: '☂️', activity: 'Umbrella game: every /u/ word "opens" the umbrella. How many can you find?' },
    sh: { emoji: '🤫', activity: '"Shh" library game: whisper only words that start with /sh/!' },
    ch: { emoji: '🚂', activity: 'Be a train: ch-ch-ch-ch! Say a /ch/ word each time the train stops.' },
    th: { emoji: '👅', activity: 'Stick your tongue out for /th/! Touch your teeth gently. Feel it?' },
    wh: { emoji: '💨', activity: 'Blow a feather: /wh/ is a breeze! Name /wh/ words as the feather floats.' },
  };

  for (const skill of weak) {
    const act = activities[skill];
    if (act) {
      suggestions.push({
        emoji: act.emoji,
        skill,
        text: `Practising the /${skill}/ sound`,
        activity: act.activity,
      });
    }
  }

  // Always add a general suggestion
  suggestions.push({
    emoji: '📖',
    text: 'Read together',
    activity: 'Point to each word as you read aloud. Let your child tap the page for each sound they hear!',
  });

  return suggestions;
}

// ─────────────────────────────────────────────────────────
// Should we show a hint after consecutive errors?
// ─────────────────────────────────────────────────────────
export function shouldShowHint(progress, phoneme) {
  const s = progress.skills[phoneme];
  return s && s.errors >= HINT_TRIGGER_COUNT;
}

// ─────────────────────────────────────────────────────────
// Skill mastery summary for dashboard
// ─────────────────────────────────────────────────────────
export function getSkillSummary(progress) {
  const summary = [];

  for (const level of PHONICS_LEVELS) {
    const levelSkills = level.skills.map(skill => {
      const data = progress.skills[skill] || { attempts: 0, correct: 0, mastery: 0 };
      return {
        skill,
        ...data,
        status: data.mastery >= MASTERY_THRESHOLD
          ? 'mastered'
          : data.attempts > 0
            ? 'learning'
            : 'not-started',
      };
    });

    const masteredCount = levelSkills.filter(s => s.status === 'mastered').length;

    summary.push({
      levelId: level.id,
      levelName: level.name,
      magicName: level.magicName,
      skills: levelSkills,
      masteredCount,
      totalCount: levelSkills.length,
      complete: masteredCount === levelSkills.length,
    });
  }

  return summary;
}
