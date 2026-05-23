function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/58">
      <h4 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20">{item}</span>
        ))}
      </div>
    </article>
  );
}

export function SavenLearningCenter() {
  const modules = [
    {
      step: '01',
      title: 'Understand the person',
      text: 'Create the life profile: relationship, language, environment, support mode, rhythm, mobility, communication preference, and goals.',
      practice: 'Open Life Setup and complete a basic profile for Anna.',
      items: ['Person profile', 'Daily rhythm', 'Mobility support', 'Communication style'],
      tone: 'blue',
    },
    {
      step: '02',
      title: 'Build the Support Circle',
      text: 'Connect the family, caregiver, provider, device, home environment, robot readiness, and verification layer.',
      practice: 'Go to Circle and identify who confirms reality.',
      items: ['Family', 'Caregiver', 'Device', 'Robot', 'Verification'],
      tone: 'gold',
    },
    {
      step: '03',
      title: 'Run daily support',
      text: 'Use Today and Support Flow to see need detection, support task creation, assignment, action, verification, and continuity update.',
      practice: 'Follow one task from need to verified continuity.',
      items: ['Need', 'Assign', 'Act', 'Verify', 'Continue'],
      tone: 'green',
    },
    {
      step: '04',
      title: 'Use voice and text commands',
      text: 'Use the SAVEN voice layer for commands and text fallback. Watch how the response and command log make support actions visible.',
      practice: 'Open Settings and test one command through text and one through voice.',
      items: ['Mic', 'Text fallback', 'SAVEN response', 'Command log'],
      tone: 'blue',
    },
    {
      step: '05',
      title: 'Connect robots safely',
      text: 'Use robot settings to register readiness, map permissions, bind telemetry, require human approval, and verify physical action.',
      practice: 'Review Robot Connection Center and confirm physical action remains gated.',
      items: ['Register', 'Permissions', 'Telemetry', 'Approval', 'Verification'],
      tone: 'gold',
    },
    {
      step: '06',
      title: 'Tune the operating rules',
      text: 'Use Settings to tune cognitive load, reminder intensity, privacy, devices, caregiver overrides, night mode, robot policy, and escalation.',
      practice: 'Adjust one slider and one permission; read the generated rules.',
      items: ['Regulators', 'Permissions', 'Privacy', 'Escalation', 'Night mode'],
      tone: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="SAVEN Learning Center" title="Learn SAVEN step by step." text="A guided, practical training center for operating SAVEN clearly: profile, circle, daily support, voice commands, robots, verification, and settings." />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_70%_86%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.74))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_70%_86%,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(8,22,42,0.9),rgba(33,22,10,0.7))] dark:ring-1 dark:ring-white/10">
        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-300/30">
                <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Training path</p>
                <h3 className="mt-1 text-2xl font-semibold">6 core lessons</h3>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {['Profile', 'Circle', 'Daily support', 'Voice', 'Robots', 'Settings'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 text-xs font-semibold text-white">{index + 1}</span>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => {
              const tone = module.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : module.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
              return (
                <article key={module.step} className={'group rounded-[2rem] border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-sm font-semibold text-slate-950 shadow-sm ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-white dark:ring-white/10">{module.step}</span>
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{module.text}</p>
                  <div className="mt-4 rounded-2xl bg-white/76 p-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-white/10">
                    Practice: {module.practice}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.items.map((item) => (
                      <span key={item} className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">{item}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Beginner goal" text="Understand what SAVEN is doing before changing settings." items={['Read FAQ', 'Open Start', 'Create profile', 'Review Today']} />
        <LayeredPanel title="Operator goal" text="Run support tasks and verify actions without losing accountability." items={['Support Flow', 'Timeline', 'Verification', 'Circle']} />
        <LayeredPanel title="Advanced goal" text="Connect robots, devices, environments, and command layers safely." items={['Robots', 'Devices', 'Settings', 'Voice commands']} />
      </section>
    </div>
  );
}
