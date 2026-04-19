// monk-particles.jsx — particle systems for the reel
// Falling leaves, sparkles, "caging" bars, confetti, breath rings.

// A pool of leaves drifting down. Driven by `time` (seconds).
function FallingLeaves({ width, height, time, count = 14, intensity = 1 }) {
  const seed = (i) => {
    // deterministic per-leaf params
    const r = Math.sin(i * 12.9898) * 43758.5453;
    return r - Math.floor(r);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => {
        const xBase = seed(i) * width;
        const fallSpeed = 30 + seed(i + 100) * 25;
        const swayAmp = 20 + seed(i + 200) * 30;
        const swayFreq = 0.6 + seed(i + 300) * 0.6;
        const startOffset = seed(i + 400) * height;
        const y = ((time * fallSpeed + startOffset) % (height + 100)) - 50;
        const x = xBase + Math.sin(time * swayFreq + i) * swayAmp;
        const rot = time * 80 + i * 30;
        const size = 12 + seed(i + 500) * 8;
        const palette = ['#7BC474', '#A8D89E', '#5BA751', '#9BCC91', '#FFD24A', '#E8B23A'];
        const color = palette[i % palette.length];
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y,
            width: size, height: size * 0.7,
            background: color,
            borderRadius: '0 100% 0 100%',
            transform: `rotate(${rot}deg)`,
            opacity: 0.7 * intensity,
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
          }} />
        );
      })}
    </div>
  );
}

function Sparkles({ width, height, time, count = 10, cx, cy, radius = 80 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const phase = (time + i * 0.4) % 1.6;
        const angle = (i / count) * Math.PI * 2 + time * 0.5;
        const r = radius * (0.5 + phase / 1.6);
        const x = (cx ?? width/2) + Math.cos(angle) * r;
        const y = (cy ?? height/2) + Math.sin(angle) * r;
        const opacity = phase < 0.2 ? phase / 0.2 : phase > 1.2 ? (1.6 - phase) / 0.4 : 1;
        const scale = 0.4 + opacity * 0.8;
        return (
          <div key={i} style={{
            position: 'absolute', left: x - 8, top: y - 8,
            width: 16, height: 16, opacity,
            transform: `scale(${scale}) rotate(${time * 180 + i * 45}deg)`,
            color: '#FFD24A', fontSize: 14,
          }}>✦</div>
        );
      })}
    </div>
  );
}

function Confetti({ width, height, time, count = 40, burst = 0 }) {
  // burst: 0..1, where the explosion originates (top of screen)
  const seed = (i) => {
    const r = Math.sin(i * 7.123) * 43758.5453;
    return r - Math.floor(r);
  };
  const colors = ['#FFD24A', '#FF7A1A', '#3DA837', '#7BC474', '#FF4A8E', '#4AB1E3'];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => {
        const t = burst; // 0..1 progression
        const angle = (seed(i) - 0.5) * Math.PI * 1.4;
        const speed = 200 + seed(i + 99) * 250;
        const x0 = width / 2;
        const y0 = height * 0.35;
        const gravity = 600;
        const vx = Math.sin(angle) * speed;
        const vy = -Math.cos(angle) * speed * (0.6 + seed(i + 7) * 0.4);
        const x = x0 + vx * t;
        const y = y0 + vy * t + 0.5 * gravity * t * t;
        const rot = (time * 360 + i * 50);
        const size = 8 + seed(i + 50) * 6;
        const color = colors[i % colors.length];
        const opacity = t < 0.05 ? t / 0.05 : t > 0.85 ? Math.max(0, (1 - t) / 0.15) : 1;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: size, height: size * 0.6,
            background: color, transform: `rotate(${rot}deg)`,
            opacity, borderRadius: 2,
          }} />
        );
      })}
    </div>
  );
}

// Cage bars dropping down to "trap" apps
function CageBars({ width, height, progress = 0, color = '#1B3A19' }) {
  // progress 0..1 → bars descend from top
  const bars = 6;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: bars }).map((_, i) => {
        const x = (i + 0.5) * (width / bars);
        const dropProgress = clamp((progress - i * 0.05) / 0.5, 0, 1);
        const eased = Easing.easeOutBack(dropProgress);
        const barH = height * eased;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x - 4, top: 0, width: 8, height: barH,
            background: `linear-gradient(180deg, ${color}, #2C5C2A)`,
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          }}>
            {/* nub at the bottom */}
            <div style={{
              position: 'absolute', bottom: -3, left: -2, width: 12, height: 6,
              background: color, borderRadius: 3,
            }}/>
          </div>
        );
      })}
      {/* horizontal cross-beam at top */}
      {progress > 0.05 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 8,
          background: color,
        }}/>
      )}
    </div>
  );
}

// Pulsing breath rings around the timer circle
function BreathRings({ cx, cy, time, color = MONK.green }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[0, 1, 2].map(i => {
        const phase = ((time + i * 1.2) % 3.6) / 3.6;
        const r = 60 + phase * 80;
        const opacity = (1 - phase) * 0.6;
        return (
          <div key={i} style={{
            position: 'absolute', left: cx - r, top: cy - r,
            width: r * 2, height: r * 2, borderRadius: '50%',
            border: `2px solid ${color}`, opacity,
          }}/>
        );
      })}
    </div>
  );
}

// "Pop-in" emoji burst at a point
function EmojiBurst({ x, y, emoji, progress }) {
  // progress: 0..1
  if (progress <= 0 || progress >= 1) return null;
  const scale = Easing.easeOutBack(Math.min(progress * 2.5, 1));
  const fade = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;
  const ty = -progress * 30;
  return (
    <div style={{
      position: 'absolute', left: x - 16, top: y - 16,
      fontSize: 28, transform: `translateY(${ty}px) scale(${scale})`,
      opacity: fade, pointerEvents: 'none',
    }}>{emoji}</div>
  );
}

Object.assign(window, { FallingLeaves, Sparkles, Confetti, CageBars, BreathRings, EmojiBurst });
