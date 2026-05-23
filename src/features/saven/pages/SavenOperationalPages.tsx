function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

export function SavenCommandCenter() {
  const commands = [
    { label: 'Voice', command: 'Hey SAVEN, show today support status.', result: 'Highlights open verification and next action.', tone: 'blue' },
    { label: 'Text', command: 'Assign walking support to Maya.', result: 'Routes support task with verification required.', tone: 'green' },
    { label: 'Robot-safe', command: 'Can R1 help with mobility?', result: 'Checks readiness; physical action stays approval-gated.', tone: 'gold' },
    { label: 'Family', command: 'Prepare Daniel evening summary.', result: 'Creates family-safe digest without hidden medical detail.', tone: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="SAVEN Command Center" title="One command layer across every support service." text="Voice and text commands control daily support, caregiver handoff, device checks, robot readiness, verification, and continuity." />
      <section className="grid gap-4 md:grid-cols-2">
        {commands.map((item) => {
          const tone = item.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : item.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={item.label} className={'rounded-[2rem] border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-65">{item.label}</p>
              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm font-semibold leading-6 text-white shadow-inner">{item.command}</div>
              <p className="mt-4 text-sm leading-6 opacity-85">{item.result}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export function TaskLifecycleService() {
  const lifecycle = [
    ['Need Detected', 'Signal received'],
    ['Support Task Created', 'Structured'],
    ['Assigned', 'Owner selected'],
    ['Action Performed', 'In reality'],
    ['Verified', 'Proof received'],
    ['Continuity Updated', 'Stable'],
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Task Lifecycle Service" title="Every support need moves through one visible lifecycle." text="SAVEN keeps one path from detected need to verified continuity." />
      <section className="grid gap-4 xl:grid-cols-6">
        {lifecycle.map(([title, state], index) => (
          <article key={title} className="relative min-h-[210px] rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100">
            {index < lifecycle.length - 1 && <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-1 w-6 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 xl:block" />}
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/82 text-sm font-semibold shadow-sm dark:bg-slate-950/70">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-4 text-sm leading-6 opacity-85">{state}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export function DailySupportPlanBuilder() {
  const rows = [
    ['08:30', 'Hydration check', 'SAVEN + sensor', 'Sensor + user'],
    ['10:30', 'Assisted walking session', 'Maya Carter', 'Caregiver confirmation'],
    ['13:30', 'Robot readiness review', 'SAVEN Assist R1', 'Telemetry only'],
    ['19:00', 'Family recovery summary', 'Daniel Roberts', 'Family acknowledgement'],
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Daily Support Plan" title="A simple daily plan that becomes real support work." text="SAVEN organizes time windows, owners, commands, verification, fallback, and continuity effect." />
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="space-y-3">
          {rows.map(([time, action, owner, proof]) => (
            <div key={time} className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-900 md:grid-cols-[86px_minmax(0,1fr)_190px] md:items-center">
              <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">{time}</span>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{action}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{proof}</p>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{owner}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function VerificationPolicyBuilder() {
  const policies = [
    ['Low risk routine', 'User or caregiver confirmation', 'blue'],
    ['Recovery support', 'Caregiver confirmation required', 'gold'],
    ['Device-assisted', 'Human confirmation plus telemetry', 'green'],
    ['Robot-related', 'Human approval before action, telemetry after action', 'blue'],
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Verification Policy Builder" title="Proof rules before continuity changes." text="Each support category defines who confirms it and which signals can support proof." />
      <section className="grid gap-4 lg:grid-cols-2">
        {policies.map(([label, proof, tone]) => {
          const color = tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={label} className={'rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + color}>
              <h3 className="text-2xl font-semibold">{label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-85">{proof}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export function ContinuityOperations() {
  const rows = [
    { label: 'Today support continuity', value: 'Strong', detail: '4 verified actions, 1 waiting for review', tone: 'green' },
    { label: 'Caregiver coverage', value: 'Active', detail: 'Maya owns recovery actions until 15:00', tone: 'blue' },
    { label: 'Robot readiness', value: 'Standby', detail: 'R1 available for readiness only', tone: 'gold' },
    { label: 'Open verification', value: '1 waiting', detail: 'Assisted walking session needs confirmation', tone: 'red' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Continuity Operations" title="Continuity is the final SAVEN product outcome." text="SAVEN shows whether real support continuity is stable, interrupted, waiting, or escalating." />
      <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Continuity score</p>
          <div className="mt-5 flex items-end gap-4">
            <p className="text-7xl font-semibold tracking-tight">86</p>
            <p className="pb-3 text-sm font-semibold text-emerald-200">Stable</p>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-300" />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">Operational confidence, not a medical score.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row) => {
            const tone = row.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : row.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : row.tone === 'red' ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={row.label} className={'rounded-[2rem] border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
                <p className="text-sm font-semibold opacity-75">{row.label}</p>
                <h3 className="mt-3 text-3xl font-semibold">{row.value}</h3>
                <p className="mt-3 text-sm leading-6 opacity-85">{row.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
