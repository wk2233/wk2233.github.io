// Mobile-only touch flight. Keyboard / mouse / gamepad are off.
// Right stick: bank (X) + throttle (Y). Does NOT change pitch attitude.
//   centre  -> brake (Space)
//   light forward -> cruise
//   far forward  -> boost (gust)
// Left buttons: Climb / Dive (W / S) — only these change pitch.
const DOUBLE_TAP = 320;

const isTouchDevice = () =>
  (typeof window !== 'undefined') &&
  (('ontouchstart' in window) || (navigator.maxTouchPoints | 0) > 0);

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const curve = (v, exp = 1.55) => Math.sign(v) * Math.pow(Math.abs(v), exp);

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.turn = 0;
    this.pitch = 0;
    this.boost = false;
    this.brake = false;
    this.invert = false;
    this.locked = false;
    this.enabled = false;
    this.pressed = new Set();
    this.touchUI = true;
    this.touchStick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
    this.touchClimb = false;
    this.touchDive = false;
    this._touchRoot = null;
    this._tap = -1e9;
    this._wasBrake = true;
    this._smTurn = 0;
    this._smPitch = 0;

    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        e.preventDefault();
      }
    }, { capture: true });
    window.addEventListener('contextmenu', (e) => { if (this.enabled) e.preventDefault(); });
    canvas.addEventListener('click', () => {
      if (document.pointerLockElement) document.exitPointerLock?.();
    });

    this._bindTouchUI();
  }

  _bindTouchUI() {
    const root = document.getElementById('touch');
    const base = document.getElementById('touchStick');
    const knob = document.getElementById('touchKnob');
    const climbBtn = document.getElementById('touchClimb');
    const diveBtn = document.getElementById('touchDive');
    if (!root || !base || !knob || !climbBtn || !diveBtn) return;

    root.hidden = true;
    this._touchRoot = root;

    const radius = () => Math.max(36, (base.getBoundingClientRect().width || 140) * 0.5);

    const setKnob = (dx, dy) => {
      const r = radius();
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, r / len);
      const x = dx * k, y = dy * k;
      knob.style.transform = `translate(${x}px, ${y}px)`;
      this.touchStick.x = x / r;
      this.touchStick.y = y / r;
    };
    const resetKnob = () => {
      this.touchStick.active = false;
      this.touchStick.id = null;
      this.touchStick.x = 0;
      this.touchStick.y = 0;
      knob.style.transform = 'translate(0px, 0px)';
      base.classList.remove('active');
      this._tapBrake(performance.now());
    };

    const pointerId = (t) => (t.identifier != null ? t.identifier : (t.pointerId != null ? t.pointerId : 'mouse'));

    const onStickStart = (e) => {
      if (!this.enabled) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      this.touchStick.active = true;
      this.touchStick.id = pointerId(t);
      this.touchStick.ox = t.clientX;
      this.touchStick.oy = t.clientY;
      base.classList.add('active');
      setKnob(0, 0);
    };
    const onStickMove = (e) => {
      if (!this.touchStick.active) return;
      const touches = e.changedTouches || [e];
      for (const t of touches) {
        if (pointerId(t) !== this.touchStick.id) continue;
        e.preventDefault();
        setKnob(t.clientX - this.touchStick.ox, t.clientY - this.touchStick.oy);
        break;
      }
    };
    const onStickEnd = (e) => {
      if (!this.touchStick.active) return;
      const touches = e.changedTouches || [e];
      for (const t of touches) {
        if (pointerId(t) !== this.touchStick.id) continue;
        resetKnob();
        break;
      }
    };

    base.addEventListener('touchstart', onStickStart, { passive: false });
    window.addEventListener('touchmove', onStickMove, { passive: false });
    window.addEventListener('touchend', onStickEnd, { passive: false });
    window.addEventListener('touchcancel', onStickEnd, { passive: false });
    base.addEventListener('mousedown', onStickStart);
    window.addEventListener('mousemove', onStickMove);
    window.addEventListener('mouseup', onStickEnd);

    const bindHold = (el, on, off) => {
      const down = (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        e.stopPropagation();
        on();
        el.classList.add('active');
      };
      const up = (e) => {
        e.preventDefault();
        e.stopPropagation();
        off();
        el.classList.remove('active');
      };
      el.addEventListener('touchstart', down, { passive: false });
      el.addEventListener('touchend', up, { passive: false });
      el.addEventListener('touchcancel', up, { passive: false });
      el.addEventListener('mousedown', down);
      el.addEventListener('mouseup', up);
      el.addEventListener('mouseleave', up);
    };

    bindHold(
      climbBtn,
      () => { this.touchClimb = true; },
      () => { this.touchClimb = false; },
    );
    bindHold(
      diveBtn,
      () => { this.touchDive = true; },
      () => { this.touchDive = false; },
    );
  }

  setTouchVisible(on) {
    if (!this._touchRoot) this._touchRoot = document.getElementById('touch');
    if (!this._touchRoot) return;
    this._touchRoot.hidden = !on;
  }

  _tapBrake(t) {
    if (t - this._tap < DOUBLE_TAP) { this.pressed.add('Space2'); this._tap = -1e9; }
    else this._tap = t;
    this.pressed.add('Space');
  }

  take(code) {
    if (this.pressed.has(code)) { this.pressed.delete(code); return true; }
    return false;
  }

  update(dt) {
    let turn = 0, pitch = 0, boost = false, brake = false;

    // Pitch only from Climb / Dive buttons (soft, not twitchy)
    const pitchGain = 0.42;
    if (this.touchClimb) pitch += pitchGain;
    if (this.touchDive) pitch -= pitchGain;
    if (this.invert) pitch = -pitch;

    if (!this.touchStick.active) {
      brake = true;
    } else {
      const sx = this.touchStick.x;
      const sy = this.touchStick.y; // +down on screen, -up (forward)
      const mag = Math.hypot(sx, sy);
      const forward = clamp(-sy, 0, 1);

      if (mag < 0.16) {
        brake = true;
        turn = 0;
      } else {
        // Stick steers heading only — never changes climb/dive attitude
        turn = curve(sx) * 0.48;

        if (forward >= 0.70 && mag >= 0.62) boost = true;
        else boost = false;
        brake = false;
      }
    }

    if (brake && !this._wasBrake) this._tapBrake(performance.now());
    this._wasBrake = brake;

    const k = 1 - Math.exp(-(brake ? 10 : 7) * dt);
    this._smTurn += (turn - this._smTurn) * k;
    this._smPitch += (pitch - this._smPitch) * k;

    this.turn = clamp(this._smTurn, -1, 1);
    this.pitch = clamp(this._smPitch, -1, 1);
    this.boost = boost;
    this.brake = brake;

    if (!this.enabled) {
      this.turn = 0;
      this.pitch = 0;
      this.boost = false;
      this.brake = false;
      this.touchClimb = false;
      this.touchDive = false;
      this._smTurn = 0;
      this._smPitch = 0;
    }
  }
}

export { isTouchDevice };
