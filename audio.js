/**
 * Web Audio API Synthesizer for Praise's 3D Love Game
 * Provides procedural romantic background music and sound effects.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentStep = 0;
  }

  // Initialize Web Audio Context on first user click/tap
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  // Toggle Background Music
  toggleMusic() {
    if (this.isPlayingMusic) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isPlayingMusic;
  }

  // Start Looping Romantic Synth Music
  startMusic() {
    this.init();
    if (this.isPlayingMusic || !this.ctx) return;
    this.isPlayingMusic = true;

    // Chord Progression (Frequencies in Hz)
    // Cmaj7 -> Am7 -> Fmaj7 -> G7 (Dreamy Romance)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [196.00, 246.94, 293.66, 349.23]  // G7    (G3, B3, D4, F4)
    ];

    const playChordStep = () => {
      if (!this.isPlayingMusic || this.isMuted || !this.ctx) return;

      try {
        const currentChord = chords[this.currentStep % chords.length];
        const now = this.ctx.currentTime;

        // Play pad notes for the chord
        currentChord.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = index === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          // Soft envelope
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 3.0);
        });

        // Play high melody note (arpeggiated chime)
        const melodyFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
        this.playChimeNote(melodyFreq, now + 0.4, 0.03);
      } catch (err) {
        console.warn("Audio step error:", err);
      }

      this.currentStep++;
      this.musicTimer = setTimeout(playChordStep, 2600);
    };

    playChordStep();
  }

  // Stop Background Music
  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Play a single soft chime note
  playChimeNote(freq, startTime, volume = 0.05) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    } catch (e) {}
  }

  // Jump Sound Effect (Upward Sweep Chime)
  playJumpSFX() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  // Heart Collection Sound Effect (Sparkling Arpeggio)
  playHeartCollectSFX() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

      notes.forEach((freq, index) => {
        this.playChimeNote(freq, now + index * 0.08, 0.08);
      });
    } catch (e) {}
  }

  // Button Click Sound
  playClickSFX() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Victory / Proposal Celebration Fanfare
  playVictoryFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const fanfareNotes = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.15 },
        { freq: 783.99, time: 0.30 },
        { freq: 1046.50, time: 0.45 },
        { freq: 1318.51, time: 0.70 }
      ];

      fanfareNotes.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        const duration = note.time === 0.70 ? 1.5 : 0.25;
        gain.gain.setValueAtTime(0.12, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + duration);
      });
    } catch (e) {}
  }
}

// Export to global window scope so it works without module restrictions
window.soundEngine = new SoundEngine();
