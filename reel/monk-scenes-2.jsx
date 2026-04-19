// monk-scenes-2.jsx — Timer / Block / Crew scenes

const { MONK, FONT, MountainBG, PhoneShell, MonkHeader, Pill, CircleBtn, GreenButton,
  TabBar, MonkCharacter, Card, PhoneScene } = window;

// ─────────────────────────────────────────────
// SCENE 3 — Focus Timer (Monk tab) [HERO TIMER]
// Vibe selector + breathing rings + countdown begin
// ─────────────────────────────────────────────
function SceneTimer({ localTime, progress }) {
  // Begin button pressed at t=2.5s, then timer counts
  const beginPressed = localTime > 2.5;
  const t0 = 2.5;
  const elapsed = beginPressed ? localTime - t0 : 0;
  const totalSecs = 25 * 60; // 25:00
  const remaining = Math.max(0, totalSecs - Math.floor(elapsed * 12)); // sped-up
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const timerText = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  const buttonPressFrame = localTime > t0 - 0.1 && localTime < t0 + 0.3;

  // Hearts pop while character is meditating
  const heartProgress = (localTime % 2.4) / 2.4;
  const showHeart = beginPressed;

  // Vibe selection animates: Off → Rainy Tokyo at t=1.2
  const vibeSelected = localTime > 1.2 ? 'rainy' : 'off';

  return (
    <PhoneScene glow={beginPressed}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MountainBG width={390} height={780} />
      </div>
      {/* Rain particles when Rainy Tokyo selected */}
      {vibeSelected === 'rainy' && beginPressed && (
        <div style={{ position: 'absolute', inset: 8, borderRadius: 48, overflow: 'hidden', zIndex: 30,
          pointerEvents: 'none' }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const x = (i * 13.7) % 390;
            const speed = 100 + (i % 7) * 12;
            const y = ((localTime * speed + i * 47) % 800) - 50;
            return <div key={i} style={{
              position: 'absolute', left: x, top: y, width: 1.5, height: 14,
              background: 'linear-gradient(180deg, rgba(143,200,238,0.0), rgba(143,200,238,0.7))',
              transform: 'rotate(8deg)',
            }}/>;
          })}
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MonkHeader />

        {/* Mode pills row */}
        <div style={{ padding: '12px 16px 6px', display: 'flex', gap: 8 }}>
          {[
            { e: '🧘', l: 'Deep · 25m', active: true },
            { e: '☕', l: 'Rest · 5m' },
            { e: '🔔', l: 'Custom' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderRadius: 999,
              background: m.active ? MONK.green : 'white',
              border: `1.5px solid ${MONK.green}`,
              color: m.active ? 'white' : MONK.greenDark,
              fontWeight: 800, fontSize: 12, fontFamily: FONT,
              display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: m.active ? `0 3px 0 ${MONK.greenDark}` : 'none',
            }}>
              <span style={{ fontSize: 13 }}>{m.e}</span>{m.l}
            </div>
          ))}
        </div>

        {/* Vibe row */}
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ fontSize: 10, color: MONK.inkSoft, letterSpacing: 1, fontWeight: 700,
            fontFamily: FONT, marginBottom: 6 }}>🎵 VIBE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { e: '🔇', l: 'Off', id: 'off' },
              { e: '🌧️', l: 'Rainy Tokyo', id: 'rainy' },
              { e: '☕', l: 'Coffee House', id: 'coffee' },
            ].map((v, i) => {
              const sel = vibeSelected === v.id;
              return (
                <div key={i} style={{
                  padding: '6px 12px', borderRadius: 999,
                  background: sel ? MONK.green : 'white',
                  border: `1.5px solid ${sel ? MONK.greenDark : MONK.border}`,
                  color: sel ? 'white' : MONK.ink,
                  fontWeight: 700, fontSize: 12, fontFamily: FONT,
                  display: 'flex', alignItems: 'center', gap: 4,
                  transform: sel ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
                }}>
                  <span>{v.e}</span>{v.l}
                </div>
              );
            })}
          </div>
        </div>

        {/* Timer area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', position: 'relative', paddingBottom: 60 }}>

          {/* Breath rings (only when active) */}
          {beginPressed && (
            <>
              {[0, 1, 2].map(i => {
                const phase = ((elapsed + i * 1.2) % 3.6) / 3.6;
                const r = 90 + phase * 80;
                const opacity = (1 - phase) * 0.5;
                return (
                  <div key={i} style={{
                    position: 'absolute', top: '40%', left: '50%',
                    transform: `translate(-50%, -50%) scale(${r/90})`,
                    width: 180, height: 180, borderRadius: '50%',
                    border: `2px solid ${MONK.green}`, opacity,
                  }}/>
                );
              })}
            </>
          )}

          {/* Circle with monk */}
          <div style={{
            position: 'relative', width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)', border: `3px solid ${MONK.cream}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
            transform: `scale(${beginPressed ? 1 + Math.sin(elapsed*1.5)*0.02 : 1})`,
            transition: 'transform 400ms ease-out',
          }}>
            <MonkCharacter
              state={beginPressed ? 'meditate' : 'default'}
              size={130}
              breath={Math.sin(localTime*1.5)*0.5+0.5}
            />
            {showHeart && (
              <>
                <div style={{ position: 'absolute', top: 30 + Math.sin(localTime*2)*4, left: 60,
                  fontSize: 14, opacity: 1 - heartProgress, transform: `translateY(${-heartProgress*40}px)` }}>💚</div>
                <div style={{ position: 'absolute', top: 25, right: 50,
                  fontSize: 12, opacity: 1 - heartProgress*0.8,
                  transform: `translateY(${-heartProgress*30}px) translateX(${heartProgress*5}px)` }}>💚</div>
              </>
            )}
          </div>

          <div style={{
            fontFamily: FONT, fontWeight: 900, fontSize: 56, color: MONK.ink,
            letterSpacing: -2, fontVariantNumeric: 'tabular-nums',
            transform: buttonPressFrame ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 300ms cubic-bezier(.34,1.56,.64,1)',
          }}>{timerText}</div>

          {/* Begin button */}
          <div style={{ marginTop: 24, width: '70%' }}>
            <GreenButton pressed={buttonPressFrame}>
              {beginPressed ? '⏸  Pause' : '▶  Begin'}
            </GreenButton>
          </div>

          {/* Today's habits progress */}
          <div style={{ marginTop: 18, width: '70%',
            background: 'white', border: `1.5px solid ${MONK.border}`, borderRadius: 18, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 13 }}>Today's habits</span>
              <span style={{ color: MONK.inkSoft, fontSize: 12, fontFamily: FONT }}>1/3</span>
            </div>
            <div style={{ marginTop: 6, height: 6, background: MONK.greenSofter, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '33%', background: MONK.green }}/>
            </div>
          </div>
        </div>

        <TabBar active="monk" />
      </div>
    </PhoneScene>
  );
}

// ─────────────────────────────────────────────
// SCENE 4 — Block (Monk Mode toggle ON) [HERO MOMENT]
// User taps "Monk My Apps" → cage bars drop → apps locked
// ─────────────────────────────────────────────
function SceneBlock({ localTime, progress }) {
  // T=0..1: idle "off" state, T=1: tap, T=1.2..3.5: cage drops, apps shake, locked badge
  const tapTime = 1.2;
  const cageProgress = clamp((localTime - tapTime) / 1.5, 0, 1);
  const tapped = localTime > tapTime - 0.1 && localTime < tapTime + 0.3;
  const isCaged = localTime > tapTime;
  const lockedShown = localTime > tapTime + 1.4;

  // Apps in a grid get caged
  const apps = [
    { name: 'IG', color: '#E1306C', emoji: '📷' },
    { name: 'TT', color: '#000', emoji: '🎵' },
    { name: 'YT', color: '#FF0000', emoji: '▶️' },
    { name: 'X', color: '#1DA1F2', emoji: '🐦' },
    { name: 'FB', color: '#1877F2', emoji: '📘' },
    { name: 'RD', color: '#FF4500', emoji: '👽' },
    { name: 'SC', color: '#FFFC00', emoji: '👻' },
    { name: 'NF', color: '#E50914', emoji: '🎬' },
    { name: 'DC', color: '#5865F2', emoji: '🎮' },
  ];

  return (
    <PhoneScene glow={isCaged} shake={tapped ? 1 : 0}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MountainBG width={390} height={780} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MonkHeader />

        <div style={{ padding: '14px 16px', flex: 1, position: 'relative' }}>
          {/* Hero card */}
          <div style={{
            background: isCaged ? '#1B3A19' : MONK.greenSoft,
            border: `2px solid ${isCaged ? '#0F2A0E' : MONK.green}`,
            borderRadius: 22, padding: 18, textAlign: 'center', marginBottom: 14,
            transition: 'all 600ms cubic-bezier(.34,1.56,.64,1)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <MonkCharacter
                state={isCaged ? 'halo' : 'thinking'}
                size={100}
                breath={Math.sin(localTime*1.5)*0.5+0.5}
              />
            </div>
            <div style={{
              fontWeight: 900, fontSize: 22, color: isCaged ? 'white' : MONK.ink,
              fontFamily: FONT, letterSpacing: -0.5,
              transition: 'color 400ms',
            }}>{isCaged ? 'Monk Mode ON' : 'Monk Mode Off'}</div>
            <div style={{
              fontSize: 12, color: isCaged ? '#A8D89E' : MONK.inkSoft,
              fontFamily: FONT, marginTop: 4,
              transition: 'color 400ms',
            }}>
              {isCaged ? `${apps.length} apps caged · 3h focus` : `${apps.length} apps caged`}
            </div>
            <div style={{ marginTop: 12 }}>
              <GreenButton pressed={tapped} height={48}>
                {isCaged ? '🔒 Locked Down' : 'Monk My Apps'}
              </GreenButton>
            </div>
          </div>

          {/* App grid being caged */}
          <div style={{ position: 'relative',
            background: 'white', borderRadius: 18, padding: 12,
            border: `1.5px solid ${MONK.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: MONK.greenSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
                <div>
                  <div style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 14 }}>
                    {apps.length} apps</div>
                  <div style={{ fontSize: 10, color: MONK.inkSoft, fontFamily: FONT }}>
                    {isCaged ? 'Now blocked' : 'Ready to block'}</div>
                </div>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 999,
                background: isCaged ? MONK.greenDark : 'white',
                border: `1.5px solid ${MONK.green}`, color: isCaged ? 'white' : MONK.greenDark,
                fontWeight: 800, fontSize: 12, fontFamily: FONT,
              }}>{isCaged ? 'Active' : 'Edit Apps'}</div>
            </div>

            {/* App tile grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
              position: 'relative', minHeight: 88 }}>
              {apps.map((app, i) => {
                const shake = isCaged && localTime < tapTime + 0.8
                  ? Math.sin((localTime - tapTime) * 30 + i) * 2 : 0;
                const fade = isCaged ? 0.3 : 1;
                return (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 10, background: app.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, transform: `translateX(${shake}px)`,
                    opacity: fade, transition: 'opacity 400ms',
                    filter: isCaged ? 'grayscale(0.6) brightness(0.7)' : 'none',
                  }}>{app.emoji}</div>
                );
              })}
              {/* Cage bars overlay */}
              {isCaged && (
                <div style={{ position: 'absolute', inset: -2, pointerEvents: 'none', overflow: 'hidden',
                  borderRadius: 10 }}>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const dropProgress = clamp((cageProgress - i * 0.04) / 0.5, 0, 1);
                    const eased = Easing.easeOutBack(dropProgress);
                    const heightPct = 100 * eased;
                    return (
                      <div key={i} style={{
                        position: 'absolute',
                        left: `${(i * 100) / 6 + 100/12 - 1}%`,
                        top: 0, width: 3,
                        height: `${heightPct}%`,
                        background: 'linear-gradient(180deg, #4A7C46, #2C5C2A)',
                        borderRadius: '0 0 2px 2px',
                        boxShadow: '1px 0 2px rgba(0,0,0,0.2)',
                      }}/>
                    );
                  })}
                  {/* Lock icon centered */}
                  {lockedShown && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 36, height: 36, borderRadius: 999,
                      background: '#1B3A19',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'monkPop 500ms cubic-bezier(.34,1.56,.64,1) backwards',
                    }}>🔒</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Duration row */}
          <div style={{ marginTop: 12, opacity: isCaged ? 0.5 : 1, transition: 'opacity 400ms' }}>
            <div style={{ fontSize: 10, color: MONK.inkSoft, letterSpacing: 1, fontWeight: 700,
              fontFamily: FONT, marginBottom: 6 }}>AUTOMATION</div>
            <Card padding={14}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🕐</span>
                  <div>
                    <div style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 13 }}>Monk Duration</div>
                    <div style={{ fontSize: 10, color: MONK.inkSoft, fontFamily: FONT }}>How long each blocking session lasts</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, color: MONK.greenDark, fontFamily: FONT, fontSize: 16 }}>3h</div>
              </div>
            </Card>
          </div>
        </div>
        <TabBar active="block" />
      </div>
    </PhoneScene>
  );
}

// ─────────────────────────────────────────────
// SCENE 5 — Crew (people joining)
// Crews list slides in, new member badge pops
// ─────────────────────────────────────────────
function SceneCrew({ localTime, progress }) {
  const newMemberAt = 2.2;
  const newMemberShown = localTime > newMemberAt;
  const newMemberPulse = newMemberShown && localTime < newMemberAt + 0.5;

  // Member avatar palette (initials + color)
  const mk = (i, c) => ({ i, c });
  const crews = [
    { name: 'Network School', tag: 'School', tagColor: '#A78BE5', tagBg: '#E8DEF8', emoji: '🎓',
      roster: [mk('AK','#F4B86A'), mk('JD','#8FC9E5'), mk('MR','#E59FBF'), mk('SP','#B8E096'), mk('TL','#C7A8E8'), mk('RN','#F09090'), mk('YU','#FFD27A')] },
    { name: '5k Run Grinders', tag: 'Fitness', tagColor: '#E55A5A', tagBg: '#FBDADA', emoji: '🏃',
      roster: [mk('EV','#7BC474'), mk('CH','#F4A87A'), mk('MK','#9FBCE5'), mk('LA','#E5B89F'), mk('BJ','#C8E098')] },
    { name: 'Healthy Eating', tag: 'Fitness', tagColor: '#E55A5A', tagBg: '#FBDADA', emoji: '🥗',
      roster: [mk('NI','#F4C46A'), mk('RO','#96C4E5'), mk('DA','#E596BF'), ...(newMemberShown ? [mk('+YOU','#3DA837')] : [])] },
    { name: 'Deep Work Club', tag: 'Work', tagColor: '#5A8FE5', tagBg: '#DBEAFB', emoji: '💼',
      roster: [mk('HS','#F4B86A'), mk('KT','#B8D4E5'), mk('VP','#E5A8CA'), mk('OM','#C0E096'), mk('ZN','#E8C57A'), mk('LQ','#A8C8E8')] },
    { name: 'Sunrise Readers', tag: 'Mindful', tagColor: '#4A9A3E', tagBg: '#D8EDD3', emoji: '📚',
      roster: [mk('GA','#F4D86A'), mk('NU','#98BFE5')] },
  ];

  return (
    <PhoneScene>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MountainBG width={390} height={780} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MonkHeader />

        <div style={{ padding: '14px 16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MonkCharacter state="happy" size={56} breath={Math.sin(localTime*1.5)*0.5+0.5} />
              <div style={{ whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: MONK.ink, fontFamily: FONT,
                  letterSpacing: -0.5, lineHeight: 1 }}>Your Crew</div>
                <div style={{ fontSize: 11, color: MONK.inkSoft, fontFamily: FONT, marginTop: 3 }}>
                  5 crews · {23 + (newMemberShown ? 1 : 0)} posts</div>
              </div>
            </div>
            <div style={{
              padding: '8px 16px', borderRadius: 999, background: MONK.green,
              color: 'white', fontWeight: 800, fontSize: 13, fontFamily: FONT,
              boxShadow: `0 3px 0 ${MONK.greenDark}`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>👋 Invite</div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[
              { l: 'Feed', active: false },
              { l: 'Crews', active: true },
              { l: 'Challenges', active: false },
              { l: 'Friends', active: false },
            ].map((p, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderRadius: 999,
                background: p.active ? MONK.green : MONK.greenSofter,
                color: p.active ? 'white' : MONK.greenDark,
                fontWeight: 800, fontSize: 12, fontFamily: FONT,
                boxShadow: p.active ? `0 3px 0 ${MONK.greenDark}` : 'none',
              }}>{p.l}</div>
            ))}
          </div>

          {/* Crew rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {crews.map((c, i) => {
              const showAt = i * 0.13;
              const inProg = clamp((localTime - showAt) / 0.45, 0, 1);
              const slide = animate({from:30,to:0,start:0,end:1,ease:Easing.easeOutBack})(inProg);
              const isHealthy = i === 2;
              const memberCount = c.roster.length;
              return (
                <div key={i} style={{
                  background: 'white', borderRadius: 14,
                  padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 10,
                  border: `1.5px solid ${MONK.border}`,
                  boxShadow: '0 2px 0 rgba(61,168,55,0.06)',
                  transform: `translateY(${slide}px)`,
                  opacity: inProg,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #B8DBA8, #7BC474)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 13.5,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {c.name}</span>
                      <span style={{ padding: '1px 6px', borderRadius: 5,
                        background: c.tagBg, color: c.tagColor,
                        fontWeight: 800, fontSize: 9, fontFamily: FONT, flexShrink: 0 }}>{c.tag}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      {/* Avatar stack */}
                      <div style={{ display: 'flex' }}>
                        {c.roster.slice(0, 4).map((m, mi) => {
                          const justJoined = isHealthy && newMemberShown && m.i === '+YOU';
                          return (
                            <div key={mi} style={{
                              width: 18, height: 18, borderRadius: 999,
                              background: m.c,
                              border: `1.5px solid white`,
                              marginLeft: mi === 0 ? 0 : -6,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 800, fontSize: 7.5, fontFamily: FONT,
                              letterSpacing: -0.2,
                              boxShadow: justJoined ? `0 0 0 2px ${MONK.green}` : 'none',
                              transform: justJoined && newMemberPulse ? 'scale(1.25)' : 'scale(1)',
                              transition: 'transform 300ms cubic-bezier(.34,1.56,.64,1)',
                              zIndex: 10 - mi,
                            }}>{m.i.replace('+','')}</div>
                          );
                        })}
                        {c.roster.length > 4 && (
                          <div style={{
                            width: 18, height: 18, borderRadius: 999,
                            background: '#E8F0E6', border: `1.5px solid white`,
                            marginLeft: -6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: MONK.greenDark, fontWeight: 800, fontSize: 7.5, fontFamily: FONT,
                          }}>+{c.roster.length - 4}</div>
                        )}
                      </div>
                      <span style={{ fontSize: 10.5, fontFamily: FONT,
                        color: isHealthy && newMemberShown ? MONK.greenDark : MONK.inkSoft,
                        fontWeight: isHealthy && newMemberShown ? 800 : 500,
                        transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
                      }}>
                        {memberCount} members
                        {isHealthy && newMemberPulse && (
                          <span style={{ marginLeft: 3, fontSize: 11 }}>✨</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: MONK.inkSoft, fontSize: 16, flexShrink: 0 }}>›</div>
                </div>
              );
            })}
          </div>

          {/* Discover/Create row */}
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            opacity: animate({from:0,to:1,start:0.5,end:0.9})(progress) }}>
            <div style={{
              padding: 12, background: MONK.greenSofter, border: `1.5px solid ${MONK.green}`,
              borderRadius: 14, textAlign: 'center', color: MONK.greenDark,
              fontWeight: 800, fontFamily: FONT, fontSize: 12,
            }}>🌍 Discover</div>
            <div style={{
              padding: 12, background: 'transparent',
              border: `1.5px dashed ${MONK.greenMid}`, borderRadius: 14,
              textAlign: 'center', color: MONK.inkSoft,
              fontWeight: 800, fontFamily: FONT, fontSize: 12,
            }}>+ Create</div>
          </div>

          {/* New crew member toast */}
          {newMemberPulse && (
            <div style={{
              position: 'absolute', top: 80, left: '50%',
              transform: 'translateX(-50%)',
              background: MONK.greenDark, color: 'white',
              padding: '8px 14px', borderRadius: 999,
              fontWeight: 800, fontSize: 12, fontFamily: FONT,
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 6,
              animation: 'monkSlideDown 400ms cubic-bezier(.34,1.56,.64,1)',
              zIndex: 60,
            }}>✨ New crew member joined!</div>
          )}
        </div>
        <TabBar active="crew" />
      </div>
    </PhoneScene>
  );
}

Object.assign(window, { SceneTimer, SceneBlock, SceneCrew });
