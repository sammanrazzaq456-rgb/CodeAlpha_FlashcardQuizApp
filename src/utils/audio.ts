// Web Audio API procedural Lo-Fi Ambient Study Music Generator

export type AmbientSoundPreset = 'lofi_piano' | 'gentle_rain' | 'binaural_focus';

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;
  private currentPreset: AmbientSoundPreset = 'lofi_piano';
  private volume = 0.4;
  private listeners: ((playing: boolean) => void)[] = [];

  private chordIndex = 0;
  // Frequencies for relaxing Lo-Fi 7th & 9th chords
  private readonly chordProgressions: number[][] = [
    // Dm9: D3, F3, A3, C4, E4
    [146.83, 174.61, 220.0, 261.63, 329.63],
    // G13: G2, F3, B3, E4
    [98.0, 174.61, 246.94, 329.63],
    // Cmaj9: C3, E3, G3, B3, D4
    [130.81, 164.81, 196.0, 246.94, 293.66],
    // Am9: A2, G3, C4, E4, B4
    [110.0, 196.0, 261.63, 329.63, 493.88],
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying));
  }

  public toggle(preset?: AmbientSoundPreset): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      if (preset) this.currentPreset = preset;
      this.start();
      return true;
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.notify();

    // Smoothly ramp volume in
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);

    // Start background texture (vinyl crackle / rain murmur)
    this.startBackgroundTexture();

    // Start chord or tone sequence
    this.chordIndex = 0;
    this.scheduleNextPhrase();
  }

  public stop() {
    if (!this.isPlaying) return;
    if (this.ctx && this.masterGain) {
      // Smooth fade out
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
    }

    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    setTimeout(() => {
      this.stopBackgroundTexture();
      this.isPlaying = false;
      this.notify();
    }, 600);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && this.isPlaying) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setPreset(preset: AmbientSoundPreset) {
    this.currentPreset = preset;
    if (this.isPlaying) {
      this.stop();
      setTimeout(() => this.start(), 300);
    }
  }

  public getPreset(): AmbientSoundPreset {
    return this.currentPreset;
  }

  private startBackgroundTexture() {
    if (!this.ctx || !this.masterGain) return;

    // Generate subtle vinyl / atmospheric noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink/brownian soft noise with gentle crackles
      const crackle = Math.random() < 0.001 ? (Math.random() - 0.5) * 0.4 : 0;
      output[i] = (Math.random() * 2 - 1) * 0.04 + crackle;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter to keep it mellow & vintage
    const filter = this.ctx.createBiquadFilter();
    filter.type = this.currentPreset === 'gentle_rain' ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(this.currentPreset === 'gentle_rain' ? 1200 : 800, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(
      this.currentPreset === 'gentle_rain' ? 0.15 : 0.04,
      this.ctx.currentTime
    );

    whiteNoise.connect(filter);
    filter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  private stopBackgroundTexture() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
    if (this.noiseGain) {
      this.noiseGain.disconnect();
      this.noiseGain = null;
    }
  }

  private scheduleNextPhrase() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    if (this.currentPreset === 'lofi_piano') {
      const chord = this.chordProgressions[this.chordIndex];
      this.playLofiChord(chord);
      this.chordIndex = (this.chordIndex + 1) % this.chordProgressions.length;
      this.timerId = window.setTimeout(() => this.scheduleNextPhrase(), 3600);
    } else if (this.currentPreset === 'binaural_focus') {
      this.playBinauralTone();
      this.timerId = window.setTimeout(() => this.scheduleNextPhrase(), 6000);
    } else {
      // gentle_rain preset relies on textured rain buffer + sporadic soft rain chime
      this.playRainChime();
      this.timerId = window.setTimeout(() => this.scheduleNextPhrase(), 4000);
    }
  }

  private playLofiChord(frequencies: number[]) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    frequencies.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm rhodes-like timbre: mix triangle + sine
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(freq * 0.5, now);

      // Warm lowpass filter to produce cozy lo-fi bedroom feel
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 2.8);

      // Stagger chord notes slightly for organic humanized strum
      const noteOffset = i * 0.04;
      const startTime = now + noteOffset;

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.09, startTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.2);

      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(startTime);
      oscSub.start(startTime);
      osc.stop(startTime + 3.3);
      oscSub.stop(startTime + 3.3);
    });
  }

  private playBinauralTone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 432 Hz focus tone with 4 Hz alpha wave beat (432Hz left, 436Hz right)
    const baseFreq = 432;
    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(baseFreq, now);

    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(baseFreq + 4, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 1.5);
    gain.gain.linearRampToValueAtTime(0.001, now + 5.5);

    leftOsc.connect(gain);
    rightOsc.connect(gain);
    gain.connect(this.masterGain);

    leftOsc.start(now);
    rightOsc.start(now);
    leftOsc.stop(now + 5.8);
    rightOsc.stop(now + 5.8);
  }

  private playRainChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const chimeFreqs = [523.25, 659.25, 783.99, 1046.5];
    const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.6);
  }
}

export const ambientAudio = new AmbientAudioManager();
