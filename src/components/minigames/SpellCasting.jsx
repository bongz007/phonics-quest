// ═══════════════════════════════════════════════════════════
// SPELL CASTING — Blending Mini-Game
// Child drags letter-runes into a magic circle to form a word.
// Maps to: Phoneme Blending (Science of Reading)
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeech } from '../../hooks/useSpeech.js';
import { getPhonemeInfo } from '../../engine/phonicsEngine.js';
import CompanionCharacter from '../CompanionCharacter.jsx';

const INSTRUCTIONS = [
  "Drag the sound-runes into the magic circle to cast a spell!",
  "Place each glowing letter into the circle. Listen to the sounds!",
  "The magic circle hungers for sounds! Drag the letters in order!",
];

const WORLD_THEMES = {
  ocean: { bg: 'radial-gradient(ellipse at 50% 120%, #0096C7 0%, #0A2B4E 70%)', circleColor: '#00B4D8', runeColor: '#FFD166', particleEmoji: '🫧' },
  frost:  { bg: 'radial-gradient(ellipse at 50% 120%, #74B9FF 0%, #1a1a3e 70%)', circleColor: '#A29BFE', runeColor: '#E8F4F8', particleEmoji: '❄️' },
  hero:   { bg: 'radial-gradient(ellipse at 50% 120%, #e85d04 0%, #1a1a2e 70%)', circleColor: '#FDCB6E', runeColor: '#FF6B9D', particleEmoji: '⚡' },
};

export default function SpellCasting({ words, world = 'ocean', onComplete }) {
  const [wordIndex, setWordIndex]   = useState(0);
  const [slots, setSlots]           = useState([]);   // [{id, letter, filled, correctLetter}]
  const [runes, setRunes]           = useState([]);   // [{id, phoneme, label, placed}]
  const [dragging, setDragging]     = useState(null); // {runeId}
  const [dragPos, setDragPos]       = useState({ x: 0, y: 0 });
  const [successFlash, setSuccessFlash] = useState(false);
  const [wordResults, setWordResults]   = useState([]);
  const [companion, setCompanion]       = useState({ msg: '', emotion: 'idle' });
  const [phase, setPhase]               = useState('intro'); // intro | playing | wordSuccess | done
  const [particles, setParticles]       = useState([]);

  const slotRefs  = useRef([]);
  const gameRef   = useRef(null);
  const { speakPhoneme, speakWord, speakBlend, speakInstruction } = useSpeech();
  const theme = WORLD_THEMES[world] || WORLD_THEMES.ocean;
  const currentWord = words[wordIndex];

  // ── Initialise word ─────────────────────────────────────────
  useEffect(() => {
    if (!currentWord) return;
    setPhase('intro');
    setSuccessFlash(false);

    const phonemes = currentWord.phonemes;

    // Create slots (in order)
    setSlots(phonemes.map((ph, i) => ({
      id: `slot-${i}`,
      index: i,
      correctPhoneme: ph,
      filled: false,
      placedPhoneme: null,
    })));

    // Create runes (shuffled)
    const runeList = phonemes.map((ph, i) => ({
      id: `rune-${i}`,
      phoneme: ph,
      label: getPhonemeInfo(ph).label,
      emoji: getPhonemeInfo(ph).emoji,
      placed: false,
    })).sort(() => Math.random() - 0.5);
    setRunes(runeList);

    // Short intro
    const intro = INSTRUCTIONS[wordIndex % INSTRUCTIONS.length];
    setCompanion({ msg: intro, emotion: 'speaking' });
    const t = setTimeout(() => {
      speakInstruction(intro);
      setPhase('playing');
    }, 500);
    return () => clearTimeout(t);
  }, [wordIndex, currentWord]);

  // ── Pointer events ──────────────────────────────────────────
  const handleRuneDown = useCallback((e, runeId) => {
    e.preventDefault();
    const rune = runes.find(r => r.id === runeId);
    if (!rune || rune.placed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDragging({ runeId, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    setDragPos({ x: e.clientX, y: e.clientY });
    speakPhoneme(rune.phoneme);
  }, [runes, speakPhoneme]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [dragging]);

  const handlePointerUp = useCallback((e) => {
    if (!dragging) return;

    const rune = runes.find(r => r.id === dragging.runeId);
    if (!rune) { setDragging(null); return; }

    // Find which slot the pointer is over
    let targetSlot = null;
    for (let i = 0; i < slotRefs.current.length; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 30 &&
        e.clientX <= rect.right + 30 &&
        e.clientY >= rect.top  - 30 &&
        e.clientY <= rect.bottom + 30
      ) {
        targetSlot = slots[i];
        break;
      }
    }

    if (targetSlot && !targetSlot.filled) {
      const correct = rune.phoneme === targetSlot.correctPhoneme;

      if (correct) {
        // Place rune in slot
        setSlots(prev => prev.map(s =>
          s.id === targetSlot.id ? { ...s, filled: true, placedPhoneme: rune.phoneme } : s
        ));
        setRunes(prev => prev.map(r =>
          r.id === rune.id ? { ...r, placed: true } : r
        ));
        speakPhoneme(rune.phoneme);
        spawnParticle(e.clientX, e.clientY);

        // Check word complete
        const newSlots = slots.map(s =>
          s.id === targetSlot.id ? { ...s, filled: true } : s
        );
        const allFilled = newSlots.every(s => s.filled);
        if (allFilled) {
          setTimeout(() => completeWord(true), 400);
        }
      } else {
        // Wrong slot — shake feedback
        setCompanion({ msg: 'Almost! Try that sound in a different spot.', emotion: 'encouraging' });
        speakInstruction('Try again!');
        triggerWrongFeedback(rune.id);
      }
    }

    setDragging(null);
  }, [dragging, runes, slots, speakPhoneme]);

  const spawnParticle = (x, y) => {
    const id = Date.now();
    setParticles(prev => [...prev, { id, x, y }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000);
  };

  const triggerWrongFeedback = (runeId) => {
    setRunes(prev => prev.map(r =>
      r.id === runeId ? { ...r, shake: true } : r
    ));
    setTimeout(() => {
      setRunes(prev => prev.map(r =>
        r.id === runeId ? { ...r, shake: false } : r
      ));
    }, 600);
  };

  const completeWord = async (success) => {
    setPhase('wordSuccess');
    setSuccessFlash(true);
    await speakBlend(currentWord.phonemes, currentWord.word);

    const results = currentWord.phonemes.map(ph => ({ phoneme: ph, correct: success }));
    setWordResults(prev => [...prev, ...results]);

    setCompanion({ msg: `✨ ${currentWord.word.toUpperCase()}! You cast the spell!`, emotion: 'celebrating' });

    setTimeout(() => {
      setSuccessFlash(false);
      if (wordIndex + 1 < words.length) {
        setWordIndex(i => i + 1);
      } else {
        setPhase('done');
        onComplete(wordResults.concat(results));
      }
    }, 2500);
  };

  // ── Render ──────────────────────────────────────────────────
  if (!currentWord) return null;

  return (
    <div
      className="minigame spell-casting"
      style={{ background: theme.bg }}
      ref={gameRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Word progress dots */}
      <div className="game-progress">
        {words.map((_, i) => (
          <div key={i} className={`prog-dot ${i < wordIndex ? 'done' : i === wordIndex ? 'active' : ''}`} />
        ))}
      </div>

      {/* Target word image + hint */}
      <div className="spell-target">
        <div className="spell-image">{currentWord.image}</div>
        <div className="spell-hint">Spell it!</div>
      </div>

      {/* Magic circle / drop zone */}
      <div className={`magic-circle ${successFlash ? 'magic-circle--success' : ''}`}
        style={{ '--circle-color': theme.circleColor }}>
        <div className="circle-label">Magic Circle</div>

        {/* Slots */}
        <div className="slot-row">
          {slots.map((slot, i) => (
            <div
              key={slot.id}
              ref={el => slotRefs.current[i] = el}
              className={`letter-slot ${slot.filled ? 'letter-slot--filled' : 'letter-slot--empty'}`}
              style={{ '--rune-color': theme.runeColor }}
            >
              {slot.filled ? (
                <span className="slot-phoneme">{getPhonemeInfo(slot.placedPhoneme).label}</span>
              ) : (
                <span className="slot-placeholder">?</span>
              )}
            </div>
          ))}
        </div>

        {/* Success word reveal */}
        {successFlash && (
          <div className="word-reveal">{currentWord.word}</div>
        )}
      </div>

      {/* Floating runes */}
      <div className="rune-tray">
        {runes.filter(r => !r.placed).map((rune) => (
          <div
            key={rune.id}
            className={`letter-rune ${rune.shake ? 'rune-shake' : ''} ${dragging?.runeId === rune.id ? 'rune-dragging' : ''}`}
            style={{ '--rune-color': theme.runeColor }}
            onPointerDown={(e) => handleRuneDown(e, rune.id)}
          >
            <span className="rune-label">{rune.label}</span>
            <span className="rune-emoji">{rune.emoji}</span>
          </div>
        ))}
      </div>

      {/* Dragging ghost */}
      {dragging && (() => {
        const rune = runes.find(r => r.id === dragging.runeId);
        return rune ? (
          <div
            className="rune-ghost"
            style={{
              left: dragPos.x - 50,
              top: dragPos.y - 50,
              '--rune-color': theme.runeColor,
            }}
          >
            <span className="rune-label">{rune.label}</span>
          </div>
        ) : null;
      })()}

      {/* Particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="success-particle"
          style={{ left: p.x, top: p.y }}
        >
          {theme.particleEmoji}
        </span>
      ))}

      {/* Companion */}
      <CompanionCharacter
        message={companion.msg}
        emotion={companion.emotion}
        world={world}
      />
    </div>
  );
}
