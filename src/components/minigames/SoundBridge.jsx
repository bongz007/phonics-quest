// ═══════════════════════════════════════════════════════════
// SOUND BRIDGE — Segmenting Mini-Game
// Child hears a word then taps it apart into phoneme segments.
// Each tap "breaks" off a phoneme, placing a bridge stone.
// Maps to: Phoneme Segmentation (Science of Reading)
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getPhonemeInfo } from '../../engine/phonicsEngine.js';
import CompanionCharacter from '../CompanionCharacter.jsx';

const WORLD_THEMES = {
  ocean: { bg: 'linear-gradient(180deg, #0A2B4E 0%, #0077B6 60%, #48CAE4 100%)', bridgeColor: '#FFD166', waterColor: '#00B4D8', islandLeft: '🏝️', islandRight: '🐚' },
  frost:  { bg: 'linear-gradient(180deg, #1a1a3e 0%, #4a0e8f 60%, #74B9FF 100%)', bridgeColor: '#E8F4F8', waterColor: '#A29BFE', islandLeft: '🏔️', islandRight: '🌨️' },
  hero:   { bg: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',  bridgeColor: '#FDCB6E', waterColor: '#E17055', islandLeft: '🏙️', islandRight: '⚡' },
};

const COMPANION_MSGS = [
  "Tap the word — break it into sounds to build the bridge!",
  "Each tap places a bridge stone. How many sounds can you hear?",
  "Listen first, then tap! One tap for each sound you hear.",
];

export default function SoundBridge({ words, world = 'ocean', onComplete }) {
  const [wordIndex, setWordIndex]   = useState(0);
  const [phase, setPhase]           = useState('listen'); // listen | tapping | success | done
  const [tapCount, setTapCount]     = useState(0);
  const [stones, setStones]         = useState([]);       // placed bridge stones
  const [companion, setCompanion]   = useState({ msg: '', emotion: 'idle' });
  const [wordResults, setWordResults] = useState([]);
  const [glowWord, setGlowWord]     = useState(false);
  const [charPosition, setCharPos]  = useState(0);        // 0–100 % across bridge

  const { speakWord, speakPhoneme, speakSegmented, speakInstruction } = useSpeech();
  const theme = WORLD_THEMES[world] || WORLD_THEMES.ocean;
  const currentWord = words[wordIndex];

  // ── Setup new word ──────────────────────────────────────────
  useEffect(() => {
    if (!currentWord) return;
    setPhase('listen');
    setTapCount(0);
    setStones([]);
    setGlowWord(false);
    setCharPos(0);

    const msg = COMPANION_MSGS[wordIndex % COMPANION_MSGS.length];
    setCompanion({ msg, emotion: 'speaking' });

    const t = setTimeout(async () => {
      await speakWord(currentWord.word);
      setCompanion({ msg: `Now tap it apart: ${currentWord.word}`, emotion: 'encouraging' });
      setGlowWord(true);
      setPhase('tapping');
    }, 800);

    return () => clearTimeout(t);
  }, [wordIndex, currentWord]);

  // ── Tap handler ─────────────────────────────────────────────
  const handleWordTap = useCallback(async () => {
    if (phase !== 'tapping') return;

    const phonemes = currentWord.phonemes;
    const nextIdx  = tapCount;
    if (nextIdx >= phonemes.length) return;

    const phoneme = phonemes[nextIdx];
    speakPhoneme(phoneme);

    // Add a bridge stone
    const newStone = {
      id:      Date.now(),
      phoneme,
      label:   getPhonemeInfo(phoneme).label,
      emoji:   getPhonemeInfo(phoneme).emoji,
      index:   nextIdx,
    };

    setStones(prev => [...prev, newStone]);
    setTapCount(nextIdx + 1);

    // Move character along bridge
    const progress = ((nextIdx + 1) / phonemes.length) * 85;
    setCharPos(progress);

    // All phonemes tapped?
    if (nextIdx + 1 === phonemes.length) {
      setTimeout(() => completeWord(), 500);
    }
  }, [phase, tapCount, currentWord, speakPhoneme]);

  const completeWord = async () => {
    setPhase('success');
    setCharPos(100);

    // Replay segmented then blended
    await speakSegmented(currentWord.phonemes);
    setTimeout(async () => {
      await speakWord(currentWord.word);
    }, 600);

    setCompanion({
      msg: `🌉 Bridge complete! ${currentWord.word.toUpperCase()}!`,
      emotion: 'celebrating',
    });

    const results = currentWord.phonemes.map(ph => ({ phoneme: ph, correct: true }));
    setWordResults(prev => [...prev, ...results]);

    setTimeout(() => {
      if (wordIndex + 1 < words.length) {
        setWordIndex(i => i + 1);
      } else {
        onComplete([...wordResults, ...results]);
      }
    }, 2800);
  };

  const handleReplayWord = () => {
    speakWord(currentWord.word);
  };

  // ── Render ──────────────────────────────────────────────────
  if (!currentWord) return null;
  const totalPhonemes = currentWord.phonemes.length;

  return (
    <div className="minigame sound-bridge" style={{ background: theme.bg }}>
      {/* Progress dots */}
      <div className="game-progress">
        {words.map((_, i) => (
          <div key={i} className={`prog-dot ${i < wordIndex ? 'done' : i === wordIndex ? 'active' : ''}`} />
        ))}
      </div>

      {/* Header: word to segment */}
      <div className="bridge-header">
        <button className="replay-btn" onPointerDown={handleReplayWord} title="Hear the word again">
          🔊 Hear it again
        </button>

        <div
          className={`bridge-word-card ${glowWord ? 'word-glow' : ''} ${phase === 'tapping' ? 'word-tappable' : ''}`}
          onPointerDown={handleWordTap}
          style={{ '--bridge-color': theme.bridgeColor }}
        >
          <div className="bwc-image">{currentWord.image}</div>
          <div className="bwc-word">{currentWord.word}</div>
          {phase === 'tapping' && <div className="bwc-hint">Tap me!</div>}
        </div>

        <div className="tap-counter">
          {tapCount}/{totalPhonemes} sounds
        </div>
      </div>

      {/* Bridge scene */}
      <div className="bridge-scene">
        {/* Left island */}
        <div className="island island-left">
          <span className="island-emoji">{theme.islandLeft}</span>
          {/* Character starts here */}
          {charPosition === 0 && <span className="bridge-character">🧒</span>}
        </div>

        {/* Bridge + water */}
        <div className="bridge-area">
          {/* Water */}
          <div className="water" style={{ background: theme.waterColor }}>
            <span className="water-wave">〰️〰️〰️〰️〰️〰️〰️〰️</span>
          </div>

          {/* Bridge stones */}
          <div className="bridge-stones">
            {[...Array(totalPhonemes)].map((_, i) => {
              const stone = stones[i];
              return (
                <div
                  key={i}
                  className={`bridge-stone ${stone ? 'stone-placed' : 'stone-empty'}`}
                  style={{
                    '--stone-color': theme.bridgeColor,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {stone ? (
                    <>
                      <span className="stone-label">{stone.label}</span>
                      <span className="stone-emoji">{stone.emoji}</span>
                    </>
                  ) : (
                    <span className="stone-ghost">•</span>
                  )}
                </div>
              );
            })}

            {/* Moving character on bridge */}
            {charPosition > 0 && charPosition <= 95 && (
              <div
                className="bridge-char-moving"
                style={{ left: `${charPosition}%` }}
              >
                🧒
              </div>
            )}
          </div>
        </div>

        {/* Right island */}
        <div className="island island-right">
          <span className="island-emoji">{theme.islandRight}</span>
          {charPosition >= 100 && (
            <div className="arrival-celebrate">
              <span className="bridge-character">🧒</span>
              <span className="celebration">🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* Phoneme breakdown display */}
      <div className="phoneme-chips">
        {currentWord.phonemes.map((ph, i) => (
          <div
            key={i}
            className={`phoneme-chip ${i < tapCount ? 'chip-active' : 'chip-inactive'}`}
            style={{ '--chip-color': theme.bridgeColor }}
          >
            {getPhonemeInfo(ph).label}
          </div>
        ))}
        <span className="chip-arrow">→ {currentWord.word}</span>
      </div>

      <CompanionCharacter
        message={companion.msg}
        emotion={companion.emotion}
        world={world}
      />
    </div>
  );
}
