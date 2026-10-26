/**
 * Web Audio API synthesizer for cheerful kids background music and sound effects.
 * Also wraps Web Speech API for clean text-to-speech pronunciation.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private step = 0;
  private isMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.18; // gentle, non-intrusive
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects ---

  public playPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public playClownHonk() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Two quick funny squeaks
      [0, 0.13].forEach((delay) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now + delay);
        osc.frequency.exponentialRampToValueAtTime(780, now + delay + 0.08);

        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + delay);
        osc.stop(now + delay + 0.1);
      });
    } catch {
      // Ignored
    }
  }

  public playSuccess() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // Ignored
    }
  }

  public playCheer() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Fanfare chord sequence
      const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 739.99, 880.00], // D
        [659.25, 830.61, 987.77], // E
        [1046.5, 1318.5, 1567.98] // C high
      ];

      chords.forEach((chord, i) => {
        const chordTime = now + i * 0.14;
        chord.forEach((freq) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordTime);

          gain.gain.setValueAtTime(0.18, chordTime);
          gain.gain.exponentialRampToValueAtTime(0.01, chordTime + 0.35);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(chordTime);
          osc.stop(chordTime + 0.36);
        });
      });
    } catch {
      // Ignored
    }
  }

  public playWhoosh() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignored
    }
  }

  // --- Cheerful Background Music Loop ---
  // A gentle, whimsical nursery melody with marimba/music-box tones
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.step = 0;
    this.scheduleNextBgmBeat();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private scheduleNextBgmBeat() {
    if (!this.isBgmPlaying) return;

    // Happy 16-step nursery melody in C Major:
    // C4, E4, G4, A4, G4, E4, C4, D4, E4, G4, A4, C5, B4, G4, E4, D4
    const melody = [
      261.63, 329.63, 392.00, 440.00,
      392.00, 329.63, 261.63, 293.66,
      329.63, 392.00, 440.00, 523.25,
      493.88, 392.00, 329.63, 293.66
    ];

    const bass = [
      130.81, null, 196.00, null,
      130.81, null, 174.61, null,
      130.81, null, 196.00, null,
      174.61, null, 196.00, null
    ];

    const freq = melody[this.step % melody.length];
    const bassFreq = bass[this.step % bass.length];

    if (this.ctx && this.bgmGain && !this.isMuted) {
      const now = this.ctx.currentTime;

      // Play soft marimba tone
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.12, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 0.23);

      // Play gentle bass note
      if (bassFreq) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.08, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }
    }

    this.step++;
    const beatInterval = 280; // ~107 BPM, playful and relaxed
    this.bgmTimer = window.setTimeout(() => this.scheduleNextBgmBeat(), beatInterval);
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.18, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying;
  }

  // --- Text to Speech (Kids Friendly English Pronunciation) ---
  public speak(text: string, rate: number = 0.85, pitch: number = 1.15): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop prior audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // slightly slower for young learners
      utterance.pitch = pitch; // friendly, slightly higher voice

      // Try finding a nice English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen') || v.name.includes('US'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const audioManager = new AudioManager();
