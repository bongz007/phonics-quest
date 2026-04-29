// ═══════════════════════════════════════════════════════════
// CREATURE CALLING — Phoneme Recognition Mini-Game
// A phoneme sound plays. Child taps the matching letter.
// A hidden creature appears when the right letter is found.
// Maps to: Phoneme-Grapheme Correspondence (Science of Reading)
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getPhonemeInfo } from '../../engine/phonicsEngine.js';
import CompanionCharacter from '../CompanionCharacter.jsx';

const WORLD_THEMES = {
  ocean: { bg: 'linear-gradient(160deg, #0A2B4E 0%, #023E8A 40%, #0096C7 100%)', hideEmoji: '🌿', revealBg: 'radial-gradient(circle, #FFD166 0%, transparent 70%)', accent: '#FFD166' },
  frost:  { bg: 'linear-gradient(160deg, #1a1a3e 0%, #4a0e8f 50%, #a8d8ea 100%)', hideEmoji: '❄️', revealBg: 'radial-gradient(circle, #A29BFE 0%, transparent 70%)', accent: '#E8F4F8' },
  hero:   { bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #e85d04 100%)',  hideEmoji: '🌑', revealBg: 'radial-gradient(circle, #FDCB6E 0%, transparent 70%)', accent: '#FDCB6E' },
};

// Build a distractor set. Distractors are visually different from the target
// (different first character) so young children are not tripped up by near-identical shapes.
// We also keep count at 2 for early levels so there's a clear, confident choice.
function buildChoices(target, allSkills, count = 2) {
  const targetFirst = target[0];

  // Prefer distractors that start with a different letter — reduces visual confusion
  const different = allSkills.filter(s => s !== target && s[0] !== targetFirst);
  const similar   = allSkills.filter(s => s !== target && s[0] === targetFirst);

  const pool = [...different, ...similar];
  const others = pool.sort(() => Math.random() - 0.5).slice(0, count - 1);

  return [target, ...others].sort(() => Math.random() - 0.5);
}

const COMPANION_PROMPTS = [
  "Listen to the sound! Which letter makes it?",
  "Shh… hear that? Find the letter that makes that sound!",
  "A creature is hiding! Play its sound to call it out!",
  "Which letter is calling from the kelp forest?",
];

export default function CreatureCalling({ words, world = 'ocean', onComplete }) {
  const [roundIndex, setRoundIndex]   = useState(0);
  const [choices, setChoices]         = useState([]);
  const [revealedCreature, setReveal] = useState(false);
  const [selectedChoice, setSelected] = useState(null);
  const [wrongChoices, setWrong]      = useState([]);
  const [companion, setCompanion]     = useState({ msg: '', emotion: 'idle' });
  const [phase, setPhase]             = useState('waiting'); // waiting | choosing | correct | wrong
  const [results, setResults]         = useState([]);
  const [shake, setShake]             = useState(null);
  const [allSkills, setAllSkills]     = useState([]);

  const { speakPhoneme, speakWord } = useSpeech();
  const theme = WORLD_THEMES[world] || WORLD_THEMES.ocean;
  const current = words[roundIndex];

  // Gather all unique phonemes in this word set for distractors
  useEffect(() => {
    const phonemes = [...new Set(words.flatMap(w => w.phonemes))];
    setAllSkills(phonemes.length >= 4 ? phonemes : [...phonemes, 's','a','t','p','i','n'].slice(0,8));
  }, [words]);

  // ── Setup round ─────────────────────────────────────────────
  useEffect(() => {
    if (!current || allSkills.length === 0) return;

    // Pick one phoneme from this word as the target
    const phonemes = current.phonemes;
    const target   = phonemes[Math.floor(Math.random() * phonemes.length)];
    const built    = buildChoices(target, allSkills, 4);

    setChoices(built.map(ph => ({
      id: ph,
      phoneme: ph,
      label: getPhonemeInfo(ph).label,
      emoji: getPhonemeInfo(ph).emoji,
      isTarget: ph === target,
    })));

    setReveal(false);
    setSelected(null);
    setWrong([]);
    setPhase('waiting');

    const msg = COMPANION_PROMPTS[roundIndex % COMPANION_PROMPTS.length];
    setCompanion({ msg, emotion: 'speaking' });

    // Auto-play the phoneme after a short pause
    const t = setTimeout(() => {
      speakPhoneme(target);
      setPhase('choosing');
    }, 1200);

    return () => clearTimeout(t);
  }, [roundIndex, current, allSkills]);

  // ── Touch = instant sound, release = submit answer ───────────
  const handleChoiceDown = useCallback((choice) => {
    if (phase !== 'choosing') return;
    // Play the letter's sound the moment the finger lands — no quiz pressure
    speakPhoneme(choice.phoneme);
  }, [phase, speakPhoneme]);

  const handleChoiceTap = useCallback((choice) => {
    if (phase !== 'choosing' || selectedChoice) return;

    setSelected(choice.id);

    if (choice.isTarget) {
      // ✅ Correct!
      setPhase('correct');
      setReveal(true);
      speakWord(current.word);

      setCompanion({
        msg: `🎉 Yes! That's the /${choice.phoneme}/ sound in "${current.word}"!`,
        emotion: 'celebrating',
      });

      const newResult = { phoneme: choice.phoneme, correct: true, word: current.word };
      const updated   = [...results, newResult];
      setResults(updated);

      setTimeout(() => {
        if (roundIndex + 1 < words.length) {
          setRoundIndex(i => i + 1);
        } else {
          onComplete(updated);
        }
      }, 2500);
    } else {
      // ❌ Wrong — shake and mark as wrong, allow retry
      setPhase('choosing');
      setSelected(null);
      setWrong(prev => [...prev, choice.id]);
      setShake(choice.id);

      setCompanion({ msg: 'Not quite — listen again and try another!', emotion: 'encouraging' });
      speakPhoneme(choices.find(c => c.isTarget)?.phoneme);

      // Record error
      setResults(prev => [...prev, { phoneme: choice.phoneme, correct: false, word: current.word }]);

      setTimeout(() => setShake(null), 600);
    }
  }, [phase, selectedChoice, choices, current, results, roundIndex, words, speakWord, speakPhoneme, onComplete]);

  const handleReplay = useCallback(() => {
    const target = choices.find(c => c.isTarget);
    if (target) speakPhoneme(target.phoneme);
  }, [choices, speakPhoneme]);

  if (!current || choices.length === 0) return null;

  return (
    <div className="minigame creature-calling" style={{ background: theme.bg }}>
      {/* Progress */}
      <div className="game-progress">
        {words.map((_, i) => (
          <div key={i} className={`prog-dot ${i < roundIndex ? 'done' : i === roundIndex ? 'active' : ''}`} />
        ))}
      </div>

      {/* Top: creature hiding area */}
      <div className="creature-stage">
        <div
          className={`creature-bush ${revealedCreature ? 'bush-revealed' : ''}`}
          style={{ '--reveal-bg': theme.revealBg }}
        >
          {!revealedCreature ? (
            <div className="bush-hide">
              <span className="bush-emoji">{theme.hideEmoji}</span>
              <span className="bush-emoji" style={{ animationDelay: '0.3s' }}>{theme.hideEmoji}</span>
              <span className="bush-emoji" style={{ animationDelay: '0.6s' }}>{theme.hideEmoji}</span>
              <div className="hidden-creature">?</div>
            </div>
          ) : (
            <div className="creature-revealed">
              <div className="creature-pop">{current.image}</div>
              <div className="creature-name">{current.creature}</div>
              <div className="creature-word">
                {current.word.split('').map((ch, i) => (
                  <span key={i} className="reveal-letter" style={{ animationDelay: `${i * 0.1}s` }}>
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sound replay */}
      <div className="sound-panel">
        <div className="sound-label">What sound do you hear?</div>
        <button className="sound-btn" onPointerDown={handleReplay} style={{ '--accent': theme.accent }}>
          <span className="sound-icon">🔊</span>
          <span className="sound-text">Play the sound</span>
        </button>
      </div>

      {/* Letter choices */}
      <div className="choice-grid">
        {choices.map((choice) => {
          const isWrong    = wrongChoices.includes(choice.id);
          const isShaking  = shake === choice.id;
          const isCorrect  = revealedCreature && choice.isTarget;

          return (
            <button
              key={choice.id}
              className={`
                letter-choice
                ${isWrong    ? 'choice-wrong'    : ''}
                ${isShaking  ? 'choice-shake'    : ''}
                ${isCorrect  ? 'choice-correct'  : ''}
                ${isWrong    ? 'choice-disabled' : ''}
              `}
              disabled={isWrong || phase === 'correct'}
              onPointerDown={() => handleChoiceDown(choice)}
              onPointerUp={() => handleChoiceTap(choice)}
              style={{ '--accent': theme.accent }}
            >
              <span className="choice-label">{choice.label}</span>
              <span className="choice-emoji">{choice.emoji}</span>
            </button>
          );
        })}
      </div>

      <CompanionCharacter
        message={companion.msg}
        emotion={companion.emotion}
        world={world}
      />
    </div>
  );
}
