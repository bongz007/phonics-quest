import { useEffect, useState } from 'react';

export default function RewardScreen({ unlock, world, onContinue }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const worldColors = {
    ocean: { bg: '#0A2B4E', ring: '#00B4D8', shimmer: '#FFD700' },
    frost:  { bg: '#1a1a3e', ring: '#A29BFE', shimmer: '#E8F4F8' },
    hero:   { bg: '#1a1a2e', ring: '#FDCB6E', shimmer: '#E17055' },
  };
  const colors = worldColors[world] || worldColors.ocean;

  const particles = ['✨','💫','🌟','⭐','🎆','🎇'];

  return (
    <div
      className="reward-screen"
      style={{ background: `radial-gradient(circle at center, ${colors.ring}33 0%, ${colors.bg} 70%)` }}
      onClick={phase >= 3 ? onContinue : undefined}
    >
      {/* Burst particles */}
      {phase >= 2 && [...Array(12)].map((_, i) => (
        <span
          key={i}
          className="reward-particle"
          style={{
            '--angle': `${i * 30}deg`,
            '--delay': `${(i % 4) * 0.1}s`,
            fontSize: `${1.5 + Math.random()}rem`,
          }}
        >
          {particles[i % particles.length]}
        </span>
      ))}

      <div className="reward-content">
        {/* Creature card */}
        <div
          className="creature-card"
          style={{
            transform: phase >= 1 ? 'scale(1)' : 'scale(0)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 60px ${colors.ring}`,
          }}
        >
          <div className="creature-emoji">{unlock?.emoji || '⭐'}</div>
          <div className="creature-glow" style={{ background: `radial-gradient(circle, ${colors.shimmer}44, transparent)` }} />
        </div>

        {/* Name */}
        <div
          className="creature-name"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s ease 0.3s',
            color: colors.shimmer,
          }}
        >
          {unlock?.name || 'New Friend'} unlocked!
        </div>

        {/* Description */}
        <div
          className="creature-desc"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <p>{unlock?.description || 'A magical new companion!'}</p>
          <div className="tap-continue">Tap to keep going →</div>
        </div>
      </div>
    </div>
  );
}
