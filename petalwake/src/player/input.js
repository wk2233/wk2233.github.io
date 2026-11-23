// Mobile-only input: on-screen stick + boost/brake. Keyboard / mouse / gamepad are off.
// Brake doubles as land: two taps inside DOUBLE_TAP ms posts 'Space2' (see game/index.js).
const DOUBLE_TAP = 300;

const isTouchDevice = () =>
  (typeof window !== 'undefined') &&
  (('ontouchstart' in window) || (navigator.maxTouchPoints | 0) > 0);

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.turn = 0;     // -1 left .. +1 right
    this.pitch = 0;    // -1 dive .. +1 climb
    this.boost = false;
    this.brake = false;
    this.invert = false;
    this.locked = false;
    this.enabled = false;
    this.pressed = new Set();
    this.touchUI = true; // always on-screen controls
    this.touchStick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
    this.touchBoost = false;
    this.touchBrake = false;
    this._touchRoot = null;
    this._tap = -1e9;

    // block browser scrolling / context menu while playing; no flight keys
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        e.preventDefault();
      }
    }, { capture: true });
    window.addEventListener('contextmenu', (e) => { if (this.enabled) e.preventDefault(); });
    // never pointer-lock the canvas
    canvas.addEventListener('click', (e) => {
      if (document.pointerLockElement) document.exitPointerLock?.();
    });

    this._bindTouchUI();
  }

  _bindTouchUI() {
    const root = document.getElementById('touch');
    const base = document.getElementById('touchStick');
    const knob = document.getElementById('touchKnob');
    const boost = document.getElementById('touchBoost');
    const brake = document.getElementById('touchBrake');
    if (!root || !base || !knob) return;

    root.hidden = true;
    this._touchRoot = root;

    const radius = () => Math.max(28, (base.getBoundingClientRect().width || 120) * 0.5);

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

    const bindBtn = (el, setDown, onTap) => {
      if (!el) return;
      const down = (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        e.stopPropagation();
        setDown(true);
        el.classList.add('active');
        onTap?.(e.timeStamp || performance.now());
      };
      const up = (e) => {
        e.preventDefault();
        setDown(false);
        el.classList.remove('active');
      };
      el.addEventListener('touchstart', down, { passive: false });
      el.addEventListener('touchend', up, { passive: false });
      el.addEventListener('touchcancel', up, { passive: false });
      el.addEventListener('mousedown', down);
      window.addEventListener('mouseup', up);
    };

    bindBtn(boost, (v) => { this.touchBoost = v; });
    bindBtn(brake, (v) => { this.touchBrake = v; }, (t) => {
      this.pressed.add('Space');
      this._tapBrake(t);
    });
  }

  setTouchVisible(on) {
    if (!this._touchRoot) this._touchRoot = document.getElementById('touch');
    if (!this._touchRoot) return;
    this._touchRoot.hidden = !on;
  }

  _tapBrake(t) {
    if (t - this._tap < DOUBLE_TAP) { this.pressed.add('Space2'); this._tap = -1e9; } else this._tap = t;
  }

  take(code) {
    if (this.pressed.has(code)) { this.pressed.delete(code); return true; }
    return false;
  }

  update(dt) {
    let x = 0, y = 0;
    if (this.touchStick.active) {
      x = this.touchStick.x;
      y = -this.touchStick.y; // up on pad = climb
    }
    if (this.invert) y = -y;
    this.turn = Math.max(-1, Math.min(1, x));
    this.pitch = Math.max(-1, Math.min(1, y));
    this.boost = !!this.touchBoost;
    this.brake = !!this.touchBrake;
    if (!this.enabled) {
      this.turn = 0;
      this.pitch = 0;
      this.boost = false;
      this.brake = false;
    }
  }
}

export { isTouchDevice };
