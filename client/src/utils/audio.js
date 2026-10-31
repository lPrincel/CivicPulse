/**
 * Web Audio API Synthesizer
 * Zero external audio assets, works 100% offline and cross-browser!
 */

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Celebratory major chord chime for resolved tickets & success actions
 */
export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.08);

      gain.gain.setValueAtTime(0, startTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, startTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + index * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.08);
      osc.stop(startTime + index * 0.08 + 0.65);
    });
  } catch (e) {
    console.debug('Audio playback note:', e);
  }
};

/**
 * Emergency alert pulse sound
 */
export const playEmergencyTone = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, startTime);
    osc.frequency.linearRampToValueAtTime(880, startTime + 0.15);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  } catch (e) {
    console.debug('Audio error:', e);
  }
};
