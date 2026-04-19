// monk-scenes-3.jsx — SCENE 6 · Dark Mode reveal
// Light home screen → tap moon button → expanding circular wipe to dark mode

const { MONK, FONT, MountainBG, PhoneShell, Pill, CircleBtn, GreenButton,
  TabBar, MonkCharacter, Card, PhoneScene,
  animate, clamp, Easing } = window;

// Hardcoded light/dark palettes (bypass the MONK proxy so we can render both
// side-by-side regardless of the global dark flag)
const LIGHT = {
  green: '#3DA837', greenDark: '#2C7E28', greenSoft: '#E8F5E5', greenSofter: '#F4FAF2',
  greenMid: '#7BC474', sky: '#CFE7F4', skyTop: '#DFF0F8',
  ink: '#1B3A19', inkSoft: '#3F5C3D', card: '#FFFFFF', border: '#D6EBD2',
  bg: '#DFF0F8', headerBg: 'rgba(255,255,255,0.7)', headerBorder: '#D6EBD2',
  pillBg: '#FFFFFF',
  tabBg: 'rgba(255,255,255,0.95)',
  tabShadow: '0 6px 20px rgba(0,0,0,0.08), 0 0 0 1.5px rgba(61,168,55,0.25)',
  tabGlow: 'none',
  mountainFar: '#B8DBA8', mountainMid: '#7BC474', mountainNear: '#3DA837',
  mountainFarOp: 0.55, mountainMidOp: 0.85,
};
const DARK = {
  green: '#4BC93F', greenDark: '#2C7E28', greenSoft: '#1F2A1E', greenSofter: '#16201A',
  greenMid: '#2E4A2B', sky: '#0B0B0B', skyTop: '#0A0A0A',
  ink: '#F2F5F1', inkSoft: '#A8B3A6', card: '#1A1F1A', border: '#2A332A',
  bg: '#0A0A0A', headerBg: 'rgba(10,10,10,0.75)', headerBorder: '#1F1F1F',
  pillBg: '#0F1A0E',
  tabBg: 'rgba(20,24,20,0.95)',
  tabShadow: '0 6px 20px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(75,201,63,0.35)',
  tabGlow: `0 0 16px rgba(75,201,63,0.55)`,
  mountainFar: '#1a2218', mountainMid: '#213021', mountainNear: '#2a3d28',
  mountainFarOp: 1, mountainMidOp: 1,
};

// Themed mountain BG for the standalone render (doesn't read the proxy)
function ThemedMountainBG({ P, width = 390, height = 780 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${P.skyTop} 0%, ${P.sky} 70%)`,
      overflow: 'hidden',
    }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        <path d={`M0 ${height*0.65} L${width*0.18} ${height*0.4} L${width*0.32} ${height*0.55} L${width*0.5} ${height*0.35} L${width*0.68} ${height*0.52} L${width*0.84} ${height*0.42} L${width} ${height*0.58} L${width} ${height} L0 ${height} Z`}
          fill={P.mountainFar} opacity={P.mountainFarOp} />
        <path d={`M0 ${height*0.78} L${width*0.12} ${height*0.55} L${width*0.28} ${height*0.7} L${width*0.42} ${height*0.5} L${width*0.58} ${height*0.65} L${width*0.74} ${height*0.48} L${width*0.88} ${height*0.62} L${width} ${height*0.55} L${width} ${height} L0 ${height} Z`}
          fill={P.mountainMid} opacity={P.mountainMidOp} />
        <path d={`M0 ${height*0.88} L${width*0.08} ${height*0.7} L${width*0.22} ${height*0.82} L${width*0.36} ${height*0.65} L${width*0.5} ${height*0.78} L${width*0.64} ${height*0.62} L${width*0.78} ${height*0.75} L${width*0.92} ${height*0.68} L${width} ${height*0.78} L${width} ${height} L0 ${height} Z`}
          fill={P.mountainNear} />
      </svg>
    </div>
  );
}

// Themed home screen — light OR dark based on passed palette
function ThemedHomeScreen({ P, isDark, breath, highlightMoon = false, moonPress = false }) {
  const heroIcon = isDark ? '☀️' : '🌙';
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 50, paddingTop: 56,
        padding: '56px 16px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: P.headerBg, backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${P.headerBorder}`,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999, background: P.pillBg,
          border: `1.5px solid ${P.green}`,
        }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontWeight: 800, color: P.greenDark, fontSize: 12, letterSpacing: 0.5 }}>3 STREAK</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 18, color: P.ink, letterSpacing: -0.5 }}>
          monk.mode
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: P.greenSoft,
            border: `2px solid ${P.green}`, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="assets/user-avatar.jpg" alt="" style={{ width: 34, height: 34, objectFit: 'cover',
              objectPosition: 'center 25%' }} />
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 999,
            background: isDark ? '#1F1F1F' : 'white',
            border: `1.5px solid ${isDark ? '#2A2A2A' : P.green}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><span style={{ fontSize: 14 }}>⚙️</span></div>
          {/* Moon / Sun button — the star of the scene */}
          <div
            data-moon-btn
            style={{
              width: 34, height: 34, borderRadius: 999,
              background: isDark ? '#1F2A1E' : P.greenSoft,
              border: `1.5px solid ${P.green}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: moonPress ? 'scale(0.85)' : (highlightMoon ? 'scale(1.15)' : 'scale(1)'),
              transition: 'transform 180ms cubic-bezier(.34,1.56,.64,1)',
              boxShadow: isDark
                ? `0 0 18px ${P.green}99`
                : (highlightMoon ? `0 0 0 6px ${P.green}44, 0 0 22px ${P.green}88` : 'none'),
            }}>
            <span style={{ fontSize: 14 }}>{heroIcon}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px', flex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <MonkCharacter state="cool" size={130} breath={breath} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 999,
            background: P.greenSoft, border: `1.5px solid ${P.green}`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: P.green }}/>
            <span style={{ color: P.greenDark, fontWeight: 800, fontSize: 13, fontFamily: FONT, whiteSpace: 'nowrap' }}>
              66% · Almost there
            </span>
          </div>
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div style={{ background: P.card, borderRadius: 18, padding: 12,
            border: `1.5px solid ${P.border}` }}>
            <div style={{ fontSize: 10, color: P.inkSoft, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: FONT }}>HABITS DONE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: P.greenDark, fontFamily: FONT }}>2</span>
              <span style={{ fontSize: 14, color: P.inkSoft, fontFamily: FONT }}>/ 3</span>
            </div>
            <div style={{ height: 4, background: P.greenSofter, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: P.green, width: '66%' }}/>
            </div>
          </div>
          <div style={{ background: P.card, borderRadius: 18, padding: 12,
            border: `1.5px solid ${P.border}` }}>
            <div style={{ fontSize: 10, color: P.inkSoft, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: FONT }}>DAY STREAK</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 22 }}>💪</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: P.greenDark, fontFamily: FONT }}>3</span>
              <span style={{ fontSize: 14, color: P.inkSoft, fontFamily: FONT }}>days</span>
            </div>
          </div>
        </div>

        {/* Action tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { e: '🌱', l: 'Log Habit' },
            { e: '🧘', l: 'Focus Timer' },
            { e: '🐵', l: 'Monk My Apps' },
          ].map((t, i) => (
            <div key={i} style={{ background: P.card, borderRadius: 18, padding: 12,
              border: `1.5px solid ${P.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{t.e}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: P.ink, fontFamily: FONT }}>{t.l}</div>
            </div>
          ))}
        </div>

        {/* Start session row */}
        <div style={{ background: P.card, borderRadius: 18, padding: 14,
          border: `1.5px solid ${P.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, color: P.ink, fontFamily: FONT, fontSize: 14 }}>Start a Monk Session</div>
            <div style={{ fontSize: 11, color: P.inkSoft, marginTop: 2, fontFamily: FONT }}>Block distracting apps & focus</div>
          </div>
          <div style={{ padding: '6px 14px', background: P.greenSofter, borderRadius: 999,
            color: P.greenDark, fontWeight: 800, fontSize: 12, fontFamily: FONT }}>Go →</div>
        </div>
      </div>

      {/* Themed tab bar */}
      <div style={{
        position: 'absolute', left: 8, right: 8, bottom: 14, zIndex: 60,
        background: P.tabBg, borderRadius: 28,
        padding: '8px 4px', display: 'flex', justifyContent: 'space-between',
        boxShadow: P.tabShadow, backdropFilter: 'blur(10px)',
      }}>
        {[
          { id: 'home', label: 'Home', img: 'assets/monk-relieved.png' },
          { id: 'habits', label: 'Habits', img: 'assets/monk-proud.png' },
          { id: 'block', label: 'Block', img: 'assets/monk-angry.png' },
          { id: 'monk', label: 'Monk', img: 'assets/monk-meditating.png' },
          { id: 'crew', label: 'Crew', img: 'assets/monk-happy.png' },
        ].map(t => {
          const active = t.id === 'home';
          return (
            <div key={t.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '4px 4px', borderRadius: 18, minWidth: 0,
              background: active ? P.green : 'transparent',
              boxShadow: active ? P.tabGlow : 'none',
              transform: active ? 'scale(1.03)' : 'scale(1)',
            }}>
              <div style={{ marginBottom: 2, height: 28, width: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center' }}>
                <img src={t.img} alt="" draggable={false} style={{
                  width: 30, height: 30, objectFit: 'contain',
                  filter: active ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' : 'saturate(0.7) opacity(0.85)',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                }} />
              </div>
              <div style={{
                fontFamily: FONT, fontWeight: 800, fontSize: 11,
                color: active ? 'white' : P.inkSoft,
              }}>{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCENE 6 — DARK MODE reveal
// 0.0–1.2s: light home screen, monk breathes
// 1.2–1.8s: moon button pulses (spotlight attention)
// 1.8–2.1s: finger taps the moon (squash)
// 2.1–3.2s: dark mode expands as a circular wipe from the moon button
// 3.2–4.0s: hold on dark UI, sparkles pop near the sun icon
// ─────────────────────────────────────────────
function SceneDarkMode({ localTime, progress }) {
  const breath = Math.sin(localTime * 1.2) * 0.5 + 0.5;

  // Phase timing
  const HIGHLIGHT_START = 1.0;
  const TAP_TIME = 1.8;
  const WIPE_START = 1.95;
  const WIPE_END = 3.1;
  const SPARKLE_START = 3.1;

  const highlightMoon = localTime > HIGHLIGHT_START && localTime < TAP_TIME;
  const moonPress = localTime > TAP_TIME - 0.08 && localTime < TAP_TIME + 0.18;
  const fingerVisible = localTime > HIGHLIGHT_START - 0.2 && localTime < TAP_TIME + 0.4;

  // Finger position: moon button is at the far right of the header. Phone is 390 wide,
  // moon button center is roughly at x=352, y=76 (56px paddingTop + ~20px into header).
  const MOON_X = 352;
  const MOON_Y = 84;

  // Finger travels from below-right to the moon, then taps
  const fingerT = clamp((localTime - (HIGHLIGHT_START - 0.2)) / 1.1, 0, 1);
  const fingerEase = Easing.easeOutCubic(fingerT);
  const fingerX = interp(400, MOON_X + 10, fingerEase);
  const fingerY = interp(360, MOON_Y + 18, fingerEase);
  // Press squash during tap
  const pressP = localTime > TAP_TIME && localTime < TAP_TIME + 0.2
    ? (localTime - TAP_TIME) / 0.2 : 0;
  const fingerScale = moonPress ? 0.85 : 1;

  // Wipe radius (clip-path for the dark layer)
  const wipeP = clamp((localTime - WIPE_START) / (WIPE_END - WIPE_START), 0, 1);
  const wipeEased = Easing.easeOutCubic(wipeP);
  // Max radius needs to cover phone diagonal from the moon button corner.
  // Phone is 390x780; from (352, 84) the far corner is (0, 780). dist = sqrt(352² + 696²) ≈ 780
  const MAX_R = 830;
  const wipeR = wipeEased * MAX_R;

  // Soft ring around expanding edge
  const ringOpacity = wipeP > 0 && wipeP < 1 ? 0.6 * (1 - wipeP) : 0;

  // Sparkle particles near sun after flip
  const sparkleT = localTime - SPARKLE_START;
  const sparkles = sparkleT > 0 && sparkleT < 1.2 ? Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const r = 16 + sparkleT * 40 + (i % 2) * 10;
    const op = Math.max(0, 1 - sparkleT);
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, op, size: 4 + (i%3) };
  }) : [];

  return (
    <PhoneScene>
      {/* Light layer — always rendered, fills the phone */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ThemedMountainBG P={LIGHT} width={390} height={780} />
      </div>
      <ThemedHomeScreen
        P={LIGHT} isDark={false} breath={breath}
        highlightMoon={highlightMoon} moonPress={moonPress}
      />

      {/* Dark layer — clipped by expanding circle from moon button */}
      {wipeP > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: `circle(${wipeR}px at ${MOON_X}px ${MOON_Y}px)`,
          WebkitClipPath: `circle(${wipeR}px at ${MOON_X}px ${MOON_Y}px)`,
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ThemedMountainBG P={DARK} width={390} height={780} />
          </div>
          <ThemedHomeScreen
            P={DARK} isDark={true} breath={breath}
            highlightMoon={false} moonPress={false}
          />
        </div>
      )}

      {/* Expanding ring at wipe edge — SVG so it can be clipped-out circle */}
      {wipeP > 0 && wipeP < 1 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 80 }}
          width="390" height="780" viewBox="0 0 390 780">
          <circle cx={MOON_X} cy={MOON_Y} r={wipeR}
            fill="none" stroke="#4BC93F" strokeWidth="3" opacity={ringOpacity} />
          <circle cx={MOON_X} cy={MOON_Y} r={wipeR - 8}
            fill="none" stroke="white" strokeWidth="1.5" opacity={ringOpacity * 0.7} />
        </svg>
      )}

      {/* Sparkles around sun icon after flip */}
      {sparkles.length > 0 && (
        <div style={{ position: 'absolute', left: MOON_X, top: MOON_Y, zIndex: 90,
          pointerEvents: 'none' }}>
          {sparkles.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', left: s.x, top: s.y,
              width: s.size, height: s.size, borderRadius: 999,
              background: '#FFE066',
              boxShadow: '0 0 8px #FFE066',
              opacity: s.op,
            }}/>
          ))}
        </div>
      )}

      {/* Pointing finger */}
      {fingerVisible && (
        <div style={{
          position: 'absolute', left: fingerX, top: fingerY, zIndex: 95,
          transform: `scale(${fingerScale}) rotate(-18deg)`,
          transformOrigin: '20% 20%',
          transition: 'transform 120ms ease-out',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}>
          <div style={{ fontSize: 44 }}>👆</div>
        </div>
      )}
    </PhoneScene>
  );
}

// linear interp
function interp(a, b, t) { return a + (b - a) * t; }

Object.assign(window, { SceneDarkMode });
