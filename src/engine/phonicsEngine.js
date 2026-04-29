// Science of Reading - Systematic Phonics Progression
// Based on Orton-Gillingham and structured literacy principles

export const PHONEME_MAP = {
  // === SHORT VOWELS ===
  'a': { speech: 'aaa', label: 'short A', type: 'short-vowel', keyword: 'apple', emoji: '🍎' },
  'e': { speech: 'eh',  label: 'short E', type: 'short-vowel', keyword: 'egg',   emoji: '🥚' },
  'i': { speech: 'ih',  label: 'short I', type: 'short-vowel', keyword: 'igloo', emoji: '🏔️' },
  'o': { speech: 'oh',  label: 'short O', type: 'short-vowel', keyword: 'octopus', emoji: '🐙' },
  'u': { speech: 'uh',  label: 'short U', type: 'short-vowel', keyword: 'umbrella', emoji: '☂️' },

  // === CONSONANTS (Set 1 - most frequent) ===
  's': { speech: 'ssss', label: 'S',  type: 'consonant', keyword: 'snake',  emoji: '🐍' },
  't': { speech: 't',    label: 'T',  type: 'consonant', keyword: 'turtle', emoji: '🐢' },
  'p': { speech: 'p',    label: 'P',  type: 'consonant', keyword: 'pearl',  emoji: '🫧' },
  'n': { speech: 'nnn',  label: 'N',  type: 'consonant', keyword: 'net',    emoji: '🕸️' },
  'm': { speech: 'mmm',  label: 'M',  type: 'consonant', keyword: 'moon',   emoji: '🌙' },
  'd': { speech: 'd',    label: 'D',  type: 'consonant', keyword: 'dolphin',emoji: '🐬' },
  'g': { speech: 'g',    label: 'G',  type: 'consonant', keyword: 'gold',   emoji: '✨' },
  'c': { speech: 'k',    label: 'C',  type: 'consonant', keyword: 'coral',  emoji: '🪸' },
  'k': { speech: 'k',    label: 'K',  type: 'consonant', keyword: 'kelp',   emoji: '🌿' },
  'h': { speech: 'h',    label: 'H',  type: 'consonant', keyword: 'harbor', emoji: '⚓' },
  'b': { speech: 'b',    label: 'B',  type: 'consonant', keyword: 'bubble', emoji: '🫧' },
  'f': { speech: 'fff',  label: 'F',  type: 'consonant', keyword: 'fish',   emoji: '🐟' },
  'l': { speech: 'lll',  label: 'L',  type: 'consonant', keyword: 'lantern',emoji: '🏮' },
  'r': { speech: 'rrr',  label: 'R',  type: 'consonant', keyword: 'reef',   emoji: '🪸' },
  'j': { speech: 'j',    label: 'J',  type: 'consonant', keyword: 'jellyfish', emoji: '🪼' },
  'v': { speech: 'vvv',  label: 'V',  type: 'consonant', keyword: 'volcano',emoji: '🌋' },
  'w': { speech: 'www',  label: 'W',  type: 'consonant', keyword: 'wave',   emoji: '🌊' },
  'x': { speech: 'ks',   label: 'X',  type: 'consonant', keyword: 'fox',    emoji: '🦊' },
  'y': { speech: 'y',    label: 'Y',  type: 'consonant', keyword: 'yarn',   emoji: '🧶' },
  'z': { speech: 'zzz',  label: 'Z',  type: 'consonant', keyword: 'zigzag', emoji: '⚡' },
  'q': { speech: 'kw',   label: 'QU', type: 'consonant', keyword: 'queen',  emoji: '👑' },

  // === DIGRAPHS ===
  'sh': { speech: 'shh', label: 'SH', type: 'digraph', keyword: 'shell',  emoji: '🐚' },
  'ch': { speech: 'ch',  label: 'CH', type: 'digraph', keyword: 'chest',  emoji: '🪣' },
  'th': { speech: 'th',  label: 'TH', type: 'digraph', keyword: 'thorn',  emoji: '🌵' },
  'wh': { speech: 'wh',  label: 'WH', type: 'digraph', keyword: 'whale',  emoji: '🐋' },
  'ph': { speech: 'fff', label: 'PH', type: 'digraph', keyword: 'photo',  emoji: '📷' },

  // === CONSONANT BLENDS ===
  'bl': { speech: 'bl', label: 'BL', type: 'blend', keyword: 'blue',  emoji: '💙' },
  'cl': { speech: 'cl', label: 'CL', type: 'blend', keyword: 'clam',  emoji: '🦪' },
  'fl': { speech: 'fl', label: 'FL', type: 'blend', keyword: 'flame', emoji: '🔥' },
  'gl': { speech: 'gl', label: 'GL', type: 'blend', keyword: 'glow',  emoji: '✨' },
  'pl': { speech: 'pl', label: 'PL', type: 'blend', keyword: 'plant', emoji: '🌱' },
  'sl': { speech: 'sl', label: 'SL', type: 'blend', keyword: 'slide', emoji: '🎿' },
  'st': { speech: 'st', label: 'ST', type: 'blend', keyword: 'star',  emoji: '⭐' },
  'sp': { speech: 'sp', label: 'SP', type: 'blend', keyword: 'spell', emoji: '🪄' },
  'sk': { speech: 'sk', label: 'SK', type: 'blend', keyword: 'sky',   emoji: '🌤️' },
  'sn': { speech: 'sn', label: 'SN', type: 'blend', keyword: 'snap',  emoji: '🫰' },
  'sw': { speech: 'sw', label: 'SW', type: 'blend', keyword: 'swim',  emoji: '🏊' },
  'tr': { speech: 'tr', label: 'TR', type: 'blend', keyword: 'tree',  emoji: '🌳' },
  'br': { speech: 'br', label: 'BR', type: 'blend', keyword: 'brave', emoji: '🛡️' },
  'cr': { speech: 'cr', label: 'CR', type: 'blend', keyword: 'crab',  emoji: '🦀' },
  'gr': { speech: 'gr', label: 'GR', type: 'blend', keyword: 'grow',  emoji: '🌿' },
  'dr': { speech: 'dr', label: 'DR', type: 'blend', keyword: 'drop',  emoji: '💧' },
  'fr': { speech: 'fr', label: 'FR', type: 'blend', keyword: 'frost', emoji: '❄️' },
  'pr': { speech: 'pr', label: 'PR', type: 'blend', keyword: 'pearl', emoji: '🫧' },

  // === LONG VOWEL PATTERNS (CVCe) ===
  'a_e': { speech: 'ayy', label: 'A-E', type: 'long-vowel', keyword: 'wave',  emoji: '🌊' },
  'i_e': { speech: 'eye', label: 'I-E', type: 'long-vowel', keyword: 'kite',  emoji: '🪁' },
  'o_e': { speech: 'oh',  label: 'O-E', type: 'long-vowel', keyword: 'stone', emoji: '🪨' },
  'u_e': { speech: 'you', label: 'U-E', type: 'long-vowel', keyword: 'flute', emoji: '🎵' },

  // === VOWEL TEAMS ===
  'ai': { speech: 'ayy', label: 'AI', type: 'vowel-team', keyword: 'rain', emoji: '🌧️' },
  'ay': { speech: 'ayy', label: 'AY', type: 'vowel-team', keyword: 'bay',  emoji: '🏖️' },
  'ee': { speech: 'ee',  label: 'EE', type: 'vowel-team', keyword: 'reef', emoji: '🌿' },
  'ea': { speech: 'ee',  label: 'EA', type: 'vowel-team', keyword: 'seal', emoji: '🦭' },
  'oa': { speech: 'oh',  label: 'OA', type: 'vowel-team', keyword: 'boat', emoji: '⛵' },
  'oo': { speech: 'ooh', label: 'OO', type: 'vowel-team', keyword: 'moon', emoji: '🌕' },
};

// ═══════════════════════════════════════════════════════════════
// PHONICS LEVELS — Systematic progression (Science of Reading)
// ═══════════════════════════════════════════════════════════════
export const PHONICS_LEVELS = [
  {
    id: 'L1',
    name: 'First Sounds',
    magicName: 'The Discovery Tide',
    description: 'Lumina wakes the ocean with her first magic sounds.',
    skills: ['s', 'a', 't', 'p', 'i', 'n'],
    gameTypes: ['creature-calling', 'spell-casting'],
    words: [
      { word: 'sat', phonemes: ['s','a','t'], image: '🐚', creature: 'pearl-fish' },
      { word: 'tin', phonemes: ['t','i','n'], image: '🐟', creature: 'tin-fish' },
      { word: 'pan', phonemes: ['p','a','n'], image: '⭐', creature: 'star-sprite' },
      { word: 'nap', phonemes: ['n','a','p'], image: '💤', creature: 'slumber-seal' },
      { word: 'tip', phonemes: ['t','i','p'], image: '💧', creature: 'tip-ray' },
      { word: 'sip', phonemes: ['s','i','p'], image: '🌊', creature: 'sip-crab' },
      { word: 'tap', phonemes: ['t','a','p'], image: '🥁', creature: 'tap-turtle' },
      { word: 'pin', phonemes: ['p','i','n'], image: '📌', creature: 'pin-urchin' },
    ],
    storyPrompt: {
      ocean: "The deep sea glows! Lumina heard a mystery sound beneath the waves...",
      frost: "The ice mountains shimmer. Zara feels her first sound spell brewing...",
      hero: "The city needs help! Rook discovers the power of sounds...",
    },
    unlocks: {
      ocean: { name: 'Pearl Fish', emoji: '🐠', description: 'A glowing fish who knows all vowel sounds!' },
      frost:  { name: 'Ice Sprite', emoji: '❄️', description: 'A frost fairy who whispers secret sounds!' },
      hero:   { name: 'Firefly',    emoji: '🌟', description: 'A guiding light through the city!' },
    },
  },
  {
    id: 'L2',
    name: 'More Sounds',
    magicName: 'Deeper Waters',
    description: 'More creatures stir as Lumina learns new sounds.',
    skills: ['m', 'd', 'g', 'o', 'c', 'k'],
    gameTypes: ['creature-calling', 'spell-casting', 'sound-bridge'],
    words: [
      { word: 'dog',  phonemes: ['d','o','g'], image: '🐕', creature: 'sea-dog' },
      { word: 'got',  phonemes: ['g','o','t'], image: '🪙', creature: 'gold-ray' },
      { word: 'mop',  phonemes: ['m','o','p'], image: '🧹', creature: 'mop-fish' },
      { word: 'kid',  phonemes: ['k','i','d'], image: '🐐', creature: 'kid-fish' },
      { word: 'cot',  phonemes: ['c','o','t'], image: '🛏️', creature: 'cot-clam' },
      { word: 'dim',  phonemes: ['d','i','m'], image: '🌑', creature: 'dim-star' },
      { word: 'mad',  phonemes: ['m','a','d'], image: '🌪️', creature: 'mad-eel' },
      { word: 'cod',  phonemes: ['c','o','d'], image: '🐟', creature: 'cool-cod' },
    ],
    storyPrompt: {
      ocean: "A pod of creatures waits! Each one woke up because you called their sounds.",
      frost: "The frozen forest echoes with new spells! More creatures emerge from the ice.",
      hero: "Signal received! More allies are coming, answering the call of sounds.",
    },
    unlocks: {
      ocean: { name: 'Seahorse', emoji: '🐴', description: 'The wise seahorse who teaches blending!' },
      frost:  { name: 'Snow Fox',  emoji: '🦊', description: 'A silver fox who runs between sounds!' },
      hero:   { name: 'Robo-Bird', emoji: '🦅', description: 'A mechanical eagle who carries messages!' },
    },
  },
  {
    id: 'L3',
    name: 'All Five Vowels',
    magicName: 'The Vowel Whirlpool',
    description: 'Master the five vowel powers. The whirlpool reveals hidden treasure.',
    skills: ['e', 'u', 'h', 'b', 'f', 'l'],
    gameTypes: ['sound-bridge', 'spell-casting'],
    words: [
      { word: 'bed',  phonemes: ['b','e','d'], image: '🛏️', creature: 'bed-fish' },
      { word: 'hen',  phonemes: ['h','e','n'], image: '🐔', creature: 'hen-bird' },
      { word: 'fun',  phonemes: ['f','u','n'], image: '🎉', creature: 'fun-fish' },
      { word: 'bug',  phonemes: ['b','u','g'], image: '🐛', creature: 'sea-bug' },
      { word: 'let',  phonemes: ['l','e','t'], image: '🔓', creature: 'let-ray' },
      { word: 'hub',  phonemes: ['h','u','b'], image: '⚙️', creature: 'hub-crab' },
      { word: 'felt', phonemes: ['f','e','l','t'], image: '🎭', creature: 'felt-whale' },
      { word: 'belt', phonemes: ['b','e','l','t'], image: '🥋', creature: 'belt-eel' },
    ],
    storyPrompt: {
      ocean: "A magical whirlpool swirls! The five vowel sounds live inside. Dive in!",
      frost: "Five crystal pillars glow — A, E, I, O, U! Touch each one to release the magic.",
      hero: "Five power cores need activation! Each vowel sound charges one up.",
    },
    unlocks: {
      ocean: { name: 'Glowing Ray', emoji: '🌟', description: 'A stingray who lights up the deep sea!' },
      frost:  { name: 'Crystal Wolf', emoji: '🐺', description: 'A wolf made of ice who howls vowels!' },
      hero:   { name: 'Wind Eagle', emoji: '🦁', description: 'A golden eagle powered by vowel sounds!' },
    },
  },
  {
    id: 'L4',
    name: 'Blended Sounds',
    magicName: 'The Blend Storm',
    description: 'Two sounds merge into one powerful spell. The storm begins!',
    skills: ['bl','cl','fl','st','sp','tr','br','cr','gr','dr'],
    gameTypes: ['spell-casting', 'sound-bridge'],
    words: [
      { word: 'clap',  phonemes: ['cl','a','p'], image: '👏', creature: 'clap-crab' },
      { word: 'flip',  phonemes: ['fl','i','p'], image: '🔄', creature: 'flip-fish' },
      { word: 'step',  phonemes: ['st','e','p'], image: '👣', creature: 'step-star' },
      { word: 'spot',  phonemes: ['sp','o','t'], image: '🎯', creature: 'spot-seal' },
      { word: 'trap',  phonemes: ['tr','a','p'], image: '🪤', creature: 'trap-ray' },
      { word: 'drop',  phonemes: ['dr','o','p'], image: '💧', creature: 'drop-dragon' },
      { word: 'grip',  phonemes: ['gr','i','p'], image: '✊', creature: 'grip-gator' },
      { word: 'brim',  phonemes: ['br','i','m'], image: '🪣', creature: 'brim-bird' },
    ],
    storyPrompt: {
      ocean: "The blend storm swirls! Two sounds crash together and make a new, stronger one!",
      frost: "Two ice crystals fuse! Zara learns that blending sounds doubles their power.",
      hero: "Combo power unlocked! Rook merges two sounds for a super ability!",
    },
    unlocks: {
      ocean: { name: 'Twin Dolphins', emoji: '🐬', description: 'Two dolphins who swim as one—just like blended sounds!' },
      frost:  { name: 'Frost Dragon',  emoji: '🐉', description: 'A mighty dragon formed from two ice spells!' },
      hero:   { name: 'Turbo Hawk',    emoji: '🦅', description: 'A super-speed hawk powered by combined sounds!' },
    },
  },
  {
    id: 'L5',
    name: 'Magic Pairs',
    magicName: 'The Digraph Depths',
    description: 'Two letters make one secret sound. Discover the deep-sea magic!',
    skills: ['sh','ch','th','wh'],
    gameTypes: ['creature-calling', 'spell-casting', 'sound-bridge'],
    words: [
      { word: 'ship',  phonemes: ['sh','i','p'], image: '⛵', creature: 'ship-spirit' },
      { word: 'chat',  phonemes: ['ch','a','t'], image: '💬', creature: 'chat-fish' },
      { word: 'thin',  phonemes: ['th','i','n'], image: '🌙', creature: 'thin-ray' },
      { word: 'whip',  phonemes: ['wh','i','p'], image: '💨', creature: 'whip-whale' },
      { word: 'shell', phonemes: ['sh','e','l'], image: '🐚', creature: 'shell-beast' },
      { word: 'chin',  phonemes: ['ch','i','n'], image: '😊', creature: 'chin-crab' },
      { word: 'that',  phonemes: ['th','a','t'], image: '👆', creature: 'that-thing' },
      { word: 'when',  phonemes: ['wh','e','n'], image: '🤔', creature: 'when-whale' },
    ],
    storyPrompt: {
      ocean: "Shh! Can you hear it? Two letters share a secret. Listen very carefully...",
      frost: "Two runes fuse together! When SH appear side by side, they whisper as one.",
      hero: "Secret signals discovered! Two letters team up for a totally new sound.",
    },
    unlocks: {
      ocean: { name: 'Giant Squid', emoji: '🦑', description: 'The wise squid who knows all the secret sounds!' },
      frost:  { name: 'Phoenix Ice',  emoji: '🦚', description: 'An ice phoenix risen from two frozen runes!' },
      hero:   { name: 'Shadow Cat',   emoji: '🐱', description: 'A stealthy cat who moves between two sounds!' },
    },
  },
  {
    id: 'L6',
    name: 'Long Vowel Magic',
    magicName: 'The Magic-E Tide',
    description: 'The silent E changes everything! Watch short sounds grow long.',
    skills: ['a_e','i_e','o_e','u_e'],
    gameTypes: ['spell-casting', 'sound-bridge'],
    words: [
      { word: 'cake',  phonemes: ['c','a_e','k'], image: '🎂',  creature: 'cake-coral' },
      { word: 'kite',  phonemes: ['k','i_e','t'], image: '🪁',  creature: 'kite-fish' },
      { word: 'bone',  phonemes: ['b','o_e','n'], image: '🦴',  creature: 'bone-whale' },
      { word: 'cube',  phonemes: ['c','u_e','b'], image: '🧊',  creature: 'cube-crab' },
      { word: 'flame', phonemes: ['fl','a_e','m'], image: '🔥', creature: 'flame-fish' },
      { word: 'shine', phonemes: ['sh','i_e','n'], image: '✨', creature: 'shine-ray' },
      { word: 'stone', phonemes: ['st','o_e','n'], image: '🪨', creature: 'stone-beast' },
      { word: 'flute', phonemes: ['fl','u_e','t'], image: '🎵', creature: 'flute-eel' },
    ],
    storyPrompt: {
      ocean: "The silent E drifts in from the tide! Watch what happens when it joins a word...",
      frost: "A magic rune with no voice! The E changes words without making a sound.",
      hero: "Power amplifier found! The E boosts every vowel it stands near.",
    },
    unlocks: {
      ocean: { name: 'Mermaid Guardian', emoji: '🧜', description: 'A mermaid who has mastered all long vowels!' },
      frost:  { name: 'Aurora Sprite',   emoji: '🌈', description: 'A sprite painted in the colors of long vowels!' },
      hero:   { name: 'Lightning Wolf',  emoji: '⚡', description: 'A wolf whose howl stretches on and on!' },
    },
  },
  {
    id: 'L7',
    name: 'Vowel Teams',
    magicName: 'Twin-Vowel Ocean',
    description: 'Two vowels team up. The first one says its name!',
    skills: ['ai','ay','ee','ea','oa','oo'],
    gameTypes: ['spell-casting', 'sound-bridge', 'creature-calling'],
    words: [
      { word: 'rain',  phonemes: ['r','ai','n'],   image: '🌧️',  creature: 'rain-rider' },
      { word: 'reef',  phonemes: ['r','ee','f'],   image: '🌿',  creature: 'reef-fish' },
      { word: 'seal',  phonemes: ['s','ea','l'],   image: '🦭',  creature: 'seal-beast' },
      { word: 'boat',  phonemes: ['b','oa','t'],   image: '⛵',  creature: 'boat-bird' },
      { word: 'moon',  phonemes: ['m','oo','n'],   image: '🌕',  creature: 'moon-whale' },
      { word: 'trail', phonemes: ['tr','ai','l'],  image: '🛤️',  creature: 'trail-turtle' },
      { word: 'greet', phonemes: ['gr','ee','t'],  image: '👋',  creature: 'greet-ray' },
      { word: 'float', phonemes: ['fl','oa','t'],  image: '🛟',  creature: 'float-fish' },
    ],
    storyPrompt: {
      ocean: "Two vowels join forces! When they swim together, the first one leads the song.",
      frost: "Double vowel crystals! They merge and the first one shines bright.",
      hero: "Dynamic duo detected! Two vowels side by side — the first takes the lead!",
    },
    unlocks: {
      ocean: { name: 'Rainbow Whale', emoji: '🐋', description: 'The legendary whale who sings vowel team songs!' },
      frost:  { name: 'Starlight Unicorn', emoji: '🦄', description: 'A unicorn whose mane shows all vowel colors!' },
      hero:   { name: 'Titan Eagle',  emoji: '🦅', description: 'The ultimate eagle who rules the sky of sounds!' },
    },
  },
];

export function getLevelById(id) {
  return PHONICS_LEVELS.find(l => l.id === id) || PHONICS_LEVELS[0];
}

export function getNextLevel(currentId) {
  const idx = PHONICS_LEVELS.findIndex(l => l.id === currentId);
  return idx < PHONICS_LEVELS.length - 1 ? PHONICS_LEVELS[idx + 1] : null;
}

export function getWordsForLevel(levelId, count = 4) {
  const level = getLevelById(levelId);
  if (!level) return [];
  const shuffled = [...level.words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getPhonemeInfo(phoneme) {
  return PHONEME_MAP[phoneme] || { speech: phoneme, label: phoneme.toUpperCase(), type: 'unknown', emoji: '🔤' };
}

export function getLevelProgress(levelIndex) {
  return Math.round((levelIndex / PHONICS_LEVELS.length) * 100);
}
