import { useCallback, useRef, useEffect } from 'react';
import { loadPhonemeAudio, playPhoneme as playPhonemeAudio } from '../engine/audioEngine.js';

// Pick the best British English voice for full-word / instruction TTS.
function getBritishVoice() {
  const voices = window.speechSynthesis.getVoices();
  const gb = voices.filter(v => v.lang.startsWith('en-GB'));
  const daniel = gb.find(v => v.name.toLowerCase().includes('daniel'));
  if (daniel) return daniel;
  const kate = gb.find(v => v.name.toLowerCase().includes('kate'));
  if (kate) return kate;
  if (gb.length > 0) return gb[0];
  return voices.find(v => v.lang.startsWith('en-AU')) || null;
}

export function useSpeech() {
  const synthRef = useRef(window.speechSynthesis);
  const voiceRef = useRef(null);

  // Load pre-recorded phoneme WAVs + resolve British voice in parallel
  useEffect(() => {
    loadPhonemeAudio();
    const load = () => { voiceRef.current = getBritishVoice(); };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  // TTS — used for full words and instructions only
  const speak = useCallback((text, { rate = 0.82, pitch = 1.05, volume = 1 } = {}) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.lang   = 'en-GB';
    u.rate   = rate;
    u.pitch  = pitch;
    u.volume = volume;
    synthRef.current.speak(u);
  }, []);

  // Phoneme — plays pre-recorded WAV file (real isolated sound, not TTS letter name)
  const speakPhoneme = useCallback((phoneme) => {
    playPhonemeAudio(phoneme); // audioEngine handles it; silent if file missing
  }, []);

  const speakWord = useCallback((word) => {
    speak(word, { rate: 0.88, pitch: 1.0 });
  }, [speak]);

  const speakBlend = useCallback(async (phonemes, word) => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    for (const p of phonemes) {
      speakPhoneme(p);
      await delay(700);
    }
    await delay(400);
    speakWord(word);
  }, [speakPhoneme, speakWord]);

  const speakSegmented = useCallback(async (phonemes) => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    for (const p of phonemes) {
      speakPhoneme(p);
      await delay(800);
    }
  }, [speakPhoneme]);

  const speakInstruction = useCallback((text) => {
    speak(text, { rate: 0.88, pitch: 1.1 });
  }, [speak]);

  const cancel = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  return { speak, speakPhoneme, speakWord, speakBlend, speakSegmented, speakInstruction, cancel };
}
