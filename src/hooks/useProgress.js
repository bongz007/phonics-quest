import { useState, useCallback, useEffect } from 'react';
import {
  loadProgress,
  saveProgress,
  createInitialProgress,
  unlockCreature,
} from '../engine/progressTracker.js';
import {
  recordSession,
  shouldLevelUp,
  selectNextWords,
} from '../engine/adaptiveEngine.js';
import { getLevelById, getNextLevel } from '../engine/phonicsEngine.js';

export function useProgress() {
  const [progress, setProgress] = useState(null);

  // Load on mount
  useEffect(() => {
    const saved = loadProgress();
    setProgress(saved || createInitialProgress());
  }, []);

  // Persist on every change
  useEffect(() => {
    if (progress) saveProgress(progress);
  }, [progress]);

  // ── initialise a new child profile ──────────────────────────
  const initChild = useCallback((name, world) => {
    const fresh = createInitialProgress(name);
    const withWorld = { ...fresh, selectedWorld: world };
    setProgress(withWorld);
    return withWorld;
  }, []);

  // ── record game results and maybe level-up ──────────────────
  const submitGameResults = useCallback((levelId, gameType, results) => {
    setProgress(prev => {
      let updated = recordSession(prev, levelId, gameType, results);

      // Unlock creature if game was successful (>50% correct)
      const accuracy = results.filter(r => r.correct).length / Math.max(results.length, 1);
      if (accuracy > 0.5) {
        const level = getLevelById(levelId);
        const world  = prev.selectedWorld || 'ocean';
        const unlock = level?.unlocks?.[world];
        if (unlock) {
          updated = unlockCreature(updated, unlock.name);
        }
      }

      // Level up check
      if (shouldLevelUp(updated, levelId)) {
        const next = getNextLevel(levelId);
        if (next) {
          updated = { ...updated, currentLevelId: next.id };
        }
      }

      return updated;
    });
  }, []);

  // ── get next words adapted to child ─────────────────────────
  const getAdaptedWords = useCallback((levelId, count = 4) => {
    if (!progress) return [];
    return selectNextWords(progress, levelId, count);
  }, [progress]);

  // ── update world selection ───────────────────────────────────
  const setWorld = useCallback((world) => {
    setProgress(prev => ({ ...prev, selectedWorld: world }));
  }, []);

  return {
    progress,
    initChild,
    submitGameResults,
    getAdaptedWords,
    setWorld,
    isLoaded: progress !== null,
  };
}
