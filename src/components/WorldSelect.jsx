import { useState } from 'react';

const WORLDS = [
  {
    id: 'ocean',
    name: 'Lumina\'s Ocean',
    tagline: 'Sound-powered ocean explorer',
    icon: '🌊',
    hero: '🐠',
    heroine: 'Lumina',
    description: 'Dive into a magical ocean where every sound you make wakes up sea creatures. Learn phonics to explore the deep!',
    bg: 'linear-gradient(135deg, #0A2B4E 0%, #1B4F72 40%, #2E86AB 70%, #48CAE4 100%)',
    card: 'linear-gradient(135deg, #0077B6, #0096C7)',
    glow: '#00B4D8',
    accent: '#FFD166',
    features: ['🐠 Wake sleeping sea creatures', '🌊 Unlock hidden ocean paths', '🐚 Collect magical shells'],
  },
  {
    id: 'frost',
    name: 'Zara\'s Frost Peaks',
    tagline: 'A frost mage learning sound spells',
    icon: '❄️',
    hero: '🧊',
    heroine: 'Zara',
    description: 'In an enchanted icy kingdom, only sound spells can restore warmth. Zara needs your phonics power!',
    bg: 'linear-gradient(135deg, #1a1a3e 0%, #4a0e8f 40%, #74B9FF 80%, #E8F4F8 100%)',
    card: 'linear-gradient(135deg, #6C63FF, #48C9B0)',
    glow: '#A29BFE',
    accent: '#E8F4F8',
    features: ['✨ Cast ice crystal spells', '❄️ Melt frost with sounds', '🌈 Restore the frost kingdom'],
  },
  {
    id: 'hero',
    name: 'Rook\'s City',
    tagline: 'A hero on a sound-powered mission',
    icon: '⚡',
    hero: '🦸',
    heroine: 'Rook',
    description: 'A city in need of a hero! Rook has the power — but only phonics knowledge can activate each ability!',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #e85d04 100%)',
    card: 'linear-gradient(135deg, #E84393, #F8961E)',
    glow: '#FDCB6E',
    accent: '#F8961E',
    features: ['⚡ Unlock hero powers', '🏙️ Protect the city', '🦸 Discover new abilities'],
  },
];

export default function WorldSelect({ onSelectWorld }) {
  const [hoveredWorld, setHoveredWorld] = useState(null);
  const [selecting, setSelecting] = useState(null);

  const handleSelect = (worldId) => {
    setSelecting(worldId);
    setTimeout(() => onSelectWorld(worldId), 600);
  };

  return (
    <div className="world-select">
      {/* Header */}
      <div className="world-select-header">
        <div className="ws-title">🔤 Phonics Quest</div>
        <div className="ws-subtitle">Choose your adventure world!</div>
      </div>

      {/* World cards */}
      <div className="world-cards">
        {WORLDS.map((world) => (
          <button
            key={world.id}
            className={`world-card ${selecting === world.id ? 'world-card--selecting' : ''}`}
            style={{
              background: world.card,
              boxShadow: hoveredWorld === world.id
                ? `0 0 40px ${world.glow}, 0 20px 60px rgba(0,0,0,0.4)`
                : '0 10px 40px rgba(0,0,0,0.3)',
              transform: selecting === world.id
                ? 'scale(1.08)'
                : hoveredWorld === world.id
                  ? 'scale(1.04) translateY(-8px)'
                  : 'scale(1)',
            }}
            onPointerEnter={() => setHoveredWorld(world.id)}
            onPointerLeave={() => setHoveredWorld(null)}
            onPointerDown={() => handleSelect(world.id)}
          >
            {/* World icon */}
            <div className="wc-icon">{world.icon}</div>

            {/* Hero */}
            <div className="wc-hero">{world.hero}</div>

            {/* Info */}
            <div className="wc-info">
              <div className="wc-name">{world.name}</div>
              <div className="wc-tagline">{world.tagline}</div>
              <div className="wc-desc">{world.description}</div>
              <ul className="wc-features">
                {world.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Tap indicator */}
            <div className="wc-tap" style={{ color: world.accent }}>
              Tap to explore! →
            </div>

            {/* Glow ring */}
            {hoveredWorld === world.id && (
              <div className="wc-glow" style={{ boxShadow: `inset 0 0 60px ${world.glow}44` }} />
            )}
          </button>
        ))}
      </div>

      {/* Bottom wave decoration */}
      <div className="world-select-waves">
        🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊
      </div>
    </div>
  );
}
