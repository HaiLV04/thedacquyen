/**
 * AUDIO.JS - Bộ phát âm thanh chuyên nghiệp cho lớp học
 * Hỗ trợ các file MP3 trong thư mục assets/audio/ kết hợp Web Audio API dự phòng
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;

    // Đường dẫn các file âm thanh trong assets/audio/
    // (Cô giáo hoặc bạn có thể thay thế các file mp3 này trong thư mục assets/audio/)
    this.audioPaths = {
      click: 'assets/audio/click.mp3',
      fanfare: 'assets/audio/fanfare.mp3',
      applause: 'assets/audio/applause.mp3',
      pop: 'assets/audio/pop.mp3',
      bell: 'assets/audio/bell.mp3'
    };

    this.audioPool = {};
    this.initAudioElements();
  }

  initAudioElements() {
    Object.entries(this.audioPaths).forEach(([key, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.audioPool[key] = audio;
      } catch (e) {
        console.warn('Không thể nạp audio:', key, e);
      }
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setSoundEnabled(val) {
    this.enabled = !!val;
  }

  playAudioFile(key, volume = 1.0) {
    if (!this.enabled) return false;
    const baseAudio = this.audioPool[key];
    if (baseAudio) {
      try {
        const soundClone = baseAudio.cloneNode();
        soundClone.volume = Math.max(0, Math.min(1, volume));
        const playPromise = soundClone.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Trình duyệt chặn autoplay thì fallback sang synth
          });
        }
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.playAudioFile('click', 0.85)) {
      this.synthClick();
    }
  }

  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.playAudioFile('pop', 0.45)) {
      this.synthHover();
    }
  }

  playTick() {
    if (!this.enabled) return;
    this.init();
    // Vòng quay xoay: dùng synth tick triangle chuẩn xác nhịp điệu
    this.synthTick();
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();

    // 1. Kèn chiến thắng tưng bừng từ fanfare.mp3
    this.playAudioFile('fanfare', 1.0);

    // 2. Tiếng vỗ tay hoan hô rộn rã của cả lớp từ applause.mp3 sau 380ms
    setTimeout(() => {
      this.playAudioFile('applause', 0.85);
    }, 380);

    // 3. Chuông ngân vang may mắn từ bell.mp3 sau 850ms
    setTimeout(() => {
      this.playAudioFile('bell', 0.6);
    }, 850);

    // 4. Synth lấp lánh dự phòng
    this.synthFanfare();
  }

  // --- BỘ TỔNG HỢP ÂM THANH DỰ PHÒNG (SYNTHESIZER) ---
  synthHover() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  synthClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  synthTick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.035);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  synthFanfare() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.12;

      osc.type = idx === 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.15);
    });
  }
}

window.SoundEngine = SoundEngine;
window.sound = new SoundEngine();
