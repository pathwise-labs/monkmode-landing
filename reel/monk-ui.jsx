// monk-ui.jsx — shared UI primitives matching the monk.mode visual language
// Colors, fonts, monk character, mountain backdrop, header, tab bar.

// Theme palette — reads window.__MONK_DARK on every property access so
// flipping the flag + remounting the tree retunes every color at once.
const MONK_LIGHT = {
  green: '#3DA837',
  greenDark: '#2C7E28',
  greenDeep: '#1F5A1B',
  greenSoft: '#E8F5E5',
  greenSofter: '#F4FAF2',
  greenMid: '#7BC474',
  sky: '#CFE7F4',
  skyTop: '#DFF0F8',
  cream: '#FFF8E0',
  gold: '#F5C84A',
  goldDark: '#E2A622',
  ink: '#1B3A19',
  inkSoft: '#3F5C3D',
  inkDim: '#6B8A69',       // tertiary / meta
  white: '#FFFFFF',
  fire: '#FF7A1A',
  fireGlow: '#FFB347',
  card: '#FFFFFF',
  cardAlt: '#F4FAF2',
  border: '#D6EBD2',
  borderSoft: '#E4F0E0',
  shadow: 'rgba(27,58,25,0.08)',
  bg: 'transparent', // let MountainBG show
  chipBg: '#FFFFFF',
  chipInactiveBorder: '#D6EBD2',
  monkSkin: '#E8B888',
  monkRobe: '#C95E2C',
  monkHead: '#D9A47A',
};

const MONK_DARK = {
  green: '#4BC93F',          // a touch brighter so it still pops on black
  greenDark: '#2C7E28',
  greenDeep: '#1F5A1B',
  greenSoft: '#1F2A1E',      // dark green-tinted surface
  greenSofter: '#16201A',
  greenMid: '#2E4A2B',
  sky: '#0B0B0B',
  skyTop: '#0A0A0A',
  cream: '#1F1D17',
  gold: '#F5C84A',
  goldDark: '#8A6E1E',
  ink: '#F2F5F1',            // primary text
  inkSoft: '#A8B3A6',        // secondary text
  inkDim: '#6B756A',         // tertiary / meta
  white: '#1A1F1A',          // "white" cards become dark green-black
  fire: '#FF7A1A',
  fireGlow: '#FFB347',
  card: '#1A1F1A',
  cardAlt: '#121612',
  border: '#2A332A',
  borderSoft: '#222922',
  shadow: 'rgba(0,0,0,0.5)',
  bg: '#0A0A0A',
  chipBg: '#1A1F1A',
  chipInactiveBorder: '#2A332A',
  monkSkin: '#E8B888',
  monkRobe: '#C95E2C',
  monkHead: '#D9A47A',
};

const MONK = new Proxy({}, {
  get(_, key) {
    const src = window.__MONK_DARK ? MONK_DARK : MONK_LIGHT;
    return src[key];
  },
});

const FONT = `'Nunito', 'Quicksand', system-ui, -apple-system, sans-serif`;

// Mountain layered background
function MountainBG({ width = 390, height = 700, scrollY = 0, leafTime = null }) {
  const dark = !!window.__MONK_DARK;
  const far = dark ? '#1a2218' : '#B8DBA8';
  const mid = dark ? '#213021' : MONK.greenMid;
  const near = dark ? '#2a3d28' : MONK.green;
  const gradient = dark
    ? `linear-gradient(180deg, #0A0A0A 0%, #0C1410 70%)`
    : `linear-gradient(180deg, ${MONK.skyTop} 0%, ${MONK.sky} 70%)`;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: gradient,
      overflow: 'hidden',
    }}>
      {/* Far mountains */}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}>
        <g style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <path d={`M0 ${height*0.65} L${width*0.18} ${height*0.4} L${width*0.32} ${height*0.55} L${width*0.5} ${height*0.35} L${width*0.68} ${height*0.52} L${width*0.84} ${height*0.42} L${width} ${height*0.58} L${width} ${height} L0 ${height} Z`}
            fill={far} opacity={dark ? 1 : 0.55} />
        </g>
        <g style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <path d={`M0 ${height*0.78} L${width*0.12} ${height*0.55} L${width*0.28} ${height*0.7} L${width*0.42} ${height*0.5} L${width*0.58} ${height*0.65} L${width*0.74} ${height*0.48} L${width*0.88} ${height*0.62} L${width} ${height*0.55} L${width} ${height} L0 ${height} Z`}
            fill={mid} opacity={dark ? 1 : 0.85} />
        </g>
        <g style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <path d={`M0 ${height*0.88} L${width*0.08} ${height*0.7} L${width*0.22} ${height*0.82} L${width*0.36} ${height*0.65} L${width*0.5} ${height*0.78} L${width*0.64} ${height*0.62} L${width*0.78} ${height*0.75} L${width*0.92} ${height*0.68} L${width} ${height*0.78} L${width} ${height} L0 ${height} Z`}
            fill={near} />
        </g>
      </svg>
    </div>
  );
}

// Phone frame (custom, more compact than the iOS starter, fits the style)
function PhoneShell({ children, width = 390, height = 780, glow = false, shake = 0 }) {
  return (
    <div style={{
      width: width + 16, height: height + 16,
      borderRadius: 56,
      background: 'linear-gradient(160deg, #1a1a1a, #0a0a0a)',
      padding: 8,
      position: 'relative',
      transform: `translate(${shake ? Math.sin(Date.now()/30)*shake : 0}px, 0)`,
      boxShadow: glow
        ? `0 30px 80px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.08), 0 0 80px ${MONK.green}55`
        : '0 30px 80px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.08)',
      transition: 'box-shadow 600ms',
    }}>
      <div style={{
        width, height, borderRadius: 48, overflow: 'hidden',
        position: 'relative', background: window.__MONK_DARK ? '#0A0A0A' : MONK.skyTop,
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 32, borderRadius: 20, background: '#000', zIndex: 100,
        }} />
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 90,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px 0', fontFamily: '-apple-system, system-ui',
          fontWeight: 600, fontSize: 15, color: MONK.ink,
        }}>
          <span>1:04</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="3" height="4" rx="1" fill={MONK.ink}/><rect x="4" y="4" width="3" height="6" rx="1" fill={MONK.ink}/><rect x="8" y="2" width="3" height="8" rx="1" fill={MONK.ink}/><rect x="12" y="0" width="3" height="10" rx="1" fill={MONK.ink}/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 2.5C8.7 2.5 10.3 3.2 11.4 4.3L12.4 3.3C11 2 9 1.2 7 1.2C5 1.2 3 2 1.6 3.3L2.6 4.3C3.7 3.2 5.3 2.5 7 2.5Z M7 5.5C8 5.5 9 5.9 9.7 6.5L10.6 5.6C9.6 4.7 8.4 4.2 7 4.2C5.6 4.2 4.4 4.7 3.4 5.6L4.3 6.5C5 5.9 6 5.5 7 5.5Z M7 8.5A1 1 0 1 1 7 8.6Z" fill={MONK.ink}/><circle cx="7" cy="8.5" r="1" fill={MONK.ink}/></svg>
            <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="19" height="9" rx="2.5" stroke={MONK.ink} strokeOpacity="0.5" fill="none"/><rect x="2" y="2" width="16" height="6" rx="1.5" fill={MONK.ink}/><path d="M20.5 3.5V6.5C21 6.3 21.3 5.9 21.3 5.5C21.3 5.1 21 4.7 20.5 4.5Z" fill={MONK.ink} fillOpacity="0.5"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ position: 'absolute', inset: 0, paddingTop: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Header bar (streak / monk.mode / avatar+gear+moon-or-sun)
function MonkHeader({ streak = 3, dark = false }) {
  const isDark = !!window.__MONK_DARK;
  return (
    <div style={{
      position: 'relative', zIndex: 50, paddingTop: 56,
      padding: '56px 16px 12px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      background: isDark ? 'rgba(10,10,10,0.75)' : 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${isDark ? '#1F1F1F' : MONK.border}`,
    }}>
      <Pill bg={isDark ? '#0F1A0E' : 'white'} border={MONK.green}>
        <span style={{ fontSize: 16 }}>🔥</span>
        <span style={{ fontWeight: 800, color: MONK.greenDark, fontSize: 12, letterSpacing: 0.5 }}>{streak} STREAK</span>
      </Pill>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 18, color: MONK.ink, letterSpacing: -0.5 }}>
        monk.mode
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: MONK.greenSoft,
          border: `2px solid ${MONK.green}`, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="assets/user-avatar.jpg" alt="" style={{ width: 34, height: 34, objectFit: 'cover',
            objectPosition: 'center 25%' }} />
        </div>
        <CircleBtn><span style={{ fontSize: 14 }}>⚙️</span></CircleBtn>
        <CircleBtn filled sun={isDark}>
          <span style={{ fontSize: 14 }}>{isDark ? '☀️' : '🌙'}</span>
        </CircleBtn>
      </div>
    </div>
  );
}

function Pill({ children, bg = 'white', border = MONK.green, padding = '6px 12px' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding, borderRadius: 999, background: bg,
      border: `1.5px solid ${border}`,
    }}>{children}</div>
  );
}

function CircleBtn({ children, filled = false, sun = false }) {
  const isDark = !!window.__MONK_DARK;
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 999,
      background: filled
        ? (isDark ? '#1F2A1E' : MONK.greenSoft)
        : (isDark ? '#1F1F1F' : 'white'),
      border: `1.5px solid ${isDark ? (filled ? MONK.green : '#2A2A2A') : MONK.green}`,
      boxShadow: filled && sun ? `0 0 14px ${MONK.green}88` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
}

// Big rounded green button
function GreenButton({ children, width = '100%', height = 56, onClick, pressed = false, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width, height, borderRadius: 999,
      background: disabled ? '#B8D4B5' : (pressed ? MONK.greenDark : MONK.green),
      border: 'none',
      boxShadow: pressed ? `inset 0 -2px 0 ${MONK.greenDeep}` : `0 4px 0 ${MONK.greenDark}`,
      color: 'white', fontFamily: FONT, fontWeight: 800, fontSize: 18,
      letterSpacing: -0.3, cursor: 'pointer',
      transform: pressed ? 'translateY(2px)' : 'translateY(0)',
      transition: 'all 100ms',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>{children}</button>
  );
}

// Bottom tab bar
function TabBar({ active = 'monk' }) {
  const tabs = [
    { id: 'home', label: 'Home', img: 'assets/monk-relieved.png' },
    { id: 'habits', label: 'Habits', img: 'assets/monk-proud.png' },
    { id: 'block', label: 'Block', img: 'assets/monk-angry.png' },
    { id: 'monk', label: 'Monk', img: 'assets/monk-meditating.png' },
    { id: 'crew', label: 'Crew', img: 'assets/monk-happy.png' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 8, right: 8, bottom: 14, zIndex: 60,
      background: window.__MONK_DARK ? 'rgba(20,24,20,0.95)' : 'rgba(255,255,255,0.95)', borderRadius: 28,
      padding: '8px 4px', display: 'flex', justifyContent: 'space-between',
      boxShadow: window.__MONK_DARK
        ? '0 6px 20px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(75,201,63,0.35)'
        : '0 6px 20px rgba(0,0,0,0.08), 0 0 0 1.5px rgba(61,168,55,0.25)',
      backdropFilter: 'blur(10px)',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '4px 4px', borderRadius: 18, minWidth: 0,
            background: isActive ? MONK.green : 'transparent',
            boxShadow: isActive && window.__MONK_DARK ? `0 0 16px ${MONK.green}88` : 'none',
            transform: isActive ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 200ms cubic-bezier(.34,1.56,.64,1)',
          }}>
            <div style={{ marginBottom: 2, height: 28, width: 28, display: 'flex',
              alignItems: 'center', justifyContent: 'center' }}>
              <img src={t.img} alt="" draggable={false} style={{
                width: 30, height: 30, objectFit: 'contain',
                filter: isActive ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                                  : 'saturate(0.7) opacity(0.85)',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 200ms cubic-bezier(.34,1.56,.64,1)',
              }} />
            </div>
            <div style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 11,
              color: isActive ? 'white' : MONK.inkSoft,
            }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// Monk character using real sticker art
// states: 'default' | 'meditate' | 'happy' | 'celebrate' | 'excited' | 'hyped'
//         | 'proud' | 'cool' | 'halo' | 'angry' | 'alert' | 'thinking'
//         | 'shocked' | 'sleep' | 'relieved' | 'romantic' | 'fighter'
//         | 'thumbsup' (alias -> cool)
const MONK_ART = {
  default: 'assets/monk.png',
  meditate: 'assets/monk-meditating.png',
  happy: 'assets/monk-happy.png',
  celebrate: 'assets/monk-celebrating.png',
  excited: 'assets/monk-excited.png',
  hyped: 'assets/monk-hyped.png',
  proud: 'assets/monk-proud.png',
  cool: 'assets/monk-cool.png',
  thumbsup: 'assets/monk-cool.png',
  halo: 'assets/monk-halo.png',
  angry: 'assets/monk-angry.png',
  alert: 'assets/monk-alert.png',
  thinking: 'assets/monk-thinking.png',
  shocked: 'assets/monk-shocked.png',
  sleep: 'assets/monk-sleeping.png',
  relieved: 'assets/monk-relieved.png',
  romantic: 'assets/monk-romantic.png',
  fighter: 'assets/monk-fighter.png',
};

function MonkCharacter({ state = 'default', size = 110, breath = 0, bounce = 0, rotate = 0 }) {
  const src = MONK_ART[state] || MONK_ART.default;
  const breathScale = 1 + breath * 0.04;
  const bounceY = bounce * -8;
  return (
    <div style={{
      position: 'relative', width: size, height: size,
      transform: `translateY(${bounceY}px) scale(${breathScale}) rotate(${rotate}deg)`,
      transition: 'transform 300ms ease-out',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img src={src} alt="" style={{
        width: '100%', height: '100%', objectFit: 'contain',
        filter: 'drop-shadow(0 6px 12px rgba(27,58,25,0.2))',
        userSelect: 'none', pointerEvents: 'none',
      }} draggable={false} />
    </div>
  );
}

// Generic placeholder card
function Card({ children, padding = 16, style = {} }) {
  return (
    <div style={{
      background: MONK.card, borderRadius: 18, padding,
      border: `1.5px solid ${MONK.border}`,
      boxShadow: '0 2px 0 rgba(61,168,55,0.08)',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { MONK, FONT, MountainBG, PhoneShell, MonkHeader, Pill, CircleBtn, GreenButton, TabBar, MonkCharacter, Card });
