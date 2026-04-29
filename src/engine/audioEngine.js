// Audio Engine
// Plays pre-recorded WAV files generated from macOS Daniel voice
// using correct ARPAbet phoneme codes — real isolated human sounds.
// Web Audio synthesis is used only as a silent fallback.

const cache = {};
let loadPromise = null;

const PHONEME_FILES = [
  'a','e','i','o','u',
  's','t','p','n','m','d','g','k','c','h','b','f','l','r','j','v','w','x','y','z',
  'sh','ch','th','wh',
  'a_e','i_e','o_e','u_e',
  'ai','ay','ee','ea','oa','oo',
  'bl','cl','fl','gl','pl','sl','st','sp','sk','sn','sw',
  'tr','br','cr','gr','dr','fr','pr',
];

export function loadPhonemeAudio() {
  if (loadPromise) return loadPromise;
  loadPromise = Promise.all(
    PHONEME_FILES.map(ph => new Promise(resolve => {
      const audio = new Audio(`/sounds/phonemes/${ph}.wav`);
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => {
        cache[ph] = audio;
        resolve();
      }, { once: true });
      audio.addEventListener('error', resolve, { once: true });
      audio.load();
    }))
  );
  return loadPromise;
}

export function playPhoneme(phoneme) {
  const audio = cache[phoneme];
  if (!audio) return false;
  // Clone so rapid repeats don't cut each other off
  const clone = audio.cloneNode();
  clone.play().catch(() => {});
  return true;
}

export function isPhonemeLoaded(phoneme) {
  return !!cache[phoneme];
}
