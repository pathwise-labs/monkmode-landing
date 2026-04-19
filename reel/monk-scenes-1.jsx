// monk-scenes.jsx — individual scene components for the reel
// Each scene receives `localTime` and `progress` (0..1) from a Sprite.

const { MONK, FONT, MountainBG, PhoneShell, MonkHeader, Pill, CircleBtn, GreenButton,
  TabBar, MonkCharacter, Card } = window;

// Scene wrapper that mounts a phone with a screen inside
function PhoneScene({ children, glow = false, shake = 0 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #FFF8E0 0%, #DFF0F8 50%, #C5E5D9 100%)',
    }}>
      <PhoneShell glow={glow} shake={shake}>
        {children}
      </PhoneShell>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCENE 1 — Home dashboard
// Idle monk + breathing + tabs slide in
// ─────────────────────────────────────────────
function SceneHome({ localTime, progress }) {
  const breath = Math.sin(localTime * 1.2) * 0.5 + 0.5;
  const habitsDone = Math.min(3, Math.floor(localTime / 1.2) + 1);
  const habitsProg = habitsDone / 3;
  const pct = Math.round(habitsProg * 100);
  const statusLabel = habitsDone >= 3 ? 'All done · Crushing it' : habitsDone >= 2 ? 'Almost there' : 'Warming up';

  return (
    <PhoneScene>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MountainBG width={390} height={780} />
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MonkHeader />

        <div style={{ padding: '20px 16px', flex: 1, position: 'relative' }}>
          {/* Monk character */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8,
            transform: `translateY(${animate({from:-20,to:0,start:0,end:0.5,ease:Easing.easeOutBack})(progress)}px)`,
            opacity: animate({from:0,to:1,start:0,end:0.4})(progress) }}>
            <MonkCharacter state="cool" size={130} breath={breath} />
          </div>

          {/* Status pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16,
            opacity: animate({from:0,to:1,start:0.2,end:0.6})(progress) }}>
            <Pill bg={MONK.greenSoft} border={MONK.green} padding="8px 16px">
              <div style={{ width: 8, height: 8, borderRadius: 999, background: MONK.green }}/>
              <span style={{ color: MONK.greenDark, fontWeight: 800, fontSize: 13, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                {pct}% · {statusLabel}
              </span>
            </Pill>
          </div>

          {/* Stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12,
            transform: `translateY(${animate({from:20,to:0,start:0.3,end:0.7,ease:Easing.easeOutBack})(progress)}px)`,
            opacity: animate({from:0,to:1,start:0.3,end:0.6})(progress) }}>
            <Card padding={12}>
              <div style={{ fontSize: 10, color: MONK.inkSoft, fontWeight: 700, letterSpacing: 1, marginBottom: 6,
                fontFamily: FONT }}>HABITS DONE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: MONK.greenDark, fontFamily: FONT }}>
                  {habitsDone}</span>
                <span style={{ fontSize: 14, color: MONK.inkSoft, fontFamily: FONT }}>/ 3</span>
              </div>
              <div style={{ height: 4, background: MONK.greenSofter, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: MONK.green, width: `${habitsProg*100}%`,
                  transition: 'width 400ms cubic-bezier(.34,1.56,.64,1)' }}/>
              </div>
            </Card>
            <Card padding={12}>
              <div style={{ fontSize: 10, color: MONK.inkSoft, fontWeight: 700, letterSpacing: 1, marginBottom: 6,
                fontFamily: FONT }}>DAY STREAK</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 22 }}>💪</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: MONK.greenDark, fontFamily: FONT }}>3</span>
                <span style={{ fontSize: 14, color: MONK.inkSoft, fontFamily: FONT }}>days</span>
              </div>
            </Card>
          </div>

          {/* Action tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12,
            opacity: animate({from:0,to:1,start:0.45,end:0.75})(progress) }}>
            {[
              { e: '🌱', l: 'Log Habit' },
              { e: '🧘', l: 'Focus Timer' },
              { e: '🐵', l: 'Monk My Apps' },
            ].map((t, i) => (
              <Card key={i} padding={12} style={{
                textAlign: 'center',
                transform: `scale(${animate({from:0.7,to:1,start:0.45+i*0.05,end:0.7+i*0.05,ease:Easing.easeOutBack})(progress)})`,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{t.e}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: MONK.ink, fontFamily: FONT }}>{t.l}</div>
              </Card>
            ))}
          </div>

          {/* Start session row */}
          <div style={{ opacity: animate({from:0,to:1,start:0.6,end:0.85})(progress),
            transform: `translateY(${animate({from:12,to:0,start:0.6,end:0.85,ease:Easing.easeOutCubic})(progress)}px)` }}>
            <Card padding={14} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 14 }}>Start a Monk Session</div>
                <div style={{ fontSize: 11, color: MONK.inkSoft, marginTop: 2, fontFamily: FONT }}>Block distracting apps & focus</div>
              </div>
              <div style={{ padding: '6px 14px', background: MONK.greenSofter, borderRadius: 999,
                color: MONK.greenDark, fontWeight: 800, fontSize: 12, fontFamily: FONT }}>Go →</div>
            </Card>
          </div>
        </div>

        <TabBar active="home" />
      </div>
    </PhoneScene>
  );
}

// ─────────────────────────────────────────────
// SCENE 2 — Habits / Earn screen time
// Habits ticking off one by one, gold bar filling
// ─────────────────────────────────────────────
function SceneHabits({ localTime, progress }) {
  // Act 1 (0→3s): Schedule modal slides up, user schedules "Cook Healthy Meal"
  // Act 2 (3→8s): modal dismisses, habits tick off one by one
  const MODAL_IN = 0.2;
  const MODAL_OUT = 2.9;
  const ACT2_START = 3.1;
  const t2 = localTime - ACT2_START; // time since act 2 starts

  // Modal visibility progress: slides up between MODAL_IN and MODAL_IN+0.4,
  // slides down between MODAL_OUT and MODAL_OUT+0.4
  const modalIn = clamp((localTime - MODAL_IN) / 0.5, 0, 1);
  const modalOut = clamp((localTime - MODAL_OUT) / 0.4, 0, 1);
  const modalVisible = localTime > MODAL_IN && localTime < MODAL_OUT + 0.4;
  const modalY = animate({from:780,to:0,start:0,end:1,ease:Easing.easeOutBack})(modalIn)
               + animate({from:0,to:780,start:0,end:1,ease:Easing.easeInBack})(modalOut);
  const modalOpacity = Math.min(modalIn, 1 - modalOut);
  const backdropOpacity = Math.min(modalIn, 1 - modalOut) * 0.55;

  // Tick habits at t2=1, 2.5, 4 (so 3s total after modal closes)
  const completedCount = t2 > 4 ? 3 : t2 > 2.5 ? 2 : t2 > 1 ? 1 : 0;
  const fillPct = (completedCount / 3) * 100;
  const habits = [
    { name: 'Gym', sub: 'Show up for your body every day', tag: 'FITNESS', emoji: '💪', time: '6:00 AM', completedAt: 1 },
    { name: 'Cook Healthy Meal', sub: 'No junk food shortcuts', tag: 'WELLNESS', emoji: '🥗', time: '7:30 AM', completedAt: 2.5 },
    { name: 'Study Session', sub: 'Focused deep work', tag: 'LEARNING', emoji: '📝', time: '10:00 AM', completedAt: 4 },
  ];

  return (
    <PhoneScene>
      <div style={{ position: 'absolute', inset: 0 }}>
        <MountainBG width={390} height={780} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MonkHeader />
        <div style={{ padding: '14px 16px', flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: MONK.inkSoft, letterSpacing: 1.2, fontWeight: 700, fontFamily: FONT }}>
            DAILY HABITS</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: MONK.ink, fontFamily: FONT, marginBottom: 12,
            letterSpacing: -0.5 }}>Earn screen time 🌱</div>

          {/* Tab pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: '10px 0', borderRadius: 999, background: MONK.green,
              boxShadow: `0 3px 0 ${MONK.greenDark}`,
              textAlign: 'center', color: 'white', fontWeight: 800, fontFamily: FONT, fontSize: 14 }}>Today</div>
            <div style={{ flex: 1, padding: '10px 0', borderRadius: 999, background: 'white',
              border: `1.5px solid ${MONK.green}`,
              textAlign: 'center', color: MONK.greenDark, fontWeight: 800, fontFamily: FONT, fontSize: 14 }}>Schedule</div>
          </div>

          {/* Earn bar */}
          <div style={{
            background: '#FBE7A6', border: `2px solid ${MONK.goldDark}`, borderRadius: 18,
            padding: 14, marginBottom: 12, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 10, color: '#7A5A10', letterSpacing: 1.2, fontWeight: 700,
              fontFamily: FONT }}>HABITS TODAY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#7A5A10', fontFamily: FONT }}>
                {completedCount}</span>
              <span style={{ fontSize: 14, color: '#7A5A10', fontFamily: FONT }}>/ 3</span>
            </div>
            <div style={{ fontSize: 10, color: '#7A5A10', letterSpacing: 1.2, fontWeight: 700, marginTop: 6,
              fontFamily: FONT }}>COMPLETE ALL HABITS TO EARN</div>
            <div style={{ display: 'inline-block', marginTop: 6, padding: '4px 10px',
              background: '#FFF6D6', borderRadius: 999, border: `1.5px solid ${MONK.goldDark}`,
              color: '#7A5A10', fontWeight: 800, fontSize: 12, fontFamily: FONT }}>3h screen break</div>
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <MonkCharacter state="proud" size={64} breath={Math.sin(localTime*2)*0.5+0.5} />
            </div>
            {/* Fill progress */}
            <div style={{ marginTop: 10, height: 6, background: '#F0D778', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${fillPct}%`, background: MONK.goldDark,
                transition: 'width 600ms cubic-bezier(.34,1.56,.64,1)' }}/>
            </div>
          </div>

          {/* Habit rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habits.map((h, i) => {
              const isDone = t2 >= h.completedAt;
              const justCompleted = isDone && t2 < h.completedAt + 0.4;
              const pulse = justCompleted ? 1.05 : 1;
              return (
                <div key={i} style={{
                  background: isDone ? MONK.greenSofter : 'white',
                  border: `1.5px solid ${isDone ? MONK.green : MONK.border}`,
                  borderRadius: 18, padding: 12,
                  display: 'flex', alignItems: 'center', gap: 12,
                  transform: `scale(${pulse})`,
                  transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10,
                    background: isDone ? MONK.green : MONK.greenSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {h.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: MONK.ink, fontFamily: FONT, fontSize: 14 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: MONK.inkSoft, fontFamily: FONT, marginTop: 1 }}>{h.sub}</div>
                    <div style={{ fontSize: 10, color: MONK.inkSoft, marginTop: 4, fontWeight: 700, letterSpacing: 0.5,
                      fontFamily: FONT }}>{h.tag} · {h.time}</div>
                  </div>
                  {isDone ? (
                    <div style={{ color: MONK.greenDark, fontWeight: 800, fontSize: 13, fontFamily: FONT }}>Done ✓</div>
                  ) : (
                    <div style={{ padding: '6px 14px', background: MONK.green, color: 'white',
                      borderRadius: 999, fontWeight: 800, fontSize: 12, fontFamily: FONT,
                      boxShadow: `0 2px 0 ${MONK.greenDark}` }}>Log</div>
                  )}
                  {justCompleted && (
                    <div style={{ position: 'absolute', marginLeft: -20, marginTop: -40, fontSize: 24,
                      animation: 'monkPop 600ms ease-out' }}>✨</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <TabBar active="habits" />

        {/* Schedule Habit modal overlay */}
        {modalVisible && (
          <>
            {/* Backdrop */}
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(20,40,20,0.45)',
              opacity: backdropOpacity, zIndex: 50, pointerEvents: 'none',
            }} />
            {/* Modal */}
            <ScheduleHabitModal localTime={localTime} modalTranslateY={modalY} opacity={modalOpacity} />
          </>
        )}
      </div>
    </PhoneScene>
  );
}

// ─────────────────────────────────────────────
// Schedule Habit Modal (night-before scheduling)
// ─────────────────────────────────────────────
function ScheduleHabitModal({ localTime, modalTranslateY, opacity }) {
  // interior animations sequence once modal is settled (after ~0.5s in)
  const settled = Math.max(0, localTime - 0.5);
  // user "taps" the repeat chip at t≈1.7, start time at t≈2.1, save at t≈2.6
  const repeatFlip = settled > 1.2; // goes Once → Daily
  const timeFlip = settled > 1.6;   // 7:00 AM becomes highlighted
  const savePress = settled > 2.1 && settled < 2.4;

  const dates = [
    { d: 'TODAY', n: 19, active: false },
    { d: 'MON', n: 20, active: true }, // "tomorrow" — night-before scheduling
    { d: 'TUE', n: 21, active: false },
    { d: 'WED', n: 22, active: false },
    { d: 'THU', n: 23, active: false },
    { d: 'FRI', n: 24, active: false },
  ];
  const startTimes = ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM'];
  const endTimes = ['7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM'];
  const reminders = ['At start', '5 min', '15 min', '30 min', '1 hour'];

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, top: 40,
      zIndex: 60,
      transform: `translateY(${modalTranslateY}px)`,
      opacity,
    }}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: 'white',
        borderRadius: '22px 22px 0 0',
        borderTop: `2px solid ${MONK.green}`,
        borderLeft: `2px solid ${MONK.green}`,
        borderRight: `2px solid ${MONK.green}`,
        boxShadow: `0 -12px 40px rgba(27,58,25,0.25)`,
        padding: '14px 14px 14px',
        fontFamily: FONT,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: MONK.ink, letterSpacing: -0.5 }}>Schedule a Habit</div>
          <div style={{
            width: 24, height: 24, borderRadius: 999,
            border: `1.5px solid ${MONK.greenMid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: MONK.greenDark, fontWeight: 900, fontSize: 12,
          }}>×</div>
        </div>

        {/* Habit picker */}
        <Label>HABIT</Label>
        <div style={{
          padding: '6px 9px', border: `1.5px solid ${MONK.green}`, borderRadius: 11,
          background: MONK.greenSofter, display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: MONK.green,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🥗</div>
          <div style={{ flex: 1, fontWeight: 800, fontSize: 12, color: MONK.ink }}>Cook Healthy Meal</div>
          <div style={{ color: MONK.greenDark, fontSize: 9 }}>▼</div>
        </div>

        {/* Name */}
        <Label>NAME</Label>
        <div style={{
          padding: '6px 9px', border: `1.5px solid ${MONK.green}`, borderRadius: 9,
          color: MONK.ink, fontSize: 11, fontWeight: 600, marginBottom: 6,
        }}>Cook Healthy Meal</div>

        {/* Note */}
        <Label>NOTE <span style={{ color: MONK.inkSoft, fontWeight: 500, textTransform: 'none' }}>(optional)</span></Label>
        <div style={{
          padding: '6px 9px', border: `1.5px solid ${MONK.greenMid}`, borderRadius: 9,
          color: MONK.inkSoft, fontSize: 11, fontWeight: 500, marginBottom: 7,
        }}>No junk food shortcuts</div>

        {/* Date row */}
        <Label>DATE</Label>
        <div style={{ display: 'flex', gap: 4, marginBottom: 7 }}>
          {dates.map((d, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 0, padding: '4px 0', textAlign: 'center', borderRadius: 8,
              background: d.active ? MONK.green : 'white',
              border: `1.5px solid ${d.active ? MONK.green : MONK.greenMid}`,
              boxShadow: d.active ? `0 2px 0 ${MONK.greenDark}` : 'none',
              color: d.active ? 'white' : MONK.greenDark,
            }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.4 }}>{d.d}</div>
              <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1 }}>{d.n}</div>
            </div>
          ))}
        </div>

        {/* Start time */}
        <Label>START TIME</Label>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {startTimes.map((t, i) => {
            const active = i === 4; // 7:00 AM
            return (
              <div key={i} style={{
                flex: 1, minWidth: 0, padding: '4px 2px', borderRadius: 999, textAlign: 'center',
                background: active ? MONK.green : 'white',
                border: `1.5px solid ${active ? MONK.green : MONK.greenMid}`,
                boxShadow: active ? `0 2px 0 ${MONK.greenDark}` : 'none',
                color: active ? 'white' : MONK.greenDark,
                fontSize: 9, fontWeight: 800, whiteSpace: 'nowrap',
                transform: active && timeFlip && settled < 1.9 ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 300ms cubic-bezier(.34,1.56,.64,1)',
              }}>{t}</div>
            );
          })}
        </div>

        {/* End time */}
        <Label>END TIME</Label>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {endTimes.map((t, i) => {
            const active = i === 1; // 8:00 AM
            return (
              <div key={i} style={{
                flex: 1, minWidth: 0, padding: '4px 2px', borderRadius: 999, textAlign: 'center',
                background: active ? MONK.green : 'white',
                border: `1.5px solid ${active ? MONK.green : MONK.greenMid}`,
                boxShadow: active ? `0 2px 0 ${MONK.greenDark}` : 'none',
                color: active ? 'white' : MONK.greenDark,
                fontSize: 9, fontWeight: 800, whiteSpace: 'nowrap',
              }}>{t}</div>
            );
          })}
        </div>

        {/* Repeat */}
        <Label>REPEAT</Label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          {['Once', 'Daily', 'Weekly'].map((r, i) => {
            const active = repeatFlip ? r === 'Daily' : r === 'Once';
            return (
              <div key={i} style={{
                flex: 1, padding: '6px 0', textAlign: 'center', borderRadius: 999,
                background: active ? MONK.green : 'white',
                border: `1.5px solid ${active ? MONK.green : MONK.greenMid}`,
                boxShadow: active ? `0 2px 0 ${MONK.greenDark}` : 'none',
                color: active ? 'white' : MONK.greenDark,
                fontSize: 10.5, fontWeight: 800,
                transform: active && repeatFlip && settled < 1.5 ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
              }}>{r}</div>
            );
          })}
        </div>

        {/* Reminder */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <Label noGap>REMINDER</Label>
          <div style={{
            width: 28, height: 15, borderRadius: 999, background: MONK.green,
            position: 'relative', boxShadow: `inset 0 1px 2px rgba(0,0,0,0.1)`,
          }}>
            <div style={{
              position: 'absolute', top: 1.5, right: 1.5, width: 12, height: 12, borderRadius: 999,
              background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8, marginTop: 3 }}>
          {reminders.map((r, i) => {
            const active = i === 2; // 15 min
            return (
              <div key={i} style={{
                flex: 1, minWidth: 0, padding: '4px 2px', borderRadius: 999, textAlign: 'center',
                background: active ? MONK.green : 'white',
                border: `1.5px solid ${active ? MONK.green : MONK.greenMid}`,
                boxShadow: active ? `0 2px 0 ${MONK.greenDark}` : 'none',
                color: active ? 'white' : MONK.greenDark,
                fontSize: 9, fontWeight: 800, whiteSpace: 'nowrap',
              }}>{r}</div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <div style={{
            flex: 1, padding: '9px 0', borderRadius: 999, textAlign: 'center',
            background: MONK.greenSofter, border: `1.5px solid ${MONK.greenMid}`,
            color: MONK.greenDark, fontWeight: 800, fontSize: 13,
          }}>Cancel</div>
          <div style={{
            flex: 1, padding: '9px 0', borderRadius: 999, textAlign: 'center',
            background: MONK.green,
            boxShadow: savePress ? `0 1px 0 ${MONK.greenDark}` : `0 4px 0 ${MONK.greenDark}`,
            color: 'white', fontWeight: 900, fontSize: 13,
            transform: savePress ? 'translateY(2px)' : 'translateY(0)',
            transition: 'all 120ms ease-out',
          }}>Save Block</div>
        </div>

        {/* Confirmation sparkle when saving */}
        {savePress && (
          <div style={{
            position: 'absolute', bottom: 58, right: 40, fontSize: 22,
            animation: 'monkPop 500ms ease-out',
          }}>✨</div>
        )}
      </div>
    </div>
  );
}

function Label({ children, noGap = false }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
      color: MONK.inkSoft, fontFamily: FONT,
      marginBottom: noGap ? 0 : 4, textTransform: 'uppercase',
    }}>{children}</div>
  );
}

Object.assign(window, { PhoneScene, SceneHome, SceneHabits });
