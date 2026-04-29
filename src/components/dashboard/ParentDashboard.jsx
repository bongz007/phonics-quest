import { useState } from 'react';
import { PHONICS_LEVELS, getLevelById } from '../../engine/phonicsEngine.js';
import {
  getSkillSummary,
  analyseErrorPatterns,
  generateDailySuggestions,
} from '../../engine/adaptiveEngine.js';
import {
  getRecentAccuracy,
  getTotalWordsRead,
  getStreakDays,
} from '../../engine/progressTracker.js';

export default function ParentDashboard({ progress, onClose }) {
  const [tab, setTab] = useState('overview'); // overview | skills | activities

  if (!progress) return null;

  const skillSummary  = getSkillSummary(progress);
  const errorPatterns = analyseErrorPatterns(progress);
  const suggestions   = generateDailySuggestions(progress, progress.currentLevelId);
  const recentAcc     = getRecentAccuracy(progress);
  const totalWords    = getTotalWordsRead(progress);
  const streak        = getStreakDays(progress);
  const currentLevel  = getLevelById(progress.currentLevelId);

  const MASTERY_COLORS = {
    'mastered':     '#06D6A0',
    'learning':     '#FFD166',
    'not-started':  '#6C757D',
  };

  return (
    <div className="parent-dashboard">
      {/* Header */}
      <div className="pd-header">
        <div className="pd-header-left">
          <div className="pd-title">📊 Parent Dashboard</div>
          <div className="pd-child">{progress.childName}'s Reading Journey</div>
        </div>
        <button className="pd-close" onPointerDown={onClose}>✕ Back to Game</button>
      </div>

      {/* Summary cards */}
      <div className="pd-summary">
        <div className="pd-stat-card">
          <div className="pd-stat-value">{recentAcc}%</div>
          <div className="pd-stat-label">Recent Accuracy</div>
        </div>
        <div className="pd-stat-card">
          <div className="pd-stat-value">{totalWords}</div>
          <div className="pd-stat-label">Words Decoded</div>
        </div>
        <div className="pd-stat-card">
          <div className="pd-stat-value">{streak}</div>
          <div className="pd-stat-label">Day Streak 🔥</div>
        </div>
        <div className="pd-stat-card">
          <div className="pd-stat-value">{progress.unlockedCreatures?.length || 0}</div>
          <div className="pd-stat-label">Creatures Found</div>
        </div>
      </div>

      {/* Current level callout */}
      <div className="pd-current-level">
        <span className="pd-cl-label">Currently Learning:</span>
        <span className="pd-cl-name">{currentLevel?.name} — {currentLevel?.magicName}</span>
        <span className="pd-cl-desc">
          Your child is working on: {currentLevel?.skills.slice(0,4).map(s => `/${s}/`).join(', ')} sounds
        </span>
      </div>

      {/* Tab nav */}
      <div className="pd-tabs">
        {['overview', 'skills', 'activities'].map(t => (
          <button
            key={t}
            className={`pd-tab ${tab === t ? 'pd-tab--active' : ''}`}
            onPointerDown={() => setTab(t)}
          >
            {t === 'overview'   && '📈 Overview'}
            {t === 'skills'     && '🔤 Phonics Skills'}
            {t === 'activities' && '🎮 Daily Activities'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pd-content">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="pd-overview">
            <h3 className="pd-section-title">What is your child learning?</h3>
            <p className="pd-explain">
              We use the <strong>Science of Reading</strong> — a research-backed approach that teaches phonics
              systematically. Your child is learning to <strong>blend sounds</strong> (like <em>c–a–t → cat</em>),
              <strong> segment words</strong> (breaking <em>ship</em> into <em>/sh/–/i/–/p/</em>), and
              <strong> recognise letter-sound patterns</strong>.
            </p>

            <h3 className="pd-section-title">Progress at a glance</h3>
            <div className="level-progress-list">
              {skillSummary.map(lvl => (
                <div key={lvl.levelId} className="lpl-row">
                  <div className="lpl-name">{lvl.levelName}</div>
                  <div className="lpl-bar-wrap">
                    <div
                      className="lpl-bar"
                      style={{ width: `${(lvl.masteredCount / lvl.totalCount) * 100}%` }}
                    />
                  </div>
                  <div className="lpl-count">{lvl.masteredCount}/{lvl.totalCount}</div>
                  {lvl.complete && <span className="lpl-star">⭐</span>}
                </div>
              ))}
            </div>

            {/* Error patterns */}
            {errorPatterns.length > 0 && (
              <>
                <h3 className="pd-section-title">🔍 Patterns to watch</h3>
                {errorPatterns.map((p, i) => (
                  <div key={i} className="error-pattern-card">
                    <div className="epc-label">⚠️ {p.label}</div>
                    <div className="epc-detail">{p.detail}</div>
                    <div className="epc-suggestion">💡 Try this: {p.suggestion}</div>
                  </div>
                ))}
              </>
            )}

            {/* Recent sessions */}
            {progress.sessions?.length > 0 && (
              <>
                <h3 className="pd-section-title">Recent sessions</h3>
                <div className="session-list">
                  {[...(progress.sessions || [])].reverse().slice(0, 5).map((s, i) => (
                    <div key={i} className="session-row">
                      <span className="sr-date">{new Date(s.date).toLocaleDateString()}</span>
                      <span className="sr-level">Level {s.levelId}</span>
                      <span className="sr-game">{s.gameType?.replace('-', ' ')}</span>
                      <span className="sr-acc" style={{ color: s.accuracy >= 70 ? '#06D6A0' : '#FFD166' }}>
                        {s.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {tab === 'skills' && (
          <div className="pd-skills">
            {skillSummary.map(lvl => (
              <div key={lvl.levelId} className="skill-level-block">
                <div className="slb-header">
                  <span className="slb-name">{lvl.levelName}</span>
                  <span className="slb-magic">{lvl.magicName}</span>
                  <span className="slb-count">{lvl.masteredCount}/{lvl.totalCount} mastered</span>
                </div>
                <div className="slb-skills">
                  {lvl.skills.map(skill => (
                    <div
                      key={skill.skill}
                      className="skill-chip"
                      title={`${skill.attempts} attempts, ${Math.round(skill.mastery * 100)}% accuracy`}
                      style={{ '--skill-color': MASTERY_COLORS[skill.status] }}
                    >
                      <span className="sc-phoneme">/{skill.skill}/</span>
                      <span className="sc-status">
                        {skill.status === 'mastered'   && '✅'}
                        {skill.status === 'learning'   && '📖'}
                        {skill.status === 'not-started'&& '⭕'}
                      </span>
                      {skill.attempts > 0 && (
                        <span className="sc-pct">{Math.round(skill.mastery * 100)}%</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="slb-explain">
                  {lvl.levelId === 'L1' && '🔤 Learning the most common letter sounds: S, A, T, P, I, N'}
                  {lvl.levelId === 'L2' && '🔤 More consonants and the short /o/ vowel sound'}
                  {lvl.levelId === 'L3' && '🔤 All five short vowels plus more consonants'}
                  {lvl.levelId === 'L4' && '🔀 Consonant blends — two sounds spoken together (bl, st, tr...)'}
                  {lvl.levelId === 'L5' && '🤫 Digraphs — two letters, one sound (sh, ch, th, wh)'}
                  {lvl.levelId === 'L6' && '✨ Long vowel patterns using silent E (cake, kite, bone)'}
                  {lvl.levelId === 'L7' && '🤝 Vowel teams — two vowels together (ai, ee, oa, oo)'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {tab === 'activities' && (
          <div className="pd-activities">
            <p className="activities-intro">
              These activities connect today's in-app learning to the real world. 5–10 minutes each!
            </p>
            {suggestions.map((s, i) => (
              <div key={i} className="activity-card">
                <div className="ac-emoji">{s.emoji}</div>
                <div className="ac-body">
                  <div className="ac-title">{s.text}</div>
                  <div className="ac-desc">{s.activity}</div>
                  {s.skill && (
                    <div className="ac-skill">Targets /{s.skill}/ sound</div>
                  )}
                </div>
              </div>
            ))}

            <div className="pd-glossary">
              <h3 className="pd-section-title">📚 What do these terms mean?</h3>
              <div className="glossary-item">
                <strong>Phoneme:</strong> The smallest unit of sound in a word. "Cat" has 3 phonemes: /k/ /æ/ /t/
              </div>
              <div className="glossary-item">
                <strong>Blending:</strong> Pushing sounds together to read a word. /s/ /a/ /t/ → "sat"
              </div>
              <div className="glossary-item">
                <strong>Segmenting:</strong> Breaking a word into its individual sounds. "ship" → /sh/ /i/ /p/
              </div>
              <div className="glossary-item">
                <strong>Grapheme:</strong> The written letter(s) that represent a sound. "sh" is one grapheme.
              </div>
              <div className="glossary-item">
                <strong>Digraph:</strong> Two letters that make one sound (sh, ch, th, wh).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
