import { useEffect, useState } from 'react';

export default function StoryPrompt({ story, world, onContinue }) {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setTextVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const worldConfig = {
    ocean: {
      bg: 'linear-gradient(160deg, #0A2B4E 0%, #1B4F72 40%, #2E86AB 100%)',
      overlay: 'rgba(0,30,70,0.5)',
      icon: '🌊',
      particle: '🫧',
    },
    frost: {
      bg: 'linear-gradient(160deg, #1a1a3e 0%, #4a0e8f 40%, #74B9FF 100%)',
      overlay: 'rgba(10,0,50,0.5)',
      icon: '❄️',
      particle: '✨',
    },
    hero: {
      bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #e85d04 100%)',
      overlay: 'rgba(0,0,20,0.5)',
      icon: '⚡',
      particle: '🌟',
    },
  };

  const cfg = worldConfig[world] || worldConfig.ocean;

  return (
    <div
      className="story-prompt"
      style={{
        background: cfg.bg,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
      onClick={onContinue}
    >
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="story-particle"
          style={{
            left: `${10 + i * 12}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          {cfg.particle}
        </span>
      ))}

      <div className="story-content">
        <div className="story-icon" style={{ fontSize: '5rem' }}>{cfg.icon}</div>

        <p
          className="story-text"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
          }}
        >
          {story}
        </p>

        <div
          className="story-tap-hint"
          style={{ opacity: textVisible ? 1 : 0, transition: 'opacity 1s ease 1.5s' }}
        >
          Tap anywhere to begin ✨
        </div>
      </div>
    </div>
  );
}
