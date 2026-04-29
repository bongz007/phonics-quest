import { useState, useEffect } from 'react';

const COMPANIONS = {
  ocean: { name: 'Marina', emoji: '🐠', color: '#FF6B6B', glow: '#FFD93D' },
  frost:  { name: 'Flake',  emoji: '❄️', color: '#74B9FF', glow: '#A29BFE' },
  hero:   { name: 'Spark',  emoji: '⚡', color: '#FDCB6E', glow: '#E17055' },
};

const EMOTIONS = {
  idle:       { scale: 1,    bounce: true,  glow: 0.6 },
  speaking:   { scale: 1.1,  bounce: false, glow: 1   },
  celebrating:{ scale: 1.3,  bounce: false, glow: 1   },
  thinking:   { scale: 0.95, bounce: true,  glow: 0.4 },
  encouraging:{ scale: 1.15, bounce: false, glow: 0.8 },
};

export default function CompanionCharacter({ message, emotion = 'idle', world = 'ocean', onDone }) {
  const [visible, setVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const companion = COMPANIONS[world] || COMPANIONS.ocean;
  const emo = EMOTIONS[emotion] || EMOTIONS.idle;

  useEffect(() => {
    setVisible(true);
    if (message) {
      const t = setTimeout(() => setShowBubble(true), 300);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    if (!message) { setShowBubble(false); return; }
    const t = setTimeout(() => {
      setShowBubble(false);
      onDone?.();
    }, Math.max(3000, message.length * 60));
    return () => clearTimeout(t);
  }, [message, onDone]);

  return (
    <div className="companion-wrapper" style={{ opacity: visible ? 1 : 0 }}>
      {/* Speech bubble */}
      {showBubble && message && (
        <div className="speech-bubble">
          <span>{message}</span>
          <div className="bubble-tail" />
        </div>
      )}

      {/* Character */}
      <div
        className={`companion-body ${emo.bounce ? 'float-anim' : ''} ${emotion === 'celebrating' ? 'celebrate-anim' : ''}`}
        style={{
          '--companion-color': companion.color,
          '--companion-glow': companion.glow,
          transform: `scale(${emo.scale})`,
          filter: `drop-shadow(0 0 ${12 * emo.glow}px ${companion.glow})`,
        }}
      >
        <div className="companion-emoji">{companion.emoji}</div>
        <div className="companion-name">{companion.name}</div>
      </div>
    </div>
  );
}
