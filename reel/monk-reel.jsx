// monk-reel.jsx — main timeline composer
// Sequences scenes with title cards, particles, and Tweaks.

const { Stage, Sprite, useTime, useTimeline, useSprite, Easing, animate, interpolate, clamp,
  MONK, FONT, MountainBG, PhoneShell,
  SceneHome, SceneHabits, SceneTimer, SceneBlock, SceneCrew, SceneDarkMode,
  FallingLeaves, Sparkles, Confetti, EmojiBurst } = window;

// Scene timing (each scene gets ~5-6s)
// Title cards: 1s overlay between scenes
const TIMELINE = {
  intro:    { start: 0,    end: 2.5  },
  home:     { start: 2.5,  end: 8.5  },
  habits:   { start: 8.5,  end: 17.0 },  // extended: schedule modal (3s) + habits ticking (5.5s)
  timer:    { start: 17.0, end: 23.5 },
  block:    { start: 23.5, end: 30.5 },  // hero — longest
  crew:     { start: 30.5, end: 35.5 },
  dark:     { start: 35.5, end: 39.5 },  // dark mode reveal
  outro:    { start: 39.5, end: 42.0 },
};
const TOTAL_DURATION = 42;

// Feature caption — prominent pill that pops in near the phone, stays for most of a scene.
// Positioned on the RIGHT side of the stage (phone is centered).
function FeatureCaption({ start, end, number, title, text, side = 'right' }) {
  return (
    <Sprite start={start} end={end}>
      {({ progress }) => {
        // pop in, hold, fade out
        const fIn = clamp(progress / 0.12, 0, 1);
        const fOut = clamp((1 - progress) / 0.15, 0, 1);
        const op = Math.min(fIn, fOut);
        const scale = animate({from:0.7,to:1,start:0,end:0.18,ease:Easing.easeOutBack})(progress);
        const rotateIn = (1 - fIn) * (side === 'right' ? 4 : -4);

        const posStyle = side === 'right'
          ? { right: 70, top: 200 }
          : { left: 70, top: 200 };

        return (
          <div style={{
            position: 'absolute', ...posStyle, zIndex: 180,
            opacity: op, transform: `scale(${scale}) rotate(${rotateIn}deg)`,
            pointerEvents: 'none', maxWidth: 320,
          }}>
            <div style={{
              background: 'white',
              border: `3px solid ${MONK.greenDark}`,
              borderRadius: 22,
              padding: '16px 20px 18px',
              boxShadow: `0 8px 0 ${MONK.greenDark}, 0 20px 40px rgba(27,58,25,0.25)`,
              fontFamily: FONT,
              position: 'relative',
            }}>
              {/* numbered badge */}
              <div style={{
                position: 'absolute',
                top: -14, left: side === 'right' ? 'auto' : -14,
                right: side === 'right' ? -14 : 'auto',
                width: 36, height: 36, borderRadius: 999,
                background: MONK.green,
                border: `3px solid ${MONK.greenDark}`,
                color: 'white', fontWeight: 900, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 0 ${MONK.greenDeep}`,
              }}>{number}</div>

              <div style={{
                fontSize: 11, fontWeight: 800, color: MONK.green,
                letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4,
              }}>Key feature</div>
              <div style={{
                fontSize: 22, fontWeight: 900, color: MONK.ink,
                letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 6,
              }}>{title}</div>
              <div style={{
                fontSize: 13, fontWeight: 500, color: MONK.inkSoft,
                lineHeight: 1.35,
              }}>{text}</div>

              {/* pointer tail pointing at phone */}
              <div style={{
                position: 'absolute',
                [side === 'right' ? 'left' : 'right']: -14,
                top: 40,
                width: 0, height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                [side === 'right' ? 'borderRight' : 'borderLeft']: `14px solid ${MONK.greenDark}`,
              }}/>
              <div style={{
                position: 'absolute',
                [side === 'right' ? 'left' : 'right']: -9,
                top: 43,
                width: 0, height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                [side === 'right' ? 'borderRight' : 'borderLeft']: `10px solid white`,
              }}/>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// Title card overlay shown at start of each scene
function TitleCard({ start, label, sub }) {
  return (
    <Sprite start={start} end={start + 1.4}>
      {({ progress }) => {
        const opacity = progress < 0.15 ? progress / 0.15
          : progress > 0.7 ? (1 - progress) / 0.3 : 1;
        const slide = animate({from:30,to:0,start:0,end:0.3,ease:Easing.easeOutBack})(progress);
        return (
          <div style={{
            position: 'absolute', top: 60, left: 0, right: 0, zIndex: 200,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity, transform: `translateY(${slide}px)`, pointerEvents: 'none',
          }}>
            <div style={{
              padding: '6px 16px', background: 'rgba(27,58,25,0.85)',
              borderRadius: 999, color: 'white',
              fontFamily: FONT, fontWeight: 700, fontSize: 11,
              letterSpacing: 2, textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>{label}</div>
            <div style={{
              marginTop: 8, fontFamily: FONT, fontSize: 38, fontWeight: 900,
              color: 'white', letterSpacing: -1, textAlign: 'center',
              textShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}>{sub}</div>
          </div>
        );
      }}
    </Sprite>
  );
}

// Intro card
function Intro() {
  const { progress, localTime } = useSprite();
  const opacity = progress > 0.85 ? Math.max(0, (1 - progress) / 0.15) : 1;
  const logoScale = animate({from:0.6,to:1,start:0.05,end:0.4,ease:Easing.easeOutBack})(progress);
  const logoY = animate({from:30,to:0,start:0.05,end:0.4,ease:Easing.easeOutBack})(progress);
  const taglineO = animate({from:0,to:1,start:0.35,end:0.6})(progress);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${MONK.skyTop}, ${MONK.sky} 60%, ${MONK.green})`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      <MountainBG width={1280} height={720} />
      {/* Title */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center',
        transform: `translateY(${logoY}px) scale(${logoScale})` }}>
        <div style={{ fontSize: 26, fontFamily: FONT, fontWeight: 700, color: MONK.greenDark,
          letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>introducing</div>
        <div style={{
          fontSize: 120, fontFamily: FONT, fontWeight: 900, color: MONK.ink,
          letterSpacing: -4, lineHeight: 1,
        }}>monk<span style={{ color: MONK.green }}>.mode</span></div>
      </div>
      <div style={{
        marginTop: 16, position: 'relative', zIndex: 10,
        opacity: taglineO,
        fontSize: 24, fontFamily: FONT, fontWeight: 600, color: MONK.inkSoft,
        letterSpacing: -0.3,
      }}>cage your apps. earn your screen time.</div>
      {/* Floating leaves */}
      <FallingLeaves width={1280} height={720} time={localTime} count={20} intensity={1} />
    </div>
  );
}

// Outro card
function Outro() {
  const { progress, localTime } = useSprite();
  const burstAt = 0.05;
  const burstP = clamp((progress - burstAt) / 0.7, 0, 1);
  const titleS = animate({from:0.4,to:1,start:0.1,end:0.5,ease:Easing.easeOutBack})(progress);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${MONK.green}, ${MONK.greenDark})`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <MountainBG width={1280} height={720} />
      <Confetti width={1280} height={720} time={localTime} burst={burstP} count={50}/>
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center',
        transform: `scale(${titleS})` }}>
        <div style={{ fontSize: 100, fontFamily: FONT, fontWeight: 900, color: 'white',
          letterSpacing: -3 }}>monk.mode</div>
        <div style={{
          marginTop: 8, fontSize: 22, fontFamily: FONT, fontWeight: 700, color: MONK.cream,
        }}>get it on the App Store</div>
      </div>
    </div>
  );
}

// Cross-fade wrapper for scenes
function FadeScene({ start, end, children, fadeIn = 0.4, fadeOut = 0.4 }) {
  return (
    <Sprite start={start} end={end}>
      {(ctx) => {
        const { localTime, duration } = ctx;
        const fIn = clamp(localTime / fadeIn, 0, 1);
        const fOut = clamp((duration - localTime) / fadeOut, 0, 1);
        const op = Math.min(fIn, fOut);
        const slide = (1 - fIn) * 24 - (1 - fOut) * 24;
        return (
          <div style={{
            position: 'absolute', inset: 0, opacity: op,
            transform: `translateY(${slide}px) scale(${0.96 + 0.04 * op})`,
          }}>
            {typeof children === 'function' ? children(ctx) : children}
          </div>
        );
      }}
    </Sprite>
  );
}

// Branding strip — small badge on the LEFT side, doesn't overlap the phone
function BrandStrip() {
  const time = useTime();
  if (time < TIMELINE.intro.end || time > TIMELINE.outro.start) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 32, left: 32, zIndex: 150, pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(27,58,25,0.75)', backdropFilter: 'blur(10px)',
        color: 'white', padding: '10px 18px', borderRadius: 14,
        fontFamily: FONT, letterSpacing: -0.2,
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>monk.mode</div>
        <div style={{ fontWeight: 600, fontSize: 11, opacity: 0.7, letterSpacing: 0.5,
          textTransform: 'uppercase' }}>focus that earns</div>
      </div>
    </div>
  );
}

// Ambient particles overlay
function AmbientParticles({ enabled = true }) {
  const time = useTime();
  if (!enabled) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      <FallingLeaves width={1280} height={720} time={time} count={10} intensity={0.6} />
    </div>
  );
}

// The main reel
function MonkReel({ particles = true }) {
  return (
    <>
      {/* Background fill */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #FFF8E0 0%, #DFF0F8 40%, #C5E5D9 80%, #7BC474 100%)',
      }} />

      {/* Intro */}
      <FadeScene start={TIMELINE.intro.start} end={TIMELINE.intro.end} fadeIn={0.2} fadeOut={0.5}>
        <Intro />
      </FadeScene>

      {/* HOME */}
      <FadeScene start={TIMELINE.home.start} end={TIMELINE.home.end}>
        {(ctx) => <SceneHome localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.home.start + 0.2} label="01 · Dashboard" sub="Your daily check-in" />

      {/* HABITS */}
      <FadeScene start={TIMELINE.habits.start} end={TIMELINE.habits.end}>
        {(ctx) => <SceneHabits localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.habits.start + 0.2} label="02 · Habits" sub="Earn your screen time" />
      {/* Feature 1: Schedule habits the night before — shown while modal is up */}
      <FeatureCaption
        start={TIMELINE.habits.start + 1.0}
        end={TIMELINE.habits.start + 3.4}
        number="1"
        title="Schedule habits the night before"
        text="Set tomorrow's wins tonight — wake up with a plan."
        side="right"
      />
      {/* Feature 1b: after modal closes, show habits ticking off */}
      <FeatureCaption
        start={TIMELINE.habits.start + 4.0}
        end={TIMELINE.habits.end - 0.3}
        number="1"
        title="Check them off as you go"
        text="Every completed habit pushes your gold bar up."
        side="right"
      />

      {/* TIMER */}
      <FadeScene start={TIMELINE.timer.start} end={TIMELINE.timer.end}>
        {(ctx) => <SceneTimer localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.timer.start + 0.2} label="03 · Focus" sub="Deep work, vibes on" />

      {/* BLOCK — hero */}
      <FadeScene start={TIMELINE.block.start} end={TIMELINE.block.end}>
        {(ctx) => <SceneBlock localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.block.start + 0.2} label="04 · Block" sub="Cage the distractions" />
      {/* Feature 2: Phone is locked */}
      <FeatureCaption
        start={TIMELINE.block.start + 2.0}
        end={TIMELINE.block.start + 4.8}
        number="2"
        title="Your phone is locked"
        text="Distracting apps get caged — no willpower required."
        side="right"
      />
      {/* Feature 3: Unlock by completing habits */}
      <FeatureCaption
        start={TIMELINE.block.start + 4.9}
        end={TIMELINE.block.end - 0.3}
        number="3"
        title="Unlock by completing habits"
        text="Gym. Read. Run. Every habit buys back your screen time."
        side="left"
      />

      {/* CREW */}
      <FadeScene start={TIMELINE.crew.start} end={TIMELINE.crew.end}>
        {(ctx) => <SceneCrew localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.crew.start + 0.2} label="05 · Crew" sub="Stronger together" />
      {/* Feature 4: Share with your crew */}
      <FeatureCaption
        start={TIMELINE.crew.start + 1.8}
        end={TIMELINE.crew.end - 0.3}
        number="4"
        title="Share with your crew"
        text="Build streaks together — accountability that actually sticks."
        side="right"
      />

      {/* DARK MODE reveal */}
      <FadeScene start={TIMELINE.dark.start} end={TIMELINE.dark.end}>
        {(ctx) => <SceneDarkMode localTime={ctx.localTime} progress={ctx.progress} />}
      </FadeScene>
      <TitleCard start={TIMELINE.dark.start + 0.2} label="06 · Dark mode" sub="A flick for the night owl" />
      <FeatureCaption
        start={TIMELINE.dark.start + 0.6}
        end={TIMELINE.dark.start + 2.0}
        number="5"
        title="Flick to dark mode"
        text="One tap and the whole app dims."
        side="right"
      />
      <FeatureCaption
        start={TIMELINE.dark.start + 2.2}
        end={TIMELINE.dark.end - 0.3}
        number="5"
        title="Easier on the eyes at night"
        text="Same clarity, zero glare."
        side="right"
      />

      {/* OUTRO */}
      <FadeScene start={TIMELINE.outro.start} end={TIMELINE.outro.end} fadeIn={0.3} fadeOut={0.2}>
        <Outro />
      </FadeScene>

      {particles && <AmbientParticles enabled={particles} />}
      <BrandStrip />

      {/* Scene clock pip in corner */}
      <SceneClock />
    </>
  );
}

function SceneClock() {
  const time = useTime();
  let label = '';
  for (const [key, val] of Object.entries(TIMELINE)) {
    if (time >= val.start && time < val.end) { label = key; break; }
  }
  return (
    <div style={{
      position: 'absolute', top: 24, right: 24, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', color: 'white',
      padding: '6px 12px', borderRadius: 999,
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
      backdropFilter: 'blur(8px)',
    }}>{label}</div>
  );
}

Object.assign(window, { MonkReel, TIMELINE, TOTAL_DURATION });
