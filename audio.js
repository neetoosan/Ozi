/**
 * Web Audio API Synthesizer for Praise's 3D Love Game
 * Provides dynamic mood-based romantic background music and sound effects.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentStep = 0;
    this.currentMood = 'romantic';
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

  // Set Mood
  setMood(mood) {
    this.currentMood = mood;
    if (this.isPlayingMusic) {
      this.stopMusic();
      this.startMusic();
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

  // Start Looping Romantic Synth Music based on Emotion Mood
  startMusic() {
    this.init();
    if (this.isPlayingMusic || !this.ctx) return;
    this.isPlayingMusic = true;

    // Mood-specific Chord Progressions (Hz)
    const moodChords = {
      // 💖 Romantic: Cmaj7 -> Am7 -> Fmaj7 -> G7
      romantic: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ],
      // 🌸 Comfort / Stressed: Fmaj7 -> Em7 -> Dm7 -> Cmaj7 (Warm lullaby)
      comfort: [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [164.81, 196.00, 246.94, 293.66], // Em7
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [130.81, 164.81, 196.00, 246.94]  // Cmaj7
      ],
      // 🌟 Joyful: Gmaj7 -> Cmaj7 -> D7 -> Gmaj7 (Bright & uplifting)
      joyful: [
        [196.00, 246.94, 293.66, 369.99], // Gmaj7
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [146.83, 220.00, 293.66, 369.99], // D7
        [196.00, 246.94, 293.66, 493.88]  // Gmaj7
      ],
      // 😜 Playful: Am -> Dm -> E7 -> Am (Bouncy upbeat)
      playful: [
        [220.00, 261.63, 329.63, 440.00], // Am
        [146.83, 220.00, 261.63, 349.23], // Dm
        [164.81, 207.65, 246.94, 329.63], // E7
        [220.00, 277.18, 329.63, 440.00]  // A
      ]
    };

    const playChordStep = () => {
      if (!this.isPlayingMusic || this.isMuted || !this.ctx) return;

      try {
        const chords = moodChords[this.currentMood] || moodChords.romantic;
        const currentChord = chords[this.currentStep % chords.length];
        const now = this.ctx.currentTime;

        // Sound characteristics per mood
        const isComfort = this.currentMood === 'comfort';
        const isJoyful = this.currentMood === 'joyful';
        const isPlayful = this.currentMood === 'playful';

        currentChord.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = isComfort ? 'sine' : (isPlayful && index > 1 ? 'triangle' : (index === 0 ? 'sine' : 'triangle'));
          osc.frequency.setValueAtTime(freq, now);

          const peakVol = isComfort ? 0.04 : (isJoyful ? 0.06 : 0.05);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(peakVol, now + (isComfort ? 1.0 : 0.6));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isComfort ? 3.2 : 2.6));

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 3.4);
        });

        // Arpeggiated melody note
        const melodyMultiplier = isJoyful ? 2.5 : 2;
        const melodyFreq = currentChord[Math.floor(Math.random() * currentChord.length)] * melodyMultiplier;
        this.playChimeNote(melodyFreq, now + 0.35, isComfort ? 0.02 : 0.035);

        if (isPlayful) {
          const secondFreq = currentChord[(this.currentStep + 1) % currentChord.length] * 2;
          this.playChimeNote(secondFreq, now + 0.8, 0.025);
        }
      } catch (err) {
        console.warn("Audio step error:", err);
      }

      this.currentStep++;
      const stepDuration = this.currentMood === 'comfort' ? 3000 : (this.currentMood === 'playful' ? 2200 : 2600);
      this.musicTimer = setTimeout(playChordStep, stepDuration);
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

// Export to global window scope
window.soundEngine = new SoundEngine();
