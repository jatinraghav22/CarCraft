// Web Audio API Supercar Engine Rev Simulator
let audioCtx = null;

export function playEngineRevSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // 1. Primary Low-Frequency Rumble (Cylinder firing)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();

    osc1.type = 'sawtooth';
    // Idle 65Hz -> rev to 260Hz -> settle
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.45);
    osc1.frequency.exponentialRampToValueAtTime(380, now + 0.7);
    osc1.frequency.exponentialRampToValueAtTime(95, now + 1.6);
    osc1.frequency.exponentialRampToValueAtTime(65, now + 2.1);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.1);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.5);
    gain1.gain.linearRampToValueAtTime(0.001, now + 2.2);

    // 2. Harmonic Whine (Twin Turbos spooling)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(240, now);
    osc2.frequency.exponentialRampToValueAtTime(1450, now + 0.65);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 1.5);
    osc2.frequency.exponentialRampToValueAtTime(240, now + 2.1);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain2.gain.linearRampToValueAtTime(0.001, now + 1.9);

    // 3. Distortion / Filter for Throttle Body Exhaust Tone
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(2800, now + 0.55);
    filter.frequency.linearRampToValueAtTime(500, now + 2.0);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    filter.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 2.3);
    osc2.stop(now + 2.3);
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
}
