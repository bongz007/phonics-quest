import { PHONICS_LEVELS } from '../engine/phonicsEngine.js';

const WORLD_NODES = {
  ocean: [
    { levelId: 'L1', x: 12,  y: 72, label: 'Pearl Cove',     icon: '🐚' },
    { levelId: 'L2', x: 28,  y: 48, label: 'Coral Garden',   icon: '🪸' },
    { levelId: 'L3', x: 45,  y: 65, label: 'Vowel Whirlpool',icon: '🌀' },
    { levelId: 'L4', x: 60,  y: 38, label: 'Blend Storm',     icon: '⚡' },
    { levelId: 'L5', x: 72,  y: 58, label: 'Digraph Depths',  icon: '🦑' },
    { levelId: 'L6', x: 83,  y: 35, label: 'Magic-E Tide',    icon: '✨' },
    { levelId: 'L7', x: 92,  y: 55, label: 'Rainbow Deep',    icon: '🌈' },
  ],
  frost: [
    { levelId: 'L1', x: 15,  y: 70, label: 'Ice Hollow',      icon: '❄️' },
    { levelId: 'L2', x: 30,  y: 50, label: 'Frost Glade',     icon: '🌨️' },
    { levelId: 'L3', x: 45,  y: 65, label: 'Vowel Pillars',   icon: '🔮' },
    { levelId: 'L4', x: 60,  y: 40, label: 'Blend Blizzard',  icon: '🌪️' },
    { levelId: 'L5', x: 73,  y: 60, label: 'Rune Cave',       icon: '🪄' },
    { levelId: 'L6', x: 84,  y: 38, label: 'Long-Vowel Peak', icon: '🏔️' },
    { levelId: 'L7', x: 93,  y: 58, label: 'Starlight Summit',icon: '🌟' },
  ],
  hero: [
    { levelId: 'L1', x: 10,  y: 70, label: 'Sound Lab',       icon: '🔬' },
    { levelId: 'L2', x: 28,  y: 50, label: 'Signal Tower',    icon: '📡' },
    { levelId: 'L3', x: 44,  y: 65, label: 'Power Core',      icon: '⚙️' },
    { levelId: 'L4', x: 60,  y: 42, label: 'Combo Arena',     icon: '💥' },
    { levelId: 'L5', x: 74,  y: 60, label: 'Secret HQ',       icon: '🦸' },
    { levelId: 'L6', x: 84,  y: 38, label: 'Echo Heights',    icon: '🏙️' },
    { levelId: 'L7', x: 93,  y: 56, label: 'Champion Sky',    icon: '🌠' },
  ],
};

const BG_STYLES = {
  ocean: 'linear-gradient(180deg, #0A2B4E 0%, #1B4F72 50%, #2E86AB 100%)',
  frost: 'linear-gradient(180deg, #1a1a3e 0%, #4a0e8f 50%, #74B9FF 100%)',
  hero:  'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
};

export default function WorldMap({ progress, world, onSelectLevel, onOpenDashboard }) {
  const nodes   = WORLD_NODES[world] || WORLD_NODES.ocean;
  const bg      = BG_STYLES[world] || BG_STYLES.ocean;
  const current = progress?.currentLevelId || 'L1';
  const currentIdx = PHONICS_LEVELS.findIndex(l => l.id === current);

  const isUnlocked = (levelId) => {
    const idx = PHONICS_LEVELS.findIndex(l => l.id === levelId);
    return idx <= currentIdx;
  };

  const isCurrent = (levelId) => levelId === current;

  return (
    <div className="world-map" style={{ background: bg }}>
      {/* Map title */}
      <div className="map-header">
        <div className="map-title">
          {world === 'ocean' && '🌊 Lumina\'s Ocean'}
          {world === 'frost' && '❄️ Zara\'s Frost Peaks'}
          {world === 'hero'  && '⚡ Rook\'s City'}
        </div>
        <div className="map-creatures">
          {(progress?.unlockedCreatures || []).slice(-5).map((c, i) => (
            <span key={i} title={c} style={{ fontSize: '1.8rem' }}>⭐</span>
          ))}
        </div>
      </div>

      {/* SVG path connecting nodes */}
      <svg className="map-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const unlocked = isUnlocked(next.levelId);
          return (
            <line
              key={i}
              x1={node.x} y1={node.y}
              x2={next.x} y2={next.y}
              stroke={unlocked ? '#FFD166' : '#ffffff33'}
              strokeWidth="0.8"
              strokeDasharray={unlocked ? '0' : '2 1.5'}
            />
          );
        })}
      </svg>

      {/* Level nodes */}
      <div className="map-nodes">
        {nodes.map((node) => {
          const unlocked = isUnlocked(node.levelId);
          const active   = isCurrent(node.levelId);
          const level    = PHONICS_LEVELS.find(l => l.id === node.levelId);

          return (
            <button
              key={node.levelId}
              className={`map-node ${unlocked ? 'map-node--unlocked' : 'map-node--locked'} ${active ? 'map-node--active' : ''}`}
              style={{
                left: `${node.x}%`,
                top:  `${node.y}%`,
              }}
              disabled={!unlocked}
              onPointerDown={() => unlocked && onSelectLevel(node.levelId)}
            >
              <div className="node-icon">
                {unlocked ? node.icon : '🔒'}
              </div>
              <div className="node-label">{node.label}</div>
              {active && <div className="node-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Parent dashboard button (hold for 2 seconds) */}
      <button
        className="parent-btn"
        onPointerDown={(e) => {
          const t = setTimeout(onOpenDashboard, 2000);
          const cancel = () => clearTimeout(t);
          e.target.addEventListener('pointerup', cancel, { once: true });
          e.target.addEventListener('pointerleave', cancel, { once: true });
        }}
      >
        👨‍👩‍👧 Hold for Parent View
      </button>
    </div>
  );
}
