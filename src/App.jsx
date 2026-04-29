import { useState, useCallback } from 'react';
import { useProgress } from './hooks/useProgress.js';
import { getLevelById, getWordsForLevel } from './engine/phonicsEngine.js';

import WorldSelect    from './components/WorldSelect.jsx';
import StoryPrompt    from './components/StoryPrompt.jsx';
import RewardScreen   from './components/RewardScreen.jsx';
import WorldMap       from './components/WorldMap.jsx';
import SpellCasting   from './components/minigames/SpellCasting.jsx';
import SoundBridge    from './components/minigames/SoundBridge.jsx';
import CreatureCalling from './components/minigames/CreatureCalling.jsx';
import ParentDashboard from './components/dashboard/ParentDashboard.jsx';

// Which mini-game to play per session (rotates)
const GAME_ROTATION = ['spell-casting', 'sound-bridge', 'creature-calling'];

export default function App() {
  const { progress, initChild, submitGameResults, getAdaptedWords, setWorld, isLoaded } = useProgress();
  const [screen, setScreen] = useState('world-select');  // world-select | story | game | reward | map | parent
  const [gameIndex, setGameIndex] = useState(0);
  const [pendingResults, setPendingResults] = useState(null);
  const [transition, setTransition] = useState(false);

  const go = useCallback((nextScreen, delay = 0) => {
    setTransition(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setTransition(false);
    }, delay + 300);
  }, []);

  // ── World selected ───────────────────────────────────────────
  const handleWorldSelect = useCallback((worldId) => {
    if (!progress?.childName) {
      initChild('Explorer', worldId);
    } else {
      setWorld(worldId);
    }
    go('story');
  }, [progress, initChild, setWorld, go]);

  // ── Story prompt done ────────────────────────────────────────
  const handleStoryDone = useCallback(() => {
    go('game');
  }, [go]);

  // ── Game completed ───────────────────────────────────────────
  const handleGameComplete = useCallback((results) => {
    const levelId = progress?.currentLevelId || 'L1';
    submitGameResults(levelId, currentGameType, results);
    setPendingResults(results);
    go('reward');
  }, [progress, submitGameResults, gameIndex]);

  // ── Reward screen done ───────────────────────────────────────
  const handleRewardDone = useCallback(() => {
    setGameIndex(prev => (prev + 1) % GAME_ROTATION.length);
    go('map');
  }, [go]);

  // ── Map: play again ──────────────────────────────────────────
  const handlePlayFromMap = useCallback((levelId) => {
    go('story');
  }, [go]);

  // Loading
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-anim">🌊</div>
        <div className="loading-text">Loading your adventure...</div>
      </div>
    );
  }

  const world        = progress?.selectedWorld || 'ocean';
  const levelId      = progress?.currentLevelId || 'L1';
  const level        = getLevelById(levelId);
  const currentGameType = GAME_ROTATION[gameIndex % GAME_ROTATION.length];
  const adaptedWords = getAdaptedWords(levelId, 4);
  const storyText    = level?.storyPrompt?.[world] || 'A new adventure begins...';
  const unlock       = level?.unlocks?.[world];

  const MINI_GAMES = {
    'spell-casting':   SpellCasting,
    'sound-bridge':    SoundBridge,
    'creature-calling':CreatureCalling,
  };
  const ActiveGame = MINI_GAMES[currentGameType] || SpellCasting;

  return (
    <div className={`app-root world-${world} ${transition ? 'app-fade-out' : 'app-fade-in'}`}>
      {screen === 'world-select' && (
        <WorldSelect onSelectWorld={handleWorldSelect} />
      )}

      {screen === 'story' && (
        <StoryPrompt
          story={storyText}
          world={world}
          onContinue={handleStoryDone}
        />
      )}

      {screen === 'game' && adaptedWords.length > 0 && (
        <ActiveGame
          words={adaptedWords}
          world={world}
          onComplete={handleGameComplete}
        />
      )}

      {screen === 'reward' && (
        <RewardScreen
          unlock={unlock}
          world={world}
          onContinue={handleRewardDone}
        />
      )}

      {screen === 'map' && (
        <WorldMap
          progress={progress}
          world={world}
          onSelectLevel={handlePlayFromMap}
          onOpenDashboard={() => go('parent')}
        />
      )}

      {screen === 'parent' && (
        <ParentDashboard
          progress={progress}
          onClose={() => go('map')}
        />
      )}
    </div>
  );
}
